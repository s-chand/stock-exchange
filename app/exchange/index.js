const url = require("url");
let log = require("./log");
const logManager = new log("/tmp/logs/log.txt");
const logger = (message, check) => logManager.logger(message, check);
const winnerLog = message => logManager.winnerLog(message);
const companyModel = require("../models").Company;

/** 
 * Defines states of each step
 */
const resultStates = {
    PASSED: "Passed",
    FAILED: "Failed"
};

/**
 *  The name for the various checks. Reduces the likelihood of typo
 */
const checks = {
    BASETARGETING: "BaseTargeting",
    BUDGETCHECK: "BudgetCheck",
    BASEBID: "BaseBid"
};

/**
 * This function receives a list of companies as well as the country code and category to filter the list by
 * @function checkBaseTargeting 
 * 
 * @param {Object[]} companies array of company objects
 * @param {string} countrycode
 * @param {string} Category
 * @returns {Object[]} list of successful companies
 */
const checkBaseTargeting = (companies, countrycode, Category) => {
    // Find the simplest way to search the collection of companies using countrycode and Category
    // let companies = [...cx];
    const logResultList = [];
    let companyListLength = companies.length;
    let successList = [];
    companies.forEach(company => {
        const countryFound = findSubString(company.Countries, countrycode);
        const categoryFound = findSubString(company.Category, Category);
        if (
            countryFound === resultStates.PASSED &&
            categoryFound === resultStates.PASSED
        ) {
            logResultList.push(
                `{${company.CompanyID}, ${resultStates.PASSED}}`
            );
            successList.push(company);
        } else {
            logResultList.push(
                `{${company.CompanyID}, ${resultStates.FAILED}}`
            );
        }
    });

    logger(logResultList, checks.BASETARGETING);
    return successList;
};

/** This function checks base bid supplied against companies bid prices
 * @function checkBaseBid
 * @param {Object[]} companies 
 * @param {string} bid 
 * @returns {Object[]} list of successful companies
 */
const checkBaseBid = (companies, bid) => {
    let resultLogList = [];
    let companyListLength = companies.length;
    let successList = [];
    companies.forEach(company => {
        const hasBudget = compareBidToBaseBid(company, bid);
        if (hasBudget === resultStates.PASSED) {
            resultLogList.push(`{${company.CompanyID},${resultStates.PASSED}}`);
            successList.push(company);
        } else {
            resultLogList.push(`{${company.CompanyID},${resultStates.FAILED}}`);
        }
    });
    logger(resultLogList, checks.BASEBID);
    return successList;
};
/**
 * Checks the company's budget against its bid to see if it has budget for stock sales. It's better than cehcking against zero
 * @function checkBudget
 * @param {Object[]} companies 
 * @returns {Object[]} list of successful companies
 */
const checkBudget = companies => {
    let resultLogList = [];
    let companyListLength = companies.length;
    let successList = [];

    companies.forEach(company => {
        const convertedBid = convertCentsToDollars(parseFloat(company.Bid));
        const outcome = parseFloat(company.Budget) > convertedBid;

        if (outcome === false) {
            resultLogList.push(`{${company.CompanyID},${resultStates.FAILED}}`);
        } else {
            resultLogList.push(`{${company.CompanyID},${resultStates.PASSED}}`);
            successList.push(company);
        }
    });
    logger(resultLogList, checks.BUDGETCHECK);
    return successList;
};

/**
 * Shortlists the company with the highest bid among the supplied company list
 * @function shortListCompany
 * @param {Object[]} companies - a list of companies that made it through other checks
 * @returns {Object} returns a single company object
 */
const shortListCompany = companies => {
    /**
     * Algorithm
     * Sort the companies using Array.sort but with a custom
     * function that takes the company and compares their Bids.
     *
     * Pull out the highest value based on the order as the winner.
     * return the CompanyID
     */

    /**
     * A function used to sort companies by bid
     * @function compare
     * @param {Object} a - company to compare
     * @param {Object} b - compare to compare against
     * take the company object and compare the Bids taking into consideration that it's stored as strings
     */
    const compare = (a, b) => parseFloat(a.Bid) - parseFloat(b.Bid);
    let winner = {};
    // check if the array length is one and return the company Bid
    if (companies.length === 1) {
        winner = companies.pop();
        winnerLog(winner);
        return winner;
    }
    // this means we have more than one company returned that matches the results
    // Hence we need to sort the collection using our compare function
    companies.sort(compare);
    winner = companies.pop();
    winnerLog(winner);
    return winner;
};

/**
 * Reduces the budget of the supplied company
 * @function reduceBudget
 * @param {Object} company - the winner of the bid
 * @returns {Promise} a promise from the database operation
 */
const reduceBudget = company => {
    const currentBid = parseFloat(company.Bid);
    const currentBudget = parseFloat(company.Budget);
    const newBudget = currentBudget - convertCentsToDollars(currentBid);

    return companyModel.update(
        {
            Budget: newBudget.toFixed(2) // incase it now has decimal places
        },
        {
            where: {
                CompanyID: company.CompanyID
            }
        }
    );
};

/**
 * Validates the input data for completeness only
 * @function validateData
 * @param {string} countryCode 
 * @param {string} Category 
 * @param {string} BaseBid
 * @returns {boolean} returns true if all checks pass and false otherwise
 * 
 */
const validateData = (countryCode, Category, BaseBid) => {
    if (!countryCode || !Category || !BaseBid) return false;
    return true;
};

/**
 * This method looks for the presence of a substring in a string delimted by commas
 * @function findSubstring 
 * @param {string} sourceString
 * @param {string} textToFind
 * @returns {string} returns either 'Passed' or 'Failed'
 */
const findSubString = (sourceString, textToFind) => {
    const re = /\s*,\s*/; // In the event that spaces exist before or after the commas, we use this to remove them
    const result = sourceString.split(re).indexOf(textToFind) > -1;
    return result ? resultStates.PASSED : resultStates.FAILED;
};

/**
 * Converts cents to their dollar values
 * @function convertCentsToDollars
 * @param {number} cents 
 * @returns {number} the rebased figure in dollars
 */
const convertCentsToDollars = cents => {
    // 100 cents = 1 dollar e.g 10 cents => 10/100 dollars
    const unit = 100;
    return cents / unit;
};

/**
 * Compares the company's bid value against the BaseBid supplied as the bid parameter
 * @function compareBidToBaseBid
 * @param {Object} company 
 * @param {string} bid 
 */
const compareBidToBaseBid = (company, bid) => {
    const bidInFloat = parseFloat(bid);
    const companyBidInFloat = parseFloat(company.Bid);

    const result = companyBidInFloat < bidInFloat;

    return result ? resultStates.PASSED : resultStates.FAILED;
};

/**
 * This function receives requests from the API for processing by the exchange internal components
 * Each subfunction that get's called returns a value. This is expected to ensure that we test each function independently
 * @function receiveRequest
 * @param {Object} req
 * @param {Object} res
 */
const receiveRequest = (req, res) => {
    // Extract the components suppplied as query parameters
    const { countrycode, Category, BaseBid } = req.query;

    const validate = validateData(countrycode, Category, BaseBid);
    if (!validate)
        return res.status(400).json({
            message: "Incorrect data supplied. Please check and retry"
        });
    companyModel
        .findAll({
            attributes: ["CompanyID", "Budget", "Category", "Countries", "Bid"]
        })
        .then(result => {
            let companyList = JSON.parse(JSON.stringify(result));
            companyList = checkBaseTargeting(
                companyList,
                countrycode,
                Category
            );

            if (companyList.length === 0)
                return res.json("No Companies Passed from Targeting");

            companyList = checkBudget(companyList);
            // companyList = companyList.fliter(x => x)

            if (companyList.length === 0)
                return res.json("No Companies Passed from Budget");

            companyList = checkBaseBid(companyList, BaseBid);

            if (companyList.length === 0)
                return res.json("No Companies Passed from BaseBid check");

            const winner = shortListCompany(companyList);

            reduceBudget(winner).then(updateResult => {
                return res.json(`${winner.CompanyID}`);
            });
        });
};

module.exports = {
    receiveRequest,
    checkBaseTargeting,
    checkBudget,
    checkBaseBid,
    shortListCompany,
    reduceBudget
};
