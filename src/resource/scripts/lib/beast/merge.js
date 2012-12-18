/**
 * 淘数据JS库——Beast(野兽)的种子文件
 * @author : yu.yuy
 * @createTime : 2012-10-29
 * @email : yu.yuy@taobao.com
 */
(function(){
	ImportJavascript = {
		url:function(url){
			document.write('<script type="text/javascript" src="'+url+'"></scr'+'ipt>');
		}
	};
})();

ImportJavascript.url('/scripts/lib/beast/core/jquery-1.7.2.min.js');
ImportJavascript.url('/scripts/lib/beast/core/gears.js');
ImportJavascript.url('/scripts/lib/beast/core/web.js');
ImportJavascript.url('/scripts/lib/beast/core/config.js');