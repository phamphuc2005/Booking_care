require('dotenv').config();
const { reject } = require('lodash');
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
        from: '"Booking_Health 👻" <minhpham2001bk@gmail.com>', // sender address
        to: dataSend.receiveMail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLMail(dataSend)
    });
}

let getBodyHTMLMail = (dataSend) => {
    let result = '';
    if(dataSend.language === 'vi') {
        result = `
            <h3>Xin chào, ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này sau khi đặt lịch khám bệnh online trên hệ thống Booking_Health.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Vui lòng kiểm tra lại thông tin, nếu chính xác hãy click vào link bên dưới để xác nhận và
            hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div><a href=${dataSend.link} target="_blank">Click here!</a></div>
            <div>Xin chân thành cảm ơn!</div>
        `
    }
    if(dataSend.language === 'en') {
        result = `
            <h3>Dear, ${dataSend.patientName}!</h3>
            <p>You received this email after booking an online medical appointment on Booking_Health.</p>
            <p>Information to schedule an appointment:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>Please check the information, if it is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
            <div><a href=${dataSend.link} target="_blank">Click here!</a></div>
            <div>Thanks!</div>
        `
    }
    return result; 
}

let sendConfirmMail = async (dataSend) => {
    return new Promise(async(resolve, reject) => {
        try {
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
                from: '"Booking_Health 👻" <minhpham2001bk@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLMailConfirm(dataSend),
                attachments: [{
                    filename: `${dataSend.patientId}-${dataSend.patientName}.pdf`,
                    content: dataSend.fileBase64.split("base64,")[1],
                    encoding: 'base64'
                }]
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

let getBodyHTMLMailConfirm = (dataSend) => {
    let result = '';
    if(dataSend.language === 'vi') {
        result = `
            <h3>Xin chào, ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này sau khi đặt lịch khám bệnh online trên hệ thống Booking_Health và đã khám thành công.</p>
            <p>Thông tin đơn thuốc/hóa đơn được đính kèm trong file bên dưới.</p>
            
            <div>Xin chân thành cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</div>
        `
    }
    if(dataSend.language === 'en') {
        result = `
            <h3>Dear, ${dataSend.patientName}!</h3>
            <p>You received this email after booking an online medical appointment on Booking_Health system and successfully examined.</p>
            <p>Prescription/invoice information is attached in the file below.</p>
            
            <div>Thank you very much for using our service!</div>
        `
    }
    return result; 
}

let sendConfirmRegister = async (dataSend) => {
    return new Promise(async(resolve, reject) => {
        try {
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
                from: '"Booking_Health 👻" <minhpham2001bk@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Thông báo yêu cầu đăng ký tài khoản", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLMailRegister(dataSend)
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

let getBodyHTMLMailRegister = (dataSend) => {
    // let result = '';
    // if(dataSend.language === 'vi') {
    let result = `
            <h3>Xin chào!</h3>
            <p>Bạn nhận được email này sau khi đã yêu cầu tạo tài khoản trên hệ thống Booking_Health.</p>
            
            <p>Mã số để xác nhận yêu cầu đăng ký tài khoản của bạn là: <b>${dataSend.random_number}</b></p>
            
            <div>Xin chân thành cảm ơn quý khách đã tin dùng dịch vụ của chúng tôi!</div>
        `;
    // }
    // if(dataSend.language === 'en') {
    //     result = `
    //         <h3>Dear!</h3>
    //         <p>You receive this email after you have requested to create an account on the Booking_Health system.</p>

    //         <p>The code to confirm your account registration request is: ${dataSend.random_number}</p>
            
    //         <div>Thank you very much for trusting our service!</div>
    //     `
    // }
    return result; 
}

module.exports = {
    sendExampleMail: sendExampleMail,
    getBodyHTMLMail: getBodyHTMLMail,
    sendConfirmMail: sendConfirmMail,
    getBodyHTMLMailConfirm: getBodyHTMLMailConfirm,
    sendConfirmRegister: sendConfirmRegister,
    getBodyHTMLMailRegister: getBodyHTMLMailRegister
}