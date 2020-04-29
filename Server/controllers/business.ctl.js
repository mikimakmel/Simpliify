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
    async getBusinessByID(req, res) {
        console.log("getBusinessByID()");

        const businessID = req.body.businessID;

        const query = 
            `SELECT *, 
            (SELECT to_char(AVG(rating),'9D9') AS Rating 
            FROM Review 
            WHERE business=${businessID}) 
            FROM Business 
            WHERE businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
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

    // get all categories.
    async getCategoriesList(req, res) {
        console.log("getCategoriesList()");

        const query = `SELECT enum_range(NULL::categories) as Categories`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create a new business page.
    async createNewBusiness(req, res) {
        console.log("createNewBusiness()");
        let business = JSON.parse(req.body.business);
        console.log(business);
        // console.log(req.files);

        const managerID = business.managerID;
        const name = business.name;
        const category = business.category;
        const tags = business.tags;//////////////////////
        const street = business.street;
        const city = business.city;
        const country = business.country;
        const phone = business.phone;
        const website = business.website;
        const description = business.description;
        const availability = business.availability;////////////////

        const carousel = req.files.carousel;///////////////////////
        const avatar = req.files.avatar;///////////////////////

        // console.log(addressID, managerID, name, category, phone, website, description, avatar);
        
        // const addressQuery =
        // `INSERT INTO Address 
        //     (street, city, country)
        //     VALUES 
        //     ('${street}', '${city}', '${country}')
        //     RETURNING addressid`;

            // const businessQuery = 
            //     `INSERT INTO Business 
            //     (address, manager, name, category, phone, website, description, DailyCounter, avatar) 
            //     VALUES 
            //     (${addressID}, ${managerID}, '${name}', '${category}', '${phone}', '${website}', '${description}',0 , '${avatar}')
            //     RETURNING *`;


        // db.query(addressQuery)
        // .then(result => {
        //     let addressID = result.rows[0].addressid;

        //     const businessQuery = 
        //         `INSERT INTO Business 
        //         (address, manager, name, category, phone, website, description, DailyCounter, avatar) 
        //         VALUES 
        //         (${addressID}, ${managerID}, '${name}', '${category}', '${phone}', '${website}', '${description}',0 , '${avatar}')
        //         RETURNING *`;

        //     db.query(businessQuery)
        //     .then(result => {
        //         console.log('here')
        //         res.json(result.rows[0].businessid)
        //     })
        //     .catch(err => res.status(404).send(`Query error: ${err.stack}`))
        // })
        // .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // close and delete a business page.
    async deleteYourBusiness(req, res) {
        console.log("deleteYourBusiness()");

        const businessID = req.body.businessID;

        const query = 
            `DELETE FROM Business 
            WHERE businessid=${businessID} 
            RETURNING businessid`;
        
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
            avatar='${avatar}'
            WHERE 
            businessid='${businessID}'
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
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

    // get business weekly availability.
    async getBusinessAvailability(req, res) {
        console.log("getBusinessAvailability()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM availability WHERE businessid=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}