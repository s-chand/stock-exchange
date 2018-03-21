"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Companies", null, {});
  }
};
