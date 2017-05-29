require('dotenv').config();
var Poloniex = require('./lib/poloniex-wrapper.js');

var express     = require('express');
var app         = express();
var port        = process.env.PORT || 8000;
var passport    = require('passport');

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

app.listen(port);

console.log("This app is on:" + port);
