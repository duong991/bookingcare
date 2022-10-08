import express from "express";
import homeController from "../controller/homeController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/signup", homeController.getSignupPage);
    router.post("/crud_test", homeController.createUser);
    return app.use("/", router);
};

module.exports = initWebRoutes;
