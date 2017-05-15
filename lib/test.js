module.exports = (function(){
	function Poloniex(){
		this._getPrivateHeaders = function(){
			console.log("private Headers");
		};
		this.test = function(){
			console.log("test");
		}
		return this;
	};

	Poloniex.STUFF = "true";

	Poloniex.prototype = {
		constructor : Poloniex,
		testFunction : function(){
			console.log("In Prototype");
			return this;
		}
	};

    return {
		Poloniex: Poloniex
	};
})();
