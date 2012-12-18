/*
 * jQuery UI Flash-uploader 2.0
 *
 * @author Denis 2011.12.28
 * Depends:
 *	jQuery.ui.flash
 * @update jianping.shenjp 2012.03.8 ����enableMultiple��disableMultiple��isMultiple����������swfReady�¼�ʱ��ͨ��setBrowseFilter�����ϴ�����
 */
('Uploader2' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util;
    function uploader(){
        var self = this, swfid = self.element[0].id, o = self.options;
        o = self.options = $.extend(true, {
            swf: 'http://img.china.alibaba.com/swfapp/aliuploader/aliuploader-v3.2.swf',
            width: 65,
            height: 22,
            allowscriptaccess: 'always',
            fileFilters: [{
                description: "ͼƬ(*.jpg, *.jpeg, *.gif, *.png, *.bmp)",
                extensions: "*.jpg;*.jpeg;*.gif;*.png;*.bmp;"
            }],
            identity:"fname",//���й�վʹ��ʱ��ʹ��'fname'
            flashvars: {
                //enabled: false,
                //Ϊ�˷�ֹIE�¿������⣬ͳһ����Ϊ500
                startDelay: 500,
                // ��ťƤ������Ҫ���������ṩ��normal����hover����active����disabled������״̬ͼ���Ҹ߶�һ��
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/2011/040/820/28040_548721671.gif',
                //�¼�����
                eventHandler: 'jQuery.util.flash.triggerHandler'
            }
        }, o);
        //��װflash������flash�汾��С��10
        if ($util.flash.hasVersion(10)) {
            //�����ϴ�����
            if (o.fileFilters) {
                self.element.bind('swfReady.flash', function(e, data){
                    self.obj.setBrowseFilter(o.fileFilters);
                });
            }
            //ps:��չ����дflash��
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
                _setOption: function(key, value){
                    $.ui.flash.prototype._setOption.call(this, key, value);
                    return this;
                },
                
                /**
                 * �ϴ�
                 * @param {Object} url
                 * @param {Object} param
                 */
                uploadAll: function(url, param, fileFieldName){
                    url += ((url.indexOf('?') < 0) ? '?' : '&') + '_input_charset=UTF-8';
                    self.obj.uploadAll(url, param, fileFieldName, this._getFlashConfigs().identity);
                    return self;
                },
                /**
                 * ��ȡ��Ӧ�ļ�id���ļ���Ϣ
                 * @param {Object} id
                 */
                getFileStatus: function(id){
                    return this.obj.getFileStatus(id);
                },
                /**
                 * ��ȡ�����ļ�����Ϣ
                 */
                getFileStatuses: function(){
                    return this.obj.getFileStatuses();
                },
                /**
                 * �����ļ���������
                 * @param {Array} filter ����Ԫ�ظ�ʽ���£�
                 *  {
                 *      //description���û��ܿ���������
                 *      description: 'ͼƬ�ļ� (jpg,jpeg,gif)',
                 *      //extensions ���Էֺŷָ��ĺ�׺�б�
                 *      extensions: '*.jpg; *.jpeg; *.gif;'
                 *  }
                 */
                setBrowseFilter: function(filter){
                    this.obj.setBrowseFilter(filter);
                    $.log('setBrowseFilter');
                    return this;
                },
                /**
                 * ��̬�޸�ÿ���ϴ���������
                 * @param {Int} n
                 */
                setFileCountLimit: function(n){
                    this.obj.setFileCountLimit(n);
                    $.log('setFileCountLimit:' + n);
                    return this;
                },
                /**
                 * ��յ�ǰ�ϴ����ļ�״̬�б�
                 */
                clear: function(){
                    this.obj.clear();
                    $.log('clear');
                    return this;
                },
                /**
                 * ���ʧЧ
                 */
                disable: function(){
                    self.obj.disable();
                    $.log('disable');
                    return this._setOption('disabled', true);
                },
                /**
                 * �����Ч
                 */
                enable: function(){
                    self.obj.enable();
                    $.log('enable');
                    return this._setOption('disabled', false);
                },
                /**
                 * ����Ƿ���Ч
                 */
                isEnabled: function(){
                    $.log('isEnabled');
                    return self.obj.isEnabled();               
                },
                /**
                 * �����û�һ��ѡ�����ļ�
                 */
                enableMultiple: function(){
                    $.log('enableMultiple');
                    self.obj.enableMultiple();
                    return this;               
                },
                /**
                 * ��������������û�һ��ֻ��ѡ��1���ļ�
                 */
                disableMultiple: function(){
                    $.log('disableMultiple');
                    self.obj.disableMultiple();
                    return this;               
                },
                /**
                 * ���ص�ǰ�û�Ŀǰ�Ƿ����ѡ�����ļ�
                 */
                isMultiple: function(){
                    $.log('isMultiple');
                    return self.obj.isMultiple();   
                }
            });
            //��Ҫflash����ṩ�������� return true;
            return true;
        }else{
            $.extend(self,{
                //��û��flash��汾��������ʾ����flash
                _render:function(){
                        var elem = self.element, o = self.options;
                        elem.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank">��Ǹ����δ��װflash���޷�ʹ���ϴ����ܣ���������flash��</a>');
                        //��������
                        var con = $('>a', elem).css({
                            position:'static'
                        });
                }
            });
            self._render();
            //���
            if (typeof window.dmtrack != "undefined") {
                dmtrack.clickstat('http://stat.china.alibaba.com/tracelog/click.html', '?tracelog=ibank_noflash');
            }
            //����Ҫflash����ṩ��������flash�Ĳ��� return false;
            return false;
        }
    };
    $util.flash.regist('uploader2', uploader);
    $.add('ui-flash-uploader2');
})(jQuery);
