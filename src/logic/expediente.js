import { readFile, unlink } from 'fs/promises'
import getSubjects from '../infra/expediente.js'

export default async function processExpediente(path) {
    const htmlText = await readFile(path, 'utf-8')
    const subjects = getSubjects(htmlText)
    await unlink(path).catch(e => console.error(e.message))
    return subjects
}
