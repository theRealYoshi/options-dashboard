require('dotenv').config();
var Poloniex = require('./lib/poloniex-wrapper.js');

Poloniex.returnTicker(function(res, err) {
	console.log(res);
	console.log(err);
});


return;


// create dashboard to convert all traded coins to dollar amount

// create script to convert fees to get profit or loss amount
