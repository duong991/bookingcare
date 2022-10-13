import express from "express";
import userController from "../controller/userController";
let router = express.Router();

let initAPIRouter = function (app) {
    router.post("/api/login", userController.handleLogin);

    return app.use("/", router);
};

module.exports = initAPIRouter;
