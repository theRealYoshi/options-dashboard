module.exports = (function() {
    var Polo = require( __dirname + '/poloniex.js' );
    var Poloniex = new Polo( process.env.POLONIEX_API_KEY,
                         process.env.POLONIEX_API_KEY_SECRET);

    Polo.prototype.getAllBalances = function() {
        var usdCurrencies = Poloniex.getUsdCurrencyPairs();
        var completeBalances = Poloniex.getCompleteBalances();
        var marginAccountSummary = Poloniex.getMarginAccountSummary();
        var marginPositions = Poloniex.getMarginPositions();
        //Return values are discarded but functions still run if any test fails
        return Promise.all([ usdCurrencies, completeBalances, marginAccountSummary, marginPositions])
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            console.log(error);
            return false;
        });
    }

    Polo.prototype.getUsdCurrencyPairs = function() {
        return new Promise(function(fulfill, reject) {
            Poloniex.returnTicker(function(error, data) {
                if (error) { reject(error); }

                var usdCurrencies = {};
                Object.keys(data).forEach(function(key) {
                    if (key.indexOf("USDT") !== -1 ) {
                        var usdCurrencyObj = data[key];
                        key = key.replace(/USDT_/g, "");
                        usdCurrencies[key] = usdCurrencyObj;
                    }
                });
                fulfill({usdCurrencies : usdCurrencies});
            });
        });
    }

    Polo.prototype.getCompleteBalances = function() {
        return new Promise(function(fulfill, reject) {
            Poloniex.returnCompleteBalances(function(error, data) {
                if (error) { reject(error); }
                var completeBalances = {};

                Object.keys(data).forEach(function(key) {
                    var currencyObj = data[key];
                    if (currencyObj.available > 0 ||
                        currencyObj.onOrders > 0  ||
                        currencyObj.btcValue > 0 ) {
                        completeBalances[key] = currencyObj;
                    }
                });
                fulfill({ completeBalances : completeBalances});
            });
        });
    }

    // types of accounts: "exchange", "margin", "lending"
    Polo.prototype.getAvailableAccountBalances = function(accountType) {
        accountType = accountType ? accountType : "margin";
        return new Promise(function(fulfill, reject) {
            Poloniex.returnAvailableAccountBalances(accountType, function(error, data) {
                if (error) { reject(error); }
                fulfill(data);
            });
        });
    }

    // returns currency pairs
    Polo.prototype.getTradeableBalances = function() {
        return new Promise(function(fulfill, reject) {
            Poloniex.returnTradableBalances(function(error, data) {
                if (error) { reject(error); }
                fulfill(data);
            })
        });
    }

    Polo.prototype.getMarginAccountSummary = function() {
        return new Promise(function(fulfill, reject) {
            Poloniex.returnMarginAccountSummary(function(error, data) {
                if (error) { reject(error); }
                fulfill({ marginAccountSummary : data});
            });
        });
    }

    Polo.prototype.getMarginPositions = function(currencyA, currencyB) {
        if (!currencyA || !currencyB) {
            currencyA = 'all';
            currencyB = 'all';
        }
        return new Promise(function(fulfill, reject) {
            Poloniex.getMarginPosition(currencyA, currencyB, function(error, data) {
                if (error) { reject(error); }
                fulfill(data);
            })
        });
    }





    return Poloniex;


})();