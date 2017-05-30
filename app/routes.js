// app/routes.js
var Poloniex = require('../lib/poloniex-wrapper.js');

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
        Poloniex.returnBalances(function(err, body){
            res.send(body);
        });
        // res.render('dashboard.ejs');
    });

};
