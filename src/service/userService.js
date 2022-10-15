import db from "../models/index";
import bcrypt from "bcryptjs";
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

module.exports = {
    handleUserLogin: handleUserLogin,
};
