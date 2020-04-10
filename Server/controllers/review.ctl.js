const db = require('../database');

module.exports = {

    // returns all business reviews from customers.
    async getBusinessReviews(req, res) {
        console.log("getBusinessReviews()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM Review WHERE business=${businessID}`;
        
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
            (userid, businessid, rating, description) 
            VALUES 
            (${userID}, ${businessID}, ${rating}, ${description})`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // customer add's a new rating to a business.
    async deleteReview(req, res) {
        console.log("deleteReview()");

        const reviewID = req.body.reviewID;

        const query = `DELETE FROM Review WHERE id=${reviewID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}