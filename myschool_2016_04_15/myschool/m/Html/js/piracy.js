$(initPage);

function initPage() {

}

(function(win, doc) {

	function piracy(args) {
		var defaults = {
			pirateNumber: 5,
			goldNumber: 100
		};
		defaults.pirateNumber = args.pirateNumber ? args.pirateNumber : defaults.pirateNumber;
		defaults.goldNumber = args.goldNumber ? args.goldNumber : defaults.goldNumber;
		this.options = defaults;

		return this;
	}

	var proto = piracy.prototype;

	proto.satisfies = function() {

	}

	win.piracy = piracy;

}(window, document))