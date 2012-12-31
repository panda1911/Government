/**
 * 组织选择控件
 * @author : panda
 * @createTime : 2012-12-31
 */
(function($){
	var C = G.common,
	triggerClassName = 'organization-manager-btn',
	organizationRangeDialog = $('#organizationRangeDialog'),
	organizationTreeContainer = $('#organizationTreeContainer'),
	selectedOrganizationBox = $('#selectedOrganizationBox'),
	body = document.body,
	selectedOrganizationCache = new C.idCache(),
	organizationTree,
	selectOrganization = function(e){
		var that = this,
		el = $(e.currentTarget),
		node = that.getClosestLi(el),
		name = that.getName(node),
		id = node.attr('id'),
		isChecked = el.hasClass(that.options.checkedClassName);
		if(isChecked){
			buildSelectedOrganization(id,name);
		}
		else{
			removeSelectedOrganization(id);
		}
	},
	buildOrganizationTree = function(){
		var config = G.ajaxConfig['organizationTree'],
		url = config.url,
		param = config.param;
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			var data;
			if(o && o.isSuccess){
				data = o.data;
				organizationTree = new Energon.ui.selectableWithSingleTree({
					container : organizationTreeContainer,
					content : data,
					clickboxEvent : selectOrganization
				});
			}
		});
	},
	buildSelectedOrganization = function(id,name){
		var ret = '<label class="item" data-organization-id="';
		ret += id;
		ret += '">';
		ret += name;
		ret += '<a class="item-close-btn" href="#" title="关闭"></a></label>';
		selectedOrganizationBox.append(ret);
		selectedOrganizationCache.save({'id':id,'name':name});
	},
	removeSelectedOrganization = function(id){
		var organization = selectedOrganizationBox.find('[data-organization-id="'+id+'"]').first();
		organization.remove();
		selectedOrganizationCache.remove(id);
	},
	unselectOrganization = function(id){
		var node = organizationTree.getNodeById(id);
		organizationTree.checkedNode(node,false);
	},
	getSelectedOrganizations = function(){
		var ids = selectedOrganizationCache.output();
		return ids
	},
	init = function(){
		buildOrganizationTree();
		$(body).delegate('.'+triggerClassName,'click',function(e){
			e.preventDefault();
			$.use('ui-dialog', function(){
				organizationRangeDialog.dialog({
					fixed : true,
					center : true,
					fadeOut : false
				});
			});
		});
		selectedOrganizationBox.delegate('.item-close-btn','click',function(e){
			e.preventDefault();
			var el = $(this),
			memberId = el.parent().attr('data-organization-id');
			removeSelectedOrganization(memberId);
			unselectOrganization(memberId);
		});
		organizationRangeDialog.delegate('.submit-btn', 'click', function(e){
			var custom = getSelectedOrganizations(),
			event = $.Event('select.organizationManager');
			event.custom = custom;
			organizationRangeDialog.dialog('close');
			$(this).trigger(event);
		});
	}();
})(jQuery);