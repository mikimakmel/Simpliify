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

        const query = `SELECT * FROM Users WHERE email='${email}'`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get user by his ID.
    async getUserByID(req, res) {
        console.log("getUserByID()");

        const userID = req.body.userID;

        const query = `SELECT * FROM Users WHERE userid='${userID}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // create new user in db after user signUp for the first time (contains email only).
    async createNewUser(req, res) {
        console.log("createNewUser()");
        
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const birthday = req.body.birthday;
        const gender = req.body.gender;
        const addressID = req.body.addressID;

        const query = 
            `INSERT INTO Users 
            (firstname, lastname, phone, gender, email, birthday, address) 
            VALUES 
            (${firstName}, ${lastName}, ${phone}, ${gender}, ${email}, ${birthday}, ${addressID})`;
        
        db.query(query)
          .then(result => res.json(result.rows))
          .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // update user details after filling the full signUp form, or updating profile from menu.
    async updateUserDetails(req, res) {
        console.log("updateUserDetails()");
        
        const userID = req.body.userID;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const birthday = req.body.birthday;
        const gender = req.body.gender;
        const addressID = req.body.addressID;

        // const addressQuery = 
        //     `INSERT INTO Address 
        //     (addressid, street, city, country) 
        //     VALUES 
        //     (1111, 'Test', 'Rosh HaAyin', 'Israel')
        //     RETURNING addressid`;

        const query = 
            `UPDATE Users
            SET 
            firstname='${firstName}',
            lastname='${lastName}',
            phone='${phone}',
            birthday='${birthday}',
            gender='${gender}',
            address='${addressID}'
            WHERE 
            userid=${userID}`;

        // db.query(addressQuery)
        // .then(result => res.json(result.rows))
        // .catch(err => res.status(404).send(`Query error: ${err.stack}`))
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}
