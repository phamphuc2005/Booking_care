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

let checkClinicName_en = (dataName) => {
    return new Promise(async(resolve, reject) => {
        try {
            let clinic = await db.Clinic_En.findOne({
                where: {name_en: dataName}
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
            if(!data.name_vi || !data.address_vi || !data.imageBase64 || !data.descriptionHTML_vi || !data.descriptionMarkdown_vi ||
                !data.name_en || !data.address_en || !data.descriptionHTML_en || !data.descriptionMarkdown_en) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!'
                })
            } else {
                let check = await checkClinicName(data.name_vi);
                let check_en = await checkClinicName_en(data.name_en);
                if(check === true && check_en === true) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Tên cơ sở y tế đã được sử dụng. Vui lòng chọn tên khác!'
                    });
                } else {
                    await db.Clinic.create({
                        name: data.name_vi,
                        address: data.address_vi,
                        image: data.imageBase64,
                        descriptionHTML: data.descriptionHTML_vi,
                        descriptionMarkdown: data.descriptionMarkdown_vi,
                        isDelete: 0
                    })
                    let clinic = await db.Clinic.findOne({
                        where: {name: data.name_vi},
                        raw: false
                    })
                    if(clinic) {
                        await db.Clinic_En.create({
                            name_en: data.name_en,
                            address_en: data.address_en,
                            descriptionHTML_en: data.descriptionHTML_en,
                            descriptionMarkdown_en: data.descriptionMarkdown_en,
                            id_en : clinic.id,
                            image_en: data.imageBase64,
                            isDelete: 0
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

let getAllClinic = (data_vi, data_en) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data_vi = await db.Clinic.findAll({
                where : {isDelete: 0}
            });
            if (data_vi && data_vi.length > 0) {
                data_vi.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            let data_en = await db.Clinic_En.findAll({
                where : {isDelete: 0}
            });
            if (data_en && data_en.length > 0) {
                data_en.map(item => {
                    item.image_en = new Buffer.from(item.image_en, 'base64').toString('binary');
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

let getTrashClinic = (data_vi, data_en) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data_vi = await db.Clinic.findAll({
                where : {isDelete: 1}
            });
            if (data_vi && data_vi.length > 0) {
                data_vi.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            let data_en = await db.Clinic_En.findAll({
                where : {isDelete: 1}
            });
            if (data_en && data_en.length > 0) {
                data_en.map(item => {
                    item.image_en = new Buffer.from(item.image_en, 'base64').toString('binary');
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

let editClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.name_vi || !data.address_vi || !data.imageBase64 || !data.descriptionHTML_vi || !data.descriptionMarkdown_vi ||
                !data.name_en || !data.address_en || !data.descriptionHTML_en || !data.descriptionMarkdown_en) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: {id: data.id},
                    raw: false
                })
                let clinic_en = await db.Clinic_En.findOne({
                    where: {id_en: data.id},
                    raw: false
                })
                if(clinic && clinic_en) {
                    if(clinic.name === data.name_vi && clinic_en.name_en === data.name_en) {
                        clinic.name = data.name_vi,
                        clinic.address = data.address_vi,
                        clinic.image = data.imageBase64,
                        clinic.descriptionHTML = data.descriptionHTML_vi,
                        clinic.descriptionMarkdown = data.descriptionMarkdown_vi;
                        await clinic.save();

                        clinic_en.name_en = data.name_en,
                        clinic_en.address_en = data.address_en,
                        clinic_en.descriptionHTML_en = data.descriptionHTML_en,
                        clinic_en.descriptionMarkdown_en = data.descriptionMarkdown_en;
                        clinic.image_en = data.imageBase64,
                        await clinic_en.save();
                        resolve({
                            errCode: 0,
                            message: 'Cập nhật cơ sở y tế thành công!'
                        });
                    }
                     else {
                        let check = await checkClinicName(data.name_vi);
                        let check_en = await checkClinicName_en(data.name_en);
                        if(check === true && check_en === true) {
                            resolve({
                                errCode: -1,
                                errMessage: 'Tên cơ sở y tế đã được sử dụng. Vui lòng chọn tên khác!'
                            });
                        } else {
                            clinic.name = data.name_vi,
                            clinic.address = data.address_vi,
                            clinic.image = data.imageBase64,
                            clinic.descriptionHTML = data.descriptionHTML_vi,
                            clinic.descriptionMarkdown = data.descriptionMarkdown_vi;
                            await clinic.save();

                            clinic_en.name_en = data.name_en,
                            clinic_en.address_en = data.address_en,
                            clinic_en.descriptionHTML_en = data.descriptionHTML_en,
                            clinic_en.descriptionMarkdown_en = data.descriptionMarkdown_en;
                            clinic.image_en = data.imageBase64,
                            await clinic_en.save();
                            resolve({
                                errCode: 0,
                                message: 'Cập nhật cơ sở y tế thành công!'
                            });
                        }                  
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cơ sở y tế không tồn tại!'
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
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where : {id: data.id, isDelete: 0},
                    raw: false
                })
                let clinic_en = await db.Clinic_En.findOne({
                    where : {id_en: data.id, isDelete: 0},
                    raw: false
                })
                if(!clinic || !clinic_en) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cơ sở y tế không tồn tại!'
                    })
                } else {
                    clinic.isDelete = 1;
                    await clinic.save();
                    clinic_en.isDelete = 1;
                    await clinic_en.save();
                }
                // await db.Clinic.destroy({
                //     where : {id: data.id},
                // });
                // await db.Clinic_En.destroy({
                //     where : {id_en: data.id},
                // });
                resolve({
                    errCode: 0,
                    message: 'Xóa cơ sở y tế thành công!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let unDeleteClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where : {id: data.id, isDelete: 1},
                    raw: false
                })
                let clinic_en = await db.Clinic_En.findOne({
                    where : {id_en: data.id, isDelete: 1},
                    raw: false
                })
                if(!clinic || !clinic_en) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cơ sở y tế không tồn tại!'
                    })
                } else {
                    clinic.isDelete = 0;
                    await clinic.save();
                    clinic_en.isDelete = 0;
                    await clinic_en.save();
                }
                resolve({
                    errCode: 0,
                    message: 'Khôi phục cơ sở y tế thành công!'
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
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let data_vi = await db.Clinic.findOne({
                    where : {id: inputId},
                })
                let data_en = await db.Clinic_En.findOne({
                    where : {id_en: inputId},
                })

                if(data_vi) {
                    data_vi.image = new Buffer.from(data_vi.image, 'base64').toString('binary');
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {clinicId: inputId},
                        attributes: ['doctorId']
                    })
                    data_vi.doctorClinic = doctorClinic;
                } else data_vi = {};
                if(data_en) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {clinicId: inputId},
                        attributes: ['doctorId']
                    })
                    data_en.doctorClinic = doctorClinic;
                } else data_en = {}
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
    createClinic,
    getAllClinic,
    editClinic,
    deleteClinic,
    getDetailClinicById,
    getTrashClinic,
    unDeleteClinic
}