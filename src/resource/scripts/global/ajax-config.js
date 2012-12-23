/**
 * ajax链接公共配置
 * @author : panda
 * @createTime : 2012-12-16
 */
(function($){
	$.namespace('G.ajaxConfig');
	G.ajaxConfig = {
		organizationTree : {
			url : 'json/organization-tree.json',
			param : {}
		},
		organizationDetail : {
			url : 'json/organization-detail.json',
			param : {}
		},
		memberList : {
			url : 'json/member-list.json',
			param : {
				organizationId : null
			}
		},
		memberDetail : {
			url : 'json/member-detail.json',
			param : {
				memberId : null
			}
		}
	};
})(jQuery);