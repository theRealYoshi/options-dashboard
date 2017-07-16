// app/routes.js
var Poloniex = require('../lib/js/poloniex-wrapper.js');

module.exports = function(app, passport) {

	// =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    // =====================================
    // DASHBOARD ===========================
    // =====================================
    app.get('/dashboard',  function(req, res) {

        var balances = new Promise(function(fulfill, reject) {
            var res = Poloniex.getAllBalances();
            if (!res) { reject(res); }
            fulfill(res);
        });

        balances.then(function(data) {
            var usdCurrencies = {};
            var btcDollarValue = null;
            var marginAccount = { 'btc' : {},
                                  'dollar' : {} };
            var currentMarginPositions = {};
            var currentOpenOrders = {};

            Object.keys(data).forEach(function(key) {
                var accountObj = data[key];
                var accountKey = Object.keys(accountObj)[0];
                switch(accountKey) {
                    case 'usdCurrencies':
                        usdCurrencies = accountObj[accountKey];
                        btcDollarValue = usdCurrencies['BTC']['last'];
                        break;
                    case 'marginAccountSummary':
                        var marginBtcAccount = accountObj[accountKey];
                        Object.keys(marginBtcAccount).forEach(function(key) {
                            if (key === 'currentMargin') { return; }
                            var value = marginBtcAccount[key];
                            marginAccount['btc'][key] = value
                            value = value * btcDollarValue;
                            marginAccount['dollar'][key] = value.toFixed(2);
                        });
                        break;
                    case 'currentMarginPositions':
                        currentMarginPositionsObj = accountObj[accountKey];
                        Object.keys(currentMarginPositionsObj).forEach(function(key) {
                            var marginPositionObj = currentMarginPositionsObj[key];
                            if (marginPositionObj.type === 'none' &&
                                !marginPositionObj.amount <= 0) {
                                return;
                            }
                            currentMarginPositions[key] = marginPositionObj;
                            // convert to dollar
                        });
                        break;
                    case 'currentOpenOrders':
                        currentOpenOrdersObj = accountObj[accountKey];
                        Object.keys(currentOpenOrdersObj).forEach(function(key) {
                            var currencyPairOpenOrders = currentOpenOrdersObj[key];
                            if (currencyPairOpenOrders.length <= 0) { return; }
                            currentOpenOrders[key] = [];

                            // Each open order within currency pair
                            for (var i = 0; i < currencyPairOpenOrders.length; i++) {
                                var openOrderObj = currencyPairOpenOrders[i];
                                if (!openOrderObj.orderNumber &&
                                    !openOrderObj.amount ) {
                                    continue;
                                }
                                var orderNumber = openOrderObj.orderNumber;
                                currentOpenOrders[key][orderNumber] = openOrderObj;
                            }

                            //convert to dollar
                            // projected profit
                        });
                    default:
                        break;
                }
            });

            res.render('dashboard.ejs', {
                marginAccount : marginAccount,
                currentMarginPositions : currentMarginPositions,
                currentOpenOrders : currentOpenOrders
            });
        })
        .catch(function(error) {
            console.log(error);
            res.render('error.ejs');
        })

    });

    // =====================================
    // TRADING ===========================
    // =====================================
    app.get('/trading',  function(req, res) {

    });

};
