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
            var Orderids = result.rows;
            if(Orderids.length > 0){
                console.log(Orderids)
                console.log("Notify to client that we would like to see him again!")
            }
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
// UPDATE Orders SET Starttime = NOW() + INTERVAL '1 day', Bool_notify = 'False', Status = 'Confirmed' WHERE OrderID IN (3,12,8);
reminder = (req, res) => {
    // add where bool_notify = 'False' and bla bla..
    const query = `UPDATE Orders SET bool_notify = 'True'
                    WHERE
                    bool_notify = 'False'
                    AND Status = 'Confirmed'
                    AND ((Starttime AT TIME ZONE 'UTC') BETWEEN now() AND (now() + '1 day'::interval))
                    RETURNING Orderid`

    db.query(query)
        .then(result => {
            var Orderids = result.rows;
            if (Orderids.length > 0){
                console.log(Orderids)
                console.log("Notify to client he has srevice tommorow")
                ordersIdsStr = `(` + Orderids[0].orderid
                Orderids.shift()
                
                Orderids.map((row) => {
                    ordersIdsStr = ordersIdsStr.concat(',', row.orderid)
                })
                ordersIdsStr = ordersIdsStr + `)`
                
                var userQuery = 
                    `SELECT Orderid, Status, Starttime AT TIME ZONE 'UTC' AS Starttime, Business.Name AS BusinessName, Bool_notify, Push_token FROM Orders
                        INNER JOIN Business ON (Orders.Business = Business.BusinessID)
                        INNER JOIN Users ON (Orders.Customer = Users.UserID)
                        WHERE
                        Orderid IN`
                userQuery = userQuery.concat(' ',ordersIdsStr)
                userQuery = userQuery.concat(' ',`ORDER BY Starttime`)

                db.query(userQuery)
                .then(result => {
                    var rows = result.rows
                    console.log("Notify to client he has srevice tommorow")
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