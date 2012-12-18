/**
 * Baseed on jQuery Gears
 * @Author: Denis 2011.01.21
 * @update Denis 2011.08.11 ����styleDomain����
 */
(function($){
    var $util = $.util, mudules = {
        'util-achievement': {
            js: ['util/achievement'],
            css: ['util/achievement'],
            ver: '1.0'
        },
        'util-json': {
            js: ['util/json2'],
            ver: '1.0'
        },
        'util-cookie': {
            js: ['util/cookie'],
            ver: '1.1'
        },
        'util-date': {
            js: ['util/date'],
            ver: '1.2'
        },
        'util-debug': {
            js: ['util/debug'],
            ver: '1.0'
        },
        'util-history': {
            js: ['util/history'],
            ver: '1.5.0'
        },
        'util-storage': {
            js: ['util/storage'],
            ver: '1.0'
        },
        'fx-core': {
            js: ['fx/core'],
            ver: '1.8.13'
        },
        'ui-core': {
            js: ['ui/core'],
            ver: '1.1'
        },
        'util-number': {
            js: ['util/number'],
            ver: '1.2'
        },
        'ui-combobox': {
            requires: ['ui-core'],
            js: ['ui/combobox'],
            css: ['ui/combobox'],
            ver: '1.0'
        },
        'ui-position': {
            js: ['ui/position'],
            ver: '1.8.11'
        },
        'ui-menu': {
            requires: ['ui-core'],
            js: ['ui/menu'],
            ver: '1.8.15'
        },
        'ui-mouse': {
            requires: ['ui-core'],
            js: ['ui/mouse'],
            ver: '1.8.15'
        },
        'ui-autocomplete': {
            requires: ['ui-position', 'ui-menu'],
            js: ['ui/autocomplete'],
            ver: '1.8.15'
        },
        'ui-colorbox': {
            requires: ['ui-core'],
            css: ['ui/colorbox'],
            js: ['ui/colorbox'],
            ver: '1.0'
        },
        'ui-colorpicker': {
            requires: ['ui-mouse'],
            css: ['ui/colorpicker'],
            js: ['ui/colorpicker'],
            ver: '1.0'
        },
        'ui-draggable': {
            requires: ['ui-mouse'],
            js: ['ui/draggable'],
            ver: '1.8.11'
        },
        'ui-droppable': {
            requires: ['ui-draggable'],
            js: ['ui/droppable'],
            ver: '1.8.11'
        },
        'ui-datepicker': {
            requires: ['ui-core'],
            css: ['ui/datepicker'],
            js: ['ui/datepicker'],
            ver: '1.1'
        },
        'ui-datepicker-time': {
            requires: ['ui-datepicker'],
            js: ['ui/datepicker-time'],
            ver: '1.0'
        },
        'ui-dialog': {
            requires: ['ui-core'],
            js: ['ui/dialog'],
            ver: '1.0'
        },
        'ui-flash': {
            requires: ['ui-core'],
            js: ['ui/flash'],
            ver: '1.1'
        },
        'ui-flash-uploader': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader'],
            css: ['ui/flash-uploader'],
            ver: '1.3'
        },
        'ui-flash-uploader2': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader2'],
            css: ['ui/flash-uploader'],
            ver: '2.0'
        },
        'ui-flash-chart': {
            requires: ['ui-flash'],
            js: ['ui/flash-chart'],
            ver: '1.1'
        },
        'ui-flash-storage': {
            requires: ['ui-flash'],
            js: ['ui/flash-storage'],
            ver: '1.0'
        },
        'ui-portlets': {
            requires: ['ui-mouse'],
            js: ['ui/portlets'],
            ver: '1.1'
        },
        'ui-progressbar': {
            requires: ['ui-core'],
            js: ['ui/progressbar'],
            ver: '1.8.11'
        },
        'ui-scrollto': {
            js: ['ui/scrollto'],
            ver: '1.4.2'
        },
        'ui-sortable': {
            requires: ['ui-mouse'],
            js: ['ui/sortable'],
            ver: '1.8.12'
        },
        'ui-tabs': {
            requires: ['ui-core'],
            js: ['ui/tabs'],
            ver: '1.3'
        },
        'ui-tabs-effect': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-effect'],
            ver: '1.1'
        },
        'ui-tabs-lazyload': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-lazyload'],
            ver: '1.0'
        },
        'ui-timer': {
            requires: ['ui-core'],
            js: ['ui/timer'],
            ver: '1.2'
        },
        'web-alitalk': {
            css: ['web/alitalk'],
            js: ['web/alitalk'],
            ver: '3.2'
        },
        'web-alitalk-shunt': {
            requires: ['web-alitalk'],
            js: ['web/alitalk-shunt'],
            ver: '1.0'
        },
        'web-pca': {
            js: ['web/pca'],
            ver: '1.0'
        },
        'web-datalazyload': {
            js: ['web/datalazyload'],
            ver: '1.2'
        },
        'web-sweet': {
            js: ['web/sweet'],
            ver: '1.0'
        },
        'web-stylesheet': {
            js: ['web/stylesheet'],
            ver: '1.0'
        },
        'web-suggestion': {
            requires: ['ui-autocomplete'],
            js: ['web/suggestion'],
            css: ['web/suggestion'],
            ver: '1.0'
        },
        'web-valid': {
            js: ['web/valid'],
            ver: '1.0'
        },
        'ext-jasmine': {
            css: ['external/jasmine'],
            js: ['external/jasmine'],
            ver: '1.1'
        },
        'ext-jasmine-html': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-html'],
            ver: '1.1'
        },
        'ext-jasmine-jquery': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-jquery'],
            ver: '1.1'
        }
    }, url = 'http://{0}/{t}/lib/beast/widget/{p}-min.{f}?v={1}';
    //init default mudules
    for (var name in mudules) {
        var configs = mudules[name], js = configs.js, css = configs.css, j, len;
        if (js) {
            for (j = 0, len = js.length; j < len; j++) {
                js[j] = $util.substitute(url, {
                    t: 'scripts',
                    f: 'js',
                    p: js[j]
                });
            }
        }
        if (css) {
            for (j = 0, len = css.length; j < len; j++) {
                css[j] = $util.substitute(url, {
                    t: 'css',
                    f: 'css',
                    p: css[j]
                });
            }
        }
        $.add(name, configs);
    }
    //2011.8.11 Denis style��������
    $.styleDomain = 'localhost:5000';
})(jQuery);
