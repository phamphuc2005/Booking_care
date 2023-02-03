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

let checkSpecialtyName_en = (dataName) => {
    return new Promise(async(resolve, reject) => {
        try {
            let specialty = await db.Specialty_En.findOne({
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
            if(!data.name_vi || !data.imageBase64 || !data.descriptionHTML_vi || !data.descriptionMarkdown_vi ||
                !data.name_en || !data.descriptionHTML_en || !data.descriptionMarkdown_en) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let check = await checkSpecialtyName(data.name_vi);
                let check_en = await checkSpecialtyName_en(data.name_en);
                if(check === true && check_en === true) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Specialty has been used. Please enter another name!'
                    });
                } else {
                    await db.Specialty.create({
                        name: data.name_vi,
                        image: data.imageBase64,
                        descriptionHTML: data.descriptionHTML_vi,
                        descriptionMarkdown: data.descriptionMarkdown_vi
                    })
                    let specialty = await db.Specialty.findOne({
                        where: {name: data.name_vi},
                        raw: false
                    })
                    if(specialty){
                        await db.Specialty_En.create({
                            name: data.name_en,
                            image: data.imageBase64,
                            descriptionHTML: data.descriptionHTML_en,
                            descriptionMarkdown: data.descriptionMarkdown_en,
                            id : specialty.id,
                        })
                    }
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

let getAllSpecialty = (data_vi, data_en) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data_vi = await db.Specialty.findAll();
            if (data_vi && data_vi.length > 0) {
                data_vi.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            let data_en = await db.Specialty_En.findAll();
            if (data_en && data_en.length > 0) {
                data_en.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: "OK!",
                errCode: 0,
                data_vi: data_vi,
                data_en: data_en
            })
        } catch (error) {
            reject(error)
        }
    })
}

let editSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.name_vi || !data.imageBase64 || !data.descriptionHTML_vi || !data.descriptionMarkdown_vi ||
                !data.name_en || !data.descriptionHTML_en || !data.descriptionMarkdown_en) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: {id: data.id},
                    raw: false
                })
                let specialty_en = await db.Specialty_En.findOne({
                    where: {id: data.id},
                    raw: false
                })
                if(specialty && specialty_en) {
                    if(specialty.name == data.name_vi && specialty_en.name == data.name_en) {
                        specialty.name = data.name_vi,
                        specialty.image = data.imageBase64,
                        specialty.descriptionHTML = data.descriptionHTML_vi,
                        specialty.descriptionMarkdown = data.descriptionMarkdown_vi;
                        await specialty.save();

                        specialty_en.name = data.name_en,
                        specialty_en.image = data.imageBase64,
                        specialty_en.descriptionHTML = data.descriptionHTML_en,
                        specialty_en.descriptionMarkdown = data.descriptionMarkdown_en;
                        await specialty_en.save();
                        resolve({
                            errCode: 0,
                            message: 'Update specialty successfully!'
                        });
                    } else {
                        let check = await checkSpecialtyName(data.name_vi);
                        let check_en = await checkSpecialtyName_en(data.name_en);
                        if(check === true && check_en === true) {
                            resolve({
                                errCode: -1,
                                errMessage: 'Specialty has been used. Please enter another name!'
                            });
                        } else {
                            specialty.name = data.name_vi,
                            specialty.image = data.imageBase64,
                            specialty.descriptionHTML = data.descriptionHTML_vi,
                            specialty.descriptionMarkdown = data.descriptionMarkdown_vi;
                            await specialty.save();

                            specialty_en.name = data.name_en,
                            specialty_en.image = data.imageBase64,
                            specialty_en.descriptionHTML = data.descriptionHTML_en,
                            specialty_en.descriptionMarkdown = data.descriptionMarkdown_en;
                            await specialty_en.save();
                            resolve({
                                errCode: 0,
                                message: 'Update specialty successfully!'
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
                let specialty_en = await db.Specialty_En.findOne({
                    where : {id: data.id},
                })
                if(!specialty || !specialty_en) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Specialty does not exist!'
                    })
                }
                await db.Specialty.destroy({
                    where : {id: data.id},
                });
                await db.Specialty_En.destroy({
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
                let data_vi = await db.Specialty.findOne({
                    where : {id: inputId},
                })
                let data_en = await db.Specialty_En.findOne({
                    where : {id: inputId},
                })

                if(data_vi) {
                    data_vi.image = new Buffer.from(data_vi.image, 'base64').toString('binary');

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
                    data_vi.doctorSpecialty = doctorSpecialty;
                } else data_vi = {};
                if(data_en) {
                    data_en.image = new Buffer.from(data_en.image, 'base64').toString('binary');

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
                    data_en.doctorSpecialty = doctorSpecialty;
                } else data_en = {};
                resolve({
                    errMessage: "OK!",
                    errCode: 0,
                    data_vi: data_vi,
                    data_en: data_en
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