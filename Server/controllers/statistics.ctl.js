const db = require('../database');

// 1. get all business customers sorted by gender.
statByGender = (req, res) => {
    // data example:
    // const data = [
    //     {
    //       name: "Female",
    //       population: 10,
    //       color: "rgba(255, 204, 204, 1)",
    //       legendFontColor: "#7F7F7F",
    //       legendFontSize: 15
    //     },
    //     {
    //       name: "Mail",
    //       population: 15,
    //       color: "rgba(153, 204, 255, 1)",
    //       legendFontColor: "#7F7F7F",
    //       legendFontSize: 15
    //     }
    //   ]


    console.log("getCustomersSortedByGender()");

    const businessID = req.body.businessID;
    const query = `SELECT Gender, COUNT(Gender) FROM Orders
                   LEFT OUTER JOIN Users ON (Orders.customer = Users.UserID)
                   WHERE
                   Business=${businessID} GROUP BY Gender`;
    
    db.query(query)
    .then(result => {
        var results = (result.rows).map((row) => {
            return  {
                      name: row.gender,
                      population: row.count,
                      color: "rgba(255, 204, 204, 1)",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15
                    }
        })
        res.json(results)
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 2. get business income from each service.
statByService = (req, res) => {
    // data example
    // const data = [
    //           {
    //            name: Beauty Sales,
    //            total: 50
    //           },
        //       {
    //            name: Baby Legal,
    //            total: 80
    //           }
    // ]

    console.log("getIncomeByService()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE
                    Orders.Business=${businessID} GROUP BY Orders.Service, Orders.Business, Service.Name`;
    
    db.query(query)
        .then(result => {
            
            var results = (result.rows).map((row) => {
                return  {
                          name: row.name,
                          total: row.total
                        }
            })
            res.json(results)
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 3. get all business customers sorted by ascending age.
statByAge = (req, res) => {

    // data example:
    // const data = [
    //     {
    //         18-24: 3840,
    //         25-34: 1920,
    //         44-35: 960,
    //         55-65: 400,
    //         65+: 400
    //     },
    // ]

    console.log("getCustomersSortedByAge()");

    const businessID = req.body.businessID;

    //const query = `SELECT * FROM Users ORDER BY birthday ASC`;
    const query = `SELECT orders.business, orders.customer, users.birthday, EXTRACT(YEAR FROM AGE(users.birthday)) as age FROM orders
                    LEFT OUTER JOIN users ON (orders.customer = users.userid) 
                    WHERE
                    business=${businessID} ORDER BY age`;

    db.query(query)
        .then(result => {
            // console.log(result.rows)
            var data = {
                "18-24": 0,
                "25-34": 0,
                "35-44": 0,
                "45-54": 0,
                "55-65": 0,
                "65+": 0
            }
            var rows = result.rows
            rows.map((row) => {
                if (row.age >= 18 && row.age <=24){
                    data["18-24"] += 1
                } else if (row.age >= 25 && row.age <=34){
                    data["25-34"] += 1
                } else if (row.age >= 35 && row.age <=44){
                    data["35-44"] += 1
                } else if (row.age >= 45 && row.age <=54){
                    data["45-54"] += 1
                } else if (row.age >= 55 && row.age <=65){
                    data["55-65"] += 1
                } else if (row.age >= 65){
                    data["65+"] += 1
                }
            })

            res.json(data)
        })
        .catch(err => res.status(404).send(`${err.stack}`))
}


    
// 4. get business customers sorted by top *number* addresses (cities)
statByAddress = (req, res) => {

    // data example:
    // const data = [
    //     {
    //         Tel Aviv: 2,
    //         Rishon Lezion: 1,
    //         Herzelia: 5
    //     },
    // ]

    console.log("getCustomersSortedByCities()");

    const businessID = req.body.businessID;

    const query = `SELECT Address.City, COUNT(Address.City) FROM Orders
                    INNER JOIN Users ON (Orders.Customer = Users.UserID)
                    INNER JOIN Address ON (Users.Address = Address.AddressID)
                    WHERE
                    Orders.Business=${businessID} GROUP BY Address.City`;
    
    db.query(query)
        .then(result => {
            var data = {}
            var rows = result.rows
            rows.map((row) => {
                data[row.city] = row.count
            })
            res.json(data)
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 5. get business total income under a period of time
statTotalIncome = (req, res) => {
    // data example
    // const data = [50, 10, 40, 95
    // ]

    console.log("getIncomeByTimePeriod()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Starttime::date, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=100 AND Status='Confirmed' AND Orders.Starttime::date BETWEEN (NOW() - INTERVAL '1 WEEK') AND NOW() GROUP BY Orders.Starttime::date, Orders.Business ORDER BY Starttime`;
    
    db.query(query)
        .then(result => res.json(result.rows))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 6. strongest hours 
statStrongHours = (req, res) => {
    // data example
    // const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]


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
// 7. Get all customers and order by most money spent
statTop10Customers = (req, res) => {

    // const data = ['Shira Levy', 'Guy Shriki', 'Lev Ari Cohen', 'Miki Makmel', ... top10 ... ]
    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Customer, CONCAT(Users.Firstname, ' ',Users.Lastname) AS Name,
                   SUM(Service.Price) AS Total FROM Orders
                        LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                        LEFT OUTER JOIN Users ON (Orders.Customer= Users.UserID)
                        WHERE
                        Orders.Business=${Business} GROUP BY Customer, Users.Firstname, Users.Lastname ORDER BY Total DESC`;

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

    const query = `SELECT Rating, COUNT(Rating) FROM Review WHERE Business=1 GROUP BY Rating`;
    
    db.query(query)
        .then(result => res.json(result.rows[0]))
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

    


module.exports = {
    statByGender: statByGender,
    statByService: statByService,
    statByAge: statByAge,
    statByAddress: statByAddress,
    statTotalIncome: statTotalIncome,
    statStrongHours: statStrongHours,
    statTop10Customers: statTop10Customers,
    statDailyCounter: statDailyCounter,
    statRating: statRating
}
