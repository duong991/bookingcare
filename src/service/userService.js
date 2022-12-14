import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email); //  check email exist
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ["email", "password", "roleId", "fullName"],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    console.log(user);
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.message = "Oke";
                        delete user.password;
                        userData.userInfo = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = "Password mismatch";
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.message = `Your Email isn't exist in system. Plz try again`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            });
            user ? resolve(true) : resolve(false);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "All") {
                users = await db.User.findAll({
                    attributes: { exclude: ["password"] },
                });
            } else {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let CreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let check email exists
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email address already exists. Please try again!",
                });
            } else {
                // let hash password
                let hashPassword = bcrypt.hashSync(data.password, salt);
                // create user with sequelize
                const account = await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    positionId: data.position,
                    gender: data.gender,
                    roleId: data.role,
                    image: data.image,
                });
                //return message
                resolve({ errCode: 0, message: "Ok" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let DeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false,
            });
            if (!user) {
                resolve({ errCode: 1, errMessage: "User not found" });
            } else {
                await user.destroy();
                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.fullName = data.fullName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                if (data.image) {
                    user.image = data.image;
                }
                await user.save();
                resolve({ errCode: 0, message: "Ok" });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let GetAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let response = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                response.errCode = 0;
                response.data = allCode;
                resolve(response);
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    handleUserLogin,
    getAllUser,
    CreateNewUser,
    DeleteUser,
    UpdateUser,
    GetAllCodeService,
};
