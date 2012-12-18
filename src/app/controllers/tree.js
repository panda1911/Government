(function(){
	var renderTree = function(a){
		var ret = [];
		if(a && a.length>0){
			ret.push('<ul>');
			for(var i=0,l=a.length;i<l;i++){
				ret.push('<li class="');
				if(a.chirdren && a.chirdren.length>0){
					ret.push('jstree-closed');
				}else{
					ret.push('jstree-leaf');
				}
				if(i===l-1){
					ret.push(' jstree-last');
				}
				ret.push('">');
				ret.push('<ins class="jstree-icon">&nbsp;</ins>');
				ret.push('<a href="'+a[i].url+'" title="'+a[i].name+'">');
				ret.push('<ins class="jstree-icon">&nbsp;</ins>'+a[i].name);
				ret.push('</a>');
				if(a[i].chirdren && a[i].chirdren.length>0){
					console.info('---------');
					console.info(a[i].chirdren.length);
					ret.push(renderTree(a[i].chirdren));
				}
				ret.push('</li>');
			}
			ret.push('</ul>');
		}
		return ret.join('');
	};
	exports.html = function(a){
		return renderTree(a);
	}
})();