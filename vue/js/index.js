;
(function($) {

    $.fn._init = function(args) {

        var self = $(this),
            defaults = {
                number: args.number || 0
            };

        setInterval(function() {
            defaults.number--;
            $(self).html('' + defaults.number);
        }, 2000);
    }

})(jQuery);


function _init(args) {
    var self = args.el,
        defaults = {
            number: args.number || 0
        };

    setInterval(function() {
        defaults.number--;
        $(self).html('' + defaults.number);
    }, 2000);

}
