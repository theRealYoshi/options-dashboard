var Poloniex = require('./lib/poloniex-wrapper.js');
var Test = require('./lib/test.js');

var t = Test.Poloniex;

// console.log(t()._getPrivateHeaders()); // gets "test"

var p = new t();
console.log(p.testFunction()); // In Prototype


return;


// create curl request url for both private and public apis

// create signature for private request with crypto and hmacsha signature

// create class for access to object or follow poloniex api method for creating formulas

// create dashboard to convert all traded coins to dollar amount

// create script to convert fees to get profit or loss amount
