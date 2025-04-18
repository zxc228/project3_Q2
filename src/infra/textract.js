import extract from 'pdf-text-extract'
import mammoth from 'mammoth'
import * as cheerio from 'cheerio' 


export default class Textract {
    static async pdf(path) {
        return new Promise((resolve, reject) => {
            extract(path, (err, pages) => {
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

    static async docx(path) {
        return await mammoth.extractRawText({ path: path }).then(res => res.value)
    }
}
