/**
 * 模拟checkbox
 * @author : panda;
 * @createTime : 2012-11-29;
 */
(function($){
	$(document).delegate('.imitate-checkbox input[type="checkbox"]','click',function(e){
		var el = $(this),
		wrap = el.parent();
		if(el.prop('checked') === true){
			wrap.addClass('checked');
		}
		else{
			wrap.removeClass('checked');
		}
	});
})(jQuery);