const db = require('../database');


// 1. get all business customers sorted by gender.
statByGender = (req, res) => {
    // data example:
    // const gendercount = [
    //     {
    //       gender: ['Female', 'Male'],
    //       amount: [10, 15],
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
        var gendercount = 
            {
                gender: [],
                amount: [],
            }
        var rows = result.rows
        rows.map((row) => {
            gendercount.gender.push(row.gender)
            gendercount.amount.push(row.count)

        })
        res.json([gendercount])
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 2. get business income from each service.
statByService = (req, res) => {
    // data example
    // const serviceincome = [
    //     {
    //       name: ['Beauty Sales', 'Baby Legal'],
    //       amount: [50, 80],
    //     }
    //   ]
    console.log("getIncomeByService()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders
                    LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE
                    Orders.Business=${businessID} GROUP BY Orders.Service, Orders.Business, Service.Name`;
    
    db.query(query)
        .then(result => {
            const serviceincome =
                {
                    name: [],
                    amount: [],
                }
            const rows = result.rows
            rows.map((row) => {
                serviceincome.name.push(row.name)
                serviceincome.amount.push(row.total)    
            })
            res.json([serviceincome])
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


// 3. get all business customers sorted by ascending age.
statByAge = (req, res) => {

    // data example:
    // const customersage = [
    //     {
    //       age: ['13-17', 18-24', '25-34', '44-35', '55-65', '65+'],
    //       amount: [3840, 1920, 960, 400, 400],
    //     }
    //   ]

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
                "13-17": 0,
                "18-24": 0,
                "25-34": 0,
                "35-44": 0,
                "45-54": 0,
                "55-65": 0,
                "65+": 0
            }
            var rows = result.rows
            rows.map((row) => {
                if (row.age >= 13 && row.age <=17){
                    data["13-17"] += 1
                } else if (row.age >= 18 && row.age <=24){
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
            var customersage = {
                age: [],
                amount: []
            }

            Object.keys(data).forEach((key) => {
                customersage.age.push(key)
                customersage.amount.push(data[key])
            });

            res.json([customersage])
        })
        .catch(err => res.status(404).send(`${err.stack}`))
}

// 4. get business customers sorted by top *number* addresses (cities)
statByAddress = (req, res) => {

    // data example:
    // const citycount = [
    //     {
    //       city: ['Herzelia', 'Tel Aviv', 'Rishon Lezion'],
    //       amount: [5, 2, 1],
    //     }
    //   ]

    console.log("getCustomersSortedByCities()");

    const businessID = req.body.businessID;

    const querynew = `SELECT Address.City, COUNT(Address.City) FROM Orders
                        INNER JOIN Users ON (Orders.Customer = Users.UserID)
                        INNER JOIN Address ON (Users.Address = Address.AddressID)
                        WHERE
                        Orders.Business=${businessID} GROUP BY Address.City ORDER BY Count DESC`
    
    db.query(querynew)
        .then(result => {
            var citycount = {
                city: [],
                amount: []
            }
            var rows = result.rows            
            rows.map((row) => {
                citycount.city.push(row.city)
                citycount.amount.push(row.count)
            })
            res.json([citycount])
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 5. get business total income under a period of time
statTotalIncome = (req, res) => {
    // data example
    // array size is 12, present 12 month
    // const businessincome = [50, 10, 40, 95, 50, 10, 40, 95, 50, 10, 40, 95]

    console.log("getIncomeByTimePeriod()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Starttime::date, SUM(Service.Price) as Total FROM Orders
                    LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE Orders.Business=${businessID}
                    AND Status='Confirmed'
                    AND Orders.Starttime::date BETWEEN (NOW() - INTERVAL '1 YEAR')
                    AND NOW()
                    GROUP BY Orders.Starttime::date, Orders.Business ORDER BY Starttime`;
    
    db.query(query)
        .then(result => {
            var businessincome = new Array(12).fill(0)
            
            var rows = result.rows
            console.log(rows)
            rows.map((row) => {
                var d = new Date(row.starttime)
                businessincome[d.getUTCMonth()] += parseInt(row.total, 10)
            })
            res.json(businessincome)
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 6. strongest hours 
statStrongHours = (req, res) => {
    // data example
    // const stronghours = [{ 
    //    hours: [1,2,3,4,5,6,14,16],
    //    amount: [2,4,6,1,2,6,1,3]
    // }]
    // good example: businessID=13

    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT Business, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders
                    WHERE
                    Business=${businessID} GROUP BY Business, Hour ORDER BY Popularity DESC`;
    
    db.query(query)
        .then(result => {
            var stronghours = {
                hours: [],
                amount: []
            }
            var rows = result.rows
            console.log(rows)
            rows.map((row) => {
                stronghours.hours.push(row.hour)
                stronghours.amount.push(row.popularity)
            })
            res.json([stronghours])
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 7. get top 10 customers who orders services the most times from a business.
// 7. Get all customers and order by most money spent
statTop10Customers = (req, res) => {

    // data example
    // const bestcustomer = [
    //     {
    //       name: [Guy Shriki, Shira Levy, Lev Ari Cohen, Miki Makmel]
    //       amount: [16, 12, 5, 1]
    //     }
    //   ]
    console.log("getTop10Customers()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Customer, CONCAT(Users.Firstname, ' ',Users.Lastname) AS Name,
                   SUM(Service.Price) AS Total FROM Orders
                        LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                        LEFT OUTER JOIN Users ON (Orders.Customer= Users.UserID)
                        WHERE
                        Orders.Business=${businessID} GROUP BY Customer, Users.Firstname, Users.Lastname ORDER BY Total DESC`;

    db.query(query)
        .then(result => {
            var bestcustomer = {
                name: [],
                amount: []
            }
            var rows = result.rows
            rows.map((row) => {
                bestcustomer.name.push(row.name)
                bestcustomer.amount.push(row.total)
            })

            res.json([bestcustomer])
        })
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
    // const ratingcount = [{ 
    //      rating: [5,4,3,2,1],
    //      amount: [5,7,2,5,4]
    // }],
    const businessID = req.body.businessID;

    const query = `SELECT Rating, COUNT(Rating) FROM Review WHERE Business=${businessID} GROUP BY Rating ORDER BY Rating DESC`;
    
    db.query(query)
        .then(result => {
            var ratingcount = {
                rating: [],
                amount: []
            }
            var rows = result.rows
            rows.map((row) => {
                ratingcount.rating.push(row.rating)
                ratingcount.amount.push(row.count)
            })
            res.json([ratingcount])
        })
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
