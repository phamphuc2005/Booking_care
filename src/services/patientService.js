const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 
const mailService = require('./mailService');
const { v4 : uuidv4 } = require('uuid');

let buildURLMail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postPatientBooking = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.date || !data.timeType ||
                !data.fullName || !data.selectGender || !data.address || !data.phoneNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let token = uuidv4();
                await mailService.sendExampleMail({
                    receiveMail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    link: buildURLMail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R2',
                        gender: data.selectGender,
                        address: data.address,
                        phonenumber: data.phoneNumber,
                        firstName: data.fullName
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
                        patient.token = token

                        await patient.save();
                    } else {
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
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

let postVerifyBooking = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Appointment confirmed successfully!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'The appointment is confirmed or does not exist!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListSchedule = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: { 
                        patientId: inputId,
                        statusId: 'S2'
                    },
                    include: [
                        {model: db.User, as:'doctorData2', attributes: ['firstName', 'lastName'],
                        include: [{model: db.Doctor_Info}]
                    },
                        {model: db.Allcode, as:'timeTypeData2', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
             
        } catch (error) {
            reject(error)
        }
    })
}

let getHistory = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: { 
                        patientId: inputId,
                        statusId: 'S3'
                    },
                    include: [
                        {model: db.User, as:'doctorData2', attributes: ['firstName', 'lastName'],
                        include: [{model: db.Doctor_Info}]
                    },
                        {model: db.Allcode, as:'timeTypeData2', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
             
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postPatientBooking: postPatientBooking,
    postVerifyBooking: postVerifyBooking,
    getListSchedule,
    getHistory
}