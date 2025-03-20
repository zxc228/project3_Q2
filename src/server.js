const express = require('express')
const multer  = require('multer')
const cors = require('cors')
const { Converter } = require('showdown') // converts md to HTML and vice versa
const path = require('path')

const { roles, mimes  } = require('./constants')
const { Textract } = require('./textract')
const { Lima } = require('./lima')
const { QuExecutor } = require('./quexecutor')
const { Mail } = require('./mail')
const { DeepSeek } = require('./deepseek')

const UPLOADS_PATH = path.join(__dirname + '/../uploads')
const PUBLIC_PATH = path.join(__dirname, '/../public')
const INDEX_PATH = path.join(PUBLIC_PATH, 'index.html')

const converter = new Converter()
const PORT = 3000
const upload = multer({dest: UPLOADS_PATH})
const app = express()

app.use(express.json())       
app.use(express.text())       
app.use(cors())               
app.use(express.static(PUBLIC_PATH)) 
app.listen(PORT, () => { console.log(`Server up and running on port ${PORT}`) })

// Serve the html file 
app.get(['/', '/index.html'], (_, res) => { res.sendFile(INDEX_PATH) }) 

// DEFINING THE JOB for QuExecutor
const job = async (cv) => {
    //  TODO instead of using llm, use regex to mask phone numbers, emails and websites (to not give personal info to deepseek)
    const p1 = `Remove any contact or personal information like phone numbers, emails, addresses and home addresses from this CV: ${cv}. Generate only the edited CV`
    const cvClean = await Lima.chat(p1).then(r => Lima.filterThinking(r.response))
    console.log(cvClean)
    const p2 = `Generate a concise and structured summary of this CV: ${cvClean}, 
        exclude any information that is not IT / software engineering / computer science related 
        and do not mention that you have excluded that information`
    const cvSummary = await ds.completion(DeepSeek.MODELS.REASON, p2).then(r => r.choices[0].message.content)
    const p3 = `Given these roles: ${roles} and this CV: ${cvSummary}.
        And based on the applicant's interests. 
        What one or two career paths would you advice the applicant to take. 
        What course of action should the applicant take to get there?`
    const advice = await ds.completion(DeepSeek.MODELS.REASON, p3).then(r => r.choices[0].message.content)
    return cvSummary + '\n' + advice
}

(async () => { Lima.model = await Lima.getModels().then(models => models[2].model) })() // llama3.2:3b 
const ds = new DeepSeek(process.env.DEEPSEEK_PROJECT)
const executor = new QuExecutor(job)

// TODO: modify request to take a website (Textract.web(url) already implemented)
// The POST method: Takes FormData object with a file (docx or pdf) and an email
app.post('/api/file', upload.single('file'), async (req, res) => {
    const path = '../uploads/' + req.file.filename
    const mimetype = req.file.mimetype

    if (req.file.size > 5000000) 
        res.status(413).send('File is larger than 5MB max size')
    else if (!Object.values(mimes).includes(mimetype)) 
        res.status(415).send(`${mimetype} files not supported (please give .pdf or .docx`)
    else res.status(201).send()

    let cv = null
    try {
        if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
        else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)
        console.log(`Extracting ${req.file.originalname} text => Done`)

        const response = await executor.handle(cv).then(r => converter.makeHtml(r))
        console.log('Generating LLM response => Done')

        await Mail.send(req.body.email, {html: response})
        console.log("Sending email => Done")
    } catch (e) {
        console.error(e)
    }
})

