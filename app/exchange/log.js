const fs = require("fs");
const os = require("os");

//  Write the output to file for cases wheen

const writeToLogFile = message => {
    // TODO: handle file writing to the logs folder using the fs module based on NODE_ENV
    try {
        fs.appendFileSync("/tmp/logs/log.txt", message + os.EOL);
    } catch (err) {
        /* Handle the error */
        throw err;
    }
};
exports.logger = (resultCollection, check) => {
    const messageToLog = `${check}: ${resultCollection.join(",")}`;
    writeToLogFile(messageToLog);
};

exports.winnerLog = winner => {
    const messageToLog = `Winner = ${winner.CompanyID}`;
    writeToLogFile(messageToLog);
};
