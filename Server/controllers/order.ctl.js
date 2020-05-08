const db = require('../database');

module.exports = {

    // user's create an new order for a service.
    async createNewOrder(req, res) {
        console.log("createNewOrder()");
        
        const userID = req.body.userID;
        const businessID = req.body.businessID;
        const serviceID = req.body.serviceID;
        const status = 'Confirmed';
        const startTime = req.body.startTime;

        const query = 
            `INSERT INTO Orders 
            (Customer, Business, Service, status, starttime, orderedat) 
            VALUES 
            ('${userID}', '${businessID}', '${serviceID}', '${status}', '${startTime}', NOW() AT TIME ZONE 'EETDST')
            RETURNING Orderid, Customer, Business, Service, status, starttime AT TIME ZONE 'UTC' as starttime, orderedat AT TIME ZONE 'UTC' as orderedat`;
        
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
            `SELECT 
            orderid, customer AS CustomerID, business AS BusinessID, Business.Name AS BusinessName, Business.Avatar AS avatar,
            Service AS ServiceID, Service.Name as ServiceName, status, Service.durationminutes as durationminutes,
            starttime AT TIME ZONE 'UTC' as starttime, 
            orderedat AT TIME ZONE 'UTC' as orderedat, 
            Address.Street, Address.City, Address.Country, 
            Address.Coordinates[0] AS Lat, Address.Coordinates[1] AS Lng 
            FROM Orders 
            INNER JOIN Business ON (Orders.Business = Business.BusinessID) 
            INNER JOIN Service ON (Orders.Service = Service.ServiceID) 
            INNER JOIN Address ON (Business.Address = Address.AddressID) 
            WHERE customer=${userID} AND starttime > NOW() ORDER BY starttime`;
        
        db.query(query)
            .then(result => {
                res.json(result.rows)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all business orders (past and future).
    async getAllBusinessOrders(req, res) {
        console.log("getAllBusinessOrders()");

        const businessID = req.body.businessID;

        const query = 
            `SELECT status, starttime AT TIME ZONE 'UTC' as starttime, durationminutes FROM Orders 
            INNER JOIN Business ON (Orders.Business = Business.BusinessID)
            INNER JOIN Service ON (Orders.Service= Service.ServiceID)
            WHERE business=${businessID}
            ORDER BY starttime ASC`;

        // const query = 
        //     `SELECT * FROM Orders 
        //     INNER JOIN Business ON (Orders.Business = Business.BusinessID) 
        //     INNER JOIN Service ON (Orders.Service = Orders.Service) 
        //     WHERE business=${businessID}`;

        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all business orders (past and future).
    async checkIfCustomerReceiveServiceFromBusiness(req, res) {
        console.log("checkIfCustomerReceiveServiceFromBusiness()");

        const customerID = req.body.customerID;
        const businessID = req.body.businessID;

        const query = 
            `SELECT * FROM Orders 
            WHERE business=${businessID} AND customer=${customerID} AND status='Success'
            ORDER BY starttime ASC`;

        db.query(query)
            .then(result => {
                console.log(result.rows)
                if(result.rows.length > 0) {
                    res.json({ didReceive: true });
                }
                else {
                    res.json({ didReceive: false });
                }
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

}


// SELECT orders.business, orders.status, orders.starttime, service.durationminutes FROM orders LEFT OUTER JOIN service ON (orders.business = service.businessid AND orders.service = service.serviceid) WHERE business = X