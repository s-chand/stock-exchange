const chai = require('chai')
const expect = chai.expect
const exchangeLogic = require('../exchange/index')

const mockDb = {
    rows: [
        {
            companyId: "C1",
            country: ["US, FR"],
            budget: 1,
            bid: 10, // in cents
            category: ["Automobile", "Finance"]
        },
        {
            companyId: "C2",
            country: ["IN, US"],
            budget: 2,
            bid: 30, // in cents
            category: ["IT", "Finance"]
        },
        {
            companyId: "C3",
            country: ["US, RU"],
            budget: 3,
            bid: 5,
            category: ["Automobile", "IT"]
        }
    ]
}

describe('Stock Exchange Logic Tests ', ()=>{
    it('should match companies based on country and category', ()=>{
        const sampleData = {
            countrycode: 'US',
            Category: 'Automobile',
            BaseBid: '10'
        }

        exchangeLogic()
    })
})