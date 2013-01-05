/**
 * 组织管理
 * @author : panda
 * @createTime : 2012-12-16
 */
jQuery(function($){
	var C = G.common,
	organizationTreeContainer = $('#organizationTreeContainer'),
	organizationId = $('#organizationId'),
	organizationName = $('#organizationName'),
	organizationAddress = $('#organizationAddress'),
	organizationPhoneNumber = $('#organizationPhoneNumber'),
	organizationPassword = $('#organizationPassword'),
	organizationAbstract = $('#organizationAbstract'),
	addOrganizationBtn = $('#addOrganizationBtn'),
	customBtn = $('#customBtn'),
	customAuthorityDialog = $('#customAuthorityDialog'),
	deleteOrganizationBtn = $('#deleteOrganizationBtn'),
	organizationTree,
	getOrganizationDetail = function(e){
		e.preventDefault();
		var that = this,
		el = $(e.currentTarget),
		node = that.getClosestLi(el),
		id = node.attr('id'),
		config = G.ajaxConfig['organizationDetail'],
		url = config.url,
		param = config.param;
		param[id] = id;
		that.pitchOnNode(node);
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			var data;
			if(o && o.isSuccess){
				data = o.data;
				showOrganizationDetail(data);
			}
		});
	},
	showOrganizationDetail = function(o){
		organizationId.val(o['id'] || '');
		organizationName.val(o['name'] || '');
		organizationAddress.val(o['address'] || '');
		organizationPhoneNumber.val(o['phoneNumber'] || '');
		organizationPassword.val(o['password'] || '');
		organizationAbstract.val(o['abstract'] || '');
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
					clickEvent : getOrganizationDetail
				});
			}
		});
	},
	removeOrganizations = function(ids){
		var config = G.ajaxConfig['removeOrganizations'],
		url = config.url,
		param = config.param;
		if(!ids){
			alert('请选择要删除的组织！');
			return;
		}
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			if(o && o.isSuccess){
				location.reload();
			}
		});
	},
	init = function(){
		buildOrganizationTree();
		addOrganizationBtn.on('click',function(e){
			e.preventDefault();
			showOrganizationDetail({});
		});
		customBtn.on('click',function(e){
			e.preventDefault();
			$.use('ui-dialog', function(){
				customAuthorityDialog.dialog({
					fixed : true,
					center : true,
					fadeOut : false
				});
			});
		});
		deleteOrganizationBtn.on('click',function(e){
			e.preventDefault();
			var ids;
			if(confirm('你确定要删除这些选中的组织？')){
				if(organizationTree){
					ids = organizationTree.getSelectedNodeIds();
					removeOrganizations(ids);
				}
			}
		});
	}();
});