import { mimes, __dirname, summaryPrompt, advicePrompt, removePersonalInfo, removeMarkdown } from './constants.js'
import { DeepSeek, Models, Textract, Mail } from './utils.js'
import { unlink } from 'fs/promises'
import { join } from 'path'
import showdown from 'showdown'
const { Converter } = showdown


const ds = new DeepSeek(Models.REASON, process.env.DEEPSEEK_KEY)
const mdToHtml = new Converter()


export default async function processPostRequest(path, mimetype, req) {
    let cv = null
    try {
        if (mimes['docx'] === mimetype) cv = await Textract.docx(path)
        else if (mimes['pdf'] === mimetype) cv = await Textract.pdf(path)
        console.log(`Extracting ${req.file.originalname} text => Done`)

        const cvClean = removePersonalInfo(cv)
        const summary = await ds.completion(summaryPrompt(cvClean)).then(r => r.choices[0].message.content).then(r => removeMarkdown(r))
        const advice = await ds.completion(advicePrompt(summary)).then(r => r.choices[0].message.content)
        const response =  mdToHtml.makeHtml(summary + '\n\n---\n\n' + advice)
        console.log('Generating LLM response => Done')

        await Mail.send(req.body.email, response)
        console.log('Sending email => Done')
    } catch (e) {
        console.error(e.message)
    } finally {
        await unlink(join(__dirname, path)).catch(e => console.error(e.message))
    }
}

