(function(){
	ImportJavascript = {
		url:function(url){
			document.write('<script type="text/javascript" src="'+url+'"></scr'+'ipt>');
		}
	};
})();

ImportJavascript.url('../js/lib/energon/core/jquery-1.7.2.min.js');

ImportJavascript.url('../js/lib/energon/core/gears.js');
ImportJavascript.url('../js/lib/energon/core/web.js');
ImportJavascript.url('../js/lib/energon/core/config.js');