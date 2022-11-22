const express = require ('express');
const homeController = require ('../controllers/homeController');
const userController = require ('../controllers/userController');
const doctorController = require ('../controllers/doctorController');


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
    router.delete("/api/delete-user", userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-Id', doctorController.getDetailDoctorById);
    router.post('/api/save-schedule-doctor', doctorController.createScheduleDoctor);
    router.get('/api/get-doctor-schedule-by-date', doctorController.getDoctorScheduleByDate);
    router.get('/api/get-more-doctor-info-by-Id', doctorController.getMoreDoctorInfoById);

    return app.use("/", router);
};
module.exports = initWebRoutes;