const chai = require("chai");
const expect = chai.expect;
const exchangeLogic = require("../exchange/index");

const mockDb = {
  rows: [
    {
      companyId: "C1",
      country: "US, FR",
      budget: 1,
      bid: 10, // in cents
      category: "Automobile, Finance"
    },
    {
      companyId: "C2",
      country: "IN, US",
      budget: 2,
      bid: 30, // in cents
      category: "IT, Finance"
    },
    {
      companyId: "C3",
      country: ["US, RU"],
      budget: 3,
      bid: 5,
      category: "Automobile, IT"
    }
  ]
};

describe("Stock Exchange Logic Tests ", () => {
  describe(" == Base Targeting tests ==", () => {
    it("should match C1 and C3 only for base targeting", () => {
      const sampleData = {
        countrycode: "US",
        baseBid: "10",
        category: "Automobile"
      };

      return exchangeLogic.checkBaseTargeting(sampleData).then(result => {
        expect(result).to.equal("{C1, Passed}, {C2, Failed}, {C3, Passed}");
      });

      it("should match C2 only for base targeting", () => {
        const sampleData = {
          countrycode: "IN",
          baseBid: "10",
          category: "Finance"
        };

        return exchangeLogic.checkBaseTargeting(sampleData).then(result => {
          expect(result).to.equal("{C1, Failed}, {C2, Passed}, {C3, Failed}");
        });
      });

      it("should match C3 only for base targeting", () => {
        const sampleData = {
          countrycode: "RU",
          baseBid: "10",
          category: "Automobile"
        };
        return exchangeLogic.checkBaseTargeting(sampleData).then(result => {
          expect(result).to.equal("{C1, Failed}, {C2, Failed}, {C3, Passed}");
        });
      });
    });
  });
});
