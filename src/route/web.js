const express = require ('express');
const homeController = require ('../controllers/homeController');
const userController = require ('../controllers/userController');
const doctorController = require ('../controllers/doctorController');
const patientController = require('../controllers/patientController');
const specialtyController = require('../controllers/specialtyController');
const clinicController = require('../controllers/clinicController');
const commentController = require('../controllers/commentController');

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.put("/api/delete-user", userController.handleDeleteUser);
    router.post("/api/register", userController.handleRegister);
    router.post("/api/confirm-register", userController.handleConfirmRegister);
    router.get("/api/get-user-info", userController.handleUserInfo);
    router.get("/api/get-trash-users", userController.handleGetTrashUsers);
    router.put("/api/unDelete-user", userController.handleUnDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-Id', doctorController.getDetailDoctorById);
    router.post('/api/save-schedule-doctor', doctorController.createScheduleDoctor);
    router.delete("/api/delete-schedule", doctorController.handleDeleteSchedule);
    router.get('/api/get-doctor-schedule-by-date', doctorController.getDoctorScheduleByDate);
    router.get('/api/get-more-doctor-info-by-Id', doctorController.getMoreDoctorInfoById);
    router.get('/api/get-profile-doctor-by-Id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-appointment', doctorController.getListAppointment);
    router.post('/api/send-confirm', doctorController.sendConfirm);
    router.get('/api/get-list-patient', doctorController.getListPatient);
    router.put('/api/confirm-cancel', doctorController.confirmCancel);

    router.post('/api/patient-booking', patientController.postPatientBooking);
    router.post('/api/verify-booking', patientController.postVerifyBooking);
    router.get('/api/get-list-schedule', patientController.getListSchedule);
    router.get('/api/get-history', patientController.getHistory);
    router.put('/api/cancel-appointment', patientController.cancelAppointment);

    router.post('/api/create-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.put("/api/edit-specialty", specialtyController.editSpecialty);
    router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.put("/api/edit-clinic", clinicController.editClinic);
    router.delete("/api/delete-clinic", clinicController.deleteClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    router.post('/api/create-comment', commentController.createComment);
    router.get('/api/get-all-comment', commentController.getAllComment);
    router.put("/api/edit-comment", commentController.editComment);
    router.delete("/api/delete-comment", commentController.deleteComment);

    return app.use("/", router);
};
module.exports = initWebRoutes;