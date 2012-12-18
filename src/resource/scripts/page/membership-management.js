/**
 * 用户管理
 * @author : panda
 * @createTime : 2012-12-18
 */
jQuery(function($){
	var C = G.common,
	memberBox = $('#memberBox'),
	organizationTreeContainer = $('#organizationTreeContainer'),
	selectedOrganization = $('#selectedOrganization'),
	organizationBox = $('#organizationBox'),
	body = $(document.body),
	organizationTree,
	showMembers = function(e){
		e.preventDefault();
		var that = this,
		el = $(e.currentTarget),
		node = that.getClosestLi(el),
		name = el.attr('title'),
		id = node.attr('id');
		that.pitchOnNode(node);
		getMembersByOrganizationId(id);
		selectedOrganization.attr('data-organization-id',id);
		selectedOrganization.val(name);
		organizationBox.hide();
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
				organizationTree = new Energon.ui.tree({
					container : organizationBox,
					content : data,
					clickEvent : showMembers
				});
			}
		});
	},
	getMembersByOrganizationId = function(id){
		var config = G.ajaxConfig['memberList'],
		url = config.url,
		param = config.param;
		param['organizationId'] = id;
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			var data;
			if(o && o.isSuccess){
				data = o.data;
				buildMembers(data);
			}
		});
	},
	buildMembers = function(a){
		var s = '',
		id,
		name;
		for(var i=0,l=a.length;i<l;i++){
			id = a[i].id;
			name = a[i].name;
			s += '<label class="checkbox"><input type="checkbox" data-member-id="';
			s += id;
			s += '"/>';
			s += name;
			s += '</label>';
		}
		memberBox.html(s);
	},
	getMemberDetail = function(memberId){
		
	},
	init = function(){
		getMembersByOrganizationId();
		buildOrganizationTree();
		selectedOrganization.on('click',function(e){
			var el = $(this),
			organizationId = el.attr('data-organization-id');
			if(organizationTree){
				organizationTree.location(organizationId);
			}
			organizationBox.show();
			body.on('click.selectOrganization',function(e){
				var target = e.target;
				if(!$.contains(organizationBox[0],target) && target!==selectedOrganization[0]){
					organizationBox.hide();
					body.off('click.selectOrganization');
				}
			});
		});
		memberBox.delegate('input[type="checkbox"]','click',function(e){
			var el = $(this),
			memberId = el.attr('data-member-id'),
			isChecked = el.prop();

		});
	}();
});