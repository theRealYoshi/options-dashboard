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
        Poloniex.returnTicker(function(error, data) {
            if (error) {
                res.render('error.ejs');
            }
            res.render('dashboard.ejs', {
                data : data
            });
        });
    });

};
