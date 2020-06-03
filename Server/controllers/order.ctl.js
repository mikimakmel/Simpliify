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
        const durationMinutes = req.body.durationMinutes;
        const query = 
            `
            SELECT Starttime, DurationMinutes, Quota, Status FROM Orders INNER JOIN Service ON (Orders.Service = Service.ServiceID)
            WHERE
            Business = '${businessID}' AND
            Status = '${status}' AND
            StartTime::DATE = '${startTime}'::date
            ORDER BY StartTime
            `
        db.query(query)
        .then(result => {
            var segmentToCheck = moment.range(moment(startTime), moment(startTime).add(durationMinutes, 'minutes'))
            var isValidOrder = true;
            result.rows.forEach(function(order, index) {
                let tmpDate = moment(order.starttime)
                if(segmentToCheck.overlaps(moment.range(moment(tmpDate), moment(tmpDate).add(order.durationminutes, 'minutes'))))
                {
                    if(moment(order.starttime).toString() == moment(startTime).toString())
                    {
                        var currentQuota = order.quota - 1
                        if(currentQuota)
                        {
                            for(; currentQuota; currentQuota--)
                                if(result.rows.length > index + 1)
                                    if(order.starttime.toString() != result.rows[index + 1].starttime.toString())
                                        break
                            
                            if(!currentQuota && result.rows.length > index + 1)
                                isValidOrder = false
                        }
                        else
                            isValidOrder = false
                    }
                    else
                        isValidOrder = false
                }
            })

            const scheduleQuery =
            `INSERT INTO Orders 
            (Customer, Business, Service, status, starttime, orderedat) 
            VALUES 
            ('${userID}', '${businessID}', '${serviceID}', '${status}', '${startTime}', NOW() AT TIME ZONE 'EETDST')
            RETURNING Orderid, Customer, Business, Service, status, starttime AT TIME ZONE 'UTC' as starttime, orderedat AT TIME ZONE 'UTC' as orderedat`;
            
            if(!isValidOrder)
                res.json('Unfortunately this booking is no longer available. Better luck next time!')
            else
            {
                db.query(scheduleQuery)
                .then(result => res.json(result.rows[0]))
                .catch(err =>
                {
                    if(err.code == '23505')
                    {
                        const updateStatus = 
                        `UPDATE Orders SET Status = 'Confirmed' WHERE
                        Customer = '${userID}' AND
                        Business = '${businessID}' AND
                        Service = '${serviceID}' AND
                        Starttime = '${startTime}'
                        RETURNING Orderid, Customer, Business, Service, status, starttime AT TIME ZONE 'UTC' as starttime, orderedat AT TIME ZONE 'UTC' as orderedat
                        `
                        db.query(updateStatus)
                        .then(result => res.json(result.rows[0]))
                        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
                    }
                    else
                        res.status(404).send(`Query error: ${err.stack}`)
                })
            }
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
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
            Firstname || ' ' || Lastname AS Name, Service.Name AS Service, Users.Phone
            FROM Orders 
            INNER JOIN Business ON (Orders.Business = Business.BusinessID)
            INNER JOIN Service ON (Orders.Service= Service.ServiceID)
            INNER JOIN Users ON (Orders.Customer= Users.UserID)
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
            `SELECT status, TO_CHAR(Orders.Starttime, 'YYYY-MM-DD HH24:MI:00') as starttime, durationminutes, serviceid, quota FROM Orders 
            INNER JOIN Service ON (Orders.Service=Service.ServiceID)
            WHERE business=${businessID} AND Status='Confirmed' AND starttime::date='${currentDate}'::date
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
                var stillVacant = Array.apply(null, Array(result.rows.length)).map(function (x, i) { return i; })
                result.rows.forEach(function(order, index) {
                    var currentQuota = order.quota - 1
                    if(currentQuota)
                    {
                        for(; currentQuota; currentQuota--)
                            if(result.rows.length > index + 1)
                                if(order.starttime.toString() != result.rows[index + 1].starttime.toString())
                                    break

                        if(!currentQuota && result.rows.length > index + 1)
                            stillVacant.splice(stillVacant.indexOf(index), order.quota - 1)
                    }
                    else
                        stillVacant.splice(stillVacant.indexOf(index), 1)
                })

                finalResult.orders = result.rows;
                for (var i = 0; i < stillVacant.length; ++i)
                    finalResult.orders.splice(stillVacant[i] - i, 1);
                
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

                    // Create orders' time ranges
                    let timeSegments = [];
                    finalResult.orders.forEach (order => {
                        let tmpDate = moment(order.starttime)
                        timeSegments.push(moment.range(moment(tmpDate), moment(tmpDate).add(order.durationminutes, 'minutes')))
                    })

                    // If a range of time overlaps with each other (all & ordered), move it from the list
                    var overlapping = []
                    allSegments.forEach(function(timeFrame, index) {
                        timeSegments.forEach (segment => {
                            if(segment.overlaps(timeFrame))
                                overlapping.push(index)
                        })
                    })
                    
                    // Actual remove
                    for (var i = 0; i < overlapping.length; ++i)
                        allSegments.splice(overlapping[i] - i, 1);
                    
                    // Parse to an time objects array
                    allSegments.forEach(segment => {openHours.push({'time':segment.start.format('HH:mm')})})
                }
                res.json(openHours);
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },
}