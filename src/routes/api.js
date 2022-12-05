import express from "express";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
let router = express.Router();

let initAPIRouter = function (app) {
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-user", userController.handleGetAllUser);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.put("/api/update-user", userController.handleUpdateUser);
    router.get("/api/all-code", userController.getAllCode);

    router.get("/api/top-doctor-home", doctorController.getDoctorHome);
    router.get("/api/get-all-doctors", doctorController.getAllDoctor);
    router.post(
        "/api/update-detail-doctor",
        doctorController.updateDetailDoctor
    );
    router.get(
        "/api/get-detail-doctor-by-id",
        doctorController.getDetailDoctorById
    );

    router.get(
        "/api/get-markdown-by-id-doctor",
        doctorController.getMarkdownByIdDoctor
    );
    router.post(
        "/api/bulk-create-schedule",
        doctorController.bulkCreateSchedule
    );

    return app.use("/", router);
};

module.exports = initAPIRouter;
