require('dotenv').config();

var express     = require('express');
var app         = express();
var port        = process.env.PORT || 8000;
var mongoose 	= require('mongoose');
var passport    = require('passport');
var bodyParser 	= require('body-parser');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

require('./app/routes.js')(app, passport);

// launch ===============================================================
app.listen(port);

console.log("This app is on:" + port);
