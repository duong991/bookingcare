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

module.exports = {
    handleLogin: handleLogin,
};
