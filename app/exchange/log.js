const fs = require("fs");
const os = require("os");

//  Write the output to file for cases wheen
class Logger {
    constructor(path) {
        this.path = path;
    }
    writeToLogFile(messageToLog) {
        try {
            fs.appendFileSync(this.path, messageToLog + os.EOL);
        } catch (err) {
            /* Handle the error */
        }
    }
    logger(resultCollection, check) {
        const messageToLog = `${check}: ${resultCollection.join(",")}`;
        this.writeToLogFile(messageToLog);
    }
    winnerLog(winner) {
        const messageToLog = `Winner = ${winner.CompanyID}`;
        this.writeToLogFile(messageToLog);
    }
    clearLogs() {
        fs.truncateSync(this.path, 0);
    }
}

// const writeToLogFile = message => {
//     // TODO: handle file writing to the logs folder using the fs module based on NODE_ENV
//     try {
//         fs.appendFileSync("/tmp/logs/log.txt", message + os.EOL);
//     } catch (err) {
//         /* Handle the error */
//         throw err;
//     }
// };
// exports.logger = (resultCollection, check) => {
//     const messageToLog = `${check}: ${resultCollection.join(",")}`;
//     writeToLogFile(messageToLog);
// };

// exports.winnerLog = winner => {
//     const messageToLog = `Winner = ${winner.CompanyID}`;
//     writeToLogFile(messageToLog);
// };

module.exports = Logger;
