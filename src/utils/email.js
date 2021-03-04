const nodemailer = require('nodemailer');

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