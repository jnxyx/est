var data = [{
    title: ['女装', '内衣'],
    menu: [
        ['精选上装', '羽绒服', '毛呢外套', '毛衣', '针织衫', '衬衫', '风衣'],
        ['浪漫裙装', '连衣裙'],
        ['女士下装', '牛仔裤', '休闲裤'],
        ['浪漫裙装', '连衣裙'],
        ['女士下装', '牛仔裤', '休闲裤']
    ]
}, {
    title: ['男装', '运动户外'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['女鞋', '男鞋', '箱包'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['化妆品', '个人护理'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['腕表', '珠宝饰品', '眼镜'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['手机', '数码', '电脑办公'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['母婴玩具'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['零食', '进口食品', '茶酒'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['生鲜水果'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}, {
    title: ['大家电', '生活电器'],
    menu: [
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品'],
        ['夏季新品', '夏季新品', '夏季新品']
    ]
}]

var index = {
    init: function() {
        index.renderNav();
        index.bindEvent();
    },
    renderNav: function() {
        var liItems = '',
            menuItems = '';
        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            var li = '<li class="nav li"><span>';
            for (var j = 0; j < item.title.length; j++) {
                li += '<a href="#">';
                li += item.title[j] + '</a>/';
            }
            li = li.substring(0, li.length - 1);
            li += '</span></li>';

            var menu = '<div class="block">';
            for (var m = 0; m < item.menu.length; m++) {
                menu += '<div>';
                var _item = item.menu[m];
                for (var k = 0; k < _item.length; k++) {
                    menu += '<a ' + (k == 0 ? 'class="title"' : '') + ' href="#">';
                    menu += _item[k];
                    menu += (k == 0 ? '>' : '')
                    menu += '</a>';
                }
                menu += '</div>';
            }
            menu += '</div>';

            liItems += li;
            menuItems += menu;
        }

        $('.nav').html(liItems), $('.pannel').html(menuItems);

    },
    bindEvent: function() {
        $('.nav.li,.block').hover(function(e) {
            var self = $(this),
                _index = self.index();

            index.hide();
            index.show(_index);
        });
        $('.nav-main').mouseleave(function() {
            index.hide();
        });
    },
    show: function(_index) {
        $('.nav.li').eq(_index).addClass('hover');
        $('.block').eq(_index).show();
    },
    hide: function() {
        $('.nav.li').removeClass('hover');
        $('.block').hide();
    }
}

$(index.init);
