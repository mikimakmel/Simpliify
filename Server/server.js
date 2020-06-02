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