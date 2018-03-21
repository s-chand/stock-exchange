'use strict';
module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define('Company', {
    country: DataTypes.STRING,
    budget: DataTypes.FLOAT,
    bid: DataTypes.FLOAT,
    category: DataTypes.STRING
  }, {timestamps: true});
  Company.associate = function(models) {
    // associations can be defined here
  };
  return Company;
};