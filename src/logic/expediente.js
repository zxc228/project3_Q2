import fs from 'fs/promises'
import Expediente from '../infra/expediente.js'
import { __dirname } from '../infra/constants.js'

export default async function processExpediente(path) {
    const htmlText = await fs.readFile(path, 'utf-8')
    const subjects = Expediente.getSubjects(htmlText)
    await fs.unlink(path).catch(e => console.error(e.message))
    return subjects
}
