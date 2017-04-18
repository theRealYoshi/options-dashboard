console.log("Running...");

var crypto = require('crypto');
var request = require('request');

request('https://poloniex.com/public?command=returnTicker', function (error, response, body) {
    if (!error && response.statusCode == 200) {

        console.log(body) // Print the google web page.
     }
})
