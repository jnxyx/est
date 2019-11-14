$(function() {
	initInputEvent();
});

function initInputEvent() {
	$('#input').bind('input', function(e) {
		console.log(e);
		console.log($(this).val());
	});
}