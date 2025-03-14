const express = require('express')
const multer  = require('multer')
const cors = require('cors')
const path = require('path')

const { roles_skills_tech, mimes  } = require('./constants')
const { Textract } = require('./textract')
const { Lima } = require('./lima')
const { QuExecutor } = require('./quexecutor')
const { Mail } = require('./mail')

const UPLOADS_PATH = path.join(__dirname + '/../uploads')
const PUBLIC_PATH = path.join(__dirname, '/../public')
const INDEX_PATH = path.join(PUBLIC_PATH, 'index.html')

const PORT = 3000
const upload = multer({dest: UPLOADS_PATH})
const app = express()

app.use(express.json())       
app.use(express.text())       
app.use(cors())               
app.use(express.static(PUBLIC_PATH)) // Serve static files (like CSS, JS) from the "public" directory
app.listen(PORT, () => { console.log(`Server up and running on port ${PORT}`) })

// Serve the html file 
app.get(['/', '/index.html'], (_, res) => { res.sendFile(INDEX_PATH) }) 

// Request header's Content-Type must be 'text/plain' 
app.post('/api/generate', async (req, res) => { res.json(await Lima.chat(req.body)) })  

// Request header's Content-Type must also be 'text/plain' 
app.post('/api/generate_stream', async (req, res) => {                                          
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Transfer-Encoding', 'chunked')
    for await (const chunk of await Lima.chatStreaming(req.body)) 
        res.write(chunk)
    res.end()
})

// DEFINING THE JOB for QuExecutor
const job = async (cv) => {
    const p1 = `Generate a concise and structured summary of this CV: ${cv}` 
    const cvSummary = await Lima.chat(p1).then(r => Lima.filterThinking(r.response))
    const p2 = `Given this information: ${roles_skills_tech} and this CV: ${cvSummary}. 
        And based on the applicant's interests. 
        What one or two career paths would you advice the applicant to take. 
        What course of action should the applicant take to get there?`
    const advice = await Lima.chat(p2).then(r => Lima.filterThinking(r.response))
    console.log(cvSummary + advice)
    return cvSummary + advice
}

// Setting Lima model (deepthink-r1:7b)
(async () => { 
    Lima.model = await Lima.getModels().then(models => models[1].model) 
})()

const executor = new QuExecutor(job)

// TODO: modify request to take a website (Textract.web(url) already implemented)
// TODO: limit file size (req.file.size)
// TODO: Validate u-tad emails?
// The POST method: Takes FormData object with a file (docx or pdf) and an email
app.post('/api/file', upload.single('file'), async (req, res) => {
    res.status(201).send()

    const path = '../uploads/' + req.file.filename
    const mimetype = req.file.mimetype
    let cv = null
    
    try {
        if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
        else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)
        else throw new Error(`mimetype: ${mimetype} not supported`)
        console.log(`Extracting ${req.file.originalname} text => Done`)

        const response = await executor.handle(cv)
        console.log('Generating LLM response => Done')

        await Mail.send(req.body.email, response)
        console.log("Sending email => Done")
    } catch (e) { 
        console.error(e.message)
    }
})

