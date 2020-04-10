const db = require('../database');

module.exports = {

    // user's create an new order for a service.
    async createNewOrder(req, res) {
        console.log("createNewOrder()");

        const userID = req.body.userID;
        const businessID = req.body.businessID;
        const serviceID = req.body.serviceID;
        const status = 'Pending';
        const startTime = req.body.startTime;
        const transactionTime = req.body.transactionTime;

        const query = 
            `INSERT INTO Orders 
            (customer, business, service, status, starttime, transactiontime) 
            VALUES 
            (${userID}, ${businessID}, ${serviceID}, ${status}, ${startTime}, ${transactionTime})`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // user cancel's an exsiting order for a service.
    async updateOrderStatus(req, res) {
        console.log("updateOrderStatus()");

        const orderID = req.body.orderID;
        const status = req.body.status;

        const query = 
            `UPDATE Orders
            SET 
            status='${status}'
            WHERE 
            order=${orderID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all customer orders (past and future).
    async getAllCustomerOrders(req, res) {
        console.log("getAllCustomerOrders()");

        const userID = req.body.userID;

        const query = `SELECT * FROM Orders WHERE customer=${userID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}