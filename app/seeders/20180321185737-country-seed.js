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
          country: "US,FR",
          budget: 1,
          bid: 10, // in cents
          category: "Automobile,Finance"
        },
        {
          country: "IN,US",
          budget: 2,
          bid: 30, // in cents
          category: "IT,Finance"
        },
        {
          country: "US,RU",
          budget: 3,
          bid: 5,
          category: "Automobile,IT"
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
