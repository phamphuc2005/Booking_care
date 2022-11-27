require('dotenv').config();
const nodemailer = require("nodemailer");

let sendExampleMail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.MAIL_NAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking_care 👻" <minhpham2001bk@gmail.com>', // sender address
        to: dataSend.receiveMail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: `
            <h3>Xin chào, ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này sau khi đặt lịch khám bệnh online trên hệ thống Booking_Care.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Vui lòng kiểm tra lại thông tin, nếu chính xác hãy click vào link bên dưới để xác nhận và
             hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div><a href=${dataSend.link} target="_blank">Click here!</a></div>
            <div>Xin chân thành cảm ơn!</div>
        `, // html body
    });
}

module.exports = {
    sendExampleMail: sendExampleMail
}