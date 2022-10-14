const express = require ('express');
const homeController = require ('../controllers/homeController')

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);

    return app.use("/", router);
};
module.exports = initWebRoutes;