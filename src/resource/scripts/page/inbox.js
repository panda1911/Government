/**
 * 收件箱
 * @author : panda
 * @createTime : 2012-11-18
 */
jQuery(function($){
	var searchBtn = $('#searchBtn'),
	searchBox = $('#searchBox'),
	headerContainer = $('#headerContainer'),
	showSearchBoxClassName = 'show-search-box',
	body = $('body'),
	init = function(){
		searchBtn.on('click',function(e){
			e.preventDefault();
			var el = $(this);
			if(headerContainer.hasClass(showSearchBoxClassName)){
				headerContainer.removeClass(showSearchBoxClassName);
			}
			else{
				headerContainer.addClass(showSearchBoxClassName);
			}
		});
		searchBox.delegate('.btn','click',function(e){
			headerContainer.removeClass(showSearchBoxClassName);
		});
		body.delegate('.icon','click',function(e){
			e.preventDefault();
		});
	}();
});