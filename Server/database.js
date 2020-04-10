const { Client } = require("pg");
const conString = require('./elephantsqlUser');

const client = new Client(conString);

client.connect()
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(`DB connection error: ${err.stack}`))

module.exports = client;
