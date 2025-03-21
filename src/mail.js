const nodemailer = require("nodemailer");

/*  
    Some documentation to look at:
        https://nodemailer.com/message/
        https://nodemailer.com/message/attachments/
*/

class Mail {
    static from = 'U-tad Path Finder" <senenm74@gmail.com>'
    static subject = "Mentoring done ✔"
    static transporter = nodemailer.createTransport({
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

module.exports = { Mail }

