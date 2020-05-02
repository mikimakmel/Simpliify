const { degrees, radians } = require('radians')
const math = require('mathjs')
const db = require('../database')


radiusFilter = (coordinates, rows) => {
    const lon = coordinates.lon
    const lat = coordinates.lat
    const r = coordinates.r
    const filterRows = rows.filter((row) => {
        const coordinates = row.coordinates
        return math.acos(math.sin(lat) * math.sin(degrees(coordinates.x)) + math.cos(lat) * math.cos(degrees(coordinates.x)) * math.cos(degrees(coordinates.y) - (lon))) <= r
    })
    return filterRows
}

searchQueryFilter = (s, rows) => {
    filterRows = rows.filter(row => {
        const name = row.name.toLowerCase()
        if (name.includes(s.toLowerCase())){
            return true
        }
    })
    return filterRows
}

categoryFilter = (category, rows) => {
    return rows
}

ratingFilter = (rows) => {
    return rows
}

applyFilters = (rows, category=null, radius=null, searchString=null, rating=null, coordinates=null) => {

    console.log("Apply filters: ")
    var filterRows = rows

    if (category !== null){
        console.log("Apply category")
        filterRows = categoryFilter(category, filterRows)
    }
    if (radius !== null){
        console.log("Apply radius")
        filterRows = radiusFilter(coordinates, filterRows)
    }
    if (searchString !== null){
        console.log("Apply searchString")
        filterRows = searchQueryFilter(searchString, filterRows)

    }
    if (rating !== null){
        console.log("Apply rating")
        filterRows = ratingFilter(filterRows)
    }
    return filterRows
}


search = (req, res) => {
    console.log("Search function");
    // search by radius parameters:
    const radius = req.body.radius
    const lon = req.body.lon
    const lat = req.body.lat
    const searchQuery = req.body.searchQuery
    const category = req.body.category
    const rating = req.body.rating
    const ratNum = req.body.ratNum

    
    if (category){
        // results: business details, address, rating, service, tag
        
        // const query = ...



    }

    else if (radius){
        console.log('Query by radius')
        // results: business details, address, rating, service, tag
         // Earth radius
        const R = 6371

        // angular radius 
        const r = (req.body.radius * 0.001)/R;

        // user location: Latitude & Longitude
        // got degrees, convert to radians
        const lon = degrees(req.body.lon);
        const lat = degrees(req.body.lat);

        // query circle = the circle with radius r when the user's location it center
        // bounding box that contains the query circle
        dlon = math.asinh(math.sin(r)/math.cos(lat))
        const maxLon = radians(lon + dlon)
        const minLon = radians(lon - dlon)
        const maxLat = radians(lat + r)
        const minLat = radians(lat - r)

        const query = `SELECT * FROM Business FULL OUTER JOIN Address ON
                        (Business.Address = Address.AddressID)
                        WHERE
                        (coordinates[0] >= ${minLat}) AND 
                        (coordinates[0] <= ${maxLat}) AND 
                        (coordinates[1] >= ${minLon}) AND 
                        (coordinates[1] <= ${maxLon}) AND 
                        BusinessID IS NOT NULL`

        db.query(query)
            .then(result => {
                const coordinates = {lon: lon, lat: lat, r:r}
                var rows = radiusFilter(coordinates, result.rows)
                var filterRows = applyFilters(rows, null, radius, searchQuery, rating, coordinates)
                res.json(filterRows)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    }

    else if (searchQuery){
        // results: business details, address, rating, service, tag

        const query = `SELECT * FROM Business WHERE LOWER(name) LIKE LOWER('%${searchQuery}%')`

        db.query(query)
            .then(result => {

                var rows = result.rows
                console.log(rows)
                var filterRows = applyFilters(rows, null, null, searchQuery, rating, null)

                res.json(filterRows)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    }

    else if (rating){
        // results: business details, address, rating, service, tag
        // const query = `SELECT * FROM Business WHERE LOWER(name) LIKE LOWER('%${searchQuery}%')`

        db.query(query)
            .then(result => {

                var rows = result.rows
                var filterRows = applyFilters(rows, null, null, null, rating, null)

                res.json(filterRows)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))


    }
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