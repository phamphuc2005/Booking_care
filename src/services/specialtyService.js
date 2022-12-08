const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 

let checkSpecialtyName = (dataName) => {
    return new Promise(async(resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: {name: dataName}
            })
            if(specialty) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let check = await checkSpecialtyName(data.name);
                if(check === true) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Specialty has been used. Please enter another name!'
                    });
                } else {
                    await db.Specialty.create({
                        name: data.name,
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

let getAllSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
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

let editSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: {id: data.id},
                    raw: false
                })
                if(specialty) {
                    if(specialty.name == data.name) {
                        specialty.name = data.name,
                        specialty.image = data.imageBase64,
                        specialty.descriptionHTML = data.descriptionHTML,
                        specialty.descriptionMarkdown = data.descriptionMarkdown;
                        await specialty.save();
                        resolve({
                            errCode: 0,
                            message: 'Update specialty successfully!'
                        });
                    } else {
                        let check = await checkSpecialtyName(data.name);
                        if(check === true) {
                            resolve({
                                errCode: -1,
                                errMessage: 'Specialty has been used. Please enter another name!'
                            });
                        }                   
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Specialty does not found!'
                    });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where : {id: data.id},
                })
                if(!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Specialty does not exist!'
                    })
                }
                await db.Specialty.destroy({
                    where : {id: data.id},
                });
                resolve({
                    errCode: 0,
                    message: 'Delete specialty successfully!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let data = await db.Specialty.findOne({
                    where : {id: inputId},
                    // attributes: {
                    //     exclude: ['']
                    // },
                })

                if(data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                    let doctorSpecialty = [];
                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {specialtyId: inputId},
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
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
    createSpecialty,
    getAllSpecialty,
    editSpecialty,
    deleteSpecialty,
    getDetailSpecialtyById
}