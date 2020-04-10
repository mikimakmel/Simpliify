const express = require('express');
const cors = require('cors');
const userCtl = require('./controllers/user.ctl');
const customerCtl = require('./controllers/customer.ctl');
const businessCtl = require('./controllers/business.ctl');
const serviceCtl = require('./controllers/service.ctl');
const orderCtl = require('./controllers/order.ctl');
const reviewCtl = require('./controllers/review.ctl');
const statisticsCtl = require('./controllers/statistics.ctl');

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

/*** Order routes ***/
app.post('/order/createNewOrder', orderCtl.createNewOrder);                     // need to take care of service creation
app.put('/order/updateOrderStatus', orderCtl.updateOrderStatus);                // READY
app.get('/order/getAllCustomerOrders', orderCtl.getAllCustomerOrders);          // READY

/*** Business routes ***/
app.get('/business/getAllBusinesses', businessCtl.getAllBusinesses);                        // READY
app.get('/business/getBusinessesByID', businessCtl.getBusinessesByID);                      // READY
app.get('/business/getAllCustomers', businessCtl.getAllCustomers);                          // READY
app.get('/business/getAllBusinessesByCategory', businessCtl.getAllBusinessesByCategory);    // READY
app.put('/business/deleteYourBusiness', businessCtl.deleteYourBusiness);                    // can't delete because of foriegn keys

/*** Service routes ***/

/*** Statistics routes ***/
app.get('/statistics/getCustomersSortedByAge', statisticsCtl.getCustomersSortedByAge);  
app.get('/statistics/getDailyCounter', statisticsCtl.getDailyCounter); 

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