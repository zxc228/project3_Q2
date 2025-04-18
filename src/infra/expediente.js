import * as cheerio from 'cheerio'

export default function getSubjects(expedienteHtmlText) {
    const $ = cheerio.load(expedienteHtmlText)
    let subjects = []
    for (const row of $('tr')) {
        const cols = $(row).find('td').map((_, v) => $(v).text().trim()).get()
        const nameArr = cols[0].split('')
        const code = parseInt(nameArr.slice(0, 5).join('')) 
        if (isNaN(code)) continue
        const gradeArr = cols[3].split('')
        const gradeSymbol = gradeArr.slice(0,2).join('').toUpperCase()
        const grade = gradeArr.filter(v => !isNaN(parseInt(v)) || v === '.').join('').trim()

        const subject = {
            code: code,
            name: nameArr.slice(6, nameArr.length).join(''),
            credits: parseInt(cols[1]),
            type: cols[2],
            gradeSymbol: gradeSymbol? gradeSymbol : null,
            grade: grade? grade : null,
            call: cols[4]? cols[4] : null,
            year: cols[5]? cols[5] : null,
            agot: cols[6] === '-' ? false : true,
            vMat: cols[7]? parseInt(cols[7]) : null
        }

        subjects.push(subject)
    }
    return subjects
}
