const db = require('../database');

module.exports = {

    // get all businesses in Simpliify.
    async getAllBusinesses(req, res) {
        console.log("getAllBusinesses()");

        const query = `SELECT * FROM Business`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business by id.
    async getBusinessesByID(req, res) {
        console.log("getBusinessesByID()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM Business WHERE businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all businesses in Simpliify by category.
    async getAllBusinessesByCategory(req, res) {
        console.log("getAllBusinessesByCategory()");

        const category = req.body.category;

        const query = `SELECT * FROM Business WHERE category='${category}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all businesses within distance radius.
    // async getAllBusinessesByDistance(req, res) {
    //     console.log("getAllBusinessesByDistance()");

    //     const distance = req.body.distance;

    //     const query = `SELECT * FROM "public"."address"`;
        
    //     db.query(query)
    //         .then(result => res.json(result.rows))
    //         .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    // },

    // get all businesses in Simpliify by tag.
    async getAllBusinessesByTag(req, res) {
        console.log("getAllBusinessesByTag()");

        const tag = req.body.tag;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create a new business page.
    async createNewBusiness(req, res) {
        console.log("createNewBusiness()");

        const managerID = req.body.managerID;
        const name = req.body.name;
        const category = req.body.category;
        const addressID = req.body.addressID;
        const phone = req.body.phone;
        const website = req.body.website;
        const description = req.body.description;
        const avatar = req.body.avatar;

        const query = 
            `INSERT INTO Business 
            (address, manager, name, category, phone, website, description, avatar) 
            VALUES 
            (${addressID}, ${managerID}, ${name}, ${category}, ${phone}, ${website}, ${description}, ${avatar})`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // close and delete a business page.
    async deleteYourBusiness(req, res) {
        console.log("deleteYourBusiness()");

        const businessID = req.body.businessID;

        const query = `DELETE FROM Business WHERE businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update business details that will be shown on business page.
    async updateBusinessDetails(req, res) {
        console.log("updateBusinessDetails()");

        const businessID = req.body.businessID;
        const addressID = req.body.addressID;
        const name = req.body.name;
        const category = req.body.category;
        const phone = req.body.phone;
        const website = req.body.website;
        const description = req.body.description;
        const avatar = req.body.avatar;

        const query = 
            `UPDATE Business
            SET 
            address='${addressID}',
            name='${name}',
            category='${category}',
            phone='${phone}',
            website='${website}',
            description='${description}',
            avatar='${avatar}',
            WHERE 
            businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all customers that ever ordered a service from this business.
    async getAllCustomers(req, res) {
        console.log("getAllCustomers()");

        const businessID = req.body.businessID;

        const query = `SELECT customer FROM Orders WHERE business=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all the orders from this business (past and future).
    async getAllOrders(req, res) {
        console.log("getAllOrders()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM "public"."address"`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}