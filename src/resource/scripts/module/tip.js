/**
 * tip提示框封装
 * @author : panda;
 * @createTime : 2012-12-03;
 */
(function($){
	var showStatusClassName = 'tip-show',
	doc = $(document);
	doc.delegate('[data-tip-content-id]','click',function(e){
		e.preventDefault();
		var el = $(this),
		tipContentId = el.attr('data-tip-content-id'),
		tipContent = $('#'+tipContentId);
		if(el.hasClass(showStatusClassName)){
			tipContent.hide();
			el.removeClass(showStatusClassName);
		}
		else{
			tipContent.show();
			el.addClass(showStatusClassName);
			doc.on('click.'+tipContentId,function(e){
				var target = e.target;
				if(!$.contains(tipContent[0],target) && target!==el[0]){
					tipContent.hide();
					el.removeClass(showStatusClassName);
					doc.off('click.'+tipContentId);
				}
			});
		}
	});
})(jQuery);