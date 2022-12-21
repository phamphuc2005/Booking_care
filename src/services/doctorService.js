const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 
const mailService = require('./mailService');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R1'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Doctor_Info, attributes: ['specialtyId'],
                    include: [
                        {model: db.Specialty, attributes: ['name']},
                    ]
                    },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R1'},
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
    
}

let checkRequired = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 
                'selectedPrice', 'selectedPayment', 'selectedProvince',
                'nameClinic', 'addressClinic', 'note', 'specialtyId'];
    let isValid = true;
    let element = '';
    for(let i = 0; i<arr.length; i++) {
        if(!inputData[arr[i]]) {
            isValid = false;
            element = arr[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveInfoDoctor = (inputData) => {
    return new Promise(async(resolve, reject) => {
        try {
            let checkObject = checkRequired(inputData);
            if(checkObject.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameters: ${checkObject.element}`
                })
            } else {
                if(inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if(inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false
                    })
                    if(doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();

                        await doctorMarkdown.save()
                    }
                }

                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                })
                if(doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId

                    await doctorInfo.save()
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save doctor info successfully!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown},
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Doctor_Info,
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image){
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data) data = {};
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

let createScheduleDoctor = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let schedule = data.arrSchedule;
                if(schedule && schedule.length>0) {
                    schedule = schedule.map(item=>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // console.log('data:',schedule);

                let existing = await db.Schedule.findAll(
                    {
                        where: {doctorId: data.doctorId, date: data.date},
                        attributes:['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }
                );
                // if(existing && existing.length>0) {
                //     existing = existing.map(item=>{
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                let toCreate = _.differenceWith(schedule, existing, (a, b)=>{
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)

                }
                console.log(toCreate)

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDoctorScheduleByDate = (doctorId, date) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']}
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) data = [];
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

let getMoreDoctorInfoById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputId
                    },
                    include: [
                        {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) data = {};
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

let getProfileDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown},
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Doctor_Info,
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image){
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data) data = {};
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

let getListAppointment = (inputId, inputDate) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId || !inputDate){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: inputId,
                        date: inputDate
                    },
                    include: [
                        {model: db.User, as:'patientData', attributes: ['email', 'firstName', 'phonenumber', 'address', 'gender'],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                            ]
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

let sendConfirm = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if(appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                await mailService.sendConfirmMail(data)
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatient = (inputId, inputDate) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId || !inputDate){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S3',
                        doctorId: inputId,
                        date: inputDate
                    },
                    include: [
                        {model: db.User, as:'patientData', attributes: ['email', 'firstName', 'phonenumber', 'address', 'gender'],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                            ]
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
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    createScheduleDoctor: createScheduleDoctor,
    getDoctorScheduleByDate: getDoctorScheduleByDate,
    getMoreDoctorInfoById: getMoreDoctorInfoById,
    getProfileDoctorById: getProfileDoctorById,
    getListAppointment: getListAppointment,
    sendConfirm: sendConfirm,
    getListPatient
}