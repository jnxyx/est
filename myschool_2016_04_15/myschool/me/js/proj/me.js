var init = require.config;

init({　　　　
	paths: {
		jquery: '../lib/jquery.min',
		ko: '../lib/knockout.min'
	},
	waitSeconds: 0
});

require(['jquery', 'ko'], function($, ko) {

	$('.me-nav-li').click(function() {
		$('.me-nav-li').removeClass('active');
		$(this).addClass('active');
	});

});