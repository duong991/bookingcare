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
                    attributes: ["email", "password", "roleId"],
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
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    positionId: data.positionId,
                    image: data.image,
                    gender: data.gender,
                    roleId: data.roleId,
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
            }
            await user.destroy();
            resolve({ errCode: 0, errMessage: "Ok" });
        } catch (error) {
            reject(error);
        }
    });
};

let UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: data.id } });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: "User not found",
                });
            }
            await db.User.update(
                {
                    fullName: data.fullName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                },
                {
                    where: { id: data.id },
                }
            );
            resolve({ errCode: 0, message: "Ok" });
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
};
