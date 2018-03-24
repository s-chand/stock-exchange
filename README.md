# Stock Exchange

The following is a documentation on what this code base entails.

## Installation

    Please follow these installation steps carefully. 
 - Install NodeJS
 - Install Yarn (or npm comes bundled with NodeJS)
 - Install docker and docker compose.
 - Rename `env.sample` to `.env`. Please note the leading period `'.'` in `.env`
 - Run `yarn start` or `npm start `. (This basically runs `docker-compose up --build`)
 - Once the startup process is complete the API should be available on: http://localhost:3000/api

- A simple test for the API with data would be structured as :
    http://localhost:3000/api?countrycode=US&Category=Automobile&BaseBid=9 .

This should return a simple message saying: `"Winner = C3"`


## Tests

This project comes equipped with unit an integration tests.
In order to test, please do the following:

- Ensure that you have followed the steps listed under installation (especially installiing docker, docker-compose and NodeJS) before following these steps.
- Run `yarn test` or `npm test`. It starts up the containers and executes the test within the container. A code coverage calculation tool (`Istanbul`) is used to also provide coverage results for the included tests.
 You should see the following results:

 <img width="642" alt="screen shot 2018-03-24 at 1 40 00 am" src="https://user-images.githubusercontent.com/1958765/37858516-c07fdd28-2f05-11e8-9b30-00e1ebeb776e.png">

As well this:

<img width="1278" alt="screen shot 2018-03-24 at 1 47 16 am" src="https://user-images.githubusercontent.com/1958765/37858518-c53fcf76-2f05-11e8-9cbb-9d95a2549890.png"> 


Istanbul generates a directory called coverage under `<project root>/app/coverage`.
Double clicking the index.html file will show the coverage reports interactively on a browser.

## How the code works
The repository / project code hasthe following folder structure:

