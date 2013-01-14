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
	pageContentHeight = 0,
	fileContentHeight = 0,
	toolBarHeader = $('.layout-toolbar>header').first(),
	toolBarContent = $('.layout-toolbar>.content').first(),
	toolBarFooter = $('.layout-toolbar>footer').first(),
	fileListHeader = $('.layout-file-list>header').first(),
	fileListContent = $('.layout-file-list>.content').first(),
	fileContentHeader = $('.layout-file-content>header').first(),
	fileContentContent = $('.layout-file-content>.content').first(),
	throttle = function(method, context) {
    	clearTimeout(method.tId);
    	method.tId = setTimeout(function(){
        	method.call(context);
    	}, 100);
	},
	//获取可视区域高度
	getViewportHeight = function(){
		return doc.compatMode=="BackCompat"?doc.body.clientHeight:doc.documentElement.clientHeight;
	},
	//获取页头高度
	getPageHeaderHeight = function(){
		return $('#header').height();
	},
	adjustPageHeight = function(){
		theViewportHeight = Math.max(getViewportHeight(),minHeight);
		pageContentHeight = theViewportHeight-pageHeaderHeight;
		container.height(pageContentHeight);
		adjustAreaHeight(toolBarHeader,toolBarContent,toolBarFooter);
		adjustAreaHeight(fileListHeader,fileListContent,null);
		fileContentHeight = adjustAreaHeight(fileContentHeader,fileContentContent,null);
		//adjustDetailInfo(detailInfoHeader, detailInfoContent, detailInfoFooter);
	},
	adjustAreaHeight = function(header, content, footer){
		var headerHeight = header?header.height():0,
		footerHeight = footer?footer.height():0,
		contentHeight = pageContentHeight-headerHeight-footerHeight-1,
		event;
		content.height(contentHeight);
		event = $.Event('adjust.selfAdaptionHeight');
		event.custom = {
			height : contentHeight
		};
		content.trigger(event);
		return contentHeight;
	},
	init = function(){
		pageHeaderHeight = getPageHeaderHeight();
		adjustPageHeight();
		$(window).on('resize',function(e){
			throttle(adjustPageHeight);
		});
	}();
})(jQuery);