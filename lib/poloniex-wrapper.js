module.exports = (function() {
    var Poloniex = require( __dirname + '/poloniex.js' );

    Poloniex.prototype.getTest = function(){
        console.log("test");
    }

    return new Poloniex( process.env.POLONIEX_API_KEY,
                         process.env.POLONIEX_API_KEY_SECRET);


})();
