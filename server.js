var crypto = require('crypto');
var request = require('request');

request('https://poloniex.com/public?command=returnTicker', function (error, response, body) {
    if (!error && response.statusCode == 200) {

        console.log(body);
     }
});

// create curl request url for both private and public apis

// create signature for private request with crypto and hmacsha signature

// create class for access to object or follow poloniex api method for creating formulas

// create dashboard to convert all traded coins to dollar amount

// create script to convert fees to get profit or loss amount

// 
