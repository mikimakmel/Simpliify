const express = require('express');
const cors = require('cors');
const userCtl = require('./controllers/user.ctl');
const customerCtl = require('./controllers/customer.ctl');
const businessCtl = require('./controllers/business.ctl');
const serviceCtl = require('./controllers/service.ctl');
const orderCtl = require('./controllers/order.ctl');
const statisticsCtl = require('./controllers/statistics.ctl');
// const fileupload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cors());
// app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*** All routes ***/

/*** User routes ***/
app.get('/user/getAllUsers', userCtl.getAllUsers);                              // checked and ready
app.get('/user/getUserByEmail', userCtl.getUserByEmail);                        // checked and ready
app.get('/user/getUserByID', userCtl.getUserByID);                              // checked and ready
app.post('/user/updateUserDetails', userCtl.updateUserDetails);                 // need to take care of address creation

/*** Customer routes ***/

/*** Order routes ***/
app.post('/order/createNewOrder', orderCtl.createNewOrder);                     // need to take care of service creation
app.post('/order/updateOrderStatus', orderCtl.updateOrderStatus);               // need to add order ID to table
app.get('/order/getAllCustomerOrders', orderCtl.getAllCustomerOrders);          // checked and ready

/*** Business routes ***/
app.get('/business/getAllBusinesses', businessCtl.getAllBusinesses);            // checked and ready
app.get('/business/getBusinessesByID', businessCtl.getBusinessesByID);          // checked and ready
app.get('/business/getAllCustomers', businessCtl.getAllCustomers);              // checked and ready
app.get('/business/getAllBusinessesByCategory', businessCtl.getAllBusinessesByCategory);  // checked and ready
app.put('/business/deleteYourBusiness', businessCtl.deleteYourBusiness);  // can't delete because of foriegn keys

/*** Service routes ***/

/*** Statistics routes ***/
app.get('/statistics/getCustomersSortedByAge', statisticsCtl.getCustomersSortedByAge);  
app.get('/statistics/getDailyCounter', statisticsCtl.getDailyCounter); 




// in case of a wrong route creating a fallback.
app.all('*', (req, res) => { res.send("Wrong route, please try again.") });

app.listen(port, () => console.log(`Listening on port ${port}`));



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