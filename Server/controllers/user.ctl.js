const db = require('../database');

module.exports = {

    // get all signed users in Simpliify.
    async getAllUsers(req, res) {
        console.log("getAllUsers()");

        const query = `SELECT * FROM Users`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get user by his email address.
    async getUserByEmail(req, res) {
        console.log("getUserByEmail()");

        const email = req.body.email;

        const query = 
            `SELECT * FROM Users 
            LEFT OUTER JOIN address ON (users.address = address.addressid) 
            WHERE email='${email}'`;
        
        db.query(query)
            .then(result => {
                if(result.rows.length === 1) {
                    res.json({user: result.rows[0]});
                } 
                else {
                    res.json({user: null});
                }
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get user by his ID.
    async getUserByID(req, res) {
        console.log("getUserByID()");

        const userID = req.body.userID;

        const query = 
            `SELECT * FROM Users 
            LEFT OUTER JOIN address ON (users.address = address.addressid) 
            WHERE userid='${userID}'`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create new user in db after user signUp for the first time (contains email only).
    async createNewUser(req, res) {
        console.log("createNewUser()");

        // address details
        const street = req.body.street;
        const city = req.body.city;
        const country = req.body.country;
        // user details
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const birthday = req.body.birthday;
        const gender = req.body.gender;
        const profilepic = req.body.profilePic;

        const addressQuery =
            `INSERT INTO Address 
            (street, city, country)
            VALUES 
            ('${street}', '${city}', '${country}')
            RETURNING addressid`;

        db.query(addressQuery)
        .then(result => {
            let addressID = result.rows[0].addressid;

            const userQuery = 
                `INSERT INTO Users 
                (FirstName, LastName, Phone, Gender, Email, address, HasBusiness, Birthday, profilepic)
                VALUES 
                ('${firstName}', '${lastName}', '${phone}', '${gender}', '${email}', ${addressID}, '${false}', '${birthday}', '${profilepic}')
                RETURNING UserID`;

            db.query(userQuery)
            .then(result => res.json(result.rows[0].userid))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update user details after filling the full signUp form, or updating profile from menu.
    async updateUserDetails(req, res) {
        console.log("updateUserDetails()");

        // address details
        const addressID = req.body.addressID;
        const street = req.body.street;
        const city = req.body.city;
        const country = req.body.country;
        // user details
        const userID = req.body.userID;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const birthday = req.body.birthday;
        const gender = req.body.gender;

        const addressQuery =
            `UPDATE Address 
            SET
            Street='${street}',
            City='${city}',
            Country='${country}'
            WHERE 
            AddressID=${addressID}
            RETURNING *`;

        const userQuery = 
            `UPDATE Users
            SET 
            firstname='${firstName}',
            lastname='${lastName}',
            phone='${phone}',
            birthday='${birthday}',
            gender='${gender}',
            address='${addressID}'
            WHERE 
            userid=${userID}
            RETURNING *`;

        db.query(addressQuery)
        .then(() => {
            db.query(userQuery)
            .then(result => res.json(result.rows[0]))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update user token for push notification
    async updateUserPushToken(req, res) {
        console.log("updateUserPushToken()");

        const userID = req.body.userID;
        const push_token = req.body.push_token;

        const query = 
            `UPDATE Users
            SET push_token='${push_token}'
            WHERE userid=${userID}
            RETURNING *`;

        db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update user profile picture
    async updateUserProfilePic(req, res) {
        console.log("updateUserProfilePic()");

        const email = req.body.email;
        const profilePic = req.body.profilePic;

        const query = 
            `UPDATE Users
            SET profilepic='${profilePic}'
            WHERE email='${email}'
            RETURNING *`;

        db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update user token for push notification
    async getUserPushToken(req, res) {
        console.log("getUserPushToken()");

        const userID = req.body.userID;

        const query = 
            `SELECT push_token FROM Users 
            WHERE userid='${userID}'`;

        db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}
