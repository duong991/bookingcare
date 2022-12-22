module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("doctor_infos", "specialtyId", {
                type: Sequelize.INTEGER,
            }),
            queryInterface.addColumn("doctor_infos", "clinicId", {
                type: Sequelize.INTEGER,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn("doctor_infos", "specialtyId"),
            queryInterface.removeColumn("doctor_infos", "clinicId"),
        ]);
    },
};
