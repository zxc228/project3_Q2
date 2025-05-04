import { chromium } from 'playwright'
import Handlebars from 'handlebars'
import { readFile } from 'fs/promises'


export default class Report {
    static async init(templatePath, careerTracksTemplatePath, fontPath) {
        if (Report._instance) 
            throw new Error('This class is a singleton')

        const template = Handlebars.compile(await readFile(templatePath, 'utf-8'))
        const careerTracksTemplate = Handlebars.compile(await readFile(careerTracksTemplatePath, 'utf-8'))
        const base64Font = await readFile(fontPath, 'base64')
        const browser = await chromium.launch({ headless: true })
        const page = await browser.newPage()

        Report._instance = new Report(template, careerTracksTemplate, base64Font, browser, page)
        return Report._instance
    }

    constructor(template, careerTracksTemplate, font, browser, page) {
        if (Report._instance) throw new Error('Report class is a singleton')
        this.template = template
        this.careerTracksTemplate = careerTracksTemplate
        this.font = font
        this.browser = browser
        this.page = page
        Report._instance = this
    }

    async genReport(data, dst) { 
        await this.#genPdf(data, this.template, this.font, dst) 
    }

    async genCareerTracksReport(data, dst) { 
        await this.#genPdf(data, this.careerTracksTemplate, this.font, dst) 
    }

    async close() { 
        await this.page.close()
        await this.browser.close() 
    }

    async speedTest(numReports, data) {
        const results = []
        for (let i = 0; i < numReports; i++) {
            const start = Date.now()
            await this.genReport(data, `files/myfile${i}.pdf`)
            results.push(Date.now() - start)
        }
        const chunkSize = numReports / 10
        for (let i = 0; i < numReports; i+=chunkSize) 
            console.log(results.slice(i, i+chunkSize))
        console.log(results.reduce((acc, val) => acc + val, 0) / numReports)
    }

    async #genPdf(data, template, base64Font, dst) {
        const html = template({ ...data, base64Font })
        await this.page.setContent(html, { waitUntil: 'load' })
        await this.#pageHack()
        await this.page.pdf({
            path: dst,
            format: 'A4',
            printBackground: true,
            margin: { top: '1cm' }
        })
    }

    async #pageHack() {
        // A4 size is 210x297mm, apparently playwright chromium uses a DPI of 96, 1 inch = 25.4 mm
        const pageHeightPx = Number((297 / 25.4 * 96).toFixed(1)) 
        await this.page.evaluate((height) => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const sections = document.getElementsByTagName('section')
            const heights = Array.from(sections).map(s => {
                const b = s.getBoundingClientRect()
                return { top: scrollY + b.top, bottom: scrollY + b.bottom }
            })
            for (let i = 0; i < heights.length; i++) {
                const h = heights[i]
                const pageHeightTop = h.top < height? height : height * Math.floor(h.top / height)
                const pageHeightBottom = h.bottom < height? height : height * Math.floor(h.bottom / height)
                if (h.top < pageHeightTop && h.bottom > pageHeightBottom)
                    sections[i].style.marginTop = (2 * (height - heights[i].top)).toFixed(0) + 'px'
            }
        }, pageHeightPx)
    }
}
