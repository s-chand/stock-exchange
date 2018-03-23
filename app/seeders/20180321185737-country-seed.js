module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "Companies",
            [
                {
                    CompanyID: "C1",
                    Countries: "US,FR",
                    Budget: 1,
                    Bid: 10, // in cents
                    Category: "Automobile,Finance"
                },
                {
                    CompanyID: "C2",
                    Countries: "IN,US",
                    Budget: 2,
                    Bid: 30, // in cents
                    Category: "IT,Finance"
                },
                {
                    CompanyID: "C3",
                    Countries: "US,RU",
                    Budget: 3,
                    Bid: 5,
                    Category: "Automobile,IT"
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Companies", null, {});
    }
};
