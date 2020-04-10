const db = require('../database');

module.exports = {

    // basic search by name.
    async searchByName(req, res) {
        console.log("searchByName()");

        const searchQuery = req.body.searchQuery;

        const query = `SELECT * FROM Business WHERE name='${searchQuery}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}