const { degrees, radians } = require('radians')
const math = require('mathjs')
const db = require('../database')
const { ConstantNodeDependencies } = require('mathjs')

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



createBusinessCard = (id, price, details) => {
    return {
        businessID: id,
        coverPic: details.coverPic, // the first pic from the carousel table 
        businessName: details.businessName,
        category: details.category,
        minPrice: price.min, // the cheapest service the business offers
        maxPrice: price.max,  // the most expensive service the business offers
        rating: details.rating
      }
}


priceRange = (filterRows, minPrice, maxPrice) => {
    var price = {min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER}
    var flag = false
    var id = -1
    var businesses = []

    var details = {
        coverPic: '',
        businessName: '',
        category: '',
        rating: -1
    }

    filterRows.map((item) => {
        if (id == -1){
            id = item.businessid
        }

        // if new business id -> add item to results and reset data
        if (id != item.businessid){
            if (flag){
                businesses.push(createBusinessCard(id, price, details))
            }
            id = item.businessid
            price.max = Number.MIN_SAFE_INTEGER
            price.min = Number.MAX_SAFE_INTEGER
            details.coverPic = ''
            flag = false
        } else {
            id = item.businessid
            // update new business details
            if (details.coverPic == ''){
                details.coverPic = item.img
                details.businessName = item.businessname
                details.rating = item.rating
                details.category = item.category
            }
            
            if (!maxPrice){
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
    // add last item
    if (flag){
        businesses.push(createBusinessCard(id, price, details))
    }


    return businesses
    
}


// if string choosen and radius is defulte -> don't enter radius.
search = (req, res) => {
    // properties choosen by client (lon & lat is required!)
    const lon = req.body.lon;
    const lat = req.body.lat;
    var radius = req.body.radius;
    var searchQuery = req.body.searchQuery;
    var category = req.body.category;
    var rating = req.body.rating;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;

    searchQuery = searchQuery.replace(/\s+/g,' ').trim()
    // Presents all real businesses we created (most of the businesses is fake)
    if (! searchQuery){
        searchQuery = 'Boutique'
    }
    
    console.log('searchQuery: ' + searchQuery + ', radius: ' + 
        radius + ',  category: ' + category + ',   rating: ' 
        + rating + ',  lon: ' + lon + ',  lat: ' + lat + ',  minPrice: '
        + minPrice + ',  maxPrice: ' + maxPrice);


    // default values in frontend
    // searchQuery: '',
    // distance: 10,
    // minPrice: '0',
    // maxPrice: null,
    // rating: 0,
    // category: 'All',

    // varaibles declarations - radius
    var coordinates
    var BB
    var minLat
    var maxLat
    var minLon
    var maxLon
    var r

    console.log('Radius choosen by user is ', radius)
    coordinates = {
        Lon: lon, 
        Lat: lat
    }
    if (radius){
        BB = calculateBBRdius(radius, coordinates)
        minLat = BB.minLat
        maxLat = BB.maxLat
        minLon = BB.minLon
        maxLon = BB.maxLon
        r = BB.r
    }

    // category
    if (category == 'All'){
        strCategory = `Category IS NOT NULL`
    } else {
        strCategory = `LOWER(Category) = LOWER('${category}')`
    }

    // radius
    if (radius){
        strRadius1 = `Coordinates[0] AS Lat, Coordinates[1] AS Lng,`
        strRadius2 = `INNER JOIN Address ON (Business.Address = Address.AddressID)`
        strRadius3 = `AND (Coordinates[0] >= ${minLat})
                     AND (Coordinates[0] <= ${maxLat})
                     AND (Coordinates[1] >= ${minLon})
                     AND (Coordinates[1] <= ${maxLon})`

        strRadius4 = `,Coordinates[0], Coordinates[1]`
    } else {
        strRadius1 = ``
        strRadius2 = ``
        strRadius3 = ``
        strRadius4 = ``
    }

    // Build query by the properties choosen by the client
    var query = `SELECT Business.BusinessID, Business.Name AS BusinessName, Category,
                    Service.name AS ServiceName, Service.price as price, Carousel.imagelink AS img,`
    query = query.concat(' ', strRadius1)          
    query = query.concat(' ', `AVG(Rating)::NUMERIC(2,1) AS Rating FROM Business
                                INNER JOIN Carousel ON (Business.BusinessID = Carousel.BusinessID)
                                INNER JOIN Service ON (Business.BusinessID = Service.BusinessID)
                                INNER JOIN Review ON (Business.BusinessID = Review.Business)
                                INNER JOIN Tags ON (Business.BusinessID = Tags.BusinessID)`)            
    query = query.concat(' ', strRadius2)
    query = query.concat(' ', `WHERE`)           
    query = query.concat(' ', strCategory)
    query = query.concat(' ', `AND ((Service.Name ILIKE '%${searchQuery}%') OR (Business.Name ILIKE '%${searchQuery}%') OR (Tags.Tag ILIKE '%${searchQuery}%'))`)
    query = query.concat(' ', strRadius3)
    query = query.concat(' ', `GROUP BY Business.Businessid, Service.serviceid, Carousel.imagelink`)
    query = query.concat(' ', strRadius4)
    query = query.concat(' ', `ORDER BY Businessid`)
    
    db.query(query)
    .then(result => {
        var filterRows = result.rows;

        if (radius) {
            const coordinates = {lon: lon, lat: lat, r:r}
            radiusFilter(coordinates, filterRows)
        }

        if (rating){
            filterRows = ratingFilter(rating, filterRows)
        }

        filterRows = priceRange(filterRows, minPrice, maxPrice)

        res.json(filterRows)
    })
    .catch(err => res.status(404).send(`Query error: ${err.stack}`))
}


module.exports = {
    search: search 
} 
