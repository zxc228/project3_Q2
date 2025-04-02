import { OpenAI } from "openai"
import nodemailer from "nodemailer"
import path from 'path'
import extract from 'pdf-text-extract'
import mammoth from 'mammoth'
import * as cheerio from 'cheerio' 
import { __dirname } from './constants.js'


export const Models = { CHAT: 'deepseek-chat', REASON: 'deepseek-reasoner' }


export class DeepSeek {
    constructor(model, apiKey) {
        this.ai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: apiKey })
        this.model = model 
    }

    completion = async (msg) => {
        return await this.ai.chat.completions.create({
            model: this.model,
            messages: [{ 
                role: this.model === Models.CHAT ? 'system' : 'user',
                content: msg 
            }] 
        })
    }
}


export class Textract {
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


export class Mail {
    static from = 'U-tad Path Finder" <senenm74@gmail.com>'
    static subject = "Mentoring done ✔"
    static transporter = nodemailer.createTransport({ // Some documentation to look at: https://nodemailer.com/message/
        service: "gmail",
        auth: { 
            user: "senenm74@gmail.com", 
            pass: process.env.GOOGLE_APP 
        },
    })

    static async send(email, html) {
        const mailObj = { from: Mail.from, subject: Mail.subject, to: email, html: html }
        return await Mail.transporter.sendMail(mailObj) 
    }
}


// TEXTTRACT EXAMPLE
/*
(async () => {
    console.log(await Textract.pdf('../pdfs/CV_Senén_Marqués_2024.pdf').catch(e => e.message))
    console.log(await Textract.docx('../pdfs/CV_Senén_Marqués_2024.docx').catch(e => e.message))
    console.log(await Textract.website('https://www.npmjs.com/package/cheerio'))
})()
*/


// DEEPSEEK EXAMPLE
/*
(async () => {
    const ds = new DeepSeek(Models.CHAT, process.env.DEEPSEEK_PROJECT)
    const completion = await ds.completion('What do you recommend i do with my life if i have a software engineering degree, and are interested in python and node development')
    //console.log(completion)
    //console.log(completion.choices.length)
    //console.log(completion.choices[0].message)
    console.log(completion.choices[0].message.content)
    console.log(completion.choices[0].message.reasoning_content)
})()
*/

