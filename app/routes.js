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
            var accountBalance = {};
            var usdCurrencies = {};
            var marginAccount = {};

            Object.keys(data).forEach(function(key) {
                var accountObj = data[key];
                var accountKey = Object.keys(accountObj)[0];
                switch(accountKey) {
                    case 'usdCurrencies':
                        usdCurrencies = accountObj[accountKey];
                        break;
                    case 'marginAccountSummary':
                        marginAccount = accountObj[accountKey];
                        break;
                    case 'completeBalances':
                        accountBalance = accountObj[accountKey];
                        break;
                    default:
                        break;
                }
            });

            var btcDollarValue = usdCurrencies['BTC']['last'];

            Object.keys(marginAccount).forEach(function(key) {
                if (key === 'currentMargin') { return; }
                var value = marginAccount[key];
                value = value * btcDollarValue;
                marginAccount[key] = value.toFixed(2);
            });

            res.render('dashboard.ejs', {
                accountBalance : accountBalance,
                marginAccountSummary : marginAccount
            });
        })
        .catch(function(error) {
            res.render('error.ejs');
        })

    });

    // =====================================
    // TRADING ===========================
    // =====================================
    app.get('/trading',  function(req, res) {

    });

};
