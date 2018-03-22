const url = require("url");
const { logger } = require("./log");
const company = require("../models").Company;

const resultStates = {
    PASSED: "Passed",
    FAILED: "Failed"
};
const checks = {
    BASETARGETING: "BaseTargeting",
    BUDGETCHECK: "BudgetCheck",
    BASEBID: "BaseBid"
};
/**
 * function receiveRequest
 *
 * This function receives requests from the API for processing by the exchange internal components
 * @param {*} req
 * @param {*} res
 */
const receiveRequest = (req, res) => {
    // Extract the components suppplied as query parameters
    console.log(
        `== Acknowledging request from ${process.pid} and ${JSON.stringify(
            req.query
        )} ==`
    );
    const { countrycode, Category, BaseBid } = req.query;
    if (!validate)
        return res.status(400).json({
            message: "Incorrect data supplied. Please check and retry"
        });
    company
        .findAll({})
        .then(result => {
            // Get All countries available
            result = JSON.stringify(result);
            const baseTargetResult = checkBaseTargeting(
                JSON.parse(result),
                countrycode,
                Category
            );
            res.status(200).json(baseTargetResult);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};

const checkBaseTargeting = (companies, countrycode, Category) => {
    // Find the simplest way to search the collection of companies using countrycode and Category
    let failedCount = 0;
    const outcome = companies.map(x => {
        const countryFound = findSubString(x.Countries, countrycode);
        const categoryFound = findSubString(x.Category, Category);
        if (
            countryFound === resultStates.PASSED &&
            categoryFound === resultStates.PASSED
        ) {
            return `{${x.CompanyID}, ${resultStates.PASSED}}`;
        } else {
            failedCount++;
            return `{${x.CompanyID}, ${resultStates.FAILED}}`;
        }
    });
    if (failedCount === companies.length)
        return "No Companies Passed from Targeting";
    return logger(outcome, checks.BASETARGETING);
};
const checkBaseBid = (companies, bid) => {
    let failedCount = 0;
    const outcome = companies.map(company => {
        const hasBudget = compareBidToBaseBid(company, bid);
        if (hasBudget === resultStates.PASSED) {
            return `{${company.CompanyID}, ${resultStates.PASSED}}`;
        } else {
            failedCount++;
            return `{${company.CompanyID}, ${resultStates.FAILED}}`;
        }
    });
    if (failedCount === companies.length)
        return "No Companies Passed from BaseBid check";
    return logger(outcome, checks.BASEBID);
};
const checkBudget = companies => {};
const shortListCompany = () => {};
const reduceBudget = () => {};
const validate = (countryCode, Category, BaseBid) => {
    if (!countryCode || !Category || !BaseBid) return false;
    return true;
};

/**
 * findSubstring - This method looks for the presence of a substring in a string delimted by commas
 * @param {*} sourceString
 * @param {*} textToFind
 */
const findSubString = (sourceString, textToFind) => {
    const re = /\s*,\s*/; // In the event that spaces exist before or after the commas, we use this to remove them
    const result = sourceString.split(re).indexOf(textToFind) > -1;
    return result ? resultStates.PASSED : resultStates.FAILED;
};
const convertCentsToDollars = cents => {
    // 100 cents = 1 dollar e.g 10 cents => 10/100 dollars
    const unit = 100;
    return cents / unit;
};

const compareBidToBaseBid = (company, bid) => {
    const bidInFloat = parseFloat(bid);
    const companyBidInFloat = parseFloat(company.Bid);

    const result = companyBidInFloat < bidInFloat;

    return result ? resultStates.PASSED : resultStates.FAILED;
};
module.exports = {
    receiveRequest,
    checkBaseTargeting,
    checkBudget,
    checkBaseBid,
    shortListCompany,
    reduceBudget
};
