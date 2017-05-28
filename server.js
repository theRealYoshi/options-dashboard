require('dotenv').config();
var Poloniex = require('./lib/poloniex-wrapper.js');

var express = require('express');
var app = express();


app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// Poloniex.returnTicker(function(res, err) {
// 	console.log(res);
// 	console.log(err);
// });
// create dashboard to convert all traded coins to dollar amount

// create script to convert fees to get profit or loss amount
