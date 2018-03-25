const fs = require("fs");
const os = require("os");

/** 
 * Handles all application logging
 * @class Logger
 */
class Logger {
    
    /**
     * @constructor
     * @param {string} path 
     */
    constructor(path) {
        this.path = path;
    }
     /**
      * Writes messages to log file
      * @function writeToLogFile
      * @param {string} messageToLog 
      */
    writeToLogFile(messageToLog) {
        try {
            fs.appendFileSync(this.path, messageToLog + os.EOL);
        } catch (err) {
            /* Handle the error */
        }
    }

    /**
     * Receives the messages to be logged from the different checks
     * @function logger
     * @param {string[]} resultCollection 
     * @param {string} check 
     */
    logger(resultCollection, check) {
        const messageToLog = `${check}: ${resultCollection.join(",")}`;
        this.writeToLogFile(messageToLog);
    }
    
    /** Writes logs for the winner
     * @function winnerLog
     * @param {Object} winner 
     */
    winnerLog(winner) {
        const messageToLog = `Winner = ${winner.CompanyID}`;
        this.writeToLogFile(messageToLog);
    }

    /**
     * Clears the logs. This is used by the tests.
     * @function clearLogs
     */
    clearLogs() {
        fs.truncateSync(this.path, 0);
    }
}

module.exports = Logger;
