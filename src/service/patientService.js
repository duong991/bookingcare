import db from "../models/index";
import _ from "lodash";

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        if (!data.email || !data.doctorId || !data.date || !data.timeType) {
            resolve({
                errCode: 1,
                errMessage: "Missing required parameters!",
            });
        } else {
            let [user, result] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: "R3",
                },
            });

            // create a booking reacord
            let { id } = user;
            if (user) {
                await db.Booking.findOrCreate({
                    where: { patientId: id },
                    defaults: {
                        statusId: "S1",
                        doctorId: data.doctorId,
                        patientId: id,
                        date: data.date,
                        timeType: data.timeType,
                    },
                });
            }

            resolve({ errCode: 0, message: "Save info patient success" });
        }
        try {
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointmentService,
};
