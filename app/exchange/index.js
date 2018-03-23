const url = require("url");
const { logger, winnerLog} = require("./log");
const companyModel = require("../models").Company;

const resultStates = {
    PASSED: "Passed",
    FAILED: "Failed"
};
const checks = {
    BASETARGETING: "BaseTargeting",
    BUDGETCHECK: "BudgetCheck",
    BASEBID: "BaseBid"
};

const checkBaseTargeting = (companies, countrycode, Category) => {
    // Find the simplest way to search the collection of companies using countrycode and Category
    const logResultList = [];
    let companyListLength = companies.length;
    for (let i = 0; i < companyListLength; i++) {
        const countryFound = findSubString(companies[i].Countries, countrycode);
        const categoryFound = findSubString(companies[i].Category, Category);

        if (
            countryFound === resultStates.PASSED &&
            categoryFound === resultStates.PASSED
        ) {
            logResultList.push(
                `{${companies[i].CompanyID}, ${resultStates.PASSED}}`
            );
        } else {
            logResultList.push(
                `{${companies[i].CompanyID}, ${resultStates.FAILED}}`
            );
            delete companies[i];
        }
    }
    logger(logResultList, checks.BASETARGETING);
    companies = companies.filter(x => Boolean(x))
    return companies;
};
const checkBaseBid = (companies, bid) => {
    let resultLogList = [];
    let companyListLength = companies.length;
    for (let i = 0; i < companyListLength; i++) {
        const hasBudget = compareBidToBaseBid(companies[i], bid);
        if (hasBudget === resultStates.PASSED) {
            resultLogList.push(
                `{${companies[i].CompanyID},${resultStates.PASSED}}`
            );
        } else {
            resultLogList.push(
                `{${companies[i].CompanyID},${resultStates.FAILED}}`
            );
            delete companies[i];
        }
    }
    logger(resultLogList, checks.BASEBID);
    companies = companies.filter(x => Boolean(x))
    return companies;
};
const checkBudget = companies => {
    let resultLogList = [];
    let companyListLength = companies.length;

    for (let i = 0; i < companyListLength; i++) {
        // convert the cents to dollars for comparison
        const convertedBid = convertCentsToDollars(
            parseFloat(companies[i].Bid)
        );
        const outcome = parseFloat(companies[i].Budget) > convertedBid;

        if (outcome === false) {
            resultLogList.push(
                `{${companies[i].CompanyID},${resultStates.FAILED}}`
            );
            delete companies[i];
        } else {
            resultLogList.push(
                `{${companies[i].CompanyID},${resultStates.PASSED}}`
            );
        }
    }
    logger(resultLogList, checks.BUDGETCHECK);
    companies = companies.filter(x => Boolean(x))
    return companies;
};
const shortListCompany = companies => {
    // Get the company with the highest bid
    /**
     * Algorithm
     * Sort the companies using Array.sort but with a custom 
     * function that takes the company and compares their Bids.
     * 
     * Pull out the highest value based on the order as the winner.
     * return the CompanyID
     */

     // take the company object and compare the Bids taking into consideration that it's stored as strings
    const compare = (a, b) =>  parseFloat(a.Bid) - parseFloat(b.Bid);
    let winner = {}
    // check if the array length is one and return the company Bid
    if(companies.length === 1) {
        winner = companies.pop()
        winnerLog(winner);
        return winner;
    }
    // this means we have more than one company returned that matches the results
    // Hence we need to sort the collection using our
    companies.sort(compare)
    winner = companies.pop()
    winnerLog(winner)
    return winner;

};
const reduceBudget = (company) => {
    const currentBid = parseFloat(company.Bid)
    const currentBudget = parseFloat(company.Budget);
    const newBudget = currentBudget - convertCentsToDollars(currentBid);

    return companyModel.update({
        Budget: newBudget.toFixed(2) // incase it now has decimal places    
    }, {
        where: {
            CompanyID: company.CompanyID
        }
    })
};
const validateData = (countryCode, Category, BaseBid) => {
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

/**
 * function receiveRequest
 *
 * This function receives requests from the API for processing by the exchange internal components
 * Each subfunction that get's called returns a value. This is expected to ensure that we test each function independently
 * @param {*} req
 * @param {*} res
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
                return res.json("No Companies Passed from Bugdet");

            companyList = checkBaseBid(companyList, BaseBid);

            if (companyList.length === 0)
                return res.json("No Companies Passed from BaseBid check");
            
            const winner = shortListCompany(companyList)

            reduceBudget(winner).then( updateResult => {
                return res.json(`Winner = ${winner.CompanyID}`)
            }).catch(err => {
                return res.status(400).json(err)
            })
            // return res.json(winner);
        })
        .catch(err => {
            return res.status(400).json(err);
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
