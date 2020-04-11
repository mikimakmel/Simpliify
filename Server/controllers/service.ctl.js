const db = require('../database');

module.exports = {

    // get all services in Simpliify.
    async getAllServices(req, res) {
        console.log("getAllServices()");

        const query = `SELECT * FROM Service`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get services by ID.
    async getServiceByID(req, res) {
        console.log("getServiceByID()");

        const serviceID = req.body.serviceID;

        const query = `SELECT * FROM Service WHERE serviceid=${serviceID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all business services.
    async getAllBusinessServices(req, res) {
        console.log("getAllBusinessServices()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM Service WHERE businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create a new service for a business page.
    async createNewService(req, res) {
        console.log("createNewService()");

        const BusinessID = req.body.BusinessID;
        const name = req.body.name;
        const price = req.body.price;
        const durationMinutes = req.body.durationMinutes;
        const qouta = req.body.qouta;

        const query = 
            `INSERT INTO Service 
            (BusinessID, Name, Price, DurationMinutes, Qouta)
            VALUES 
            (${BusinessID}, '${name}', ${price}, ${durationMinutes}, ${qouta})
            RETURNING *`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update service details that will be shown on business page.
    async updateServiceDetails(req, res) {
        console.log("updateServiceDetails()");

        const serviceID = req.body.serviceID;
        const name = req.body.name;
        const price = req.body.price;
        const durationMinutes = req.body.durationMinutes;
        const qouta = req.body.qouta;

        const query = 
            `UPDATE Service
            SET 
            name='${name}',
            price='${price}',
            durationMinutes='${durationMinutes}',
            qouta='${qouta}'
            WHERE 
            serviceid='${serviceID}'
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // delete a service and remove it from business page.
    async deleteService(req, res) {
        console.log("deleteService()");

        const serviceID = req.body.serviceID;

        const query = 
            `DELETE FROM Service 
            WHERE serviceid=${serviceID} 
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}