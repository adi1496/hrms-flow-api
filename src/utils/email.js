const nodemailer = require('nodemailer');

class Email {
    constructor() {

    }

    createTransport(transporter) {
        if(transporter === 'mailtrap') {
            this.transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                user: "9cd5d91c118dd6",
                pass: "aee184edf9eef5"
                }
            });
        }
    }

    async sendEmailVerficationMailUser(emailVerificationToken, to, companyName) {
        const subject = 'HRMS-Flow email checker'
        const message = 'Hi!\n'

        await this.transporter.sendMail({
            from: 'Adrian Matei <adi@hrms-flow.com>', // sender address
            to: receiver, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body
            // html: `<h1 style="color: red;">Hello world?</h1>`, // html body
        })
    }
}

const sendMail = async (receiver, subject, message) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: "9cd5d91c118dd6",
        pass: "aee184edf9eef5"
        }
    });

    let info = await transporter.sendMail({
        from: 'Adrian Matei <adi@hrms-flow.com>', // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        // html: `<h1 style="color: red;">Hello world?</h1>`, // html body
    });

    // console.log(info);
}

module.exports = sendMail;