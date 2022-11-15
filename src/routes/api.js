import express from "express";
import userController from "../controller/userController";
let router = express.Router();

let initAPIRouter = function (app) {
    router.post("/api/login", userController.handleLogin);

    router.get("/api/get-all-user", userController.handleGetAllUser);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.put("/api/update-user", userController.handleUpdateUser);

    router.get("/all-code", userController.getAllCode);
    return app.use("/", router);
};

module.exports = initAPIRouter;
