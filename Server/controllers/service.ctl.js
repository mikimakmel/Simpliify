const db = require('../database');

module.exports = {

    // create a new service for a business page.
    async createNewService(req, res) {
        console.log("createNewService()");

        // const email = req.body.email;
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        // const gender = req.body.gender;
        // const phone = req.body.phone;
        // const birthday = req.body.birthday;
        // const address = req.body.address;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // delete a service and remove it from business page.
    async deleteService(req, res) {
        console.log("deleteService()");

        const serviceID = req.body.serviceID;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update service details that will be shown on business page.
    async updateServiceDetails(req, res) {
        console.log("updateServiceDetails()");

        // const email = req.body.email;
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        // const gender = req.body.gender;
        // const phone = req.body.phone;
        // const birthday = req.body.birthday;
        // const address = req.body.address;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}