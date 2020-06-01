const db = require('../database');
const opencage = require('opencage-api-client');
const opencage_apikey = require('../opencageUser');

module.exports = {
    async alignAllAddresses(req, res) {
        console.log("alignAllAddresses()");

        const addressQuery = `SELECT * FROM Address WHERE Addressid > 1000 AND Addressid <= 1100`
        var lat = null
        var lng = null

        var street = null
        var city = null
        var country = null
        var fullAddress = null

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
              await callback(array[index], index, array);
            }
          }

        db.query(addressQuery)
        .then(result => 
        {
            asyncForEach(result.rows, async (address) => {
                street = address.street
                city = address.city
                country = address.country
                fullAddress = `${street}, ${city}, ${country}`
    
                await opencage.geocode({q: `'${fullAddress}'`, key: opencage_apikey})
                .then(data => 
                    { 
                        JSON.stringify(data)
                        if (data.status.code == 200 && data.results.length > 0)
                        {
                            lat = data.results[0].geometry.lat
                            lng = data.results[0].geometry.lng
                        }
                    })
                .catch(error => {console.log('error', error.message)});
                var updateQuery = `UPDATE Address SET Coordinates = (point(${lat}, ${lng})) WHERE AddressID = ${address.addressid};`
                console.log(updateQuery)
            })

            res.json("bla")
        })
        .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },
}