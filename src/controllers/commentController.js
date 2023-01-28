const commentService = require ('../services/commentService');

let createComment = async (req, res) => {
    try {
        let data = await commentService.createComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllComment = async (req, res) => {
    try {
        let data = await commentService.getAllComment(req.query.id, req.query.order);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let editComment = async (req, res) => {
    try {
        let data = await commentService.editComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let deleteComment = async (req, res) => {
    try {
        let data = await commentService.deleteComment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createComment,
    getAllComment,
    editComment,
    deleteComment,
}