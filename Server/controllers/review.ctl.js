const db = require('../database');

module.exports = {

    // returns all business reviews from customers.
    async getBusinessReviews(req, res) {
        console.log("getBusinessReviews()");

        const businessID = req.body.businessID;

        // const query = `SELECT * FROM Review WHERE business=${businessID}`;
        const query = 
            `SELECT * FROM Review 
            WHERE Business=${businessID} 
            AND Description IS NOT NULL 
            ORDER BY Reviewedat DESC`;  
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // returns all business reviews from customers.
    async getBusinessReviewsByQuantity(req, res) {
        console.log("getBusinessReviewsByQuantity()");

        const businessID = req.body.businessID;

        const query = 
            `SELECT Rating, COUNT(Rating) 
            FROM Review 
            WHERE Business=${businessID} 
            GROUP BY Rating`;  
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // customer write's a new review on a business.
    async createNewReview(req, res) {
        console.log("createNewReview()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;
        const rating = req.body.rating;
        const description = req.body.description;

        const query = 
            `INSERT INTO Review
            (customer, business, reviewedat, description, rating) 
            VALUES 
            (${userID}, ${businessID}, NOW() AT TIME ZONE 'EETDST', '${description}', ${rating})
            RETURNING Customer, Business, (NOW() AT TIME ZONE 'EETDST') AT TIME ZONE 'UTC' as reviewedat, description, rating`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // customer write's a new review on a business.
    async getUserReviewOnBusiness(req, res) {
        console.log("getUserReviewOnBusiness()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;

        console.log(userID, businessID);

        const query = 
            `SELECT * FROM Review
            WHERE business=${businessID} AND customer=${userID}
            RETURNING Customer, Business, (NOW() AT TIME ZONE 'EETDST') AT TIME ZONE 'UTC' as reviewedat, description, rating`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // customer add's a new rating to a business.
    async deleteReview(req, res) {
        console.log("deleteReview()");

        const customer = req.body.customer;
        const business = req.body.business;

        const query = `DELETE FROM Review WHERE customer='${customer}' AND business='${business}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}