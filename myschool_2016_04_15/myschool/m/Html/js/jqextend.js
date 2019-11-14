var jQuery = function(selector, context) {
	return new jQuery.fn.init(selector, context);
}
console.log(jQuery);
jQuery.fn = jQuery.prototype = {
	jquery: '2.1.5',

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	init: function(selector, context) {
		console.log(selector, context);
	}
}
console.log(jQuery.fn);