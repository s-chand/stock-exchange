const fs = require("fs");

//  Write the output to file for cases wheen

const writeToLogFile = message => {
    // TODO: handle file writing to the logs folder using the fs module based on NODE_ENV
};
exports.logger = (resultCollection, check) => {
    const messageToLog = `${check}: ${resultCollection.join(",")}`;
    console.log(messageToLog);
};

exports.winnerLog = winner => {
    const messageToLog = `Winner = ${winner.CompanyID}`;
    console.log(messageToLog);
};
