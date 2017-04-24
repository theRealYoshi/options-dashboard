// module exports can return object or function
var crypto = require('crypto');
var request = require('request');

module.exports = (function(){

    var PUBLIC_API_URL = 'https://poloniex.com/public';
    var PRIVATE_API_URL = 'https://poloniex.com/tradingApi';

    function Poloniex(){

        this._getPrivateHeaders = function() { // params
            console.log("private headers");
        }

        return;
    };

    Poloniex.protoype = {
        constructor : Poloniex,
        private : function(){
            console.log("private");
        }
    };

    return Poloniex;

})();
