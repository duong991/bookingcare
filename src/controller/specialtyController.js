import specialtyService from "../service/specialtyService";

let createNewSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.createNewSpecialtyService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

module.exports = {
    createNewSpecialty,
};
