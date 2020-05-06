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



createBusinessCard = (item, price) => {
    return {
        businessID: item.businessid,
        coverPic: '', // the first pic from the carousel table 
        businessName: item.businessname,
        category: item.category,
        minPrice: price.min, // the cheapest service the business offers
        maxPrice: price.max,  // the most expensive service the business offers
        rating: item.rating
      }
}


priceRange = (filterRows, minPrice, maxPrice) => {
    var price = {min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER}
    var flag = false
    var id = -1
    var businesses = []

    filterRows.map((item) => {
        if (id == -1){
            id = item.businessid
        }
        if (id != item.businessid){
            if (flag){
                businesses.push(createBusinessCard(item, price))
            }
            id = item.businessid
            price.max = Number.MIN_SAFE_INTEGER
            price.min = Number.MAX_SAFE_INTEGER
        } else {
            id = item.businessid
            if (maxPrice == 'null'){
                flag = true
            }
            else if ((item.price >= minPrice) && (item.price <= maxPrice)){
                flag = true
            }
            if (item.price < price.min){
                price.min = item.price
            }
            if (item.price > price.max){
                price.max = item.price
            }
        }
    })
    return businesses
    
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
    var query = `SELECT Business.BusinessID, Business.Name AS BusinessName, Category,
                    Service.name AS ServiceName, Service.price as price,
                    Coordinates[0] AS Lat, Coordinates[1] AS Lng, AVG(Rating)::NUMERIC(2,1) AS Rating FROM Business
                    INNER JOIN Service ON (Business.BusinessID = Service.BusinessID)
                    INNER JOIN Address ON (Business.Address = Address.AddressID)
                    INNER JOIN Review ON (Business.BusinessID = Review.Business) WHERE`
    query = query.concat(' ', strCategory)
    query = query.concat(' ', `AND
                                ((Service.Name ILIKE '%${searchQuery}%') OR (Business.Name ILIKE '%${searchQuery}%')) AND
                                (Coordinates[0] >= ${minLat}) AND
                                (Coordinates[0] <= ${maxLat}) AND
                                (Coordinates[1] >= ${minLon}) AND
                                (Coordinates[1] <= ${maxLon})
                                GROUP BY Business.Businessid, Service.serviceid, Coordinates[0], Coordinates[1] ORDER BY Businessid`)

    
    
    db.query(query)
    .then(result => {

        var rows = result.rows

        const coordinates = {lon: lon, lat: lat, r:r}
        var filterRows = radiusFilter(coordinates, rows)

        if (rating){
            filterRows = ratingFilter(rating, rows)
        }
        
        filterRows = priceRange(filterRows, minPrice, maxPrice)

        res.json(filterRows)
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


module.exports = {
    search: search 
} 
