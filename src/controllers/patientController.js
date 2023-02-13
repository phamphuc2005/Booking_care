const patientService = require ('../services/patientService');

let postPatientBooking = async (req, res) => {
    try {
        let info = await patientService.postPatientBooking(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server !'
        })
    }
}

let postVerifyBooking = async (req, res) => {
    try {
        let info = await patientService.postVerifyBooking(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server !'
        })
    }
}

let getListSchedule = async (req, res) => {
    try {
        let info = await patientService.getListSchedule(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server !'
        })
    }
}

let getHistory = async (req, res) => {
    try {
        let info = await patientService.getHistory(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server !'
        })
    }
}

let cancelAppointment = async (req, res) => {
    try {
        let appointment = await patientService.cancelAppointment(req.body);
        return res.status(200).json(appointment);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server !'
        })
    }
}

module.exports = {
    postPatientBooking: postPatientBooking,
    postVerifyBooking: postVerifyBooking,
    getListSchedule,
    getHistory,
    cancelAppointment
}