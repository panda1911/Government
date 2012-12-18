/*
 * jQuery UI Flash-uploader 1.4
 *
 * @author Denis 2011.02.26
 * @author Denis 2011.03.21 ����aliuploader�ļ��汾��v2.7
 * @update Denis 2011.06.14 ʹ���µ�flashע�᷽ʽ
 * @update Denis 2011.06.15 ����interfaceReady�¼���ͬ��Flash�¼�
 * changelog:	1.�������µ�ͼƬ�����㷨���Ż���ͼƬ��Сʱ������
 * 				2.���ڳ���Flash����������ͼƬ�����ڰ��ϴ�ʧ�ܴ���
 * @update Denis 2011.10.24 �޸�uploadAll������flashģʽ�µ�BUG
 * @update Denis 2011.11.23 ��HTMLʵ���У��ļ���ʽ����ʱ�����ϴ���finish�¼�
 * @update Denis 2011.11.24 �����ļ�ѡ��ʱ��״̬��Ϣ��HTMLģʽ
 * @update Denis 2012.02.24 ����"flash"���ã������ֶ�����flashģʽ��
 * Depends:
 *	jQuery.ui.flash
 */
('Uploader' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util, $isArray = $.isArray, uploader = function(){
        var self = this, swfid = self.element[0].id, ie67 = $util.ua.ie67, o = self.options;
        o = self.options = $.extend(true, {
            width: 65,
            height: 22,
            inputName: 'imgFile',
            fileFilters: [{
                description: "ͼƬ(*.jpg, *.jpeg, *.gif, *.png, *.bmp)",
                extensions: "*.jpg;*.jpeg;*.gif;*.png;*.bmp;"
            }],
            flashvars: {
                // ��ťƤ������Ҫ���������ṩ��normal����hover����active����disabled������״̬ͼ���Ҹ߶�һ��
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/2011/040/820/28040_548721671.gif',
                //�¼�����
                eventHandler: 'jQuery.util.flash.triggerHandler'
            }
        }, o);
        
        //��ie�£�����flash�汾��С��10
        if (o.flash || ($util.ua.ie && $util.flash.hasVersion(10))) {
            o = self.options = $.extend(true, {
                swf: 'http://img.china.alibaba.com/swfapp/aliuploader/aliuploader-v2.7.swf',
                allowscriptaccess: 'always',
                flashvars: {
                    //����Ϊ��λ�ĳ�ʱʱ��
                    dataTimeoutDelay: 60,
                    //�Ƿ��������ϴ�����ļ�
                    allowSimul: true,
                    //�������������
                    simUploadLimit: 1,
                    // �����ļ��Ĵ�С���ƣ�Bytes��
                    sizeLimitEach: 0,
                    // �ϴ��Ĵ�С�ܺ����ƣ�Bytes��
                    sizeLimitTotal: 0,
                    // �Ƿ������ϴ�֮ǰ����ѹ��
                    allowCompress: false,
                    // ѹ����ͼƬ����ת��ΪJPG��ʽ��ͼƬ������
                    compressQuality: 80,
                    // �ڴ˴�С֮�µ��ļ�������ѹ������0����ѹ��
                    compressSize: 0,
                    // ѹ��ʱ��С���˿��֮��
                    compressWidth: 800,
                    // ѹ��ʱ��С���˸߶�֮��
                    compressHeight: 800,
                    // �����ѡ
                    allowMultiple: false,
                    // �����ϴ����ļ��������
                    fileNumLimit: 1,
                    //Ϊ�˷�ֹIE�¿������⣬ͳһ����Ϊ500
                    startDelay: 500
                }
            }, o);
            if (o.fileFilters) {
                self.element.bind('interfaceReady.flash', function(e, data){
                    self.obj.setFileFilters(o.fileFilters);
                    //$(this).flash('setFileFilters', o.fileFilters);
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
                    delete configs.flash;
                    delete configs.fileFilters;
                    delete configs.inputName;
                    //�����swfid��ʵ������id
                    configs.flashvars.swfid = swfid;
                    return configs;
                },
                _setOption: function(key, value){
                    var self = this;
                    $.ui.flash.prototype._setOption.call(self, key, value);
                    //��Ҫ����flash��setFileFilters����
                    if (key === 'fileFilters' && $isArray(value)) {
                        self.obj.setFileFilters(value);
                    }
                    return this;
                },
                
                /**
                 * �ϴ�
                 * @param {Object} url
                 * @param {Object} param
                 */
                uploadAll: function(url, param){
                    var self = this, o = self.options;
                    if (url.indexOf('?') < 0) {
                        url += '?_input_charset=UTF-8';
                    } else {
                        url += '&_input_charset=UTF-8';
                    }
                    self.obj.uploadAll(url, 'POST', param, o.inputName);
                    return self;
                },
                /**
                 * ��ȡ��ǰ�ϴ����ļ�״̬�б�
                 */
                getFileStatus: function(){
                    return this.obj.getFileStatus();
                },
                /**
                 * ��յ�ǰ�ϴ����ļ�״̬�б�
                 */
                clearFileList: function(){
                    this.obj.clearFileList();
                    return this;
                },
                /**
                 * ��̬�޸��ļ����ϴ��޶�
                 * @param {Int} num
                 */
                setFileCountLimit: function(num){
                    this.obj.setFileCountLimit(num);
                    return this;
                },
                /**
                 * ���ʧЧ
                 */
                disable: function(){
                    self.obj.disable();
                    return this._setOption('disabled', true);
                },
                /**
                 *
                 */
                enable: function(){
                    self.obj.enable();
                    return this._setOption('disabled', false);
                }
            });
            //��Ҫflash����ṩ�������� return true;
            return true;
        }
        else {
            //noformat
            var guid = $.guid++, 
				triggerHandler = new Function('return ' + o.flashvars.eventHandler)(), 
                proxy = $('<div>', {
                    'class': 'ui-flash-uploader'
                }).appendTo(document.body).html('<form action="" enctype="multipart/form-data" method="post" target="proxy' + guid + '"></form><iframe width="0" height="0" frameborder="0" name="proxy' + guid + '" src="about:blank"></iframe>'),
            	form = $('form', proxy),
				iframe = $('iframe', proxy),
				fileStatus = [],
				fileId, 
				fileName;
			//format
            
            if (o.flashvars.eventHandler) {
                iframe.bind('load', function(e){
                    try {
                        if (this.contentWindow.location.href === 'about:blank' || this.contentWindow.location.host !== location.host) {
                            return;
                        }
                        else {
                            //����ļ�״̬�б�
                            triggerHandler({
                                swfid: swfid,
                                type: 'uploadCompleteData',
                                id: fileId,
                                fileName: fileName,
                                data: $.unparam(this.contentWindow.location.href)
                            });
                            fileStatus[0].status = 'done';
                            triggerHandler({
                                swfid: swfid,
                                type: 'finish'
                            });
                        }
                    } 
                    catch (ev) {
                    }
                    
                });
            }
            
            $.extend(self, {
                /**
                 * �ϴ�
                 * @param {Object} url
                 * @param {Object} param
                 */
                uploadAll: function(url, param){
                    var self = this, o = self.options, hasSearch = url.lastIndexOf('?') > -1;
                    param = param || {};
                    //����form��action��ַ��method��ʽ
                    form.attr({
                        //Ǳ����
                        action: url + (hasSearch ? '&' : '?') + 'redirectUrl=http://' + location.host + '/crossdomain.xml&'
                    });
                    //׷���ϴ���post����
                    for (var name in param) {
                        var input = ie67 ? document.createElement('<input type="text" name="' + name + '">') : $('<input>', {
                            type: 'text',
                            name: name
                        })[0];
                        input.value = param[name];
                        form.append(input);
                    }
                    fileStatus[0] = {
                        id: fileId,
                        name: fileName,
                        status: 'uploading'
                    };
                    //�ύ��
                    triggerHandler({
                        swfid: swfid,
                        type: 'uploadStart',
                        id: fileId,
                        fileName: fileName
                    });
                    form.submit();
                    
                    return self;
                },
                /**
                 * ���ص�ǰ�����ļ���״̬
                 */
                getFileStatus: function(){
                    return fileStatus;
                },
                /**
                 * ��յ�ǰ�ϴ����ļ�״̬�б�
                 */
                clearFileList: function(){
                    fileStatus.length = 0;
                    return this;
                },
                /**
                 * ��̬�޸��ļ����ϴ��޶�
                 * @param {Int} num
                 */
                setFileCountLimit: function(num){
                    return this;
                },
                /**
                 * ���ʧЧ
                 */
                disable: function(){
                    $('input', this.element).prop('disabled', true);
                    return this._setOption('disabled', true);
                },
                /**
                 *
                 */
                enable: function(){
                    $('input', this.element).prop('disabled', false);
                    return this._setOption('disabled', false);
                },
                /**
                 * ��չ_destroy
                 */
                _destroy: function(){
                    var self = this;
                    proxy.remove();
                    $.ui.flash.prototype._destroy.call(self);
                },
                _render: function(){
                    var elem = self.element, o = self.options;
                    elem.html('<div><input type="file" name="' + o.inputName + '" hidefocus="true" autocomplete="off"/><a href="javascript:;">&nbsp;</a></div>');
                    //��������
                    var con = $('>div', elem).css({
                        width: o.width,
                        height: o.height
                    }), file = $('>input', con), trigger = $('>a', con).css({
                        width: o.width,
                        height: o.height,
                        'background-image': 'url(' + o.flashvars.buttonSkin + ')'
                    });
                    file.hover(function(){
                        trigger.addClass('ui-state-hover');
                    }, function(){
                        trigger.removeClass('ui-state-hover');
                    }).bind('change', function(e){
                        //��ȡ�ļ���Ϣ���������ļ��ϴ�����id
                        fileId = 'file' + $.guid++;
                        fileName = file.val().split('\\').pop();
                        if ($isArray(o.fileFilters)) {
                            var extensions = '';
                            $.each(o.fileFilters, function(i, fileFilter){
                                extensions += fileFilter.extensions;
                            });
                            //ȥ��ĩβ�ķֺ�
                            if (extensions.slice(-1) === ';') {
                                extensions = extensions.slice(0, -1);
                            }
                            //��֤�ļ���ʽ
                            if (!(new RegExp(extensions.replace(/\*\./g, '').replace(/;/g, '|') + '$', 'i').test(this.value))) {
                                if (o.flashvars.eventHandler) {
                                    //����eventHandler
                                    triggerHandler({
                                        swfid: swfid,
                                        type: 'uploadCompleteData',
                                        id: fileId,
                                        fileName: fileName,
                                        data: {
                                            result: 'fail',
                                            errCode: ['TYPEERR'],
                                            errMsg: ['TYPEERR']
                                        }
                                    });
                                    triggerHandler({
                                        swfid: swfid,
                                        type: 'finish'
                                    });
                                }
                                trigger.removeClass('ui-state-hover');
                                return;
                            }
                        }
                        //TODO:
                        //�����form,�������append��form
                        form.empty().append(file);
                        
                        trigger.removeClass('ui-state-hover');
                        //����ԭ����
                        self._render();
                        //����״̬��Ϣ
                        fileStatus[0] = {
                            id: fileId,
                            name: fileName,
                            status: 'ready'
                        };

                        //�����������ļ�ѡ���¼�
                        elem.trigger('fileSelect', {
                            swfid: swfid,
                            numFiles: 1,
                            filesRefused: [],
                            fileList: [{
                                id: fileId,
                                name: fileName
                            }]
                        });
                    });
                }
            });
            self._render();
            //interfaceReady, ֮����Ҫʹ�ü�ʱ������Ϊ�����¼���֮�󴥷�
            setTimeout(function(){
                triggerHandler({
                    swfid: swfid,
                    type: 'interfaceReady'
                });
            }, 0);
            //����Ҫflash����ṩ��������flash�Ĳ��� return false;
            return false;
        }
    };
    $util.flash.regist('uploader', uploader);
    $.add('ui-flash-uploader');
})(jQuery);
