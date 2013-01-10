/**
 * 自适应高度
 * @author : panda;
 * @createTime : 2013-01-09;
 */
(function($){
	var doc = document,
	container = $('#content'),
	//最小高度
	minHeight = 500,
	theViewportHeight = 0,
	pageHeaderHeight = 0,
	throttle = function(method, context) {
    	clearTimeout(method.tId);
    	method.tId = setTimeout(function(){
        	method.call(context);
    	}, 100);
	},
	//获取可视区域高度
	getViewportHeight = function(){
		theViewportHeight = doc.compatMode=="BackCompat"?doc.body.clientHeight:doc.documentElement.clientHeight;
	},
	//获取页头高度
	getPageHeaderHeight = function(){
		return $('#header').height();
	},
	adjustPageHeight = function(){
		getViewportHeight();
		container.height(theViewportHeight-pageHeaderHeight);
	},

	init = function(){
		pageHeaderHeight = getPageHeaderHeight();
		adjustPageHeight();
		$(window).on('resize',function(e){
			throttle(adjustPageHeight);
		});
	}();
})(jQuery);