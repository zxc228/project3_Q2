import { unlink } from 'fs/promises'
import { join } from 'path'
import showdown from 'showdown'
const { Converter } = showdown
import DeepSeek from '../infra/deepseek.js'
import Textract from '../infra/textract.js'
import Mail from '../infra/mail.js'
import { 
    mimes, 
    __dirname, 
    summaryPrompt, 
    advicePrompt, 
    removePersonalInfo, 
    removeMarkdown 
} from '../infra/constants.js'


const deepseek = new DeepSeek(DeepSeek.Models.REASON, process.env.DEEPSEEK_KEY)
const mdToHtml = new Converter()


export default async function processCV(path, mimetype, req) {
    let cv = null
    try {
        if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
        else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)

        const summary = await deepseek.completion(summaryPrompt(removePersonalInfo(cv)))
            .then(r => r.choices[0].message.content)
            .then(r => removeMarkdown(r))

        const advice = await deepseek.completion(advicePrompt(summary))
            .then(r => r.choices[0].message.content)

        const response = mdToHtml.makeHtml(summary + '\n\n---\n\n' + advice)

        await Mail.send(req.body.email, response)
        await Mail.send('senen.marques@live.u-tad.com', response)

        console.log(`[${new Date().toLocaleString()}] ${req.body.email} => Done`)

    } catch (e) {
        console.error(`${req.body.email} => ${e.message}`)
    } finally {
        await unlink(join(__dirname, path)).catch(e => console.error(e.message))
    }
}

