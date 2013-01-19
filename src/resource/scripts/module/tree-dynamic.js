(function($,tree){
	$.namespace('Energon.ui.dynamicTree');
	var F = function(){};
	F.prototype = tree.prototype;
	Energon.ui.dynamicTree = function(options){
		this.init(options);
	};
	Energon.ui.dynamicTree.prototype = new F();
	$.extend(Energon.ui.dynamicTree.prototype,{
		remove : function(id){
			var that = this,
			node = that.getNodeById(id),
			parentNode;
			if(that.isOnlyChild(node)){
				parentNode = that.getParentNode(node);
				that.turnToLeaf(parentNode);
			}
			if(that.isLastChild(node)){
				preNode = that.getPreNode(node);
				that.becomeToLastChild(preNode);
			}
			node.remove();
		},
		renderChildren : function(node,a){
			var that = this;
			node.append(that.jsonToHtml(a));
		},
		update : function(id,fn){
			var that = this,
			url = that.options.ajaxUrl,
			param = that.options.param,
			node = that.getNodeById(id);
			param['parentId'] = id;
			$.ajax({
				url : url,
				data : param,
				dataType : 'json'
			}).done(function(o){
				var isSuccess = o.isSuccess,
				data = o.data;
				if(isSuccess){
					that.renderChildren(node,data);
				}
			}).then(fn);
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
		},
		//父节点变叶子节点
		turnToLeaf : function(node){
			var that = this,
			childContainer;
			//删除非叶子节点上可能含有的className
			node.removeClass(that.options.closeParentClassName+' '+that.options.openParentClassName);
			//加上叶子节点的className
			node.addClass(that.options.leafClassName);
			//获取子节点容器，并将其删除
			childContainer = node.children('ul').first();
			childContainer.remove();
		},
		//叶子节点变父节点
		turnToParentNode : function(node,a){
			var that = this;
			node.removeClass(that.options.leafClassName);
			node.addClass(that.options.openParentClassName);
			node.append(that.jsonToHtml(a));
		},
		turnOnLoading : function(node){
			var that = this;
			node.addClass(that.options.loadingClassName);
		},
		turnOffLoading : function(node){
			var that = this;
			node.removeClass(that.options.loadingClassName);
		},
		//成为最后一个子节点
		becomeToLastChild : function(node){
			var that = this;
			node.addClass(that.options.lastNodeClassName);
		},
		//最后一个子节点变成其他位置
		becomeToMiddleChild : function(node){
			var that = this;
			node.removeClass(that.options.lastNodeClassName);
		}
	});
})(jQuery,Energon.ui.tree);