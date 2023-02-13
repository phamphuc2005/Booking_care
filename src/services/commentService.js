const db = require('../models/index');
require('dotenv').config();
const _ = require ('lodash'); 

let createComment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.userId || !data.content || !data.date || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!'
                })
            } else {
                let check = await db.Booking.findOne({
                    where: {
                        patientId: data.userId,
                        doctorId: +data.doctorId,
                        statusId: 'S3'
                    },
                    raw: false
                })
                if(check) {
                    await db.Comment.create({
                        doctorId: +data.doctorId,
                        userId: data.userId,
                        date: data.date,
                        content: data.content,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'OK!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Bạn chưa được bác sĩ này khám nên không thể đánh giá và phản hồi !"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllComment = (inputId, order) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let comments = await db.Comment.findAll({
                    order: [['id', order]],
                    where : {doctorId: +inputId},
                    include: [
                        {model: db.User, as: 'userData', attributes: ['firstName', 'lastName', 'image']},
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errMessage: "OK!",
                    errCode: 0,
                    data: comments
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editComment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.content || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let comment = await db.Comment.findOne({
                    where: {id: data.id},
                    raw: false
                })
                if(comment) {
                    comment.content = data.content,
                    comment.date = data.date,
                    await comment.save();
                    resolve({
                        errCode: 0,
                        message: 'Chỉnh sửa bình luận thành công!'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bình luận không tồn tại!'
                    });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteComment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu dữ liệu!',
                })
            } else {
                let comment = await db.Comment.findOne({
                    where : {id: data.id},
                })
                if(!comment) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bình luận không tồn tại!'
                    })
                }
                await db.Comment.destroy({
                    where : {id: data.id},
                });
                resolve({
                    errCode: 0,
                    message: 'Xóa bình luận thành công!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createComment,
    getAllComment,
    editComment,
    deleteComment,
}