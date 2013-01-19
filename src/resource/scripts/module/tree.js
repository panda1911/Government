/**
 * @todo : 树结构
 * @author : panda
 * @createTime : 2012-09-17
 */
(function($){
	$.namespace('Energon.ui.tree');
	Energon.ui.tree = function(options){
		this.init(options);
	};
	Energon.ui.tree.prototype = {
		defaultOptions : {
			containerClassName : 'e-tree',
			structureIconClassName : 'e-tree-structure-icon',
			closeParentClassName : 'e-tree-close',
			openParentClassName : 'e-tree-open',
			nodeIconClassName : 'e-tree-node-icon',
			leafClassName : 'e-tree-leaf',
			lastNodeClassName : 'e-tree-last-child',
			currentNodeClassName : 'e-tree-current-node',
			checkboxClassName : 'e-tree-checkbox',
			checkboxShowClassName : 'e-tree-checkbox-show',
			commentClassName : 'e-tree-comment',
			checkedClassName : 'e-tree-checked',
			halfCheckedClassName : 'e-tree-half-checked',
			loadingClassName : 'e-tree-loading',
			needLoadingClassName : 'e-tree-need-loading',
			hasNoChildren : 'e-tree-has-no-children',
			isLaunchChunk : true,
			isExpandAll : false,
			clickEvent : function(e){
				e.preventDefault();
				var that = this,
				el = $(e.currentTarget);
				that.pitchOnNode(that.getClosestLi(el));
			}
		},
		init : function(options){
			var that = this;
			that.options = {};
			$.extend(that.options,that.defaultOptions,options);
			that.container = that.options.container;
			if(that.options.content){
				that.render(that.options.content);
			}
			that.unbindAllEvent();
			that.bindEvent();
			that.traversals = that.options.isLaunchChunk?that.chunkLoop:that.normalLoop;
		},
		bindEvent : function(){
			var that = this,
			container = that.options.container;
			container.delegate('.'+that.options.closeParentClassName+'>div>.'+that.options.structureIconClassName,'click.tree',function(e){
				var el = $(this);
				that.unfold(el);
			});
			container.delegate('.'+that.options.openParentClassName+'>div>.'+that.options.structureIconClassName,'click.tree',function(e){
				var el = $(this);
				that.fold(el);
			});
			container.delegate('a','click.tree',function(e){
				that.options.clickEvent.call(that,e);
			});
		},
		unbindAllEvent : function(){
			var that = this,
			container = that.options.container;
			container.undelegate("click.tree");
		},
		render : function(a){
			var that = this;
			that.options.container.html(that.jsonToHtml(a));
		},
		jsonToHtml : function(a){
			var that = this,
			nodeJson,
			children,
			isLeaf,
			hasChildren,
			customPropertys,
			ret = '<ul>';
			for(var i=0,l=a.length;i<l;i++){
				nodeJson = a[i];
				children = nodeJson.children;
				//isLeaf = !($.isArray(children) && children.length>0);
				hasChildren = nodeJson.hasChildren;
				isLeaf = !hasChildren;
				customPropertys = nodeJson.customPropertys;
				ret += '<li ';
				ret += 'class="'+(isLeaf?that.options.leafClassName:that.options.isExpandAll?that.options.openParentClassName:that.options.closeParentClassName);
				if(!isLeaf && (!$.isArray(children) || children.length===0)){
					ret += ' '+that.options.needLoadingClassName;
				}
				ret += (i===l-1)?(' '+that.options.lastNodeClassName):'';
				ret += '" id="';
				ret += nodeJson.id + '"';
				//ret += ' data-security="' + (nodeJson.security != null ? nodeJson.security : '') + '"';
				//自定义节点属性
				if(customPropertys){
					ret += that.buildCustomProperty(customPropertys);
				}
				ret += '>';
				ret += that.buildNode(nodeJson);
				if(!isLeaf && $.isArray(children) && children.length>0){
					ret += that.jsonToHtml(children);
				}
				ret += '</li>';
			}
			ret += '</ul>';
			return ret;
		},
		buildCustomProperty : function(o){
			var ret = '';
			for(var i in o){
				if(o.hasOwnProperty(i)){
					ret += ' data-'+i;
					ret += '="';
					ret += o[i];
					ret += '"';
				}
			}
			return ret;
		},
		buildNode : function(o){
			var that = this,
			name = o.name,
			url = o.url || '#',
			comment = o.comment || '',
			title = o.title || name,
			customIconClassName = o.customIconClassName,
			hasCheckbox = o.hasCheckbox,
			ret = '';
			ret = '<div>';
			ret += '<i class="'+ that.options.structureIconClassName +'"></i>';
			ret += '<a title="'+ title +'" href="'+ url +'">';
			// ret += '<i class="'+ that.options.nodeIconClassName;
			// if(customIconClassName){
			// 	ret += ' ' + customIconClassName;
			// }
			// ret += '"></i>';
			ret += name;
			if(comment !== ''){
				ret += '<span class="'+that.options.commentClassName+'">';
				ret += comment;
				ret += '</span>';
			}
			ret += '</a>';
			ret += '</div>';
			return ret;
		},
		//获取父元素中最近的li元素
		getClosestLi : function(el){
			var node = $(el),
			tagName = node.prop('tagName').toLowerCase();
			return tagName==='li'?node:node.parents('li').first();
		},
		//展开
		unfold : function(el){
			var that = this,
			node = that.getClosestLi(el);
			if(node.hasClass(that.options.closeParentClassName)){
				node.removeClass(that.options.closeParentClassName);
				node.addClass(that.options.openParentClassName);
			}
		},
		//收拢
		fold : function(el){
			var that = this,
			node = that.getClosestLi(el);
			if(node.hasClass(that.options.openParentClassName)){
				node.removeClass(that.options.openParentClassName);
				node.addClass(that.options.closeParentClassName);
			}
		},
		isLeaf : function(node){
			var that = this;
			return node.hasClass(that.options.leafClassName);
		},
		//选中节点
		pitchOnNode : function(node){
			var that = this;
			if(node.hasClass(that.options.currentNodeClassName)){
				return;
			}
			if(that.currentNode){
				that.currentNode.removeClass(that.options.currentNodeClassName);
			}
			node.addClass(that.options.currentNodeClassName);
			that.currentNode = node;
		},
		getName : function(node){
			var that = this;
			return node.children().first().children('a').first().attr('title');
		},
		getNodeById : function(id){
			var that = this,
			container = that.options.container;
			return container.find('#'+id).first();
		},
		//节点定位
		location : function(id){
			var that = this,
			node = that.getNodeById(id),
			closeNodes = node.parents('.'+that.options.closeParentClassName);
			for(var i=0,l=closeNodes.length;i<l;i++){
				that.unfold(closeNodes[i]);
			}
			that.pitchOnNode(node);
		},
		//获取直系父节点
		getParentNode : function(node){
			var that = this,
			parentNode = node.parent().parent(),
			tagName = parentNode.prop('tagName').toLowerCase();
			return (tagName==='li'||parentNode.hasClass(that.options.containerClassName))?parentNode:null;
		},
		//获取下一级的子节点
		getChildren : function(node){
			var that = this;
			return node.hasClass(that.options.leafClassName)?[]:node.children().eq(1).children();
		},
		hasChildren : function(node){
			var that = this;
			return that.getChildren(node).length>0;
		},
		//获取所有同级节点
		getBrothers : function(node){
			var that = this,
			parentNode = that.getParentNode(node);
			return that.getChildren(parentNode);
		},
		//获取所有子孙节点
		getDescendants : function(node){
			return node.find('li');
		},
		//获取该树的所有节点
		getAllNode : function(){
			var that = this;
			return that.getDescendants(that.options.container);
		},
		getPreNode : function(node){
			var that = this;
			return node.prev();
		},
		getNextNode : function(node){
			var that = this;
			return node.next();
		},
		//是否为唯一子节点
		isOnlyChild : function(node){
			var that = this,
			brothers = that.getBrothers(node);
			return brothers.length === 1;
		},
		//是否为第一个子节点
		isFirstChild : function(node){
			var that = this;
			return that.getPreNode(node)?true:false;
		},
		//是否为最后一个子节点
		isLastChild : function(node){
			var that = this;
			return node.hasClass(that.options.lastNodeClassName);
		},
		//节点上移
		shiftUp : function(node){
			var that = this,
			prev = that.getPreNode(node);
			node.insertBefore(prev);
			if(that.isLastChild(node)){
				node.removeClass(that.options.lastNodeClassName);
				prev.addClass(that.options.lastNodeClassName);
			}
		},
		//节点下移
		shiftDown : function(node){
			var that = this,
			next = that.getNextNode(node);
			node.insertAfter(next);
			if(that.isLastChild(next)){
				next.removeClass(that.options.lastNodeClassName);
				node.addClass(that.options.lastNodeClassName);
			}
		},
		chunkLoop : function(a,fn){
			var that = this;
			setTimeout(function(){
		        var item = a.shift();
		        fn.call(that, $(item));
		        if (a.length > 0){
		            setTimeout(arguments.callee, 100);
		        }
		    }, 100);
		},
		normalLoop : function(a,fn){
			var that = this,
			node;
			for(var i=0,l=a.length;i<l;i++){
				node = a.eq(i);
				fn.call(that,node);
			}
		}
	};
})(jQuery);