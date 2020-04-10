const db = require('../database');

module.exports = {

    // add a new business to customer favorites list.
    async addBusinessToFavorites(req, res) {
        console.log("addBusinessToFavorites()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // removes a business from customer favorites list.
    async removeBusinessFromFavorites(req, res) {
        console.log("removeBusinessFromFavorites()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}