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
        var btcDollarValue = Poloniex.getBtcDollarValue();

        var activities = new Promise(function(fulfill, reject) {
            var res = Poloniex.getMarginActivity();
            if (!res) { reject(res); }
            fulfill(res);
        });

        activities.then(function(data) {
            var marginAccount = { 'btc' : {},
                                  'dollar' : {} };
            var currentMarginPositions = {};
            var currentOpenOrders = {};

            Object.keys(data).forEach(function(key) {
                var accountObj = data[key];
                var accountKey = Object.keys(accountObj)[0];
                switch(accountKey) {
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
                            currentMarginPositions[key] = {
                                'btc' : marginPositionObj,
                                'dollar' : Poloniex.convertToDollar(key, marginPositionObj)
                            };
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

                                currentOpenOrders[key][orderNumber] = {
                                    'btc': openOrderObj,
                                    'dollar' : Poloniex.convertToDollar(key, openOrderObj)
                                };
                            }
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
            res.render('error.ejs', {
                errorMsg : error
            });
        })

    });

    // =====================================
    // TRADING ===========================
    // =====================================
    app.get('/trading',  function(req, res) {

    });

};
