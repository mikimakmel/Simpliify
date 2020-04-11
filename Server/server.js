const express = require('express');
const userCtl = require('./controllers/user.ctl');
const customerCtl = require('./controllers/customer.ctl');
const businessCtl = require('./controllers/business.ctl');
const serviceCtl = require('./controllers/service.ctl');
const orderCtl = require('./controllers/order.ctl');
const reviewCtl = require('./controllers/review.ctl');
const statisticsCtl = require('./controllers/statistics.ctl');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*** User routes ***/
app.get('/user/getAllUsers', userCtl.getAllUsers);                              // READY
app.get('/user/getUserByEmail', userCtl.getUserByEmail);                        // READY
app.get('/user/getUserByID', userCtl.getUserByID);                              // READY
app.put('/user/updateUserDetails', userCtl.updateUserDetails);                  // READY
app.post('/user/createNewUser', userCtl.createNewUser);                         // READY

/*** Customer routes ***/
app.post('/customer/addBusinessToFavorites', customerCtl.addBusinessToFavorites);               // READY
app.post('/customer/removeBusinessFromFavorites', customerCtl.removeBusinessFromFavorites);     // READY
app.get('/customer/getFavoritesList', customerCtl.getFavoritesList);                            // READY

/*** Order routes ***/
app.post('/order/createNewOrder', orderCtl.createNewOrder);                     // need to take care of starttime
app.put('/order/updateOrderStatus', orderCtl.updateOrderStatus);                // READY
app.get('/order/getAllCustomerOrders', orderCtl.getAllCustomerOrders);          // dosen't show all the orders
app.get('/order/getAllBusinessOrders', orderCtl.getAllBusinessOrders);          // READY

/*** Business routes ***/
app.get('/business/getAllBusinesses', businessCtl.getAllBusinesses);                        // READY
app.get('/business/getBusinessesByID', businessCtl.getBusinessesByID);                      // READY
app.get('/business/getAllCustomers', businessCtl.getAllCustomers);                          // READY
app.get('/business/getBusinessAvailability', businessCtl.getBusinessAvailability);          // READY
app.get('/business/getAllBusinessesByCategory', businessCtl.getAllBusinessesByCategory);    // READY
app.post('/business/createNewBusiness', businessCtl.createNewBusiness);                     // READY, needs check what about images
app.post('/business/deleteYourBusiness', businessCtl.deleteYourBusiness);                   // can't delete because of foriegn keys
app.put('/business/updateBusinessDetails', businessCtl.updateBusinessDetails);              // READY, needs check what about images

/*** Service routes ***/
app.get('/service/getAllServices', serviceCtl.getAllServices);                          // READY
app.get('/service/getServiceByID', serviceCtl.getServiceByID);                          // READY
app.get('/service/getAllBusinessServices', serviceCtl.getAllBusinessServices);          // READY
app.post('/service/createNewService', serviceCtl.createNewService);                     // READY
app.put('/service/updateServiceDetails', serviceCtl.updateServiceDetails);              // READY
app.post('/service/deleteService', serviceCtl.deleteService);                           // READY

/*** Statistics routes ***/
app.get('/statistics/getDailyCounter', statisticsCtl.getDailyCounter);                  // READY
app.get('/statistics/getCustomersSortedByAge', statisticsCtl.getCustomersSortedByAge);  // 

/*** Review routes ***/
app.post('/review/createNewReview', reviewCtl.createNewReview);                  // READY, but needs check with time zone
app.get('/review/getBusinessReviews', reviewCtl.getBusinessReviews);             // READY
app.post('/review/deleteReview', reviewCtl.deleteReview);                        // READY


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