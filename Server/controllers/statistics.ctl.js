const db = require('../database');

module.exports = {

    // get all business customers sorted by ascending age.
    async getCustomersSortedByAge(req, res) {
        console.log("getCustomersSortedByAge()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM Users ORDER BY birthday ASC`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all business customers sorted by gender.
    async getCustomersSortedByGender(req, res) {
        console.log("getCustomersSortedByGender()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business customers sorted by top *number* addresses (cities).
    async getCustomersSortedByCities(req, res) {
        console.log("getCustomersSortedByCities()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get daily entrance counter for a business page.
    async getDailyCounter(req, res) {
        console.log("getDailyCounter()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get top 10 customers who orders services the most times from a business.
    async getTop10Customers(req, res) {
        console.log("getTop10Customers()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business income from each service.
    async getIncomeByService(req, res) {
        console.log("getIncomeByService()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business total income under a period of time.
    async getIncomeByTimePeriod(req, res) {
        console.log("getIncomeByTimePeriod()");

        const businessID = req.body.businessID;

        const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}