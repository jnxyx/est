/*
    require jQuery
    富文本框限制插件
    调用： <textarea class="erp-textarea" erp-max="205"></textarea>
    created by xuyunxiang On 2017.10.23
 */
(function ($) {
    $.fn.erpTextarea = function () {
        var self = $(this);
        var maxlength = self.attr('erp-max') || 200;
        init();

        function init() {
            self.attr('maxlength', maxlength);
            self.css({
                resize: 'none',
                padding: '10px',
                height: '100%',
                width: '100%',
                borderColor: '#e5e6e7',
                borderRadius: '5px',
                boxSizing: 'border-box' // ,
                // outline: 'none'
            })
            var wrapElement = $('<div class="erp-textarea-container"></div>');
            wrapElement.css({
                position: 'relative',
                paddingTop: '20px',
                height: '100%',
                width: '100%'
            });
            self.wrap(wrapElement);
            renderWarning();
            bindEvent();
        }

        function bindEvent() {
            self.on('input', function () {
                renderWarning();
            });
        }

        function renderWarning() {
            var max = +maxlength;
            var current = +self.val().length;
            if (self.data('hasRender')) {
                var element = self.prev()
                if (element.hasClass('erp-warning')) {
                    element.text(current + '/' + max)
                }
            } else {
                var warningElement = $('<div class="erp-warning">' + current + '/' + max + '</div>');
                warningElement.css({
                    textAlign: 'right',
                    color: 'red'
                });
                self.before(warningElement);
                self.data('hasRender', true);
            }
        }
    }
})(jQuery)

$(function () {
    $('.erp-textarea').each(function () {
        $(this).erpTextarea()
    })
})