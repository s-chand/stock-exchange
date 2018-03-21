const app = require("express");
const cluster = require('cluster');
const {receiveRequest} = require("./exchange/index");
const db = require('./models')

const PORT = process.env.PORT || 3000

if(cluster.isMaster){
    const numberOfWorkers = require("os").cpus().length;
    for(let i = 0; i < numberOfWorkers; i++){
        cluster.fork()
    }
    cluster.on('online', (worker) => {
        console.log("Worker Id: "+worker.process.pid )
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`)
    })
}
else {
    const app = require('express')();

    app.get('/api', (request, response) => {
        receiveRequest(request, response)
    });
    app.listen(PORT, () => {
        db.sequelize.sync()
        console.log(`Exchange API is listening on PORT ${PORT} and process Id ${process.pid}`)
    });
    console.log(`Worker ${process.pid}`);
    
}