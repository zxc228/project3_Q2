const express = require('express')
const multer  = require('multer')
const cors = require('cors')
const { Converter } = require('showdown') // converts md to HTML and vice versa
const { join } = require('path')
const { unlink } = require('fs/promises')
const { Textract } = require('./textract')
const { Lima } = require('./lima')
const { QuExecutor } = require('./quexecutor')
const { Mail } = require('./mail')
const { DeepSeek, Models } = require('./deepseek')
const { mimes, summaryPrompt, advicePrompt, removeInfoPrompt } = require('./constants')

const UPLOADS_PATH = join(__dirname + '/../uploads')
const PUBLIC_PATH = join(__dirname, '/../public')
const INDEX_PATH = join(PUBLIC_PATH, 'index.html')

const PORT = 3000
const upload = multer({dest: UPLOADS_PATH})
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(PUBLIC_PATH))
app.listen(PORT, () => { console.log(`Server up and running on port ${PORT}`) })
app.get(['/', '/index.html'], (_, res) => { res.sendFile(INDEX_PATH) }) 

//  TODO instead of using llm, use regex to mask phone numbers, emails and websites (to not give personal info to deepseek)
// DEFINING THE JOB for QuExecutor
const job = async (cv) => {
    const cvClean = await Lima.chat(removeInfoPrompt(cv)).then(r => Lima.filterThinking(r.response))
    const summary = await ds.completion(summaryPrompt(cvClean)).then(r => r.choices[0].message.content)
    const advice = await ds.completion(advicePrompt(summary)).then(r => r.choices[0].message.content)
    return summary + '\n\n---\n\n' + advice
}

(async () => { Lima.model = await Lima.getModels().then(models => models[1].model) })() // deepseek-r1:7b
const ds = new DeepSeek(Models.REASON, process.env.DEEPSEEK_PROJECT)
const queue = new QuExecutor(job)
const mdToHtml = new Converter()

// TODO: modify request to take a website (Textract.web(url) already implemented)
// TODO: do not download files, have them in memory
app.post('/api/file', upload.single('file'), async (req, res) => {
    const mimetype = req.file.mimetype
    const path = '../uploads/' + req.file.filename

    if (req.file.size > 5000000)
        res.status(413).send(`${req.file.originalname} is larger than 5MB max size`)
    else if (!Object.values(mimes).includes(mimetype)) 
        res.status(415).send(`${mimetype} not supported (please give .pdf or .docx`)
    else { 
        res.status(201).send()
        let cv = null
        try {
            if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
            else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)
            console.log(`Extracting ${req.file.originalname} text => Done`)

            const response = await queue.handle(cv).then(r => mdToHtml.makeHtml(r))
            console.log('Generating LLM response => Done')

            await Mail.send(req.body.email, {html: response})
            console.log('Sending email => Done')
        } catch (e) { 
            console.error(e.message) 
        }
    }
    await unlink(path).catch(e => console.error(e.message))
})

