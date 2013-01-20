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
	allSelectBtn = $('#allSelectBtn'),
	addBtn = $('#addBtn'),
	body = $(document.body),
	organizationTree,
	editableMemberInfo = null,
	isOpenAdd = false,
	editableMemberDetailTemplate = '<form action="#" method="post">\
	<input type="hidden" value="<%=$data.id%>"/>\
	<ul class="editable-member-info form-list">\
	<li>\
	<label class="label-describe">用户名：</label>\
	<input type="text" class="input-box" value="<%=$data.userName%>"/>\
	</li>\
	<li>\
	<label class="label-describe">真实姓名：</label>\
	<input type="text" class="input-box" value="<%=$data.trueName%>"/>\
	</li>\
	<li>\
	<label class="label-describe">所在部门：</label>\
	<input type="text" class="input-box" value="<%=$data.department%>"/>\
	</li>\
	<li>\
	<label class="label-describe">单位权限：</label>\
	<input type="text" class="input-box" value="<%=$data.authority%>"/>\
	</li>\
	<li>\
	<label class="label-describe">密码：</label>\
	<input type="text" class="input-box" value="<%=$data.password%>"/>\
	</li>\
	</ul>\
	<div class="operate-area">\
	<button class="btn btn-large" type="submit">保存</button>\
	<button class="btn btn-large reset-btn" type="reset">重置</button>\
	</div>\
	</form>',
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
		//清空会员详情区域
		clearAllMemberDetails();
		manageNoInfoTip();
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
	getMemberDetail = function(id,isEditable){
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
				if(isEditable){
					buildEditableMemberDetail(data);
					editableMemberInfo = data;
				}
				else{
					buildMemberDetail(data);
				}
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
		manageNoInfoTip();
	},
	buildEditableMemberDetail = function(o){
		$.use('web-sweet', function(){
			var html = FE.util.sweet(editableMemberDetailTemplate).applyData(o);
    		memberInfoContainer.html(html);
    		manageNoInfoTip();
		});
	},
	clearAllMemberDetails = function(){
		var details = memberInfoContainer.find('[data-member-id]'),
		detail,
		memberId,
		key;
		for(var i=0,l=details.length;i<l;i++){
			detail = details.eq(i);
			memberId = detail.attr('data-member-id');
			key = 'info'+memberId;
			detail.remove();
		}
		editableMemberInfo = null;
		isOpenAdd = false;
	},
	showMemberDetail = function(isChecked,memberId,key){
		if(isChecked){
			if(memberInfoContainer.children().length === 0){
				getMemberDetail(memberId, true);
				return;
			}
			else if(editableMemberInfo){
				memberInfoContainer.html('');
				buildMemberDetail(editableMemberInfo);
				editableMemberInfo = null;
			}
			else if(isOpenAdd){
				isOpenAdd = false;
				getMemberDetail(memberId, true);
				return;
			}

			getMemberDetail(memberId);
		}
		else{
			if(memberInfoContainer.children().length===2){
				memberInfoContainer.find('[data-member-id="'+memberId+'"]').remove();
				getMemberDetail(memberInfoContainer.children().first().attr('data-member-id'), true);
			}
			else if(memberInfoContainer.children().length===1){
				memberInfoContainer.html('');
			}
			manageNoInfoTip();
		}
	},
	manageNoInfoTip = function(){
		if(memberInfoContainer.children().length !== 0){
			memberInfoContainer.removeClass('no-membership-info');
		}
		else{
			memberInfoContainer.addClass('no-membership-info');
		}
	},
	selectAllMembers = function(){
		var checkboxs = memberBox.find('input[type="checkbox"]'),
		checkbox,
		isChecked,
		memberId;
		for(var i=0,l=checkboxs.length;i<l;i++){
			checkbox = $(checkboxs[i]);
			isChecked = checkbox.prop('checked');
			if(!isChecked){
				memberId = checkbox.attr('data-member-id');
				checkbox.prop('checked',true);
				showMemberDetail(true,memberId,'info'+memberId);
			}
		}
	},
	clearAllMembers = function(){
		var checkboxs = memberBox.find('input[type="checkbox"]'),
		checkbox,
		isChecked;
		for(var i=0,l=checkboxs.length;i<l;i++){
			checkbox = checkboxs.eq(i);
			isChecked = checkbox.prop('checked');
			if(isChecked){
				checkbox.prop('checked',false);
			}
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
			showMemberDetail(isChecked,memberId,key);
		});
		memberInfoContainer.height(memberInfoContainer.parents('.content').first().height()-32);
		$('.layout-file-content>.content').first().on('adjust.selfAdaptionHeight',function(e){
			var el = $(this),
			contentHeight = e.custom.height;
			memberInfoContainer.height(contentHeight-32);
		});
		allSelectBtn.on('click',function(e){
			selectAllMembers(true);
		});
		addBtn.on('click',function(){
			clearAllMembers();
			clearAllMemberDetails();
			buildEditableMemberDetail({
				id : '',
				userName : '',
				trueName : '',
				department : '',
				authority : '',
				password : ''
			});
			isOpenAdd = true;
		});
	}();
});