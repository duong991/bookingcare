import doctorService from "../service/doctorService";

let getDoctorHome = async (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10;
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error form server..." });
    }
};

module.exports = { getDoctorHome };
