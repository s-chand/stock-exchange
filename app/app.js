const app = require("express")();
const { receiveRequest } = require("./exchange/index");
const db = require("./models");

db.sequelize.sync();
app.get("/api", (request, response) => {
    receiveRequest(request, response);
});

module.exports = app;
