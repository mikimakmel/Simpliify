const { degrees, radians } = require('radians')
const math = require('mathjs')
const db = require('../database')

// query circle -> the circle with radius that choosen by the client

// calculate the bounding box containing the query circle
calculateBBRdius = (radius, coordinates) => {
        var lon = coordinates.Lon
        var lat = coordinates.Lat
        console.log(lon, lat)
         // Earth radius
         const R = 6371

         // angular radius 
         const r = (radius)/R;
 
         // user location: Latitude & Longitude
         // got degrees, convert to radians
        lon = degrees(lon);
        lat = degrees(lat);
 
         // query circle = the circle with radius r when the user's location it center
         // bounding box that contains the query circle
         dlon = math.asinh(math.sin(r)/math.cos(lat))
         const maxLon = radians(lon + dlon)
         const minLon = radians(lon - dlon)
         const maxLat = radians(lat + r)
         const minLat = radians(lat - r)

         return {
             maxLon: maxLon,
             minLon: minLon,
             maxLat: maxLat,
             minLat: minLat,
             r: r
         }

}

// find results in circle query
radiusFilter = (coordinates, rows) => {
    const lon = degrees(coordinates.lon)
    const lat = degrees(coordinates.lat)
    const r = coordinates.r
    var filterRows = rows.filter((row) => {
        const rowLat = row.lat
        const rowLon = row.lng
        return math.acos(math.sin(lat) * math.sin(degrees(rowLat)) + math.cos(lat) * math.cos(degrees(rowLat)) * math.cos(degrees(rowLon) - (lon))) <= r
    })
    return filterRows
}


ratingFilter = (rate, rows) => {
    var filterRows = rows.filter((row) => {
        return row.rating >= rate
    })
    return filterRows
}


search = (req, res) => {
    console.log("Search function");
    // properties choosen by client (lon & lat is required!)
    const lon = req.body.lon;
    const lat = req.body.lat;
    var radius = req.body.radius;
    var searchQuery = req.body.searchQuery;
    var category = req.body.category;
    var rating = req.body.rating;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;


    console.log(searchQuery, )

    // default values in frontend
    // searchQuery: '',
    // distance: 10,
    // minPrice: '0',
    // maxPrice: null,
    // rating: 0,
    // category: 'All',

    console.log('Radius choosen by user is ', radius)
    const coordinates = {
        Lon: lon, 
        Lat: lat
    }

    const BB = calculateBBRdius(radius, coordinates)
    const minLat = BB.minLat
    const maxLat = BB.maxLat
    const minLon = BB.minLon
    const maxLon = BB.maxLon
    const r = BB.r

    // search query
    if (searchQuery == ""){
        console.log("String choosen by user is sempty")
    } else {
        console.log("String choosen by user:", searchQuery)
    }

    // category
    if (category == 'All'){
        console.log('Search for all categories')
        strCategory = `Category IS NOT NULL`
    } else {
        console.log("String chossen by user:", category)
        strCategory = `LOWER(Category) = LOWER('${category}')`
    }

    // Build query by the properties choosen by the client
    var query = `SELECT Business.BusinessID, Business.Address, Manager, Business.Name AS BusinessName, Category,
                    Service.name AS ServiceName, Phone, Website, Business.Description, Dailycounter, Avatar,
                    Coordinates[0] AS Lat, Coordinates[1] AS Lng, AVG(Rating)::NUMERIC(2,1) AS Rating FROM Business
                    LEFT JOIN Service ON (Business.BusinessID = Service.BusinessID)
                    LEFT JOIN Address ON (Business.Address = Address.AddressID)
                    LEFT JOIN Review ON (Business.BusinessID = Review.Business) WHERE`
    query = query.concat(' ', strCategory)
    query = query.concat(' ', `AND
                                ((Service.Name ILIKE '%${searchQuery}%') OR (Business.Name ILIKE '%${searchQuery}%')) AND
                                (Coordinates[0] >= ${minLat}) AND
                                (Coordinates[0] <= ${maxLat}) AND
                                (Coordinates[1] >= ${minLon}) AND
                                (Coordinates[1] <= ${maxLon})
                                GROUP BY Business.Businessid, Service.Name, Coordinates[0], Coordinates[1] ORDER BY Rating DESC`)

    
    
    db.query(query)
    .then(result => {

        var rows = result.rows

        const coordinates = {lon: lon, lat: lat, r:r}
        var filterRows = radiusFilter(coordinates, rows)

        if (rating){
            filterRows = ratingFilter(rating, rows)
        }

        res.json(filterRows)
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}

/* ULTIMATE FUCKING QUERY */
/* SELECT Business.BusinessID, Business.Address, Manager, Business.Name AS BusinessName, Category,
          Service.name AS ServiceName, Phone, Website, Business.Description, Dailycounter, Avatar,
          Coordinates[0] AS Lat, Coordinates[1] AS Lng, AVG(Rating)::NUMERIC(2,1) AS Rating FROM Business
          LEFT JOIN Service ON (Business.BusinessID = Service.BusinessID)
          LEFT JOIN Address ON (Business.Address = Address.AddressID)
          LEFT JOIN Review ON (Business.BusinessID = Review.Business) WHERE
          LOWER(Category) = LOWER('HEALTH') AND
          Service.Name ILIKE '%Health%' AND
          (Coordinates[0] >= ${minLat}) AND
          (Coordinates[0] <= ${maxLat}) AND
          (Coordinates[1] >= ${minLon}) AND
          (Coordinates[1] <= ${maxLon})
          GROUP BY Business.Businessid, Service.Name, Coordinates[0], Coordinates[1] ORDER BY Rating DESC */

// Explanation - 
// If you want to choose a specific category use: Category = 'Foo',
// If no specific category is required simply use: IS NOT NULL.
// e.g. Category IS NOT NULL
// If you want to check whether a service name contains a word use: %Foo%,
// If no specific category is required simply use: %%.
// I made sure that nothing is case sensitive so a correct input would be correct.
// Good Luck <3

module.exports = {
    search: search 
} 