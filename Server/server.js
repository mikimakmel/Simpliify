const express = require('express');
const intervals = require('./intervals')
const userCtl = require('./controllers/user.ctl');
const customerCtl = require('./controllers/customer.ctl');
const businessCtl = require('./controllers/business.ctl');
const serviceCtl = require('./controllers/service.ctl');
const orderCtl = require('./controllers/order.ctl');
const reviewCtl = require('./controllers/review.ctl');
const statisticsCtl = require('./controllers/statistics.ctl');
const searchCtl = require('./controllers/search.ctl')
const addressCtl = require('./controllers/address.ctl')
// const fileupload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cors());
// app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


setInterval(intervals.reminder, 12000);
setInterval(intervals.success, 12000);

/*** Address route ***/
app.put('/address/alignAllAddresses', addressCtl.alignAllAddresses);

/*** User routes ***/
app.get('/user/getAllUsers', userCtl.getAllUsers);
app.post('/user/getUserByEmail', userCtl.getUserByEmail);
app.post('/user/getUserByID', userCtl.getUserByID);
app.put('/user/updateUserDetails', userCtl.updateUserDetails);
app.put('/user/updateUserPushToken', userCtl.updateUserPushToken);
app.post('/user/getUserPushToken', userCtl.getUserPushToken);
app.post('/user/createNewUser', userCtl.createNewUser);
app.put('/user/updateUserProfilePic', userCtl.updateUserProfilePic);

/*** Customer routes ***/
app.post('/customer/addBusinessToFavorites', customerCtl.addBusinessToFavorites);
app.post('/customer/removeBusinessFromFavorites', customerCtl.removeBusinessFromFavorites);
app.post('/customer/getFavoritesList', customerCtl.getFavoritesList);

/*** Order routes ***/
app.post('/order/createNewOrder', orderCtl.createNewOrder);
app.put('/order/updateOrderStatus', orderCtl.updateOrderStatus);
app.post('/order/getAllCustomerOrders', orderCtl.getAllCustomerOrders);
app.post('/order/getAllBusinessOrders', orderCtl.getAllBusinessOrders);          
app.post('/order/getAllAvailableBusinessTime', orderCtl.getAllAvailableBusinessTime);                      
app.post('/order/checkIfCustomerReceiveServiceFromBusiness', orderCtl.checkIfCustomerReceiveServiceFromBusiness);

/*** Business routes ***/
app.get('/business/getAllBusinesses', businessCtl.getAllBusinesses);
app.post('/business/getBusinessByID', businessCtl.getBusinessByID);
app.post('/business/getBusinessByManagerID', businessCtl.getBusinessByManagerID);
app.get('/business/getAllCustomers', businessCtl.getAllCustomers);
app.get('/business/getBusinessAvailability', businessCtl.getBusinessAvailability);
app.get('/business/getCategoriesList', businessCtl.getCategoriesList);
app.get('/business/getTagsList', businessCtl.getTagsList);
app.get('/business/getAllBusinessesByCategory', businessCtl.getAllBusinessesByCategory);
app.post('/business/createNewBusiness', businessCtl.createNewBusiness); 
app.post('/business/deleteYourBusiness', businessCtl.deleteYourBusiness);
app.put('/business/updateBusinessDetails', businessCtl.updateBusinessDetails);
app.put('/business/incrementBusinessDailyCounter', businessCtl.incrementBusinessDailyCounter);

/*** Service routes ***/
app.get('/service/getAllServices', serviceCtl.getAllServices);
app.get('/service/getServiceByID', serviceCtl.getServiceByID);
app.post('/service/getAllBusinessServices', serviceCtl.getAllBusinessServices);
app.post('/service/createNewService', serviceCtl.createNewService);
app.post('/service/updateServiceDetails', serviceCtl.updateServiceDetails);
app.post('/service/deleteService', serviceCtl.deleteService);

/*** Statistics routes ***/
app.post('/statistics/statDailyCounter', statisticsCtl.statDailyCounter);
app.post('/statistics/statByGender', statisticsCtl.statByGender);
app.post('/statistics/statByService', statisticsCtl.statByService);
app.post('/statistics/statByAge', statisticsCtl.statByAge);
app.post('/statistics/statByAddress', statisticsCtl.statByAddress);
app.post('/statistics/statTotalIncome', statisticsCtl.statTotalIncome);
app.post('/statistics/statStrongHours', statisticsCtl.statStrongHours);
app.post('/statistics/statTop10Customers', statisticsCtl.statTop10Customers);
app.post('/statistics/statRating', statisticsCtl.statRating);
app.post('/statistics/getAllStatisticsByBusinessID', statisticsCtl.getAllStatisticsByBusinessID);

/*** Review routes ***/
app.post('/review/createNewReview', reviewCtl.createNewReview);
app.post('/review/getUserReviewOnBusiness', reviewCtl.getUserReviewOnBusiness);
app.post('/review/getBusinessReviewsByQuantity', reviewCtl.getBusinessReviewsByQuantity);
app.post('/review/getBusinessReviews', reviewCtl.getBusinessReviews);
app.post('/review/deleteReview', reviewCtl.deleteReview);

/*** Search routes ***/
app.post('/search/search', searchCtl.search);


// in case of a wrong route creating a fallback.
app.all('*', (req, res) => { res.send("Wrong route, please try again.") });

app.listen(port, () => console.log(`Listening on port ${port}`));


// New Queries //
// SELECT enum_range(NULL::categories) as Categories

/* Return all businesses' AVG Rating and order by best to worst */
/* SELECT Business, Business.name, to_char(AVG (review.rating),'9D9') AS avgrating FROM Review INNER JOIN Business ON Review.Business = Business.BusinessID GROUP BY REVIEW.Business, business.businessid ORDER BY avgrating DESC */

/* Increment visitor in a business */
/* UPDATE Business SET Dailycounter = Dailycounter + 1 WHERE BusinessID=${businessID} */

/* Best Customers in a business (order by anoumt of orders per business) */
/* SELECT Customer, Business, COUNT(Customer) FROM Orders WHERE Business=${Business} GROUP BY Customer, Orders.Business ORDER BY Count DESC */

/* Avarage of a business rating in the last day + week + month */
/* SELECT Business, (SELECT to_char(AVG (review.rating),'9D9') as avgperday FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 DAY')::DATE AND NOW()::DATE GROUP BY Review.Business), (SELECT to_char(AVG (review.rating),'9D9') as avgperweek FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 WEEK')::DATE AND NOW()::DATE GROUP BY Review.Business), (SELECT to_char(AVG (review.rating),'9D9') as avgpermonth FROM review WHERE Business=${Business} AND reviewedat BETWEEN (NOW() - INTERVAL '1 MONTH')::DATE AND NOW()::DATE GROUP BY Review.Business) FROM review WHERE Business=${Business} GROUP BY Review.Business */

/* Summary of revenue per service of specific business */
/* SELECT Orders.Business, Orders.Service, Service.Name, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${Business} GROUP BY Orders.Service, Orders.Business, Service.Name */

/* Popularity of a bussiness's service by a certain hour */
/* SELECT Service, EXTRACT(HOUR FROM Starttime) as Hour, COUNT(EXTRACT(HOUR FROM Starttime)) AS Popularity FROM Orders WHERE Business=${Business} GROUP BY Service, Hour ORDER BY Popularity DESC */

/* Return a business with his services' names */
/* SELECT Business.BusinessID, Service.Name as Service FROM Business LEFT OUTER JOIN Service ON (Business.BusinessID = Service.BusinessID) WHERE Business.BusinessID=${Business} */

/* Most profitable customers in a business */
/* SELECT Orders.Customer, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${Business} GROUP BY Orders.Customer ORDER BY Total DESC */

/* Cancelation history of a business */
/* SELECT * FROM Orders WHERE Status = 'Cancelled' AND Business=${Business} */

/* Orders between date A and date B */
/* SELECT * FROM Orders WHERE Starttime BETWEEN SYMMETRIC '2020-06-11'::timestamp AND '2020-06-13'::timestamp AND Business=${Business} */

/* Business's revenew for the last X time*/
/* SELECT Orders.Business, Orders.Starttime::date, SUM(Service.Price) as Total FROM Orders LEFT OUTER JOIN Service ON (Orders.Service = Service.ServiceID) WHERE Orders.Business=${Business} AND Status='Confirmed' AND Orders.Starttime::date BETWEEN (NOW() - INTERVAL '1 WEEK') AND NOW() GROUP BY Orders.Starttime::date, Orders.Business ORDER BY Starttime */

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