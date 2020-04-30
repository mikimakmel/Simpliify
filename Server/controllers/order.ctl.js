const db = require('../database');

module.exports = {

    // user's create an new order for a service.
    async createNewOrder(req, res) {
        console.log("createNewOrder()");

        const userID = req.body.order.userID;
        const businessID = req.body.order.businessID;
        const serviceID = req.body.order.serviceID;
        const status = 'Confirmed';
        const startTime = req.body.order.startTime;

        const query = 
            `INSERT INTO Orders 
            (Customer, Business, Service, status, starttime, orderedat) 
            VALUES 
            ('${userID}', '${businessID}', '${serviceID}', '${status}', '${startTime}', NOW() AT TIME ZONE 'EETDST')
            RETURNING Customer, Business, Service, status, starttime AT TIME ZONE 'UTC' as starttime, orderedat AT TIME ZONE 'UTC' as orderedat`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
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
            orderid=${orderID}
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all customer orders (past and future).
    async getAllCustomerOrders(req, res) {
        console.log("getAllCustomerOrders()");

        const userID = req.body.userID;

        const query = 
            `SELECT orderid, customer, business, service, status,
            starttime AT TIME ZONE 'UTC' as starttime,
            orderedat AT TIME ZONE 'UTC' as orderedat
            FROM Orders INNER JOIN Business ON (Orders.Business = Business.BusinessID)
            WHERE customer=${userID} AND starttime > NOW() ORDER BY starttime`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all business orders (past and future).
    async getAllBusinessOrders(req, res) {
        console.log("getAllBusinessOrders()");

        const businessID = req.body.businessID;

        const query = `SELECT * FROM Orders INNER JOIN Business ON (Orders.Business = Business.BusinessID) WHERE business=${businessID}`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}


// SELECT orders.business, orders.status, orders.starttime, service.durationminutes FROM orders LEFT OUTER JOIN service ON (orders.business = service.businessid AND orders.service = service.serviceid) WHERE business = X