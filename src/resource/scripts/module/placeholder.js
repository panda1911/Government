/**
 * placeholder特性兼容性封装
 * @author : yu.yuy
 * @createTime : 2012-7-11
 */
(function($){
	var Placeholder = function(config){
		this.init(config);
	};
	Placeholder.prototype = {
			init : function(config){
				var that = this;
				that.input = config.input && $(config.input);
				that.parent = that.input.parent();
				that.offset = that.input.data('placeholder-offset') || [1,2];
				that.holder = that.createHolder();
				
				if(that.input.val().length){
					that.holder.hide();
				}
				that.holder.on('click',function(e){
					that.input.trigger('focus');
				});
				that.input.on('focus',function(e){
					var el = $(this);
					if(el.val().length){
						that.holder.hide();
					}
					else{
						that.holder.show();
					}
				}).on('blur',function(e){
					var el = $(this);
					if(!el.val().length){
						that.holder.show();
					}
				}).on('keyup',function(e){
					var el = $(this);
					if(el.val().length){
						that.holder.hide();
					}
					else{
						that.holder.show();
					}
				}).on('change',function(e){
					var el = $(this);
					if(el.val().length){
						that.holder.hide();
					}
					else{
						that.holder.show();
					}
				});
			},
			createHolder : function(){
				var that = this,
				text = that.input.attr('placeholder'),
				holder = $('<span class="placeholder">'+text+'</span>');
				that.input.wrap('<span class="placeholer-container"/>');
				that.input.parent('.placeholer-container').css({
					lineHeight:that.input.height() + 'px'
				});
				console.info(that.offset);
				holder.css({
					left : that.offset[0],
					top : that.offset[1]
				});
				that.input.after(holder);
				
				return holder;
			}
	};
	$(document).ready(function(){
		if('placeholder' in document.createElement('input')){
	        return;
	    }
		var placeholders = $('[placeholder]');
		for(var i=0,l=placeholders.length;i<l;i++){
			new Placeholder({
				input : placeholders[i]
			});
		}
	});
})(jQuery);
