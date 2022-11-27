const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 
const mailService = require('./mailService');

let postBooking = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                await mailService.sendExampleMail({
                    receiveMail: data.email,
                    patientName: 'Nguyen Thi B',
                    time: '10-11h',
                    doctorName: 'Tran Van X',
                    link: 'https://www.google.com/'
                })

                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R2',
                    }
                })
                if(user && user[0]) {
                    let patient = await db.Booking.findOne({
                        where: {patientId: user[0].id},
                        raw: false
                        // defaults: {
                        //     statusId: 'S1',
                        //     doctorId: data.doctorId,
                        //     patientId: user[0].id,
                        //     date: data.date,
                        //     timeType: data.timeType
                        // }
                    })
                    if(patient) {
                        patient.statusId = 'S1',
                        patient.doctorId = data.doctorId,
                        patient.patientId = user[0].id,
                        patient.date = data.date,
                        patient.timeType = data.timeType

                        await patient.save();
                    } else {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        });
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save patient successfully!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBooking: postBooking
}