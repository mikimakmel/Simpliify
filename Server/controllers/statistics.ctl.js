const db = require('../database');

// 1. get all business customers sorted by gender.
StatByGender = (req, res) => {


    // const data = [
    //     {
    //       name: "Female",
    //       population: 21500000,
    //       color: "rgba(131, 167, 234, 1)",
    //       legendFontColor: "#7F7F7F",
    //       legendFontSize: 15
    //     },
    //     {
    //       name: "Mail",
    //       population: 2800000,
    //       color: "#F00",
    //       legendFontColor: "#7F7F7F",
    //       legendFontSize: 15
    //     }
    //   ]


    console.log("getCustomersSortedByGender()");

    const businessID = req.body.businessID;

    const query = `SELECT Gender, COUNT(Gender) FROM Orders LEFT OUTER JOIN Users ON (Orders.customer = Users.UserID) WHERE Business.BusinessID=${Business} GROUP BY Gender`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 2. get business income from each service.
statByService = (req, res) => {
    console.log("getIncomeByService()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE
                    Orders.Business=${Business} GROUP BY Orders.Service, Orders.Business, Service.Name`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 3. get all business customers sorted by ascending age.
statByAge = (req, res) => {
    console.log("getCustomersSortedByAge()");

    const businessID = req.body.businessID;

    //const query = `SELECT * FROM Users ORDER BY birthday ASC`;
    const query = `SELECT orders.business, orders.customer, users.birthday, EXTRACT(YEAR FROM AGE(users.birthday)) as age FROM orders
                    LEFT OUTER JOIN users ON (orders.customer = users.userid) 
                    WHERE
                    business=${businessID} ORDER BY age`;

    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


    
// 4. get business customers sorted by top *number* addresses (cities)
statByAddress = (req, res) => {
    console.log("getCustomersSortedByCities()");

    const businessID = req.body.businessID;

    const query = `SELECT Address.City, COUNT(Address.City) FROM Orders
                    INNER JOIN Users ON (Orders.Customer = Users.UserID)
                    INNER JOIN Address ON (Users.Address = Address.AddressID)
                    WHERE
                    Orders.Business=${Business} GROUP BY Address.City`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 5. get business total income under a period of time.
statTotalIncome = (req, res) => {
    console.log("getIncomeByTimePeriod()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 6. strongest hours 
statStrongHours = (req, res) => {
    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT Business, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders
                    WHERE
                    Business=${Business} GROUP BY Business, Hour ORDER BY Popularity DESC`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 7. get top 10 customers who orders services the most times from a business.
statTop10Customers = (req, res) => {
    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Customer, SUM(Service.Price) as Total FROM Orders
                    LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE
                    Orders.Business=${Business} GROUP BY Orders.Customer ORDER BY Total DESC`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}



// 8. get daily entrance counter for a business page.
statDailyCounter = (req, res) =>{
    console.log("getDailyCounter()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 9. get rating data
statRating = (req, res) =>{
    console.log("getDailyCounter()");

    const businessID = req.body.businessID;

    const query = `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    
    db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

    


module.exports = {
    StatByGender: StatByGender,
    statByService: statByService,
    statByAge: statByAge,
    statByAddress: statByAddress,
    statTotalIncome: statTotalIncome,
    statStrongHours: statStrongHours,
    statTop10Customers: statTop10Customers,
    statDailyCounter: statDailyCounter,
    statRating: statRating
}
