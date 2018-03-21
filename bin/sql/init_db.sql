DROP DATABASE IF EXISTS "stockexchange";
CREATE DATABASE "stockexchange";
GRANT ALL PRIVILEGES ON DATABASE "stockexchange" TO postgres;
-- I have considered normalizing the data but it may be out of scope.
-- so I am reverting to the sample database structure provided

-- CREATE TABLE IF NOT EXISTS category (
--     id SERIAL,
--     name VARCHAR
-- );
-- CREATE TABLE IF NOT EXISTS country (
--     id SERIAL,
--     code VARCHAR
-- );
-- CREATE TABLE IF NOT EXISTS company (
--     id SERIAL,
--     budget NUMERIC,
--     bid NUMERIC,
--     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE IF NOT EXISTS company_category (
--     id SERIAL,
--     companyId INTEGER,
--     categoryId INTEGER
-- );
-- CREATE TABLE IF NOT EXISTS company_country (
--     id SERIAL,
--     companyId INTEGER,
--     countryId INTEGER
-- );
CREATE TABLE IF NOT EXISTS company (
    CompanyID VARCHAR,
    Countries VARCHAR,
    Budget VARCHAR,
    Bid VARCHAR,
    Category VARCHAR,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);