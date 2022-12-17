const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 

let checkClinicName = (dataName) => {
    return new Promise(async(resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: {name: dataName}
            })
            if(clinic) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let check = await checkClinicName(data.name);
                if(check === true) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Clinic has been used. Please enter another name!'
                    });
                } else {
                    await db.Clinic.create({
                        name: data.name,
                        address: data.address,
                        image: data.imageBase64,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'OK!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: "OK!",
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

let editClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: {id: data.id},
                    raw: false
                })
                if(clinic) {
                    if(clinic.name == data.name) {
                        clinic.name = data.name,
                        clinic.address = data.address,
                        clinic.image = data.imageBase64,
                        clinic.descriptionHTML = data.descriptionHTML,
                        clinic.descriptionMarkdown = data.descriptionMarkdown;
                        await clinic.save();
                        resolve({
                            errCode: 0,
                            message: 'Update clinic successfully!'
                        });
                    } else {
                        let check = await checkClinicName(data.name);
                        if(check === true) {
                            resolve({
                                errCode: -1,
                                errMessage: 'Clinic has been used. Please enter another name!'
                            });
                        }                   
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Clinic does not found!'
                    });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where : {id: data.id},
                })
                if(!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Clinic does not exist!'
                    })
                }
                await db.Clinic.destroy({
                    where : {id: data.id},
                });
                resolve({
                    errCode: 0,
                    message: 'Delete clinic successfully!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let data = await db.Clinic.findOne({
                    where : {id: inputId},
                    // attributes: {
                    //     exclude: ['']
                    // },
                })

                if(data) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {clinicId: inputId},
                        attributes: ['doctorId']
                    })
                    data.doctorClinic = doctorClinic;
                } else data = {}
                resolve({
                    errMessage: "OK!",
                    errCode: 0,
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createClinic,
    getAllClinic,
    editClinic,
    deleteClinic,
    getDetailClinicById
}