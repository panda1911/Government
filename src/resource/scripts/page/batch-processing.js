/**
 * 批量处理
 * @author : panda
 * @createTime : 2012-12-30
 */
(function($){
	var memberRangeDialog = $('#memberRangeDialog'),
	selectedMemberContainer = $('#selectedMemberContainer'),
	organizationRangeDialog = $('#organizationRangeDialog'),
	selectedOrganizationContainer = $('#selectedOrganizationContainer'),
	selectedOrganizations = $('#selectedOrganizations'),
	selectedMembers = $('#selectedMembers'),
	buildSelectedOptions = function(a,container,idContainer){
		var item,
		id,
		name,
		ids = [],
		ret = '';
		for(var i=0,l=a.length;i<l;i++){
			item = a[i];
			id = item.id;
			name = item.name;
			ids.push(id);
			ret += buildSelectedOption(id,name);
		}
		idContainer.val(ids.join());
		container.html(ret);
	},
	buildSelectedOption = function(id, name){
		var ret = '<label class="item" data-organization-id="';
		ret += id;
		ret += '">';
		ret += name;
		ret += '</label>';
		return ret;
	},
	init = function(){
		memberRangeDialog.on('select.memberManager',function(e){
			var custom = e.custom;
			buildSelectedOptions(custom,selectedMemberContainer,selectedMembers);
		});
		organizationRangeDialog.on('select.organizationManager',function(e){
			var custom = e.custom;
			buildSelectedOptions(custom,selectedOrganizationContainer,selectedOrganizations);
		});
	}();
})(jQuery);