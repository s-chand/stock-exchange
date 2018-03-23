const chai = require("chai");
const expect = chai.expect;
const exchangeLogic = require("../exchange/index");

// TODO: read logs from file for tests
const LOGS_PATH = ""

const mockDb = [
    {
        CompanyID: "C1",
        Countries: "US, FR",
        Budget: 1,
        Bid: 10, // in cents
        Category: "Automobile, Finance"
    },
    {
        CompanyID: "C2",
        Countries: "IN, US",
        Budget: 2,
        Bid: 30, // in cents
        Category: "IT, Finance"
    },
    {
        CompanyID: "C3",
        Countries: "US, RU",
        Budget: 3,
        Bid: 5, // in cents
        Category: "Automobile, IT"
    }
];

describe("Stock Exchange Logic Unit Tests ", () => {
    describe(" == Base Targeting tests ==", () => {
        it("should match C1 and C3 only for base targeting", () => {
            const sampleData = {
                countrycode: "US",
                baseBid: "10",
                category: "Automobile"
            };

            const result = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(result).to.equal(
                "BaseTargeting: {C1, Passed},{C2, Failed},{C3, Passed}"
            );
        });
        it("should match C2 only for base targeting", () => {
            const sampleData = {
                countrycode: "IN",
                baseBid: "10",
                category: "Finance"
            };

            const result = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(result).to.equal(
                "BaseTargeting: {C1, Failed},{C2, Passed},{C3, Failed}"
            );
        });

        it("should match C3 only for base targeting", () => {
            const sampleData = {
                countrycode: "RU",
                baseBid: "10",
                category: "Automobile"
            };
            const outcome = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(outcome).to.equal(
                "BaseTargeting: {C1, Failed},{C2, Failed},{C3, Passed}"
            );
        });
        it("should fail all checks for Targeting with the correct message", () => {
            const sampleData = {
                countrycode: "NG",
                baseBid: "10",
                category: "Food"
            };
            const outcome = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(outcome).to.equal("No Companies Passed from Targeting");
            // TODO: Test for Log output
            // TODO: Test for a list container only the expected/ desired values
        });
    });

    describe(" == BaseBid Check Tests ==", () => {
        it("should match baseBid check for C3 only", () => {
            const sampleData = {
                countrycode: "RU",
                baseBid: "9",
                category: "Automobile"
            };

            const outcome = exchangeLogic.checkBaseBid(
                mockDb,
                sampleData.baseBid
            );
            /**
             * This should pass because only C3 in test data  has a bid more than the company Bid.
             * C1 has a baseBid of 10, C2 a base bid of 30.
             * They are both higher than 9
             */
            expect(outcome).to.equal(
                "BaseBid: {C1,Failed},{C2,Failed},{C3,Passed}"
            );
        });

        it("should match baseBid for all companies", () => {
            const sampleData = {
                countrycode: "US",
                baseBid: "50",
                category: "Automobile"
            };
            const outcome = exchangeLogic.checkBaseBid(
                mockDb,
                sampleData.baseBid
            );
            /**
             * This should pass all companies available as the highest in the data is 30
             * whereas we are passing in a 50
             */
            expect(outcome).to.equal(
                "BaseBid: {C1,Passed},{C2,Passed},{C3,Passed}"
            );
        });
        it("should fail to match baseBid for any company", () => {
            const sampleData = {
                countrycode: "NG",
                baseBid: "1", // in cents
                category: "Food"
            };
            const outcome = exchangeLogic.checkBaseBid(
                mockDb,
                sampleData.baseBid
            );
            /**
             * This should fail for all companies available because it's base bid offering is lower than that available for all companies present.
             */
            expect(outcome).to.equal("No Companies Passed from BaseBid check");
        });
    });

    describe(" == Budget Check Tests ==", () => {
        it("should pass budget check for all companies", () => {
            const outcome = exchangeLogic.checkBudget(mockDb);

            expect(outcome).to.equal(
                "BudgetCheck: {C1,Passed},{C2,Passed},{C3,Passed}"
            );
        });
        it("should fail for all companies based on supplied data with the correct message", () => {
            const mockDb2 = [
                {
                    CompanyID: "C1",
                    Countries: "US, FR",
                    Budget: 1,
                    Bid: 100, // in cents
                    Category: "Automobile, Finance"
                },
                {
                    CompanyID: "C2",
                    Countries: "IN, US",
                    Budget: 2,
                    Bid: 200, // in cents
                    Category: "IT, Finance"
                },
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 300, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const outcome = exchangeLogic.checkBudget(mockDb2);
            expect(outcome).to.equal("No Companies Passed from Bugdet");
        });
        it("should fail for C1 and C3 with the correct message", () => {
            const mockDb2 = [
                {
                    CompanyID: "C1",
                    Countries: "US, FR",
                    Budget: 1,
                    Bid: 100, // in cents
                    Category: "Automobile, Finance"
                },
                {
                    CompanyID: "C2",
                    Countries: "IN, US",
                    Budget: 2,
                    Bid: 20, // in cents
                    Category: "IT, Finance"
                },
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 300, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const outcome = exchangeLogic.checkBudget(mockDb2);
            expect(outcome).to.equal(
                "BudgetCheck: {C1,Failed},{C2,Passed},{C3,Failed}"
            );
        });
        it("should fail for C2 alone with the correct message", () => {
            const mockDb2 = [
                {
                    CompanyID: "C1",
                    Countries: "US, FR",
                    Budget: 1,
                    Bid: 10, // in cents
                    Category: "Automobile, Finance"
                },
                {
                    CompanyID: "C2",
                    Countries: "IN, US",
                    Budget: 2,
                    Bid: 200, // in cents
                    Category: "IT, Finance"
                },
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 3, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const outcome = exchangeLogic.checkBudget(mockDb2);
            expect(outcome).to.equal(
                "BudgetCheck: {C1,Passed},{C2,Failed},{C3,Passed}"
            );
        });
    });

    describe (" == Budget Reduction Tests", () => {
      it("should reduce budget for C2", ()=>{
        const companyID = "C2"
        const previousBudget = 2 //dollars
        const bid = 100 // cents
        exchangeLogic.reduceBudget(mockDb, companyID, bid)
        expect(mockDb[1].Budget).to.equal(1)
      })
    })
});
