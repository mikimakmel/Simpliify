const db = require('../database');

module.exports = {

    // get all businesses in Simpliify.
    async getAllBusinesses(req, res) {
        console.log("getAllBusinesses()");

        const query = `SELECT * FROM Business FULL OUTER JOIN Address ON (Business.Address = Address.AddressID) WHERE BusinessID IS NOT NULL`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business by id.
    async getBusinessByID(req, res) {
        console.log("getBusinessByID()");

        const businessID = req.body.businessID;

        const businessQuery = 
            `SELECT *, 
            (SELECT AVG(rating)::NUMERIC(2,1) AS Rating FROM Review WHERE business=${businessID}), 
            (SELECT COUNT(rating) AS RatingCount FROM Review WHERE business=${businessID}) 
            FROM Business 
            FULL OUTER JOIN Address ON (Business.Address = Address.AddressID) 
            WHERE businessid=${businessID} AND BusinessID IS NOT NULL`;  

        const tagsQuery = 
            `SELECT * FROM Tags WHERE businessid=${businessID}`;

        const availabilityQuery = 
            `SELECT * FROM availability 
            WHERE businessid=${businessID}`;

        const servicesQuery = 
            `SELECT * FROM Service WHERE businessid=${businessID}`;

        const photosQuery = 
            `SELECT * FROM Carousel WHERE businessid=${businessID}`;

        var finalResult = {
            businessDetails: {
                business: {},
                tags: [],
                availability: [],
                services: [],
                photos: {
                    cover: '',
                    carousel: [],
                }
            },
        };
        
        db.query(businessQuery)
            .then(result => {
                finalResult.businessDetails.business = result.rows[0];
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))

        db.query(tagsQuery)
            .then(result => {
                finalResult.businessDetails.tags = result.rows;
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))

        db.query(availabilityQuery)
            .then(result => {
                finalResult.businessDetails.availability = result.rows;
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))

        db.query(photosQuery)
            .then(result => {
                finalResult.businessDetails.photos.carousel = result.rows;
                finalResult.businessDetails.photos.cover = result.rows[0];
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))

        db.query(servicesQuery)
            .then(result => {
                finalResult.businessDetails.services = result.rows;
                res.json(finalResult);
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get business by id.
    async getBusinessByManagerID(req, res) {
        console.log("getBusinessByManagerID()");

        const managerID = req.body.managerID;

        const query = 
            `SELECT * 
            FROM Business 
            WHERE manager=${managerID}`;  
        
        db.query(query)
            .then(result => {
                res.json(result.rows[0])
            })
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
            .then(result => {
                let data = result.rows[0];
                let splits = data.categories.slice(1, data.categories.length - 1).split(',');
                let categoriesArr = splits.map((item) => { return { label: item, value: item } });
                res.json(categoriesArr)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all tags.
    async getTagsList(req, res) {
        console.log("getTagsList()");

        const query = `SELECT DISTINCT(Tag) FROM Tags`;
        
        db.query(query)
            .then(async result => {
                const tagsArr = await Promise.all(result.rows.map((item) => { return { label: item.tag, value: item.tag } }));
                res.json(tagsArr);
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create a new business page.
    async createNewBusiness(req, res) {
        console.log("createNewBusiness()");

/////////////////////////////////// chnage client hasBusiness status after creating new business/////////////////////////////////////////////////////////

        const managerID = req.body.managerID;
        const name = req.body.name;
        const category = req.body.category;
        const tags = req.body.tags;
        const street = req.body.street;
        const city = req.body.city;
        const country = req.body.country;
        const phone = req.body.phone;
        const website = req.body.website;
        const description = req.body.description;
        const availability = req.body.availability;
        const carousel = req.body.carousel;
        const avatar = req.body.avatar;
        const servicesList = req.body.servicesList;
        
        const addressQuery =
            `INSERT INTO Address 
            (street, city, country, coordinates)
            VALUES 
            ('${street}', '${city}', '${country}', '(33.333333,33.333333)')
            RETURNING *`;///////////////////////////////////////////////////////////////coordinates/////////////////////////////////////////

        db.query(addressQuery)
        .then(result => {
            const addressID = result.rows[0].addressid;

            const businessQuery = 
                `INSERT INTO Business 
                (address, manager, name, category, phone, website, description, dailycounter, avatar) 
                VALUES 
                (${addressID}, ${managerID}, '${name}', '${category}', '${phone}', '${website}', '${description}', 0, '${avatar}')
                RETURNING *`;

            db.query(businessQuery)
            .then(async result => {
                const businessID = result.rows[0].businessid;

                carousel.forEach((item, index) => {
                    const carouselQuery = index === 0 ?
                        `INSERT INTO Carousel 
                        (businessid, imagelink, primarypic) 
                        VALUES 
                        (${businessID}, '${item}', 'True')
                        RETURNING *`
                        :
                        `INSERT INTO Carousel 
                        (businessid, imagelink, primarypic) 
                        VALUES 
                        (${businessID}, '${item}', null)
                        RETURNING *`;
    
                    db.query(carouselQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                });

                tags.forEach(item => {
                    const carouselQuery = 
                        `INSERT INTO Tags 
                        (BusinessID, Tag) 
                        VALUES 
                        (${businessID}, '${item}')
                        RETURNING *`;
    
                    db.query(carouselQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                });

                if(availability['sunday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Sunday', '${availability['sunday'].open}', '${availability['sunday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['monday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Monday', '${availability['monday'].open}', '${availability['monday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['tuesday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Tuesday', '${availability['tuesday'].open}', '${availability['tuesday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['wednesday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Wednesday', '${availability['wednesday'].open}', '${availability['wednesday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['thursday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Thursday', '${availability['thursday'].open}', '${availability['thursday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['friday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Friday', '${availability['friday'].open}', '${availability['friday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }
                if(availability['saturday'].isOpen) {
                    let availabilityQuery = 
                        `INSERT INTO Availability 
                        (BusinessID, DOW, StartTime, EndTime) 
                        VALUES 
                        (${businessID}, 'Saturday', '${availability['saturday'].open}', '${availability['saturday'].closes}')
                        RETURNING *`;

                    db.query(availabilityQuery)
                        .then(result => console.log(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                }

                // servicesList.forEach(item => {
                //     let serviceQuery = 
                //         `INSERT INTO Service 
                //         (businessid, name, price, durationminutes, quota)
                //         VALUES 
                //         (${businessID}, '${item.name}', ${item.price}, ${item.durationminutes}, ${item.qouta})
                //         RETURNING *`;
                
                //     db.query(serviceQuery)
                //         .then(result => res.json(result.rows[0]))
                //         .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                // });

                const userQuery = `UPDATE Users SET hasbusiness=true WHERE userid=${managerID} RETURNING hasbusiness`;
                db.query(userQuery)
                    .then(result => console.log(result.rows[0]))
                    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

                res.json(result.rows[0].businessid);
            })
            .catch(err => {
                console.log(err.stack)
                res.status(404).send(`Query error: ${err.stack}`)
            })
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
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

    async incrementBusinessDailyCounter(req, res) {
        console.log("incrementBusinessDailyCounter()");

        const businessID = req.body.businessID;

        const query = 
            `UPDATE Business 
            SET Dailycounter=Dailycounter + 1 
            WHERE BusinessID=${businessID}
            RETURNING Name, Dailycounter`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },
}