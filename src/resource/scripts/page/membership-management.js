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
	memberInfoContainer = $('#memberInfoContainer'),
	body = $(document.body),
	organizationTree,
	memberInfoCache = {},
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
	getMemberDetail = function(id){
		var config = G.ajaxConfig['memberDetail'],
		url = config.url,
		param = config.param;
		param['memberId'] = id;
		$.ajax({
			url : url,
			data : param,
			dataType : 'json'
		}).done(function(o){
			var data;
			if(o && o.isSuccess){
				data = o.data;
				buildMemberDetail(data);
			}
		});
	},
	buildMemberDetail = function(o){
		var ret = '<ul class="member-info" data-member-id="',
		id = o.id,
		userName = o.userName,
		trueName = o.trueName,
		department = o.department,
		authority = o.authority,
		password = o.password;
		ret += id;
		ret += '">';
		ret += '<li>';
		ret += '<span class="info-item"><label>用户名：</label>';
		ret += userName;
		ret += '</span>';
		ret += '<span class="info-item"><label>真实姓名：</label>';
		ret += trueName;
		ret += '</span>';
		ret += '<span class="info-item department-info"><label>所在部门：</label>';
		ret += department;
		ret += '</span>';
		ret += '</li>';
		ret += '<li>';
		ret += '<span class="info-item"><label>单位权限：</label>';
		ret += authority;
		ret += '</span>';
		ret += '<span class="info-item"><label>密码：</label>';
		ret += password;
		ret += '</span>';
		ret += '</li>';
		ret += '</ul>';
		memberInfoContainer.append(ret);
		memberInfoCache['info'+id] = true;
		manageNoInfoTip();
	},
	manageNoInfoTip = function(){
		var ret = false;
		for(var i in memberInfoCache){
			if(memberInfoCache[i] === true){
				ret = true;
				break;
			}
		}
		if(ret){
			memberInfoContainer.removeClass('no-membership-info');
		}
		else{
			memberInfoContainer.addClass('no-membership-info');
		}
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
			isChecked = el.prop('checked'),
			key = 'info'+memberId;
			if(isChecked){
				if(memberInfoCache[key]){
					memberInfoContainer.find('[data-member-id="'+memberId+'"]').show();
					memberInfoCache[key] = true;
					manageNoInfoTip();
				}
				else{
					getMemberDetail(memberId);
				}
			}
			else{
				memberInfoContainer.find('[data-member-id="'+memberId+'"]').hide();
				memberInfoCache[key] = false;
				manageNoInfoTip();
			}
		});

		memberInfoContainer.height(memberInfoContainer.parents('.content').first().height()-32);
		$('.layout-file-content>.content').first().on('adjust.selfAdaptionHeight',function(e){
			var el = $(this),
			contentHeight = e.custom.height;
			memberInfoContainer.height(contentHeight-32);
		});
	}();
});