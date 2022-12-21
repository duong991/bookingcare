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

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, "base64").toString(
                        "binary"
                    );
                    return item;
                });
            }

            resolve({ errCode: 0, errMessage: "ok", data: data });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = { createNewSpecialtyService, getAllSpecialtyService };
