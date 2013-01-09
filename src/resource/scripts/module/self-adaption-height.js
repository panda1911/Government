/**
 * 自适应高度
 * @author : panda;
 * @createTime : 2013-01-09;
 */
(function($){
	var doc = document,
	theViewportHeight = 0,
	//获取可视区域高度
	getViewportHeight = function(){
		theViewportHeight = doc.compatMode=="BackCompat"?doc.body.clientHeight:doc.documentElement.clientHeight;
	},
	getPageHeaderHeight = function(){
		return $('#header').height();
	},
	init = function(){
		var pageHeaderHeight = getPageHeaderHeight();
		getViewportHeight();
		$(window).on('resize',function(e){

		});
	}();
})(jQuery);