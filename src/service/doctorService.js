import db from "../models/index";
import _ from "lodash";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: +limit,
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ["password"] },
                where: { roleId: "R2" },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                message: "Ok",
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ["password", "image"] },
                where: { roleId: "R2" },
            });
            resolve({
                errCode: 0,
                message: "Ok",
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateDetailDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let valueMarkdown = {
                contentHTML: data.contentHTML,
                contentMarkdown: data.contentMarkdown,
                description: data.description,
            };

            let valueDoctorInfo = {
                priceId: data.selectedPrice,
                provinceId: data.selectedProvince,
                paymentId: data.selectedPayment,
                addressClinic: data.addressClinic,
                nameClinic: data.nameClinic,
                note: data.note,
                clinicId: data.selectedClinic,
                specialtyId: data.selectedSpecialty,
            };

            // check doctorId ???? t???n t???i ch??a _ table Markdown
            await db.Markdown.findOne({
                where: { doctorId: data.doctorId },
            }).then(async (obj) => {
                // n???u ???? t???n t???i ti???n h??nh update
                if (obj) {
                    return db.Markdown.update(
                        { ...valueMarkdown },
                        {
                            where: { doctorId: data.doctorId },
                        }
                    );
                } else {
                    let value = {
                        ...valueMarkdown,
                        doctorId: data.doctorId,
                    };

                    // n???u kh??ng t???n t???i ti???n h??nh t???o m???i
                    await db.Markdown.create(value);
                }
            });

            // check doctorId ???? t???n t???i ch??a _ table Doctor_Info
            await db.Doctor_Info.findOne({
                where: { doctorId: data.doctorId },
            }).then(async (obj) => {
                // n???u ???? t???n t???i ti???n h??nh update
                if (obj) {
                    return db.Doctor_Info.update(
                        { ...valueDoctorInfo },
                        {
                            where: { doctorId: data.doctorId },
                        }
                    );
                } else {
                    let value = {
                        ...valueDoctorInfo,
                        doctorId: data.doctorId,
                    };

                    // n???u kh??ng t???n t???i ti???n h??nh t???o m???i
                    await db.Doctor_Info.create(value);
                }
            });

            resolve({
                errCode: 0,
                message: "Ok",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ["password", "gender", "roleId", "positionId"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "contentHTML",
                                "contentMarkdown",
                                "description",
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        // {
                        //     model: db.Doctor_Info,
                        //     attributes: {
                        //         exclude: ["id", "doctorId"],
                        //     },
                        //     include: [
                        //         {
                        //             model: db.Allcode,
                        //             as: "priceData",
                        //             attributes: ["valueEn", "valueVi"],
                        //         },
                        //         {
                        //             model: db.Allcode,
                        //             as: "provinceData",
                        //             attributes: ["valueEn", "valueVi"],
                        //         },
                        //         {
                        //             model: db.Allcode,
                        //             as: "paymentData",
                        //             attributes: ["valueEn", "valueVi"],
                        //         },
                        //     ],
                        // },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, "base64").toString(
                        "binary"
                    );
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: "Ok",
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

//!!!!
let getMarkdownByIdDoctorService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Markdown.findOne({ where: { doctorId: id } });
            let Doctor_Info = await db.Doctor_Info.findOne({
                where: { doctorId: id },
                attributes: [
                    "priceId",
                    "provinceId",
                    "paymentId",
                    "addressClinic",
                    "nameClinic",
                    "note",
                    "clinicId",
                    "specialtyId",
                ],
            });
            data = { ...data, Doctor_Info };
            resolve({ errCode: 0, message: "Ok", data: data });
        } catch (error) {
            reject(error);
        }
    });
};

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.result || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing result parameters",
                });
            } else {
                let schedule = data.result;
                let doctorId = data.doctorId;
                let date = data.date;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                //get exist data
                let exist = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                });

                // convert date
                // if (exist && exist.length > 0) {
                //     exist.map((item, index) => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     });
                // }

                // get data can create
                let toCreate = _.differenceWith(schedule, exist, (a, b) => {
                    return a.timeType == b.timeType && a.date == b.date;
                });

                await db.Schedule.bulkCreate(toCreate);
                resolve({ errCode: 0, message: "Ok" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing result parameters",
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.User,
                            as: "doctorName",
                            attributes: ["fullName"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getExtraInfoDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            }
            let data = await db.Doctor_Info.findOne({
                where: { doctorId: id },
                attributes: { exclude: ["id", "doctorId"] },
                include: [
                    {
                        model: db.Allcode,
                        as: "priceData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "provinceData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "paymentData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (!data) data = {};
            resolve({ errCode: 0, message: "Ok", data: data });
        } catch (error) {
            reject(error);
        }
    });
};

let getProfileDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },

                        {
                            model: db.Doctor_Info,
                            attributes: { exclude: ["id", "doctorId"] },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],

                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, "base64").toString(
                        "binary"
                    );
                }
                if (!data) data = {};
                resolve({ errCode: 0, message: "Ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
module.exports = {
    getTopDoctorHome,
    getAllDoctorsService,
    updateDetailDoctorService,
    getDetailDoctorByIdService,
    getMarkdownByIdDoctorService,
    bulkCreateScheduleService,
    getScheduleDoctorByDateService,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
};
