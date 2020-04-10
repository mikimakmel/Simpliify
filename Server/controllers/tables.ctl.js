const db = require('../database');

module.exports = {

    /****************************
               Create
    ***************************/
    
    // create users table in db.
    async createUsersTable(req, res) {
        console.log("createUsersTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Users 
            (
                UserID BIGSERIAL NOT NULL PRIMARY KEY,
                Password VARCHAR(60) NOT NULL,
                FirstName VARCHAR(255) NOT NULL,
                LastName VARCHAR(255) NOT NULL,
                Phone VARCHAR(10) NOT NULL,
                Gender VARCHAR(10) NOT NULL,
                Email VARCHAR(150),
                HasBusiness BOOLEAN NOT NULL,
                Birthday DATE NOT NULL,
                Address BIGSERIAL REFERENCES Address(AddressID) NOT NULL
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create businesses table in db.
    async createBusinessTable(req, res) {
        console.log("createBusinessTable()");

        const query =
            `CREATE TYPE IF NOT EXISTS categories AS ENUM 
            (
                'Sport', 'Education', 'Beauty', 'Pets', 'Utilities', 'Health',
                'Food', 'Technology', 'Design', 'Kids', 'Events', 'Music'
            );
            CREATE TABLE IF NOT EXISTS Business 
            (
                BusinessID BIGSERIAL NOT NULL PRIMARY KEY,
                Address BIGSERIAL REFERENCES Address(AddressID) NOT NULL,
                Manager BIGSERIAL REFERENCES Users(UserID) NOT NULL,
                Name VARCHAR(255) NOT NULL,
                Category VARCHAR(255) NOT NULL,
                Phone VARCHAR(10) NOT NULL,
                Website VARCHAR(255),
                Description VARCHAR(512) NOT NULL,
                DailyCounter INT NOT NULL,
                Avatar VARCHAR(512)
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create services table in db.
    async createServiceTable(req, res) {
        console.log("createServiceTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Service 
            (
                ServiceID BIGSERIAL NOT NULL PRIMARY KEY,
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                Name VARCHAR(255) NOT NULL,
                Price INT NOT NULL,
                DurationMinutes SMALLINT NOT NULL,
                Qouta SMALLINT NOT NULL
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create addresses table in db.
    async createAddressTable(req, res) {
        console.log("createAddressTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Address 
            (
                AddressID BIGSERIAL NOT NULL PRIMARY KEY,
                Street VARCHAR(255) NOT NULL,
                City VARCHAR(100) NOT NULL,
                Country VARCHAR(50) NOT NULL
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create availability table in db.
    async createAvailabilityTable(req, res) {
        console.log("createAvailabilityTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Availability 
            (
                BusinessID BIGSERIAL REFERENCES Business(BusinessID) PRIMARY KEY,
                DayOfWeek SMALLINT NOT NULL,
                StartTime TIME,
                EndTime TIME,
                CHECK (dayofweek >= 0 AND dayofweek <= 6)
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create orders table in db.
    async createOrdersTable(req, res) {
        console.log("createOrdersTable()");

        const query =
            `CREATE TYPE IF NOT EXISTS status AS ENUM 
            (
                'Pending','Cancelled', 'Confirmed', 'Success'
            );
            CREATE TABLE IF NOT EXISTS Orders 
            (
                Customer BIGSERIAL REFERENCES Users(UserID) NOT NULL,
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                Service BIGSERIAL REFERENCES Service(ServiceID) NOT NULL,
                Status status NOT NULL,
                StartTime TIMESTAMP NOT NULL,
                TransactionTime TIMESTAMP,
                UNIQUE (Customer, Business, Service)
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create reviews table in db.
    async createReviewTable(req, res) {
        console.log("createReviewTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Review 
            (
                Customer BIGSERIAL REFERENCES Users(UserID) NOT NULL,
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                Description VARCHAR(512),
                ReviewedAt TIMESTAMP NOT NULL,
                Rank SMALLINT NOT NULL,
                CHECK (rank > 0 AND rank <= 5),
                UNIQUE (Customer, Business)
            )`;    
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create provides table in db.
    async createProvidesTable(req, res) {
        console.log("createProvidesTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Provides 
            (
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                Service BIGSERIAL REFERENCES Service(ServiceID) NOT NULL,
                UNIQUE (Business, Service)
            )`;   
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create carousel table in db.
    async createCarouselTable(req, res) {
        console.log("createCarouselTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Carousel 
            (
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                ImageLink VARCHAR(512) NOT NULL,
                UNIQUE (Business, ImageLink)
            )`;  
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create tags table in db.
    async createTagsTable(req, res) {
        console.log("createTagsTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Tags 
            (
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                Tag VARCHAR(512) NOT NULL,
                UNIQUE (Business, Tag)
            )`;  
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create favorites table in db.
    async createFavoritedTable(req, res) {
        console.log("createFavoritedTable()");

        const query =
            `CREATE TABLE IF NOT EXISTS Favorited 
            (
                Business BIGSERIAL REFERENCES Business(BusinessID) NOT NULL,
                UserID BIGSERIAL REFERENCES Users(UserID) NOT NULL,
                UNIQUE (Business, UserID)
            )`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    /****************************
                Drop
    ***************************/

    // drop Address table from db.
    async dropAddressTable(req, res) {
        console.log("dropAddressTable()");

        const query = 'DROP TABLE IF EXISTS Address';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Users table from db.
    async dropUsersTable(req, res) {
        console.log("dropUsersTable()");

        const query = 'DROP TABLE IF EXISTS Users';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Business table from db.
    async dropBusinessTable(req, res) {
        console.log("dropBusinessTable()");

        const query = 'DROP TABLE IF EXISTS Business';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop availability table from db.
    async dropAvailabilityTable(req, res) {
        console.log("dropAvailabilityTable()");

        const query = 'DROP TABLE IF EXISTS Availability';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Service table from db.
    async dropServiceTable(req, res) {
        console.log("dropServiceTable()");

        const query = 'DROP TABLE IF EXISTS Service';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Orders table from db.
    async dropOrdersTable(req, res) {
        console.log("dropOrdersTable()");

        const query = 'DROP TABLE IF EXISTS Orders';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Review table from db.
    async dropReviewTable(req, res) {
        console.log("dropReviewTable()");

        const query = 'DROP TABLE IF EXISTS Review';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Provides table from db.
    async dropProvidesTable(req, res) {
        console.log("dropProvidesTable()");

        const query = 'DROP TABLE IF EXISTS Provides';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Carousel table from db.
    async dropCarouselTable(req, res) {
        console.log("dropCarouselTable()");

        const query = 'DROP TABLE IF EXISTS Carousel';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Tags table from db.
    async dropTagsTable(req, res) {
        console.log("dropTagsTable()");

        const query = 'DROP TABLE IF EXISTS Tags';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // drop Favorited table from db.
    async dropFavoritedTable(req, res) {
        console.log("dropFavoritedTable()");

        const query = 'DROP TABLE IF EXISTS Favorited';
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    /****************************
          Create All Tables
    ***************************/

    // create all table in db.
    async createAllTables() {
        createAddressTable();
        createUsersTable();
        createBusinessTable();
        createAvailabilityTable();
        createServiceTable();
        createOrdersTable();
        createReviewTable();
        createProvidesTable();
        createCarouselTable();
        createTagsTable();
        createFavoritedTable();
    },

    /***************************
          Drop All Tables
    ***************************/

    // drop all table from db.
    async dropAllTables() {
        dropAddressTable();
        dropUsersTable();
        dropBusinessTable();
        dropAvailabilityTable();
        dropServiceTable();
        dropOrdersTable();
        dropReviewTable();
        dropProvidesTable();
        dropCarouselTable();
        dropTagsTable();
        dropFavoritedTable();
    },

}