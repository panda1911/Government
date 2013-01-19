/**
 * 公共函数区域
 * @author : panda
 * @createTime : 2012-12-16
 */
 (function($){
 	$.extend({
 		namespace: function(){
            var a = arguments, o, i = 0, j, d, arg;
            for (; i < a.length; i++) {
                o = window;
                arg = a[i];
                if (arg.indexOf('.')) {
                    d = arg.split('.');
                    for (j = (d[0] == 'window') ? 1 : 0; j < d.length; j++) {
                        o[d[j]] = o[d[j]] || {};
                        o = o[d[j]];
                    }
                } else {
                    o[arg] = o[arg] || {};
                }
            }
        }
 	});
 	$.namespace('G.common');
 	G.common = {
        forbiddenBtn : function(btn){
            btn.attr('disabled',true);
        },
        activateBtn : function(btn){
            btn.attr('disabled',false);
        },
        init : function(){
            var body = $(document.body);
            body.delegate('.dialog-close-btn,.dialog-cancel-btn','click',function(e){
                e.preventDefault();
                var el = $(this),
                dialog = el.parents('.dialog').first();
                dialog.dialog('close');
            });
        }()
 	};
    G.common.idCache = function(){
        this.a = [];
        this.save = function(o){
            this.a.push(o);
        };
        this.remove = function(id){
            for(var i=0,l=this.a.length;i<l;i++){
                if(this.a[i]['id'] === id){
                    this.a.splice(i,1);
                    return;
                }
            }
        };
        this.output = function(){
            return this.a;
        };
        this.has = function(id){
            var ret = false;
            for(var i=0,l=this.a.length;i<l;i++){
                if(this.a[i]['id'] === id){
                    ret = true;
                    break;
                }
            }
            return ret;
        };
    };
 })(jQuery);