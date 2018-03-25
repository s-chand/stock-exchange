/**
 * Integration tests for the stock exchange app
 */

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const companyModel = require("../models");

const { mockDb, mockDbWithNoBudget } = require("./mockdata");
const SanitizeDB = model => {
    return Promise.all([
        model.Company.destroy({ restartIdentity: true, truncate: true })
    ]);
};

const log = require("../exchange/log");
const logManager = new log("/tmp/logs/log.txt");

describe("Integration Tests", () => {
    before(done => {
        companyModel.sequelize.sync();
        logManager.clearLogs();
        done();
    });
    beforeEach(() => {
        // Sanitize the database
        this.companyModel = companyModel;
        return SanitizeDB(this.companyModel).then(() => {
            // Populate DB
            return companyModel.Company.bulkCreate(mockDb);
        });
    });

    it("should return 'Winner = C3' 🍺 🍺 ", () => {
        return chai
            .request(app)
            .get("/api?countrycode=US&Category=Automobile&BaseBid=9")
            .then(response => {
                expect(response).to.have.status(200);
                expect(response.body).to.equal("C3");
            });
    });

    it("should fail for Targeting 🎉 🎉", () => {
        return chai
            .request(app)
            .get("/api?countrycode=NG&Category=Food&BaseBid=10")
            .then(response => {
                expect(response.body).to.equal(
                    "No Companies Passed from Targeting"
                );
            });
    });
    it("should pass Targeting but fail budget check", () => {
        return SanitizeDB(companyModel)
            .then(() => {
                return companyModel.Company.bulkCreate(mockDbWithNoBudget);
            })
            .then(() => {
                return chai
                    .request(app)
                    .get("/api?countrycode=US&Category=Automobile&BaseBid=10")
                    .then(response => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.equal(
                            "No Companies Passed from Budget"
                        );
                    });
            });
    });
    it("should pass BudgetCheck but fail BaseBid check", () => {
        return chai
            .request(app)
            .get("/api?countrycode=US&Category=Automobile&BaseBid=3")
            .then(response => {
                expect(response.body).to.equal(
                    "No Companies Passed from BaseBid check"
                );
            });
    });
    it("should return a 400 with message: 'Incorrect data supplied. Please check and retry'", () => {
        return chai
            .request(app)
            .get("/api")
            .catch(err => {
                expect(err.response).to.have.status(400);
                expect(err.response.text).to.equal(
                    '{"message":"Incorrect data supplied. Please check and retry"}'
                );
                expect(err.response.body.message).to.equal(
                    "Incorrect data supplied. Please check and retry"
                );
            });
    });
    it("should reduce the C3 company budget on successful selection as winner from 3 dollars to 2.95 dollars 💵 💵", () => {
        return chai
            .request(app)
            .get("/api?countrycode=US&Category=Automobile&BaseBid=9")
            .then(response => {
                // We expect the result to be C3
                expect(response.body).to.equal("C3");
                // 🍺 🍺 🍺 works!
                // then let's get the C3 company new budget and compare it
                // default C3 budget is 3 dollars. We expect that this is reduced to (C3 budget of 3 dollars minues C3 Bid value of 5 cents)
                const c3budget = 3; //dollars
                const c3BidValue = 5; // cents
                const expectedBudget = c3budget - c3BidValue / 100;
                companyModel.Company.find({
                    where: {
                        CompanyID: "C3"
                    }
                }).then(result => {
                    // 🍺 cheers!
                    //Let's assert against what we got back
                    const company = JSON.parse(JSON.stringify(result));
                    expect(parseFloat(company.Budget)).to.equal(expectedBudget);
                });
            });
    });
});
