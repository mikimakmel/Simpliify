const { degrees, radians } = require('radians')
const math = require('mathjs')
const db = require('../database')


radiusFilter = (radius, rows) => {
    return rows
}

searchQueryFilter = (s, rows) => {
    return rows
}

categoryFilter = (category, rows) => {
    return rows
}

ratingFilter = (num, rows) => {
    return rows
}

search = (req, res) => {
    console.log("Search function");
    const radius = req.body.radius
    const searchQuery = req.body.searchQuery
    const category = req.body.category
    const rating = req.body.rating

    if (category){
        // results: business details, address, rating, service, tag
        if (searchQuery){

        }

    }

    else if (radius){
        // results: business details, address, rating, service, tag
        if (searchQuery){

        }
    }

    else if (searchQuery){
        // results: business details, address, rating, service, tag
    }

    else if (rating){
        // results: business details, address, rating, service, tag
    }
}




module.exports = {
    search: search 
} 





// module.exports = {
//     // search by name in business name and in services.
//     // serach sring and sub-string
//     async searchByName(req, res) {
//         console.log("searchByName()");

//         const name = req.body.name;
//         // SELECT * FROM Business WHERE name LIKE '%${name}%'
//         const query = `SELECT * FROM Business WHERE name='${name}'`;
        
//         db.query(query)
//             .then(result => res.json(result.rows))
//             .catch(err => res.status(404).send(`Query error: ${err.stack}`))
//     },

//     // search by radius.
//     // lat=y lon=x
//     async searchByRadius(req, res) {
//         console.log("searchByRadius()");
//         // Earth radius
//         const R = 6371

//         // angular radius 
//         const r = (req.body.radius * 0.001)/R;

//         // user location: Latitude & Longitude
//         // got degrees, convert to radians
//         const lon = degrees(req.body.lon);
//         const lat = degrees(req.body.lat);
//         console.log(lon, lat)

//         // query circle = the circle with radius r when the user's location it center
//         // bounding box that contains the query circle
//         dlon = math.asinh(math.sin(r)/math.cos(lat))
//         const maxLon = radians(lon + dlon)
//         const minLon = radians(lon - dlon)
//         const maxLat = radians(lat + r)
//         const minLat = radians(lat - r)

//         const query = `SELECT * FROM Business FULL OUTER JOIN Address ON
//                         (Business.Address = Address.AddressID)
//                         WHERE
//                         (coordinates[0] >= ${minLat}) AND 
//                         (coordinates[0] <= ${maxLat}) AND 
//                         (coordinates[1] >= ${minLon}) AND 
//                         (coordinates[1] <= ${maxLon}) AND 
//                         BusinessID IS NOT NULL`

//         db.query(query)
//             .then(result => {
//                 const rows = result.rows
//                 // console.log(rows)
//                 const filterRows = rows.filter((row) => {
//                     const coordinates = row.coordinates
//                     return math.acos(math.sin(lat) * math.sin(degrees(coordinates.x)) + math.cos(lat) * math.cos(degrees(coordinates.x)) * math.cos(degrees(coordinates.y) - (lon))) <= r
//                 })
//                 // console.log(filterRows)
//                 res.json(filterRows)
//             })
//             .catch(err => res.status(404).send(`Query error: ${err.stack}`))
//     }

// }