const { degrees, radians } = require('radians')
const math = require('mathjs')
const db = require('../database');

module.exports = {

    // basic search by name.
    // example:  {
    //     "businessid": "23",
    //     "address": "23",
    //     "manager": "138",
    //     "name": "McClure Inc",
    //     "category": "Pets",
    //     "phone": "0509861702",
    //     "website": "https://mcclureinc.com",
    //     "description": "Stand-alone foreground focus group",
    //     "dailycounter": 13698,
    //     "avatar": "https://robohash.org/nonminimaet.jpg?size=80x80&set=set1"
    // }
    async searchByName(req, res) {
        console.log("searchByName()");

        const name = req.body.name;

        const query = `SELECT * FROM Business WHERE name='${name}'`;
        
        db.query(query)
            .then(result => res.json(result.rows))
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },

    // search by radius.
    // lon=y lat=x
    async searchByRadius(req, res) {
        console.log("searchByRadius()");
        // Earth radius
        const R = 6371

        // angular radius 
        const r = (req.body.radius * 0.001)/R;

        // user location: Latitude & Longitude
        // got degrees, convert to radians
        const lon = degrees(req.body.lon);
        const lat = degrees(req.body.lat);
        console.log(lon, lat)

        // query circle = the circle with radius r when the user's location it center
        // bounding box that contains the query circle
        dlon = math.asinh(math.sin(r)/math.cos(lat))
        const maxLon = radians(lon + dlon)
        const minLon = radians(lon - dlon)
        const maxLat = radians(lat + r)
        const minLat = radians(lat - r)

        // 
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
                const rows = result.rows
                const filterRows = rows.filter((row) => {
                    const coordinates = row.coordinates
                    return math.acos(math.sin(lat) * math.sin(degrees(coordinates.x)) + math.cos(lat) * math.cos(degrees(coordinates.x)) * math.cos(degrees(coordinates.y) - (lon))) <= r
                })
                res.json(result.filterRows)
            })
            .catch(err => res.status(404).send(`Query error: ${err.stack}`))
    },
}