import nodemailer from "nodemailer"


export default class Mail {
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
