DROP DATABASE IF EXISTS "stockexchange";
CREATE DATABASE "stockexchange";
GRANT ALL PRIVILEGES ON DATABASE "stockexchange" TO postgres;

CREATE TABLE IF NOT EXISTS category (
    id VARCHAR,
    description VARCHAR
);
CREATE TABLE IF NOT EXISTS country (
    id VARCHAR,
    description VARCHAR
);
CREATE TABLE IF NOT EXISTS company (
    companyId VARCHAR,
    budget numeric,
    bid numeric,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS company_category (
    id serial,
    companyId VARCHAR,
    categoryId VARCHAR
);
CREATE TABLE IF NOT EXISTS company_country (
    id serial,
    companyId VARCHAR,
    countryId VARCHAR
);