'use strict';
module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define('Company', {
    CompanyID: DataTypes.STRING,
    Countries: DataTypes.STRING,
    Budget: DataTypes.FLOAT,
    Bid: DataTypes.FLOAT,
    Category: DataTypes.STRING
  }, {timestamps: true});
  Company.associate = function(models) {
    // associations can be defined here
  };
  return Company;
};