require('dotenv').config();

var express     = require('express');
var app         = express();
var port        = process.env.PORT || 8000;
var mongoose 	= require('mongoose');
var passport    = require('passport');


var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

// launch ===============================================================
app.listen(port);

console.log("This app is on:" + port);
