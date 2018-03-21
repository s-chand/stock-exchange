exports.db = {
    DNAME: process.env.DNAME || "stockexchange",
    DBHOST: process.env.DBHOST || "postgres",
    DBPORT: process.env.DBPORT || 5432,
    DBUSER: process.env.DBUSER || "postgres",
    DBPASS: process.env.DBPASS || "password"
};