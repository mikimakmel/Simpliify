const db = require('./database')


intervalFunc = (req, res) => {
    // add where bool_notify = 'False' and bla bla..
    const query = `UPDATE Orders SET bool_notify = 'True'
                    WHERE
                    Status = 'Confirmed'
                    AND ((Starttime AT TIME ZONE 'UTC') BETWEEN now() AND (now() + '1 day'::interval))
                    RETURNING Orderid`

    db.query(query)
        .then(result => {
            var Orderids = result.rows;
            if (Orderids.length > 0){
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
                    // console.log("Notify to clients!!")
                })
                .catch(err => res.status(404).send(`Query error: ${err.stack}`))
            }
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
  
  module.exports = {
    intervalFunc: intervalFunc 
} 