exports.logger = (resultCollection, check) => {
    const messageToLog = `${check}: ${resultCollection.join(",")}`
    return messageToLog
}