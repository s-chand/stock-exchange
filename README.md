# Stock Exchange

The following is a documentation on what this code base entails.

## Installation

    Please follow these installation steps carefully.

* Install NodeJS
* Install Yarn (or npm comes bundled with NodeJS)
* Install docker and docker compose.
* Rename `env.sample` to `.env`. Please note the leading period `'.'` in `.env`
* Run `yarn start` or `npm start`. (This basically runs `docker-compose up --build`)
* Once the startup process is complete the API should be available on: <http://localhost:3000/api>

* A simple test for the API with data would be structured as :
  <http://localhost:3000/api?countrycode=US&Category=Automobile&BaseBid=9> .

This should return a simple message saying: `"Winner = C3"`

PS: Note the casing of the query parameters. (designed to specification using provided example)

## Running Tests

This project comes equipped with unit an integration tests.
In order to test, please do the following:

* Ensure that you have followed the steps listed under installation (especially installiing docker, docker-compose and NodeJS) before following these steps.
* Run `yarn test` or `npm test`. It starts up the containers and executes the test within the container. A code coverage calculation tool (`Istanbul`) is used to also provide coverage results for the included tests.
  You should see the following results:

![Code Coverage](https://user-images.githubusercontent.com/1958765/37858516-c07fdd28-2f05-11e8-9b30-00e1ebeb776e.png)

As well this:

![Code Coverage](https://user-images.githubusercontent.com/1958765/37858518-c53fcf76-2f05-11e8-9cbb-9d95a2549890.png)

Istanbul generates a directory called coverage under `<project root>/app/coverage`.
Double clicking the index.html file will show the coverage reports interactively on a browser. More information at the bottom of the page.

## Codebase Structure

The repository / project code has the following folder structure:

* **app** - This contains the server code for the api
* **bin** - This contains entrypoint scripts and travis scripts
* **logs** - This will be the location for the log output generated by the API during normal operation or during test run.

### `app directory` - code internal components

The app directory houses the server code as well as the Dockerfile for the exchange service. The list of directories and what they contain is as follows:

* **config** - the database configuration file (config.js) and the docker entrypoint script (entrypoint.sh) are place in this directory
* **exchange** - This contains the exchange service logic and request handler in the file call called index.js. It also has the Log manager class exported from the log.js file.
* **migrations** - This houses the migration file for creating the companies database table.
* **models** - the database schema is placed in the model file. This allows sequelize (the orm used on the project) know exactly what structure the database tables have as well as what their data types are and uses that to map the database tables.
* **seeders** - The test data provided by the question was used to create database seeds to test the API logic.
* **test** - the tests for the api

Asides the directories listed above, the following files are also present:

* .dockerignore
* .editorconfig
* app.js - ExpressJS server that is called by the nodeJS workers
* Dockerfile
* package.json
* server.js - the API starting point with nodeJS clustering enabled
* yarn.lock

## How the code works

The API was implemented following the below specifications:

A bid is submitted via an API call passing the following paramteres

    * Country (query parameter = countrycode)
    * BaseBid (query parameter = BaseBid)
    * Category (query parameter = Category)

Using these with values as query paramters to call the API endpoint, the API extracts these items and carries out the followinng validations:

1. **Base Targeting check:** Here we check for a match for the supplied category and country. If we find a match in the database, we log this using the example format:

    `BaseTargeting: {C1, Passed},{C2, Failed},{C3, Passed}`

    Companies that pass this first check are then allowed to go through the next steps.

2. **Budget Check:** Here we check that the successful companies indeed have a budget to sell stock. This is done by comparing the comapny's bid to the Budget. If the company budget exceeds the quantity of the bid the company is said to have passed budget check. We then log a message like so:

    `BudgetCheck: {C1,Passed},{C3,Passed}`

    When companies pass the budget check they continue on to the next step.

3. **BaseBid check:** This checks the BaseBid supplied to the API against the Bid stored for a company in the database. If the company's bid is higher, we eliminate this company from the selection. Companies whose bids are within range (i.e. less than what is offered) are allowed to go on as passed. This means that when a new bid comes through the API, the supplied BaseBid parameter value has to be more than the company Bid in the database.

    When the check is complete we log the following message to file:

    `BaseBid: {C1,Failed},{C2,Failed},{C3,Failed}`

    Successful companies go on for shortlisting

4. **Shortlisting:** Here we sort the successful companies by their Bid values. We return the company with the highest bid value as the winner.

    The API caller returns the CompanyID (i.e `C2` in this example) as the winner and logs an output to the log file like so:

    `Winner = C2`

5. **Reduce Budget:** Once the winner has been idenified, the company's bid is subtracted from the budget in the database.

## Tests

The exchange service tests are in `<root directory>/app/test`.
This codebase uses `mocha`, `chai` and `chaiHttp` for the unit and integration tests. It also uses `Istanbul (nyc)` to generate a code coverage report. (As of this writing, the code coverage is at 100%) as I have ensured that the tests correctly and completed covers the codebase.

In order to run the tests, I have included a number of options depending on your configuration.

The following command is available to make this a smooth processs:

    - npm test

The test command brings up the containers and executes the unit and integration tests within the container while logging the spec reports to the console and the test outcomes to the log file.
I have also included coverage reports as shown above indicating that the code is well covered.

The coverage reports are generated and place in `<root folder>/app/coverage`

I chose html and text so you can see the coverage on the console as well as in the browser.
Also note that I clear the logs for every run through of the tests. I imagine that this can quickly become a lot if the tests are run multiple times.
However, when the application is `started` (i.e. `yarn start` or `npm start` or `docker-compose up`) the logs are appended continously as they are gotten from the various transactions.

## Tools and Tech stack

The following are a complete list of tools used:

1. Testing:
    * mocha
    * chai
    * chaiHttp
    * istanbul
2. Database:
    * Postgresql
3. ORM:
    * Sequelize
4. Environment
    * Docker
    * Docker Compose
5. Language and frameworks
    * NodeJS
    * ExpressJS
6. Others
    * travis
    * postman
    * jshint
    * git
    * bash scripts

## Notes

A couple of thoughts on improving this setup but weren't added so as not to `over-engineer` the solution as well as some decisions I have made regarding tools:

* Add nginx to load balance requests in addition to the implemented nodeJS clusters in use. This would dramatically improve the ability to handle multiple concurrent transactions.

* The logic for Budget and BaseBid check, based on the specifications, makes no mention of cases where the supplied baseBid exceeds the budget available for a company. The temptation to include this was strong but the document doesn't account for this edge case as it didn't indicate how to handle this use case. So I have left it open.

* I have added a postman collection with some basic tests included for when the service is running. You could use this to test the API as well.

* Database wait time - I have used `wait-for-it.sh` to add a delay of 20 to the exchange service with an additional sleep time of 5 sec. Depending on your machine specification, this may not be sufficient for you but the setup should recover and run correctly anyway.

* The project is dockerized - This was done to limit the effort required to run the set up to just basic npm commands. To make this possible, I have wrapped the docker-compose commands in the root directory's package.json. Hence the easy start up commands i.e. `yarn start` or `npm start` and `yarn test` or `npm test`. This approach allows me clean out the database for each run.

* Logs: The logs are in a mapped volume to the root directory's `log` subdirectory.

(c) Samuel Okoroafor, 2018
