const db = require('./database')

// send notification to client
// notify = (row) => {

// }

// // update status to success and write to database
// update = (row) => {
//     const query = ``
//     db.query(query)
//     .then(result => {
//         res.json(result.rows)
//     })
//     .catch(err => res.status(404).send(`Query error: ${err.stack}`))
// }

intervalFunc = (req, res) => {
    console.log('Cant stop me now!');

    const query = `SELECT * FROM Orders WHERE status = 'Confirmed'`

    db.query(query)
        .then(result => {
            // console.log(result.rows)
            // check if date passed
            // if yes - update status

            // check if date is tommorow
            // if yes send notification
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
  
  module.exports = {
    intervalFunc: intervalFunc 
} 