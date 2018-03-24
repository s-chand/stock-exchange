const app = require("./app");
const cluster = require("cluster");

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
    const numberOfWorkers = require("os").cpus().length;
    for (let i = 0; i < numberOfWorkers; i++) {
        cluster.fork();
    }
    cluster.on("online", worker => {
        console.log("Worker Id: " + worker.process.pid);
    });
    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `Worker ${
                worker.process.pid
            } exited with code ${code} and signal ${signal}`
        );
    });
} else {
    app.listen(PORT, () => {
        console.log(
            `Exchange API is listening on PORT ${PORT} and process Id ${
                process.pid
            }`
        );
    });
}
