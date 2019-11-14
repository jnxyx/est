require(['moduleA'], function(moduleA) {
	console.log(moduleA);
});
require.config({　　　　
	//	baseUrl: "../../js/lib",
	　　　
	paths: {　　　　　　
		"jquery": "../../js/lib/jquery.min",
		　　　　　　"ko": "../../js/lib/knockout.min"　,
		　　　　　　"moduleA": "moduleA"　
	}　　,

	waitSeconds: 0
});
require(['jquery', 'ko', 'moduleA'], function(xu, ko, moa) {
	console.log(xu);
	console.log(ko);
	console.log(moa);
	xu(function() {
		var a = xu('#d1').html();
		console.log(a);
	});
	xu(function() {
		ko.applyBindings(moa);
	});
});