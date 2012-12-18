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

ImportJavascript.url('../scripts/lib/beast/merge.js');
ImportJavascript.url('../scripts/global/common.js');
ImportJavascript.url('../scripts/global/ajax-config.js');
ImportJavascript.url('../scripts/module/imitate-checkbox.js');
ImportJavascript.url('../scripts/module/tip.js');
ImportJavascript.url('../scripts/module/placeholder.js');
ImportJavascript.url('../scripts/module/tree.js');