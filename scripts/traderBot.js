var Poloniex = require('../lib/js/poloniex-wrapper.js');

module.exports = {
	start: function() {
		console.log(Date());
		console.log('traderBot running...');
		var marginPositions = Poloniex.getMarginPositions();
		marginPositions.then(function(data) {
			console.log("function finished at: " + Date());
			console.log(data);
		})
		.catch(function(error) {
			/*
			* message error handling here;
			*/
			console.log("this script was not executed");
			console.log(error);
		});
	},

	getMarginPositions: function() {
	}
};
