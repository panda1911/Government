/**
 * 公共JS集合
 * @author : panda
 * @createTime : 2012-11-18
 */
(function(){
	ImportJavascript = {
		url:function(url){
			document.write('<script type="text/javascript" src="'+url+'"></scr'+'ipt>');
		}
	};
})();

ImportJavascript.url('../scripts/global/common.js');
ImportJavascript.url('../scripts/global/ajax-config.js');
ImportJavascript.url('../scripts/module/self-adaption-height.js');
ImportJavascript.url('../scripts/module/imitate-checkbox.js');
ImportJavascript.url('../scripts/module/tip.js');
ImportJavascript.url('../scripts/module/placeholder.js');
ImportJavascript.url('../scripts/module/tree.js');
ImportJavascript.url('../scripts/module/tree-dynamic.js');
ImportJavascript.url('../scripts/module/tree-selectable-with-dynamic.js');
ImportJavascript.url('../scripts/module/tree-selectable-with-single.js');