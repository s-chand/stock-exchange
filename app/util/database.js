const pg = require('pg');
const dbConfig = require("./config")
const connectionString =  `postgres://${dbConfig.db.DBHOST}:${dbConfig.db.DBPORT}/${dbConfig.db.DBNAME}`;

const client = new pg.Client(connectionString);
client.connect();
// Populate db with test data
const dbData = {
    
}