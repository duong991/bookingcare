import userService from "../service/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res
            .status(500)
            .json({ message: "Missing input parameters!", errCode: 1 });
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        userInfo: userData.userInfo ? userData.userInfo : {},
    });
};

let handleGetAllUser = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing input parameters!",
        });
    }
    let users = await userService.getAllUser(id);

    return res.status(200).json({
        errCode: 0,
        message: "Ok",
        users,
    });
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.CreateNewUser(req.body.data);
    return res.status(200).json({ message });
};

let handleDeleteUser = async (req, res) => {
    let userId = req.body.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing input parameters!",
        });
    }
    let message = await userService.DeleteUser(userId);
    return res.status(200).json({ message });
};

let handleUpdateUser = async (req, res) => {
    let data = req.body.data;
    let userId = data.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing input parameters!",
        });
    }
    let message = await userService.UpdateUser(data);
    return res.status(200).json({ message });
};
module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleDeleteUser,
    handleUpdateUser,
};
