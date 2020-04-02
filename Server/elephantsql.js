var pg = require('pg');

var conString = "Ipostgres://uyjsosov:SL1FfYjnFAM_E4WgH_krDEvkMcNC10jd@balarama.db.elephantsql.com:5432/uyjsosov" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT * FROM "public"."address" LIMIT 10', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    // console.log(result.rows[0].theTime);
    console.log(result.rows[0]);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});
