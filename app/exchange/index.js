const url = require('url');
const company = require("../models").Company
/**
 * function receiveRequest
 * 
 * This function receives requests from the API for processing by the exchange internal components
 * @param {*} req 
 * @param {*} res 
 */
const receiveRequest = (req, res) => {
  // Extract the components suppplied as query parameters
  console.log(`Acknowledging request from ${process.pid} and ${JSON.stringify(req.query)}`)
  company.findAll({}).then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(400).json(err)
  })
};


const checkBaseTargeting = () => {};
const checkBudget = () => {};
const checkBaseBid = () => {};
const shortListCompany = () => {};
const reduceBudget = () => {};
const validate = (countryCode, Category, BaseBid) =>{
  if(!countryCode || !Category || !BaseBid) return false
  return true
}

module.exports = {
  receiveRequest,
  checkBaseTargeting,
  checkBudget,
  checkBaseBid,
  shortListCompany,
  reduceBudget
};
