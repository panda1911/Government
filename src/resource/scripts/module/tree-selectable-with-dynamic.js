/**
 * 树结构扩展类——既动态又可选择的树
 * @author : yu.yuy
 * @createTime : 2012-10-29
 * @email : yu.yuy@taobao.com
 */
(function($,dynamicTree){
	$.namespace('Energon.ui.selectableWithDynamicTree');
	var F = function(){},f;
	F.prototype = dynamicTree.prototype;
	Energon.ui.selectableWithDynamicTree = function(options){
		this.init(options);
	};
	f = new F();
	Energon.ui.selectableWithDynamicTree.prototype = f;
	$.extend(Energon.ui.selectableWithDynamicTree.prototype,{
		init : function(options){
			var that = this;
			that.checkboxCache = {};
			F.prototype.init.call(that,options);
		},
		//获取被选中的所有节点ID
		getSelectedNodeIds : function(){
			var that = this,
			list = that.checkboxCache,
			item,
			ret = [];
			for(var i in list){
				if(list.hasOwnProperty(i)){
					item = list[i];
					if(item === 0){
						continue;
					}
					else if(item === -1){
						ret.push('-'+i);
					}
					else if(item === 1){
						ret.push(i);
					}
				}
			}
			return ret.join(',');
		},
		selectNodeId : function(node){
			var that = this,
			id = node.attr('id'),
			isLeaf = that.isLeaf(node);
			that.checkboxCache[id] = isLeaf?1:-1;
		},
		unselectNodeId : function(node){
			var that = this,
			id = node.attr('id');
			that.checkboxCache[id] = 0;
		},
		bindEvent : function(){
			var that = this,
			container = that.options.container;
			F.prototype.bindEvent.call(that);
			container.delegate('.'+that.options.checkboxShowClassName,'click.tree',function(e){
				var el = $(this),
				node = that.getClosestLi(el);
				if(el.hasClass(that.options.checkedClassName)){
					that.checkedNodeInvolveParentNode(node,'no');
					that.checkAllChildNodes(node,false);
				}
				else if(el.hasClass(that.options.halfCheckedClassName)){
					that.checkedNodeInvolveParentNode(node,'yes');
					that.checkAllChildNodes(node,true);
				}
				else{
					that.checkedNodeInvolveParentNode(node,'yes');
					that.checkAllChildNodes(node,true);
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
					//如果该节点被选中，则全选刚加载的子节点
					if(that.reviewNodeIsChecked(node)){
						that.checkAllChildNodes(node,true);
					}
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
		buildNode : function(o){
			var that = this,
			id = o.id,
			name = o.name,
			url = o.url || '#',
			comment = o.comment || '',
			title = o.title || name,
			customIconClassName = o.customIconClassName,
			hasCheckbox = o.hasCheckbox,
			isChecked = o.isChecked || 'no',
			ret = '';
			ret = '<div>';
			ret += '<i class="'+ that.options.structureIconClassName +'"></i>';
			ret += '<em class="' + (hasCheckbox?that.options.checkboxShowClassName:'');
			ret += isChecked==='no'?'':(isChecked==='yes'?that.options.checkedClassName:that.options.halfCheckedClassName);
			ret += '" data-node-id="'+ id +'"></em>';
			ret += '<a title="'+ title +'" href="'+ url +'">';
			// ret += '<i class="'+ that.options.nodeIconClassName;
			// if(customIconClassName){
			// 	ret += ' ' + customIconClassName;
			// }
			// ret += '"></i>';
			ret += name;
			ret += '</a>';
			if(comment !== ''){
				ret += '<span class="'+that.options.commentClassName+'">';
				ret += comment;
				ret += '</span>';
			}
			ret += '</div>';
			return ret;
		},
		getCheckboxFormNode : function(node){
			var that = this,
			checkbox = node.children('div').children('.'+that.options.checkboxShowClassName);
			return checkbox.length===0?null:checkbox.first();
		},
		checkedNode : function(node,status){
			var that = this,
			checkbox = that.getCheckboxFormNode(node);
			if(checkbox === null){
				return;
			}
			checkbox.removeClass(that.options.halfCheckedClassName);
			//checkbox[(status===true?'addClass':'removeClass')](that.options.checkedClassName);
			if(status === true){
				checkbox.addClass(that.options.checkedClassName);
				that.selectNodeId(node);
			}
			else{
				checkbox.removeClass(that.options.checkedClassName);
				that.unselectNodeId(node);
			}
		},
		//点选多选框时，观察同级节点选择情况决定是否选中夫节点
		checkedNodeInvolveParentNode : function(node,status){
			var that = this,
			checkbox = that.getCheckboxFormNode(node),
			parentNode,
			checkedBrothers,
			brothers,
			brothersNum;
			if(checkbox === null){
				return;
			}
			brothers = that.getBrothers(node);
			brothersNum = brothers.length;
			if(status==='yes' || status==='half'){
				checkbox.removeClass(that.options.halfCheckedClassName);
				checkbox.removeClass(that.options.checkedClassName);
				if(status==='yes'){
					checkbox.addClass(that.options.checkedClassName);
					that.selectNodeId(node);
				}
				else{
					checkbox.addClass(that.options.halfCheckedClassName);
					that.unselectNodeId(node);
				}
				//checkbox.addClass(status==='yes'?that.options.checkedClassName:that.options.halfCheckedClassName);
				checkedBrothers = that.reviewCurrentLevelChildrenIsChecked(node);
				if(checkedBrothers === 1){
					parentNode = that.getParentNode(node);
					that.checkedNodeInvolveParentNode(parentNode,brothers.length===1?'yes':'half');
				}
				else if(checkedBrothers > 1){
					parentNode = that.getParentNode(node);
					if(checkedBrothers === brothersNum){
						that.checkedNodeInvolveParentNode(parentNode,'yes');
					}
					else if(checkedBrothers === brothersNum-1){
						that.checkedNodeInvolveParentNode(parentNode,'half');
					}
				}
			}
			else{
				checkbox.removeClass(that.options.halfCheckedClassName);
				checkbox.removeClass(that.options.checkedClassName);
				that.unselectNodeId(node);
				checkedBrothers = that.reviewCurrentLevelChildrenIsChecked(node);
				if(checkedBrothers === 0){
					parentNode = that.getParentNode(node);
					that.checkedNodeInvolveParentNode(parentNode,'no');
				}
				else if(checkedBrothers === brothersNum-1){
					parentNode = that.getParentNode(node);
					that.checkedNodeInvolveParentNode(parentNode,'half');
				}
			}
		},
		//操作所有子节点
		checkAllChildNodes : function(node, status){
			var that = this,
			descendants = that.getDescendants(node),
			descendant;
			for(var i=0,l=descendants.length;i<l;i++){
				descendant = descendants.eq(i);
				that.checkedNode(descendant,status);
			}
		},
		reviewNodeIsChecked : function(node){
			var that = this,
			ret = false,
			checkbox = that.getCheckboxFormNode(node);
			if(checkbox === null){
				return false;
			}
			if(checkbox.hasClass(that.options.checkedClassName)){
				ret = true;
			}
			return ret;
		},
		//检测当前层级子节点是否有被选中
		reviewCurrentLevelChildrenIsChecked : function(node){
			var that = this,
			ret = 0,
			brothers = that.getBrothers(node);
			for(var i=0,l=brothers.length;i<l;i++){
				if(that.reviewNodeIsChecked(brothers.eq(i))){
					ret++;
				}
			}
			return ret;
		}
	});
})(jQuery,Energon.ui.dynamicTree);