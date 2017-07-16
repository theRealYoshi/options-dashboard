module.exports = (function() {
    var Polo = require( __dirname + '/poloniex.js' );
    var Poloniex = new Polo( process.env.POLONIEX_API_KEY,
                             process.env.POLONIEX_API_KEY_SECRET);

    var usdCurrencies = {},
        currencyPairs = {};

    function getLatestCurrencyPairs() {
        var returnTicker =  new Promise(function(fulfill, reject) {
            Poloniex.returnTicker(function(error, data) {
                if (error) { reject(error); }
                fulfill({data : data});
            });
        });

        returnTicker.then(function(data) {
            currencyPairs = data.data;
            Object.keys(currencyPairs).forEach(function(key) {
                if (key.indexOf("USDT") !== -1 ) {
                    var usdCurrencyObj = currencyPairs[key];
                    key = key.replace(/USDT_/g, "");
                    usdCurrencies[key] = usdCurrencyObj;
                }
            });
        })
        .catch(function(error) {
            console.log(error)
            return false;
        });
    }

    getLatestCurrencyPairs();

    Polo.prototype.getCurrencyPairDollarValue = function(currencyPair) {
        var currencyA = currencyPair.split("_")[0];
        var currencyB = currencyPair.split("_")[1];
        return usdCurrencies[currencyB]['last'];
    }

    Polo.prototype.getBtcDollarValue = function() {
        return usdCurrencies['BTC']['last'];
    }

    Polo.prototype.getMarginActivity = function() {
        var marginAccountSummary = Poloniex.getMarginAccountSummary();
        var currentMarginPositions = Poloniex.getMarginPositions();
        var currentOpenOrders = Poloniex.getOpenOrders();

        //Return values are discarded but functions still run if any test fails
        return Promise.all([ marginAccountSummary,
                             currentMarginPositions,
                             currentOpenOrders ])
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            console.log(error);
            return false;
        });
    }

    /*
    */
    Polo.prototype.convertCurrentMarginPositionToDollar = function(currencyPair, marginPositionObj) {
        var dollarValue = Poloniex.getCurrencyPairDollarValue(currencyPair);
        var btcDollarValue = Poloniex.getBtcDollarValue();

        return { "amount" : (marginPositionObj["amount"] * dollarValue).toFixed(2),
                 "total" : (marginPositionObj["total"] * btcDollarValue).toFixed(2),
                 "basePrice" : (marginPositionObj["basePrice"] * btcDollarValue).toFixed(2),
                 "liquidationPrice" : (marginPositionObj["liquidationPrice"] * btcDollarValue).toFixed(2),
                 "pl" : (marginPositionObj["pl"] * btcDollarValue).toFixed(2),
                 "lendingFees" : (marginPositionObj["lendingFees"] * btcDollarValue).toFixed(2) };
    }

    Polo.prototype.convertOpenOrderToDollar = function() {

    }


    /*************
    ************* POLONIEX API REQUESTS
    **************/

    Polo.prototype.getExchangeBalances = function() {
        return new Promise(function(fulfill, reject) {
            Poloniex.returnCompleteBalances(function(error, data) {
                if (error) { reject(error); }
                var exchangeAccountSummary = {};

                Object.keys(data).forEach(function(key) {
                    var currencyObj = data[key];
                    if (currencyObj.available > 0 ||
                        currencyObj.onOrders > 0  ||
                        currencyObj.btcValue > 0 ) {
                        exchangeAccountSummary[key] = currencyObj;
                    }
                });
                fulfill({ exchangeAccountSummary : exchangeAccountSummary});
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
                fulfill({ marginAccountSummary : data });
            });
        });
    }

    Polo.prototype.getMarginPositions = function(currencyA, currencyB) {
        if (!currencyA || !currencyB) {
            currencyA = 'all';
            currencyB = null;
        }
        return new Promise(function(fulfill, reject) {
            Poloniex.getMarginPosition(currencyA, currencyB, function(error, data) {
                if (error) { reject(error); }
                fulfill({ currentMarginPositions : data });
            })
        });
    }

    Polo.prototype.getOpenOrders = function(currencyA, currencyB) {
        if (!currencyA || !currencyB) {
            currencyA = 'all';
            currencyB = null;
        }
        return new Promise( function(fulfill, reject) {
            Poloniex.returnOpenOrders(currencyA, currencyB, function(error, data) {
                if (error) {reject(error); }
                fulfill({ currentOpenOrders: data });
            })
        });
    }

    return Poloniex;


})();
