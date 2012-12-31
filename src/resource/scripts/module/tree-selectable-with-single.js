/**
 * 树结构扩展类——既动态又可选择的树(多选框各自之间都无关联)
 * @author : yu.yuy
 * @createTime : 2012-11-12
 * @email : yu.yuy@taobao.com
 */
(function($,selectableWithDynamicTree){
	$.namespace('Energon.ui.selectableWithSingleTree');
	var F = function(){},f;
	F.prototype = selectableWithDynamicTree.prototype;
	Energon.ui.selectableWithSingleTree = function(options){
		this.init(options);
	};
	f = new F();
	Energon.ui.selectableWithSingleTree.prototype = f;
	$.extend(Energon.ui.selectableWithSingleTree.prototype,{
		bindEvent : function(){
			var that = this,
			container = that.options.container;
			F.prototype.bindEvent.call(that);
			container.undelegate('.'+that.options.checkboxShowClassName,'click.tree');
			container.delegate('.'+that.options.checkboxShowClassName,'click.tree',function(e){
				var el = $(this),
				node = that.getClosestLi(el),
				isChecked = !el.hasClass(that.options.checkedClassName);
				that.checkedNode(node,isChecked);
				if($.isFunction(that.options.clickboxEvent)){
					that.options.clickboxEvent.call(that,e);
				}
			});
		},
		unfold : function(el){
			var that = this,
			node = that.getClosestLi(el),
			id;
			if(node.hasClass(that.options.needLoadingClassName)){
				id = node.attr('id');
				that.turnOnLoading(node);
				that.update(id,function(){
					node.removeClass(that.options.needLoadingClassName);
					that.turnOffLoading(node);
					node.removeClass(that.options.closeParentClassName);
					node.addClass(that.options.openParentClassName);
				});
			}
			else{
				if(node.hasClass(that.options.closeParentClassName)){
					node.removeClass(that.options.closeParentClassName);
					node.addClass(that.options.openParentClassName);
				}
			}
		}
	});
})(jQuery,Energon.ui.selectableWithDynamicTree);