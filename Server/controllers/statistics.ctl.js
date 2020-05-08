const db = require('../database');



// get all business customers sorted by ascending age.
getCustomersSortedByAge = async (req, res) => {
    console.log("getCustomersSortedByAge()");

    const businessID = req.body.businessID;

    //const query = `SELECT * FROM Users ORDER BY birthday ASC`;
    const query = `SELECT orders.business, orders.customer, users.birthday, EXTRACT(YEAR FROM AGE(users.birthday)) as age
                    FROM orders LEFT OUTER JOIN users ON (orders.customer = users.userid) where business=${businessID} ORDER BY age`;

    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}




// get all business customers sorted by gender.
getCustomersSortedByGender = async (req, res) => {
    console.log("getCustomersSortedByGender()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
    
// get business customers sorted by top *number* addresses (cities).
getCustomersSortedByCities = async (req, res) => {
    console.log("getCustomersSortedByCities()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
    
// get daily entrance counter for a business page.
getDailyCounter = async (req, res) =>{
    console.log("getDailyCounter()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
    
// get top 10 customers who orders services the most times from a business.
getTop10Customers = async (req, res) => {
    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
    
// get business income from each service.
getIncomeByService = async (req, res) => {
    console.log("getIncomeByService()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}
    
// get business total income under a period of time.
getIncomeByTimePeriod = async (req, res) => {
    console.log("getIncomeByTimePeriod()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}





module.exports = {
    getCustomersSortedByAge: getCustomersSortedByAge,
    getCustomersSortedByGender: getCustomersSortedByGender,
    getCustomersSortedByCities: getCustomersSortedByCities,
    getDailyCounter: getDailyCounter,
    getTop10Customers: getTop10Customers,
    getIncomeByService: getIncomeByService,
    getIncomeByTimePeriod: getIncomeByTimePeriod
}