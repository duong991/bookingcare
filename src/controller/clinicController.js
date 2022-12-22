import clinicService from "../service/clinicService";

let createNewClinic = async (req, res) => {
    try {
        let result = await clinicService.createNewClinicService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getAllClinic = async (req, res) => {
    try {
        let result = await clinicService.getAllClinicService();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getDetailClinicById = async (req, res) => {
    try {
        let result = await clinicService.getDetailClinicByIdService(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
};
