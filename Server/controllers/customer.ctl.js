const db = require('../database');

module.exports = {

    // add a new business to customer favorites list.
    async addBusinessToFavorites(req, res) {
        console.log("addBusinessToFavorites()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;

        const query =
            `INSERT INTO Favorited 
            (business, userid)
            VALUES 
            (${businessID}, ${userID})
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // removes a business from customer favorites list.
    async removeBusinessFromFavorites(req, res) {
        console.log("removeBusinessFromFavorites()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;

        const query = 
            `DELETE FROM Favorited 
            WHERE business='${businessID}' AND userid='${userID}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // returns all the businesses that a customer added to his favorites list.
    async getFavoritesList(req, res) {
        console.log("getFavoritesList()");

        const userID = req.body.userID;
        console.log(userID)

        const query = `SELECT * FROM Favorited WHERE userid='${userID}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}