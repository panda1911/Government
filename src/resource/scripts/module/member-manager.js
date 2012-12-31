/**
 * 用户选择控件
 * @author : panda
 * @createTime : 2012-12-25
 */
(function($){
		var C = G.common,
		memberRangeDialog = $('#memberRangeDialog'),
		organizationBox = memberRangeDialog.find('.organization-tree-container').first(),
		body = document.body,
		triggerClassName = 'member-manager-btn',
		selectedOrganization = $('#selectedOrganization'),
		organizationBox = $('#organizationBox'),
		organizationTree,
		memberBox = $('#memberBox'),
		selectedMemberBox = $('#selectedMemberBox'),
		selectedMemberCache = new C.idCache(),
		getMembers = function(e){
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
				s += '" data-member-name="'
				s += name;
				if(selectedMemberCache.has(id)){
					s += '" checked="checked'
				}
				s += '"/>';
				s += name;
				s += '</label>';
			}
			memberBox.html(s);
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
				console.info(o);
				if(o && o.isSuccess){
					data = o.data;
					organizationTree = new Energon.ui.tree({
						container : organizationBox,
						content : data,
						clickEvent : getMembers
					});
				}
			});
		},
		selectMember = function(id,name,isSelected){
			if(isSelected){
				buildSelectedMember(id,name);
			}
			else{
				removeSelectedMember(id);
			}
		},
		buildSelectedMember = function(id,name){
			var ret = '<label class="item" data-member-id="';
			ret += id;
			ret += '">';
			ret += name;
			ret += '<a class="item-close-btn" href="#" title="关闭"></a></label>';
			selectedMemberBox.append(ret);
			selectedMemberCache.save({'id':id,'name':name});
		},
		removeSelectedMember = function(id){
			var member = selectedMemberBox.find('[data-member-id="'+id+'"]').first();
			member.remove();
			selectedMemberCache.remove(id);
		},
		getSelectedMembers = function(){
			var ids = selectedMemberCache.output();
			return ids
		},
		unselectMember = function(id){
			var member = memberBox.find('[data-member-id="'+id+'"]').first();
			member.prop('checked',false);
		},
		init = function(){
			buildOrganizationTree();
			$(body).delegate('.'+triggerClassName,'click',function(e){
				e.preventDefault();
				$.use('ui-dialog', function(){
					memberRangeDialog.dialog({
						fixed : true,
						center : true,
						fadeOut : false
					});
				});
			});
			selectedOrganization.on('click',function(e){
				var el = $(this),
				organizationId = el.attr('data-organization-id');
				if(organizationTree){
					organizationTree.location(organizationId);
				}
				organizationBox.show();
				$(body).on('click.selectOrganization',function(e){
					var target = e.target;
					if(!$.contains(organizationBox[0],target) && target!==selectedOrganization[0]){
						organizationBox.hide();
						$(body).off('click.selectOrganization');
					}
				});
			});
			memberBox.delegate('input[type="checkbox"]','click',function(e){
				var el = $(this),
				memberId = el.attr('data-member-id'),
				memberName = el.attr('data-member-name'),
				isChecked = el.prop('checked');
				selectMember(memberId,memberName,isChecked);
			});
			selectedMemberBox.delegate('.item-close-btn','click',function(e){
				e.preventDefault();
				var el = $(this),
				memberId = el.parent().attr('data-member-id');
				removeSelectedMember(memberId);
				unselectMember(memberId);
			});
			memberRangeDialog.delegate('.submit-btn', 'click', function(e){
				var custom = getSelectedMembers(),
				event = $.Event('select.memberManager');
				event.custom = custom;
				memberRangeDialog.dialog('close');
				$(this).trigger(event);
			});
		}();
})(jQuery);