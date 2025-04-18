import extract from 'pdf-text-extract'
import mammoth from 'mammoth'
import * as cheerio from 'cheerio' 
import { __dirname } from '../index.js'


export default class Textract {
    static async pdf(relativePath) {
        return new Promise((resolve, reject) => {
            extract(path.join(__dirname, relativePath), (err, pages) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(Array.from(pages).reduce((acc, p) => acc.concat(new String(p)), ""))
            })
        })
    }

    static async website(url) {
        const $ = cheerio.load(await fetch(url).then(res => res.text()))
        return $('body').text().trim()
    }

    static async docx(relativePath) {
        return await mammoth.extractRawText({ path: path.join(__dirname, relativePath) }).then(res => res.value)
    }
}
