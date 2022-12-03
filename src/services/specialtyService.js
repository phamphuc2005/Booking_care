const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 

let createSpecialty = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
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

module.exports = {
    createSpecialty,
    getAllSpecialty
}