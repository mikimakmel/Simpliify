const db = require('../database');

var moment = require('moment');
var momentRange = require('moment-range');
momentRange.extendMoment(moment);
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

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
            .catch(err => {
                        if(err.code == '23505')
                            {
                                const checkStatus =
                                `SELECT OrderID FROM Orders WHERE
                                Customer = '${userID}' AND
                                Business = '${businessID}' AND
                                Service = '${serviceID}' AND
                                Starttime = '${startTime}' AND
                                Status = 'Cancelled'
                                `
                                db.query(checkStatus)
                                .then(result => {
                                    if(!result.rows[0])
                                        res.json('Order already exists!')
                                    else
                                    {
                                        let orderID = result.rows[0].orderid;
                                        const updateStatus = 
                                        `UPDATE Orders SET Status = 'Confirmed' WHERE
                                        OrderID = '${orderID}'
                                        RETURNING Orderid, Customer, Business, Service, status, starttime AT TIME ZONE 'UTC' as starttime, orderedat AT TIME ZONE 'UTC' as orderedat
                                        `
                                        db.query(updateStatus)
                                        .then(result => res.json(result.rows[0]))
                                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                                    }
                                })
                                
                                .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                            }
                    })
    },

    // user cancel's an exsiting order for a service.
    async updateOrderStatus(req, res) {
        console.log("updateOrderStatus()");

        const orderID = req.body.orderID;
        const status = req.body.status;

        const query = 
            `UPDATE Orders
            SET status='${status}'
            WHERE orderid=${orderID}
            RETURNING *`;
        
        db.query(query)
            .then(result => res.json(result.rows[0]))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // get all customer orders (past and future).
    async getAllCustomerOrders(req, res) {
        console.log("getAllCustomerOrders()");

        const userID = req.body.userID;

        const query = 
            `SELECT 
            orderid, customer AS CustomerID, business AS BusinessID, Business.Name AS BusinessName, Carousel.imagelink AS coverPic,
            Service AS ServiceID, Service.Name as ServiceName, status, Service.durationminutes as durationminutes,
            starttime AT TIME ZONE 'UTC' as starttime, 
            orderedat AT TIME ZONE 'UTC' as orderedat, 
            Address.Street, Address.City, Address.Country, 
            Address.Coordinates[0] AS Lat, Address.Coordinates[1] AS Lng 
            FROM Orders 
            INNER JOIN Business ON (Orders.Business = Business.BusinessID) 
            INNER JOIN Service ON (Orders.Service = Service.ServiceID) 
            INNER JOIN Address ON (Business.Address = Address.AddressID) 
            INNER JOIN Carousel ON (Orders.Business = Carousel.BusinessID)
            WHERE customer=${userID} AND primarypic = 'True' ORDER BY starttime`;
        
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
            `SELECT Status, Starttime AT TIME ZONE 'UTC' as Starttime, Starttime + INTERVAL '1 MINUTES' * DurationMinutes AS Endtime,
            Firstname || ' ' || Lastname AS FullName, Service.Name AS ServiceName, Users.Phone, Street || ', ' || City AS Address
            FROM Orders 
            INNER JOIN Business ON (Orders.Business = Business.BusinessID)
            INNER JOIN Service ON (Orders.Service= Service.ServiceID)
            INNER JOIN Users ON (Orders.Customer= Users.UserID)
            INNER JOIN Address ON (Address.AddressID = Users.Address)
            WHERE business=${businessID}
            ORDER BY starttime ASC`;

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

    async getAllAvailableBusinessTime(req, res) {
        console.log("getAllAvailableBusinessTime()");
        
        const businessID = req.body.businessID;
        const currentDate = req.body.currentDate;
        const durationMinutes = req.body.durationMinutes;

        const availabilityQuery = 
            `SELECT * FROM availability 
            WHERE businessid=${businessID}`;
        
        const ordersQuery = 
            `SELECT status, starttime, durationminutes FROM Orders 
            INNER JOIN Service ON (Orders.Service= Service.ServiceID)
            WHERE business=${businessID} AND Status='Confirmed'
            ORDER BY starttime ASC`;

        var finalResult = {
            availability: [],
            orders: [],
        };

        db.query(availabilityQuery)
            .then(result => {
                finalResult.availability = result.rows;
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))

        db.query(ordersQuery)
            .then(result => {
                finalResult.orders = result.rows;
                var allSegments = [];
                var openHours = [];
                var startAvailability = "";
                var endAvailability = "";
                
                // Calculating all available time segments for today and save them in "allSegments".
                finalResult.availability.forEach(day => {
                    if (weekday[moment.utc(currentDate).day()] == day.dow)
                    {
                        var t = day.starttime.split(":")
                        startAvailability = moment(new Date(moment(currentDate).year(), moment(currentDate).month(), moment(currentDate).date(), parseInt(t[0]), parseInt(t[1]), parseInt(t[2])))
                        t = day.endtime.split(":")
                        endAvailability = moment(new Date(moment(currentDate).year(), moment(currentDate).month(), moment(currentDate).date(), parseInt(t[0]), parseInt(t[1]), parseInt(t[2])))
                    }
                })      

                if(startAvailability !== "") {
                    var currentAvailability = startAvailability.clone()
                    var tmpTime = startAvailability.clone().add(durationMinutes, 'minutes')
                    while (tmpTime.isSameOrBefore(endAvailability))
                    {
                        if(moment(currentAvailability) > moment())
                            allSegments.push(moment.range(moment(currentAvailability), moment(currentAvailability).clone().add(durationMinutes, 'minutes')))
                        currentAvailability.add(durationMinutes, 'minutes')
                        tmpTime.add(durationMinutes, 'minutes')
                    }
                    
                    // Gather orders from the same day
                    let timeSegments = [];
                    finalResult.orders.forEach (order => {
                        if (moment(order.starttime).format('L') === moment(startAvailability).format('L'))
                        {
                            let tmpDate = moment(order.starttime)
                            timeSegments.push(moment.range(moment(tmpDate), moment(tmpDate).add(order.durationminutes, 'minutes')))
                        }
                    })
                    
                    // If a range of time overlaps with each other (all & ordered), move it from the list
                    var overlapping = []
                    allSegments.forEach(function(timeFrame, index) {
                        timeSegments.forEach (segment => {
                            if(segment.overlaps(timeFrame))
                            { 
                                overlapping.push(index)
                            }
                        })
                    })
                    
                    // Actual remove
                    for (var i = 0; i < overlapping.length; ++i) {
                        allSegments.splice(overlapping[i] - i, 1);
                    }
                    
                    // Parse to an time objects array
                    
                    allSegments.forEach(segment => {
                        openHours.push({'time':segment.start.format('HH:mm')})
                    })
                }

                res.json(openHours);
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },
}