var moment = require('moment');
const fetch = require('node-fetch');
const db = require('./database')

// UPDATE Orders SET Starttime = NOW() - INTERVAL '1 day', Bool_notify = 'True', Status = 'Confirmed' WHERE OrderID IN (23, 1187, 381)
success = (req, res) => {
    const query = `UPDATE Orders SET Status = 'Success'
                    WHERE
                    Status = 'Confirmed'
                    AND Starttime AT TIME ZONE 'UTC' < (NOW() - INTERVAL '1 day')
                    RETURNING Orderid`
    db.query(query)
        .then(result => {
            var ordersids = result.rows;
            if(ordersids.length > 0){
                arr = []
                ordersids.map((row) => arr.push(row.orderid))
                ordersIdsStr = '(' + arr.toString()+ ')'

                var queryNote = `SELECT Orderid,Business.Name AS BusinessName, firstname, Push_token FROM Orders
                                    INNER JOIN Business ON (Orders.Business = Business.BusinessID)
                                    INNER JOIN Users ON (Orders.Customer = Users.UserID)
                                    WHERE
                                    Orderid IN`
                queryNote = queryNote.concat(' ',ordersIdsStr)

                console.log()
                db.query(queryNote)
                .then(result => {
                    var rows = result.rows
                    console.log("Notify to client the service has ended successfully")

                    rows.map(async (row) => {

                        const message = {
                            to: row.push_token,
                            sound: 'default',
                            title: `${row.firstname}`,
                            body: `Thank you for your visit at ${row.businessname}!`,
                            data: { data: 'goes here' },
                            _displayInForeground: true,
                          };
                        
                        const response = await fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Accept-encoding': 'gzip, deflate',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(message)
                        })
                    })

                    
                })
                .catch(err => res.status(404).send(`Query error: ${err.stack}`))
            }
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// UPDATE Orders SET Starttime = NOW() + INTERVAL '1 day', Bool_notify = 'False', Status = 'Confirmed' WHERE OrderID IN (3,12,8)
reminder = (req, res) => {
    const query = `UPDATE Orders SET bool_notify = 'True'
                    WHERE
                    bool_notify = 'False'
                    AND Status = 'Confirmed'
                    AND ((Starttime AT TIME ZONE 'UTC') BETWEEN now() AND (now() + '1 day'::interval))
                    RETURNING Orderid`

    db.query(query)
        .then(result => {
            var ordersids = result.rows;
            if (ordersids.length > 0){
                arr = []
                ordersids.map((row) => arr.push(row.orderid))
                ordersIdsStr = '(' + arr.toString()+ ')'
               
                var queryNote = 
                    `SELECT Orderid, Starttime AT TIME ZONE 'UTC' AS Starttime, Business.Name AS BusinessName, Bool_notify, firstname, Push_token, Service.name as servicename FROM Orders
                        INNER JOIN Business ON (Orders.Business = Business.BusinessID)
                        INNER JOIN Users ON (Orders.Customer = Users.UserID)
                        INNER JOIN Service ON (Orders.service = Service.serviceid)
                        WHERE
                        Orderid IN`
                        
                queryNote = queryNote.concat(' ',ordersIdsStr)
                queryNote = queryNote.concat(' ',`ORDER BY Starttime`)

                db.query(queryNote)
                .then(result => {
                    var rows = result.rows
                    
                    console.log("Notify to client he has srevice tommorow")
                    rows.map(async (row) => {
                        const message = {
                            to: row.push_token,
                            sound: 'default',
                            title: `${row.firstname}`,
                            body: `You have visit tommorow to ${row.servicename} at ${moment(row.starttime).format("hh:mm a")} in ${row.businessname}`,
                            data: { data: 'goes here' },
                            _displayInForeground: true,
                          };
                        
                        const response = await fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Accept-encoding': 'gzip, deflate',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(message)
                        })
                    })                    
                })
                .catch(err => res.status(404).send(`Query error: ${err.stack}`))
            }
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
  
  module.exports = {
    reminder: reminder,
    success: success 
} 
