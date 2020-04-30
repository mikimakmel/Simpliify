const express = require('express');
const userCtl = require('./controllers/user.ctl');
const customerCtl = require('./controllers/customer.ctl');
const businessCtl = require('./controllers/business.ctl');
const serviceCtl = require('./controllers/service.ctl');
const orderCtl = require('./controllers/order.ctl');
const reviewCtl = require('./controllers/review.ctl');
const statisticsCtl = require('./controllers/statistics.ctl');
const searchCtl = require('./controllers/search.ctl')
const fileupload = require('express-fileupload');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 4000;

app.set('port', port);
app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*** User routes ***/
app.get('/user/getAllUsers', userCtl.getAllUsers);                              // READY
app.post('/user/getUserByEmail', userCtl.getUserByEmail);                       // READY
app.post('/user/getUserByID', userCtl.getUserByID);                             // READY
app.put('/user/updateUserDetails', userCtl.updateUserDetails);                  // READY
app.post('/user/createNewUser', userCtl.createNewUser);                         // wrong birthday when sending from frontend, need to add profile picture

/*** Customer routes ***/
app.post('/customer/addBusinessToFavorites', customerCtl.addBusinessToFavorites);               // READY
app.post('/customer/removeBusinessFromFavorites', customerCtl.removeBusinessFromFavorites);     // READY
app.get('/customer/getFavoritesList', customerCtl.getFavoritesList);                            // READY

/*** Order routes ***/
app.post('/order/createNewOrder', orderCtl.createNewOrder);                     // READY
app.put('/order/updateOrderStatus', orderCtl.updateOrderStatus);                // READY
app.get('/order/getAllCustomerOrders', orderCtl.getAllCustomerOrders);          // READY - Dosen't show all the orders?
app.get('/order/getAllBusinessOrders', orderCtl.getAllBusinessOrders);          // READY

/*** Business routes ***/
app.get('/business/getAllBusinesses', businessCtl.getAllBusinesses);                        // READY
app.post('/business/getBusinessesByID', businessCtl.getBusinessesByID);                     // READY
app.get('/business/getAllCustomers', businessCtl.getAllCustomers);                          // READY
app.get('/business/getBusinessAvailability', businessCtl.getBusinessAvailability);          // READY
app.get('/business/getCategoriesList', businessCtl.getCategoriesList);                      // READY
app.get('/business/getAllBusinessesByCategory', businessCtl.getAllBusinessesByCategory);    // READY
app.post('/business/createNewBusiness', businessCtl.createNewBusiness);                     // READY, needs check what about images
app.post('/business/deleteYourBusiness', businessCtl.deleteYourBusiness);                   // READY
app.put('/business/updateBusinessDetails', businessCtl.updateBusinessDetails);              // READY, needs check what about images

/*** Service routes ***/
app.get('/service/getAllServices', serviceCtl.getAllServices);                          // READY
app.get('/service/getServiceByID', serviceCtl.getServiceByID);                          // READY
app.post('/service/getAllBusinessServices', serviceCtl.getAllBusinessServices);         // READY
app.post('/service/createNewService', serviceCtl.createNewService);                     // READY
app.post('/service/updateServiceDetails', serviceCtl.updateServiceDetails);             // READY
app.post('/service/deleteService', serviceCtl.deleteService);                           // READY

/*** Statistics routes ***/
app.get('/statistics/getDailyCounter', statisticsCtl.getDailyCounter);                  // READY
app.get('/statistics/getCustomersSortedByAge', statisticsCtl.getCustomersSortedByAge);  // READY

/*** Review routes ***/
app.post('/review/createNewReview', reviewCtl.createNewReview);                  // READY
app.get('/review/getBusinessReviews', reviewCtl.getBusinessReviews);             // READY
app.post('/review/deleteReview', reviewCtl.deleteReview);                        // READY

/*** Search routes ***/
app.get('/search/searchByName', searchCtl.searchByName);
app.get('/search/searchByRadius', searchCtl.searchByRadius);

// in case of a wrong route creating a fallback.
app.all('*', (req, res) => { res.send("Wrong route, please try again.") });

app.listen(port, () => console.log(`Listening on port ${port}`));


// New Queries //
// SELECT enum_range(NULL::categories) as Categories

/* Return all businesses' AVG Rating and order by best to worst */
/* SELECT Business, Business.name, to_char(AVG (review.rating),'9D9') AS avgrating FROM Review INNER JOIN Business ON Review.Business = Business.BusinessID GROUP BY REVIEW.Business, business.businessid ORDER BY avgrating DESC */

/* Increment visitor in a business */
/* UPDATE Business SET Dailycounter = Dailycounter + 1 WHERE BusinessID=${businessID} */

/* Best Customer in a business */
/* SELECT Customer, Business, COUNT(Customer) FROM Orders WHERE Business=${Business} GROUP BY Customer, Orders.Business ORDER BY Count DESC */

/* Avarage of a business rating in the last day + week + month */
/* SELECT Business, (SELECT to_char(AVG (review.rating),'9D9') as avgperday FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 DAY')::DATE AND NOW()::DATE GROUP BY Review.Business), (SELECT to_char(AVG (review.rating),'9D9') as avgperweek FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 WEEK')::DATE AND NOW()::DATE GROUP BY Review.Business), (SELECT to_char(AVG (review.rating),'9D9') as avgpermonth FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 MONTH')::DATE AND NOW()::DATE GROUP BY Review.Business) FROM review WHERE Business=${Business} GROUP BY Review.Business */

/* Summary of revenue per service of specific business */
/* SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${Business} GROUP BY Orders.Service, Orders.Business, Service.Name */

/* Popularity of a bussiness's service by a certain hour */
/* SELECT Service, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders WHERE Business=${Business} GROUP BY Service, Hour ORDER BY Popularity DESC */

/* Popularity of a business by hours */
/* SELECT Business, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders WHERE Business=${Business} GROUP BY Business, Hour ORDER BY Popularity DESC */

/* Return a business with his services' names */
/* SELECT Business.BusinessID, Service.Name as Service FROM Business LEFT OUTER JOIN Service ON (Business.BusinessID = Service.BusinessID) WHERE Business.BusinessID=${Business} */

/* Return sum of customers by gender */
/* SELECT Gender, COUNT(Gender) FROM Orders LEFT OUTER JOIN Users ON (Orders.customer = Users.UserID) WHERE Business.BusinessID=${Business} GROUP BY Gender */

/* Return sum of customers by city */
/* SELECT Address.City, COUNT(Address.City) FROM Orders INNER JOIN Users ON (Orders.Customer = Users.UserID) INNER JOIN Address ON (Users.Address = Address.AddressID) WHERE Orders.Business=${Business} GROUP BY Address.City */

/* Most profitable customers in a business */
/* SELECT Orders.Customer, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${Business} GROUP BY Orders.Customer ORDER BY Total DESC */

/* Cancelation history of a business */
/* SELECT * FROM Orders WHERE Status = 'Cancelled' AND Business=${Business} */

/* Orders between date A and date B */
/* SELECT * FROM Orders WHERE Starttime BETWEEN SYMMETRIC '2020-06-11'::timestamp AND '2020-06-13'::timestamp AND Business=${Business} */

// const fileupload = require('express-fileupload');

// app.use(fileupload());

// app.post('/uploadPhoto', (req, res) => {
//     // console.log('file', req.files);
//     const file = req.files.photo;

//     file.mv("./" + file.name + '.jpg', (err, result) => {
//         if(err) {
//             res.send({ message: 'failed' });
//             throw err;
//         }
//         else {
//             res.send({ message: 'success' });
//         }
//     })
// });