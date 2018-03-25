const chai = require("chai");
const expect = chai.expect;
const exchangeLogic = require("../exchange/index");

const { mockDb } = require("./mockdata");

describe("Stock Exchange Logic Unit Tests ", () => {
    describe(" == Base Targeting tests ==", () => {
        it("should match C1 and C3 only for base targeting", () => {
            const sampleData = {
                countrycode: "US",
                baseBid: "10",
                category: "Automobile"
            };
            const expectedOutcome = [
                {
                    CompanyID: "C1",
                    Countries: "US, FR",
                    Budget: 1,
                    Bid: 10, // in cents
                    Category: "Automobile, Finance"
                },
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 5, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const result = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );

            expect(result).to.deep.equal(expectedOutcome);
        });
        it("should match C2 only for base targeting", () => {
            const sampleData = {
                countrycode: "IN",
                baseBid: "10",
                category: "Finance"
            };
            const expectedOutcome = [
                {
                    CompanyID: "C2",
                    Countries: "IN, US",
                    Budget: 2,
                    Bid: 30, // in cents
                    Category: "IT, Finance"
                }
            ];
            const result = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(result).to.deep.equal(expectedOutcome);
        });

        it("should match C3 only for base targeting", () => {
            const sampleData = {
                countrycode: "RU",
                baseBid: "10",
                category: "Automobile"
            };
            const expectedOutcome = [
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 5, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const outcome = exchangeLogic.checkBaseTargeting(
                mockDb,
                sampleData.countrycode,
                sampleData.category
            );
            expect(outcome).to.deep.equal(expectedOutcome);
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
            // We expect an empty array
            expect(outcome).to.deep.equal([]);
            expect(outcome.length).to.equal(0);
        });
    });

    describe(" == BaseBid Check Tests ==", () => {
        it("should match baseBid check for C3 only", () => {
            const sampleData = {
                countrycode: "RU",
                baseBid: "9",
                category: "Automobile"
            };
            const expectedOutcome = [
                {
                    CompanyID: "C3",
                    Countries: "US, RU",
                    Budget: 3,
                    Bid: 5, // in cents
                    Category: "Automobile, IT"
                }
            ];
            const outcome = exchangeLogic.checkBaseBid(
                mockDb,
                sampleData.baseBid
            );
            /**
             * This should pass because only C3 in test data  has a bid more than the company Bid.
             * C1 has a baseBid of 10, C2 a base bid of 30.
             * They are both higher than 9
             */
            expect(outcome).to.deep.equal(expectedOutcome);
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
            expect(outcome).to.deep.equal(mockDb);
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
            expect(outcome).to.deep.equal([]);
            expect(outcome.length).to.equal(0);
        });
    });

    describe(" == Budget Check Tests ==", () => {
        it("should pass budget check for all companies", () => {
            const outcome = exchangeLogic.checkBudget(mockDb);

            expect(outcome).to.deep.equal(mockDb);
            expect(outcome.length).to.equal(mockDb.length);
        });
        it("should fail for all companies based on supplied data", () => {
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
            expect(outcome).to.deep.equal([]);
            expect(outcome.length).to.equal(0);
        });
        it("should fail for C1 and C3 and return C2", () => {
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
            const expectedOutcome = [
                {
                    CompanyID: "C2",
                    Countries: "IN, US",
                    Budget: 2,
                    Bid: 20, // in cents
                    Category: "IT, Finance"
                }
            ];
            const outcome = exchangeLogic.checkBudget(mockDb2);
            expect(outcome).to.deep.equal(expectedOutcome);
            expect(outcome.length).to.equal(1);
        });
        it("should fail for C2 alone and return C1 & C3", () => {
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

            const expectedOutcome = [
                {
                    CompanyID: "C1",
                    Countries: "US, FR",
                    Budget: 1,
                    Bid: 10, // in cents
                    Category: "Automobile, Finance"
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
            expect(outcome).to.deep.equal(expectedOutcome);
            expect(outcome.length).to.equal(2);
        });
    });
    describe(" == Shortlist tests ==", () => {
        it("should shortlist C2 as the winner i.e highest bid", () => {
            const outcome = exchangeLogic.shortListCompany(mockDb);
            expect(outcome.CompanyID).to.equal("C2");
        });
    });
});
