const express = require('express')
const multer  = require('multer')
const cors = require('cors')
const { Converter } = require('showdown') // converts md to HTML and vice versa
const { join } = require('path')
const { unlink } = require('fs/promises')
const { existsSync } = require('fs')

const { Textract } = require('./textract')
const { QuExecutor } = require('./quexecutor')
const { Mail } = require('./mail')
const { DeepSeek, Models } = require('./deepseek')
const { 
    mimes, 
    summaryPrompt, 
    advicePrompt, 
    removePersonalInfo, 
    removeMarkdown 
} = require('./constants')

const UPLOADS_PATH = join(__dirname, '/../uploads')
const PUBLIC_PATH = join(__dirname, '/../public')
const INDEX_PATH = join(PUBLIC_PATH, 'index.html')

const PORT = 3000
const upload = multer({dest: UPLOADS_PATH})
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(PUBLIC_PATH))

app.listen(PORT, '0.0.0.0', () => { console.log(`Server up and running on port ${PORT}`) })
app.get(['/', '/index.html'], (_, res) => { res.sendFile(INDEX_PATH) }) 


const queueJob = async (cv) => {
    const cvClean = removePersonalInfo(cv)
    const summary = await ds.completion(summaryPrompt(cvClean)).then(r => r.choices[0].message.content).then(r => removeMarkdown(r))
    const advice = await ds.completion(advicePrompt(summary)).then(r => r.choices[0].message.content)
    return summary + '\n\n---\n\n' + advice
}

const queue = new QuExecutor(queueJob)
const ds = new DeepSeek(Models.REASON, process.env.DEEPSEEK_PROJECT)
const mdToHtml = new Converter()


// TODO: modify request to take a website (Textract.web(url) already implemented)
// TODO: do not download files, have them in memory
app.post('/api/cv', upload.single('file'), async (req, res) => {
    const mimetype = req.file.mimetype
    const path = '../uploads/' + req.file.filename

    if (req.file.size > 5000000)
        res.status(413).send(`${req.file.originalname} is larger than 5MB max size`)
    else if (!Object.values(mimes).includes(mimetype)) 
        res.status(415).send(`${mimetype} not supported (please give .pdf or .docx`)
    else { 
        res.status(201).send()
        await doTheThing(path, mimetype, req)
    }
    //await unlink(join(__dirname, path)).catch(e => console.error(e.message))
})


async function doTheThing(path, mimetype, req) {
    let cv = null
    try {
        if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
        else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)
        console.log(`Extracting ${req.file.originalname} text => Done`)

        const response = await queue.handle(cv).then(r => mdToHtml.makeHtml(r))
        console.log('Generating LLM response => Done')

        await Mail.send(req.body.email, response)
        console.log('Sending email => Done')

        await unlink(join(__dirname, path)).catch(e => console.error(e.message))
    } catch (e) {
        console.error(e.message)
    }
}
