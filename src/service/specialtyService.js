import db from "../models/index";
import _ from "lodash";

let createNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.descriptionMarkdown ||
                !data.descriptionHTML ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters parameters",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkDown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                });

                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getAllSpecialtyService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (type === "ALL") {
                data = await db.Specialty.findAll();
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = new Buffer(item.image, "base64").toString(
                            "binary"
                        );
                        return item;
                    });
                }
            } else if (type === "Name") {
                data = await db.Specialty.findAll({
                    attributes: ["id", "name"],
                });
            }
            resolve({ errCode: 0, errMessage: "ok", data: data });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getDetailSpecialtyByIdService = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: id },
                    attributes: ["descriptionHTML", "descriptionMarkDown"],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === "All") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }

                    data = { ...data, doctorSpecialty };
                }
                resolve({ errCode: 0, errMessage: "ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
            cc;
        }
    });
};

module.exports = {
    createNewSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyByIdService,
};
