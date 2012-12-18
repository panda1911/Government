/**
 * @author xianxia.jinaxx
 * @file websocket
 * @date 2011-07-12
 */
('websocket' in jQuery.ui.flash) ||
(function($){
    var $util = $.util;
    function WebSocket(){
        var self = this, swfid = self.element[0].id, o = self.options, swfurl = o.swf || 'http://img.china.alibaba.com/swfapp/websocket/websocket-20111121.swf';
        o = self.options = $.extend(true, {
            swf: swfurl,
            //����ű�
            allowScriptAccess: 'always',
            flashvars: {
                debug:false,
                //�¼�����
                eventHandler: 'jQuery.util.flash.triggerHandler'
            }
        }, o);
        $.extend(self, {
            /**
             * ����Flash�����ò���
             */
            _getFlashConfigs: function(){
                var self = this, configs;
                //����ԭʼ����
                configs = $.ui.flash.prototype._getFlashConfigs.call(self);
                //�����swfid��ʵ������id
                configs.flashvars.swfid = swfid;
                return configs;
            },
            /**
             * ������Ϣ
             * @param {Object} data
             */
            send: function(data){
                if (this.readyState === 2) {
                    return;
                }
                try {
                    /*this.obj.send(data);*/
                    this.callMethod('send',data);
                } 
                catch (e) {
                    $.log('send msg is error ' + e.message);
                }
            },
            /**
             * �򿪳�����
             * @param {Object} config
             */
            open: function(config){
                try {
                    //��ȫУ�飬��ֹ������������ʼ��flash��λ���뷢����Ϣ��λ�ò�һ�µ�
                    this.obj.setCallerUrl(location.href);
                    this.obj.create(config.url, config.protocal);
                } 
                catch (e) {
                    $.log('setCallerUrl or create websocket error is ' + e.message);
                }
            },
            /**
             * �رճ�����
             */
            close: function(){
                this.obj.close();
            },

            getReadyState:function(){
                return this.obj.getReadyState();
            }


        });
        //��Ҫflash����ṩ�������� return true;
        return true;
    }
    $util.flash.regist('websocket', WebSocket);
    $.add('ui-flash-websocket');
})(jQuery);

