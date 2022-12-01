import db from "../models/index";

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
            let value = {
                contentHTML: data.contentHTML,
                contentMarkdown: data.contentMarkdown,
                description: data.description,
            };

            // check doctorId đã tồn tại chưa
            await db.Markdown.findOne({
                where: { doctorId: data.doctorId },
            }).then((obj) => {
                // nếu đã tồn tại tiến hành update
                if (obj) {
                    return db.Markdown.update(
                        { ...value },
                        {
                            where: { doctorId: data.doctorId },
                        }
                    );
                }
                value = {
                    ...value,
                    doctorId: data.doctorId,
                };

                // nếu không tồn tại tiến hành tạo mới
                return db.Markdown.create(value);
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
                let info = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: [
                            "password",
                            "image",
                            "gender",
                            "roleId",
                            "positionId",
                        ],
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
                    ],
                    raw: true,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    message: "Ok",
                    data: info,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    getTopDoctorHome,
    getAllDoctorsService,
    updateDetailDoctorService,
    getDetailDoctorByIdService,
};
