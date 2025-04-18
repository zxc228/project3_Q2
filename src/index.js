import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { join } from 'path'
import { mimes, projectRoot } from './infra/constants.js'
import processCV from './logic/cv.js'
import processExpediente from './logic/expediente.js'

const PUBLIC_PATH = join(projectRoot, 'public')
const upload = multer({ dest: join(projectRoot, 'uploads') })
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(PUBLIC_PATH))

app.listen(3000, '0.0.0.0', () => { console.log(`Server up and running on port 3000`) })
app.get(['/', '/index.html'], (_, res) => { res.sendFile(join(PUBLIC_PATH, 'index.html')) }) 


app.post('/api/cv', upload.single('cv'), async (req, res) => {
    const mimetype = req.file.mimetype
    const email = req.body.email
    const path = join(projectRoot, 'uploads/' + req.file.filename)

    if (req.file.size > 5000000) 
        res.status(413).send(`${req.file.originalname} is larger than 5MB max size`)

    if (!Object.values(mimes).includes(mimetype)) 
        res.status(415).send(`${mimetype} not supported (please give .pdf or .docx`)

    res.status(201).send()
    await processCV(path, mimetype, email)
})


app.post('/api/expediente', upload.single('expediente'), async (req, res) => {
    const mimetype = req.file.mimetype
    const path = join(projectRoot, 'uploads/' + req.file.filename)

    if (req.file.size > 5000000)
        res.status(413).send(`${req.file.originalname} is larger than 5MB max size`)

    if (mimetype != 'text/html')
        res.status(415).send(`${mimetype} not supported (please give .html`)

    try {
        const subjects = await processExpediente(path)
        res.status(201).json(subjects)
        console.log(`sent subjects to => ${req.ip}`)
    } catch (e) {
        console.error(e)
        res.status(500).send(e.message)
    }
})

