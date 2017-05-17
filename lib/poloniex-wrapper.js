module.exports = (function() {
    var Poloniex = require( __dirname + '/poloniex.js' );
    
    return new Poloniex( process.env.POLONIEX_API_KEY,
                         process.env.POLONIEX_API_KEY_SECRET);


})();
