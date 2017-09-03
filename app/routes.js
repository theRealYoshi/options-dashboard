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
            var marginAccount = {};
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
                            if (!marginAccount[key]) {
                                marginAccount[key] = {};
                            }
                            marginAccount[key]['btc'] = value;
                            value = value * btcDollarValue;
                            marginAccount[key]['dollar'] = value.toFixed(2);
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
                                // add cancel order button
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
            console.log(error);
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

    // =====================================
    // AJAX ===========================
    // =====================================

    app.get('/ajax/closePosition', function(req, res){
        var currencyA = req.body.currencyPair.split("_")[0];
        var currencyB = req.body.currencyPair.split("_")[1];
        Poloniex.closeMarginPosition(currencyA, currencyB, function(error, data){
            if (!data.success) {
                res.status(500).send({error : error});
            } else {
                res.send(data);
            }
        })
    });

    app.post('/ajax/cancelOrder', function(req, res){
        var orderNumber = req.body.orderNumber;
        var currencyA = req.body.currencyPair.split("_")[0];
        var currencyB = req.body.currencyPair.split("_")[1];
        Poloniex.cancelOrder(currencyA, currencyB, orderNumber, function(error, data) {
            if (!data.success) {
                res.status(500).send({error : error});
            } else {
                res.send(data);
            }
        });
    });
};
