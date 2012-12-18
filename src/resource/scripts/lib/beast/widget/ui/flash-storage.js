/**
 * SWFStore fdev-4 version
 * @author honglun.menghl 2011-6-14
 * ���� fdev-4 �� SWFStore ��д��ԭ���� qhwa
 * Dependence:
 *	jQuery.ui.flash
 */
('storage' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util, storage = function(){
        /**
         * SWF store ���캯��
         */
        if ($util.flash.hasVersion(9)) {
            var self = this, swfid = self.element[0].id, o = self.options, swfurl = 'http://img.china.alibaba.com/swfapp/swfstore/swfstore.swf';
            o = self.options = $.extend(true, {
                width: 1,
                height: 1,
                swf: swfurl,
                //����ű�
                allowScriptAccess: 'always',
                flashvars: {
                    swfid: swfid,
                    startDelay: 500,
                    local_path: '/',
                    allowedDomain: location.hostname,
                    //�¼�����
                    eventHandler: 'jQuery.util.flash.triggerHandler'
                }
            }, o);
            
            $.extend(self, {
                getEngine: function(){
                    var self = this;
                    return {
                        setItem: function(key, value){
                            return self.callMethod('setItem',key,value);
                        },
                        getItem: function(key){
                            return self.callMethod('getValueOf',key);
                        },
                        removeItem: function(key){
                            return self.callMethod('removeItem',key);
                        },
                        clear: function(){
                            return self.callMethod('clear');
                        },
                        getLength: function(){
                            return self.callMethod('getLength');
                        },
                        key: function(n){
                            return self.callMethod('getNameAt',n);
                        }
                    }
                }
                
            });
            return true;
        }
        return false;
    }
    $util.flash.regist('storage', storage);
    $.add('ui-flash-storage');
})(jQuery);
