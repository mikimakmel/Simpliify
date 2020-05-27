var moment = require('moment');
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
                category: [],
                amount: [],
            }
        var rows = result.rows
        rows.map((row) => {
            gendercount.category.push(row.gender)
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
                    category: [],
                    amount: [],
                }
            const rows = result.rows
            rows.map((row) => {
                serviceincome.category.push(row.name)
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
            console.log(result.rows)
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
                category: [],
                amount: []
            }

            Object.keys(data).forEach((key) => {
                customersage.category.push(key)
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
                category: [],
                amount: []
            }
            var rows = result.rows            
            rows.map((row) => {
                citycount.category.push(row.city)
                citycount.amount.push(row.count)
            })
            res.json([citycount])
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

// 5. get business total income under a period of time
statTotalIncome = (req, res) => {
    // data example when May is the current month:
    // {
    //     "months": [6,7,8,9,10,11,12,1,2,3,4,5],
    //     "amount": [0,0,0,0,0,0,0,0,0,0,50,425]
    // }

    console.log("getIncomeByTimePeriod()");

    const businessID = req.body.businessID;

    const query = `SELECT Orders.Business, Orders.Starttime::date, SUM(Service.Price) as Total FROM Orders
                    LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID)
                    WHERE Orders.Business=${businessID}
                    AND Status='Success'
                    AND Orders.Starttime::date BETWEEN (NOW() - INTERVAL '1 YEAR')
                    AND NOW()
                    GROUP BY Orders.Starttime::date, Orders.Business ORDER BY Starttime`;
    
    db.query(query)
        .then(result => {
            var rows = result.rows

            var months = []
            m = moment().month() +1
            var j = m
            while (j != 12){
                j++
                months.push(j)
            }
            for (var i = 0; i < m; i++){
                months.push(i+1)
            }

            var amount = new Array(12).fill(0)   
            rows.map((row) => {
                var date = new Date(row.starttime)
                const index = months.findIndex((element) => date.getUTCMonth() == element) +1
                amount[index] += parseInt(row.total, 10)
            })
            res.json({
                months: months,
                amount: amount
            })
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
            var data = {
                "0-9": 0,
                "9-12": 0,
                "12-15": 0,
                "15-18": 0,
                "18-24": 0,
            }
            var rows = result.rows
            console.log(rows)
            rows.map((row) => {
                if (row.hour > 0 && row.hour <=9){
                    data["0-9"] += parseInt(row.popularity, 10)
                } else if (row.hour > 9 && row.hour <=12){
                    data["9-12"] += parseInt(row.popularity, 10)
                } else if (row.hour > 12 && row.hour <=15){
                    data["12-15"] += parseInt(row.popularity, 10)
                } else if (row.hour > 15 && row.hour <=18){
                    data["15-18"] += parseInt(row.popularity, 10)
                } else if (row.hour > 18 && row.hour <=24){
                    data["18-24"] += parseInt(row.popularity, 10)
                }
            })
            stronghours = {
                category: [],
                amount: []
            }
            Object.keys(data).forEach((key) => {
                stronghours.category.push(key)
                stronghours.amount.push(data[key])
            });
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
                        Orders.Business=${businessID} AND Status NOT IN ('Cancelled') GROUP BY Customer, Users.Firstname, Users.Lastname ORDER BY Total DESC`;

    db.query(query)
        .then(result => {
            var bestcustomer = {
                category: [],
                amount: []
            }
            var rows = result.rows
            rows.map((row) => {
                bestcustomer.category.push(row.name)
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
    console.log("getRatingData()");
    // data example when month 11 is the current month
    // {
    //     "months": [0,1,2,3,4,5,6,7,8,9,10,11],
    //     "amount": [null,null,null,null,null,null,null,null,null,null,"3.4","3.2"]
    // }
    const businessID = req.body.businessID;

    var query = `SELECT
                    (SELECT AVG(rating)::NUMERIC(2,1) FROM review WHERE Business=${businessID} AND Reviewedat BETWEEN (SELECT MIN(Reviewedat) FROM Review) AND NOW() GROUP BY Business) AS month0,`
    for (var i = 1; i<=10; i++){
        query = query.concat(" ", `(SELECT AVG(rating)::NUMERIC(2,1) FROM review WHERE Business=${businessID} AND Reviewedat BETWEEN (SELECT MIN(Reviewedat) FROM Review) AND (NOW() - INTERVAL '` + i + ` MONTHS') GROUP BY Business) AS month`+ i +`,`)
    }
    query = query.concat(" ", `(SELECT AVG(rating)::NUMERIC(2,1) FROM review WHERE Business=${businessID} AND Reviewedat BETWEEN (SELECT MIN(Reviewedat) FROM Review) AND (NOW() - INTERVAL '11 MONTHS') GROUP BY Business) AS month11
                                FROM review
                                WHERE Business=${businessID}
                                GROUP BY Business`);
    db.query(query)
        .then(result => {
            
            var months = []
            m = moment().month() +1
            var j = m
            while (j != 12){
                j++
                months.push(j)
            }
            for (var i = 0; i < m; i++){
                months.push(i+1)
            }

            var row = result.rows[0]
            var amount = new Array(12);
            var j = 11

            for(var i = 0; i < 12; i++){
                amount[j] = row["month"+i]
                j--
            }
            res.json({
                months: months,
                amount: amount
            })
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

getAllStatisticsByBusinessID = (req, res) =>{
    console.log("getAllStatisticsByBusinessID()");

    const businessID = req.body.businessID;

    const counterQuery =
    `SELECT DailyCounter FROM Business WHERE BusinessID=${businessID}`;
    const genderQuery = 
    `SELECT Gender, COUNT(Gender) FROM Orders LEFT OUTER JOIN Users ON (Orders.customer = Users.UserID) WHERE Business=${businessID} GROUP BY Gender`;
    const serviceQuery =
    `SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${businessID} GROUP BY Orders.Service, Orders.Business, Service.Name`;
    const ageQuery =
    `SELECT orders.business, orders.customer, users.birthday, EXTRACT(YEAR FROM AGE(users.birthday)) as age FROM orders LEFT OUTER JOIN users ON (orders.customer = users.userid) WHERE business=${businessID} ORDER BY age`;
    const cityQuery =
    `SELECT Address.City, COUNT(Address.City) FROM Orders INNER JOIN Users ON (Orders.Customer = Users.UserID) INNER JOIN Address ON (Users.Address = Address.AddressID) WHERE Orders.Business=${businessID} GROUP BY Address.City ORDER BY Count DESC`
    const incomeQuery =
    `SELECT Orders.Business, Orders.Starttime::date, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${businessID} AND Status='Success' AND Orders.Starttime::date BETWEEN (NOW() - INTERVAL '1 YEAR') AND NOW() GROUP BY Orders.Starttime::date, Orders.Business ORDER BY Starttime`;
    const hoursQuery =
    `SELECT Business, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders WHERE Business=${businessID} GROUP BY Business, Hour ORDER BY Popularity DESC`;
    const customersQuery = 
    `SELECT Orders.Customer, CONCAT(Users.Firstname, ' ',Users.Lastname) AS Name, SUM(Service.Price) AS Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) LEFT OUTER JOIN Users ON (Orders.Customer= Users.UserID) WHERE Orders.Business=${businessID} AND Status NOT IN ('Cancelled') GROUP BY Customer, Users.Firstname, Users.Lastname ORDER BY Total DESC`;
    const ratingQuery =
    `SELECT Rating, COUNT(Rating) FROM Review WHERE Business=${businessID} GROUP BY Rating ORDER BY Rating DESC`;

    var finalResult = {
        statistics: {
            dailycounter: 0,
            gendercount: null,
            serviceincome: null,
            customersage: null,
            citycount: null,
            businessincome: null,
            stronghours: null,
            bestcustomer: null,
            ratingcount: null,
        },
    };

    db.query(counterQuery)
    .then(result => finalResult.statistics.dailycounter = result.rows[0].dailycounter)
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(genderQuery).then(result => {
            var gendercount = { category: [], amount: [] }
            var rows = result.rows
            rows.map((row) => {
                gendercount.category.push(row.gender)
                gendercount.amount.push(parseInt(row.count))
            })
            finalResult.statistics.gendercount = gendercount;
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(serviceQuery).then(result => {
            const serviceincome = { category: [], amount: [],}
            const rows = result.rows
            rows.map((row) => {
                serviceincome.category.push(row.name)
                serviceincome.amount.push(parseInt(row.total))    
            })
            finalResult.statistics.serviceincome = serviceincome;
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(ageQuery).then(result => {
        var data = { "13-17": 0, "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55-65": 0, "65+": 0 }
        var rows = result.rows
        rows.map((row) => {
            if (row.age >= 13 && row.age <= 17) { data["13-17"] += 1 }
            else if (row.age >= 18 && row.age <= 24) { data["18-24"] += 1 }
            else if (row.age >= 25 && row.age <= 34) { data["25-34"] += 1 }
            else if (row.age >= 35 && row.age <= 44) { data["35-44"] += 1 }
            else if (row.age >= 45 && row.age <= 54) { data["45-54"] += 1 }
            else if (row.age >= 55 && row.age <= 65) { data["55-65"] += 1 }
            else if (row.age >= 65){ data["65+"] += 1 }
        })
        var customersage = { category: [], amount: [] }

        Object.keys(data).forEach((key) => {
            customersage.category.push(key)
            customersage.amount.push(parseInt(data[key]))
        });
        finalResult.statistics.customersage = customersage;
    })
    .catch(err => res.status(404).send(`${err.stack}`))
    
    db.query(cityQuery).then(result => {
        var citycount = { category: [], amount: [] }
        var rows = result.rows            
        rows.map((row) => {
            citycount.category.push(row.city)
            citycount.amount.push(parseInt(row.count))
        })
        finalResult.statistics.citycount = citycount;
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    
    db.query(incomeQuery).then(result => {
        var rows = result.rows
        var businessincome = { category: [], amount: [] }
        m = moment().month() +1
        var j = m
        while (j != 12){
            j++
            businessincome.category.push(j.toString())
        }
        for (var i = 0; i < m; i++)
        businessincome.category.push((i + 1).toString())
        
        var amount = new Array(12).fill(0)   
        rows.map((row) => {
            var date = new Date(row.starttime)
            const index = businessincome.category.findIndex((element) => date.getUTCMonth() == element) +1
            amount[index] += parseInt(row.total, 10)
        })
        
        amount.forEach (month => {
            businessincome.amount.push(month)
        })
        finalResult.statistics.businessincome = businessincome
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(hoursQuery).then(result => {
        var data = { "0-9": 0, "9-12": 0, "12-15": 0, "15-18": 0, "18-24": 0, }
        var rows = result.rows
        rows.map((row) => {
            if (row.hour > 0 && row.hour <= 9) { data["0-9"] += parseInt(row.popularity, 10) }
            else if (row.hour > 9 && row.hour <= 12) { data["9-12"] += parseInt(row.popularity, 10) }
            else if (row.hour > 12 && row.hour <= 15) { data["12-15"] += parseInt(row.popularity, 10) }
            else if (row.hour > 15 && row.hour <= 18) { data["15-18"] += parseInt(row.popularity, 10) }
            else if (row.hour > 18 && row.hour <= 24) { data["18-24"] += parseInt(row.popularity, 10) }
        })
        stronghours = { category: [], amount: [] }
        Object.keys(data).forEach((key) => {
            stronghours.category.push(key)
            stronghours.amount.push(parseInt(data[key]))
        });
        finalResult.statistics.stronghours = stronghours;
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(customersQuery).then(result => {
        var bestcustomer = { category: [], amount: [] }
        var rows = result.rows
        rows.map((row) => {
            bestcustomer.category.push(row.name)
            bestcustomer.amount.push(parseInt(row.total))
        })
        finalResult.statistics.bestcustomer = bestcustomer;
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))

    db.query(ratingQuery).then(result => {
        var ratingcount = { category: [], amount: [] }
        var rows = result.rows
        rows.map((row) => {
            ratingcount.category.push(row.rating)
            ratingcount.amount.push(parseInt(row.count))
        })
        finalResult.statistics.ratingcount = ratingcount;
        res.json(finalResult)
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
    statRating: statRating,
    getAllStatisticsByBusinessID: getAllStatisticsByBusinessID
}
