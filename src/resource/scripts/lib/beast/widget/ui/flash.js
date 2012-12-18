/*
 * jQuery UI Flash 1.3
 *
 * @author Denis 2011.02.26
 * @update Denis 2011.06.14 ������flash��չ��ע�᷽��$.util.flash.regist�����������ԣ�������϶�
 * @update Denis 2011.09.16 ��create������Ϊ˽�з�������
 * @update hua.qiuh 2011.11.11 ����callMethod����������ʹ�������������flash�����Ľӿ�
 * @update Denis 2011.11.24 ����IE�²���flash�ķ�ʽ
 */
('flash' in jQuery.fn) ||
(function($, $util, Plugin){
    var OBJECT = 'object', FUNCTION = 'function', isIE = $.util.ua.ie, useEncode, flashVersion, modules = {};
    
    /**
     * compareArrayIntegers
     * @param {Object} a
     * @param {Object} b
     */
    function compareArrayIntegers(a, b){
        var x = (a[0] || 0) - (b[0] || 0);
        
        return x > 0 || (!x && a.length > 0 && compareArrayIntegers(a.slice(1), b.slice(1)));
    }
    
    /**
     * objectToArguments
     * @param {Object} o
     */
    function objectToArguments(o){
        if (typeof o !== OBJECT) {
            return o;
        }
        
        var arr = [], str = '';
        
        for (var i in o) {
            if (typeof o[i] === OBJECT) {
                str = objectToArguments(o[i]);
            }
            else {
                str = [i, (useEncode) ? encodeURI(o[i]) : o[i]].join('=');
            }
            arr.push(str);
        }
        
        return arr.join('&');
    }
    
    /**
     * objectFromObject
     * @param {Object} o
     */
    function objectFromObject(o){
        var arr = [];
        
        for (var i in o) {
            if (o[i]) {
                arr.push([i, '="', o[i], '"'].join(''));
            }
        }
        
        return arr.join(' ');
    }
    
    /**
     * paramsFromObject
     * @param {Object} o
     */
    function paramsFromObject(o){
        var arr = [];
        
        for (var i in o) {
            arr.push(['<param name="', i, '" value="', objectToArguments(o[i]), '" />'].join(''));
        }
        
        return arr.join('');
    }
    
    try {
        flashVersion = Plugin.description ||
        (function(){
            return (new Plugin('ShockwaveFlash.ShockwaveFlash')).GetVariable('$version');
        }());
    } 
    catch (e) {
        flashVersion = 'Unavailable';
    }
    
    var flashVersionMatchVersionNumbers = flashVersion.match(/\d+/g) || [0];
    
    $util.flash = {
        /*
         *
         */
        available: flashVersionMatchVersionNumbers[0] > 0,
        /*
         * activeX�������
         */
        activeX: Plugin && !Plugin.name,
        /*
         * ���ָ�ʽ�İ汾��ʾ
         */
        version: {
            original: flashVersion,
            array: flashVersionMatchVersionNumbers,
            string: flashVersionMatchVersionNumbers.join('.'),
            major: parseInt(flashVersionMatchVersionNumbers[0], 10) || 0,
            minor: parseInt(flashVersionMatchVersionNumbers[1], 10) || 0,
            release: parseInt(flashVersionMatchVersionNumbers[2], 10) || 0
        },
        /**
         * �ж������Flash�汾�Ƿ���ϴ���İ汾Ҫ��
         * @param {Object} version
         */
        hasVersion: function(version){
            var versionArray = (/string|number/.test(typeof version)) ? version.toString().split('.') : (/object/.test(typeof version)) ? [version.major, version.minor] : version || [0, 0];
            
            return compareArrayIntegers(flashVersionMatchVersionNumbers, versionArray);
        },
        /*
         * �Ƿ�Բ�������encodeURI����
         */
        encodeParams: true,
        /*
         * expressInstall��swf�ļ�·��
         */
        expressInstall: 'expressInstall.swf',
        /*
         * �Ƿ񼤻�expressInstall
         */
        expressInstallIsActive: false,
        /**
         * ����һ��flash����
         * @param {Object} options	���ò���
         * @return {HTMLDOMElement} flash object����
         */
        _create: function(container, options){
            var self = this;
            
            if (!options.swf || self.expressInstallIsActive || (!self.available && !options.hasVersionFail)) {
                return false;
            }
            //����߼��ǵ���⵽Flash�汾������Ҫ��ʱ���滻ΪexpressInstall��flash
            if (!self.hasVersion(options.hasVersion || 1)) {
                self.expressInstallIsActive = true;
                
                if (typeof options.hasVersionFail === FUNCTION) {
                    if (!options.hasVersionFail.apply(options)) {
                        return false;
                    }
                }
                
                options = {
                    swf: options.expressInstall || self.expressInstall,
                    height: 137,
                    width: 214,
                    flashvars: {
                        MMredirectURL: location.href,
                        MMplayerType: (self.activeX) ? 'ActiveX' : 'PlugIn',
                        MMdoctitle: document.title.slice(0, 47) + ' - Flash Player Installation'
                    }
                };
            }
            
            attrs = {
                //����FLash���õ���Javascript��������object��id��������ie�±���
                id: 'ui-flash-object' + $.guid++,
                width: options.width || 320,
                height: options.height || 180,
                style: options.style || ''
            };
            
            if (isIE) {
                attrs.classid = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
                options.movie = options.swf;
            }
            else {
                attrs.data = options.swf;
                attrs.type = 'application/x-shockwave-flash';
            }
            
            useEncode = typeof options.useEncode !== 'undefined' ? options.useEncode : self.encodeParams;
            
            options.wmode = options.wmode || 'opaque';
            
            delete options.hasVersion;
            delete options.hasVersionFail;
            delete options.height;
            delete options.swf;
            delete options.useEncode;
            delete options.width;
            
            var html = ['<object ', objectFromObject(attrs), '>', paramsFromObject(options), '</object>'].join('');
            if (isIE) {
                var flashContainer = document.createElement('div');
                container.html(flashContainer);
                flashContainer.outerHTML = html;
            }
            else {
                container.html(html);
            }
            return container.children().get(0);
        },
        /**
         * ע��flashģ��
         * @param {String} name ģ������
         * @param {Object} handler
         * @return {Bolean} �Ƿ�ע��ɹ��������Ѿ�����ģ�飬��ע��ʧ��
         */
        regist: function(name, handler){
            var module = modules[name];
            if (!module) {
                modules[name] = handler;
                return true;
            }
            return false;
        },
        /**
         * ��Flash���ô˷���
         * @param {Object} o
         */
        triggerHandler: function(o){
            $('#' + o.swfid).triggerHandler(o.type, o);
        }
    };
    
    $.widget('ui.flash', {
        //PS:��������ý��ᴫ�ݸ�flash����������������������ע��
        options: {
            //��չ��֪�������
            module: false
        },
        _create: function(){
            var self = this, elem = self.element, o = self.options, configs, res = true;
            
            //����id��������id
            if (!elem[0].id) {
                self._generateId();
            }
            //����ģ�鴦����
            if (o.module && modules.hasOwnProperty(o.module)) {
                res = modules[o.module].call(self);
            }
            elem.addClass('ui-flash');
            //����ģ�鲿������²���Ҫ����Flash����
            if (res) {
                //����flash����
                self.obj = $util.flash._create(elem, self._getFlashConfigs());
                //self.obj = elem[0].firstChild;
                
                if (!self.obj) {
                    self.destroy();
                }
            }
        },
        _destroy: function(){
            var self = this, elem = self.element;
            if (self.isGenerateId) {
                elem.removeAttr('id');
                delete self.isGenerateId;
            }
            delete self.obj;
            
            elem.unbind('.flash').removeClass('ui-flash').empty();
        },
        /**
         * ����������һ��id
         */
        _generateId: function(){
            this.isGenerateId = true;
            this.element[0].id = 'ui-flash' + $.guid;
        },
        /**
         * ��ȡflash����
         * @return {HTMLDOMElement} flash����
         */
        getFlash: function(){
            return this.obj;
        },

        /**
         * ����flash�ڲ��ķ���
         * ������������б��룬����ֵ���н��룬���Flash��������bug
         * @return flash�ڲ�ִ�н��
         */
        callMethod: function(){

            function fixSlashBugForFlashPlayer(value){
                return encodeURIComponent(value);
            }

            var args    = $.makeArray(arguments),
                fn      = args.shift(),
                swf     = this.obj;

            $.each(args, function(id, value){
                args[id] = fixSlashBugForFlashPlayer(value);
            });

            var result = swf[fn].apply( swf, args);
            return decodeURIComponent(result);
        },

        /**
         * ��options�а�����Ч�����ò�������������flash����˵����Ĳ���
         * �÷�����Ҫʱ����Ҫ��extend�ĺ����н�����д
         */
        _getFlashConfigs: function(){
            var configs = $.extend(true, {}, this.options);
            
            //ɾ�������������
            delete configs.disabled;
            delete configs.module;
            
            return configs;
        }
    });
    $.add('ui-flash');
}(jQuery, jQuery.util, navigator.plugins['Shockwave Flash'] || window.ActiveXObject));
