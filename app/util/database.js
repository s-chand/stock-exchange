const pg = require('pg');
const dbConfig = require("./config")
const connectionString =  `postgres://${dbConfig.db.DBHOST}:${dbConfig.db.DBPORT}/${dbConfig.db.DBNAME}`;

const client = new pg.Client(connectionString);
client.connect();
// Populate db with test data
module.exports = {
    query: function(text, values, cb) {
       pg.connect(function(err, client, done) {
         client.query(text, values, function(err, result) {
           done();
           cb(err, result);
         })
       });
    }
 }