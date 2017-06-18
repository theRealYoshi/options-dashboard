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

        balances.then(function(accountBalance) {
            //
            res.render('dashboard.ejs', {
                data : accountBalance
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
