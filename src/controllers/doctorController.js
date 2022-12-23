const doctorService = require ('../services/doctorService');

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let createScheduleDoctor = async (req, res) => {
    try {
        let schedule = await doctorService.createScheduleDoctor(req.body);
        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDoctorScheduleByDate = async (req, res) => {
    try {
        let schedule = await doctorService.getDoctorScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getMoreDoctorInfoById = async (req, res) => {
    try {
        let info = await doctorService.getMoreDoctorInfoById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListAppointment = async (req, res) => {
    try {
        let info = await doctorService.getListAppointment(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendConfirm = async (req, res) => {
    try {
        let info = await doctorService.sendConfirm(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatient = async (req, res) => {
    try {
        let info = await doctorService.getListPatient(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleDeleteSchedule = async (req, res) => {
    try {
        let data = await doctorService.deleteSchedule(req.body);
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
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    createScheduleDoctor: createScheduleDoctor,
    getDoctorScheduleByDate: getDoctorScheduleByDate,
    getMoreDoctorInfoById: getMoreDoctorInfoById,
    getProfileDoctorById: getProfileDoctorById,
    getListAppointment: getListAppointment,
    sendConfirm: sendConfirm,
    getListPatient,
    handleDeleteSchedule
}