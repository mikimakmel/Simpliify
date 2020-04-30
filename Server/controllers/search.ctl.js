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




module.exports = {
    search: search 
} 