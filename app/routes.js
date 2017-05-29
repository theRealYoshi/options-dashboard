// app/routes.js

module.exports = function(app, passport) {

	// =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
		// render needs a profile template
		var message = "Hello World";
        res.send("Hello World"); // load the index.ejs file
    });

};
