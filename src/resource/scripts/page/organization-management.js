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
	upBtn = $('#upBtn'),
	downBtn = $('#downBtn'),
	organizationTree,
	//管理上移、下移按钮
	manageUpAndDown = function(node){
		var id = node.attr('id'),
		customAttr = 'data-current-node-id';
		if(organizationTree.isOnlyChild(node)){
			C.forbiddenBtn(upBtn);
			C.forbiddenBtn(downBtn);
		}
		else if(organizationTree.isLastChild(node)){
			C.activateBtn(upBtn);
			upBtn.attr(customAttr,id);
			C.forbiddenBtn(downBtn);
		}
		else if(organizationTree.isFirstChild(node)){
			C.forbiddenBtn(upBtn);
			C.activateBtn(downBtn);
			downBtn.attr(customAttr,id);
		}
		else{
			C.activateBtn(upBtn);
			upBtn.attr(customAttr,id);
			C.activateBtn(downBtn);
			downBtn.attr(customAttr,id);
		}
	},
	//移动组织节点
	moveNode = function(id,isUp){
		var config = G.ajaxConfig['moveOrganization'],
		url = config.url,
		param = config.param,
		node;
		param['organizationId'] = id;
		param['direction'] = isUp?-1:1;
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			if(o && o.isSuccess){
				node = organizationTree.getNodeById(id);
				if(isUp){
					organizationTree.shiftUp(node);
				}
				else{
					organizationTree.shiftDown(node);
				}
				manageUpAndDown(node);
			}
		});
	},
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
		manageUpAndDown(node);
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
				organizationTree = new Energon.ui.selectableWithDynamicTree({
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
		upBtn.on('click',function(e){
			e.preventDefault();
			var el = $(this),
			currentNodeId = el.attr('data-current-node-id'),
			isDisabled = el.attr('disabled');
			if(isDisabled){
				return;
			}
			moveNode(currentNodeId,true);
		});
		downBtn.on('click',function(e){
			e.preventDefault();
			var el = $(this),
			currentNodeId = el.attr('data-current-node-id'),
			isDisabled = el.attr('disabled');
			if(isDisabled){
				return;
			}
			moveNode(currentNodeId,false);
		});
	}();
});