const path = require('path')
const extract = require('pdf-text-extract')
const mammoth = require('mammoth')
const cheerio = require('cheerio')

class Textract {
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

module.exports = { Textract };

// EXAMPLE
/*
(async () => {
    console.log(await Textract.pdf('../pdfs/CV_Senén_Marqués_2024.pdf').catch(e => e.message))
    console.log(await Textract.docx('../pdfs/CV_Senén_Marqués_2024.docx').catch(e => e.message))
    console.log(await Textract.website('https://www.npmjs.com/package/cheerio'))
})()
*/
