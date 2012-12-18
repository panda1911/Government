/**
 * Baseed on gears
 * @Author: Denis 2011.01.31
 * @update: Denis 2011.07.22	�Ż���JSONģ�������
 * @update: Denis 2011.11.18    �Ż��û�״̬��ȡ��ʽ
 * @update: Denis 2011.12.14    �ṩfigo���õ�ռλ
 * @update: Denis 2012.02.06    �Բ�֧��console����������ṩconsole.info��console.log�Ķ���
 * @update: Denis 2012.04.17    �ṩ��jasmine��֧��
 */
(function($){
    $.namespace('FE.sys', 'FE.util.jasmine', 'FE.ui');
    
    var FU = FE.util, cookie = $.util.cookie, $support = $.support;
    //PS:__last_loginid__��ie6�²���ȷ����(������cookie������__cn_logon_id__�ֶ�)
    //��ǰ��¼��ID
    FU.loginId = cookie('__cn_logon_id__');
    FU.LoginId = function(){
        return cookie('__cn_logon_id__');
    };
    //��ǰ�Ƿ��е�¼�û�
    FU.isLogin = (FU.loginId ? true : false);
    FU.IsLogin = function(){
        return (FU.LoginId() ? true : false);
    };
    //��һ�ε�¼��ID
    FU.lastLoginId = cookie('__last_loginid__');
    FU.LastLoginId = function(){
        return cookie('__last_loginid__');
    };
    //��ת����
    /**
     * �¿����ڻ��ߵ�ǰ���ڴ�(Ĭ���¿�����),���IE��referrer��ʧ������
     * @param {String} url
     * @argument {String} �¿�����or��ǰ���� _self|_blank
     */
    FU.goTo = function(url, target){
        var SELF = '_self';
        target = target || SELF;
        if (!$.util.ua.ie) {
            return window.open(url, target);
        }
        var link = document.createElement('a'), body = document.body;
        link.setAttribute('href', url);
        link.setAttribute('target', target);
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        if (target !== SELF) {
            setTimeout(function(){
                try {
                    body.removeChild(link);
                } catch (e) {
                }
            }, 200);
        }
        return;
    };
    
    var FUJ = FU.jasmine, jasmineReady;
    $.extend(FUJ, {
        stack: [],
        add: function(specUrl){
            if (jasmineReady) {
                $.getScript(specUrl);
            } else {
                FUJ.stack.push(specUrl);
            }
        }
    });
    //�ж�������Ƿ�֧��JSON���Ӷ�ע��ģ��
    if ($support.JSON) {
        $.add('util-json');
    }
    //����console
    if (!window.console) {
        window.console = {};
        console.log = console.info = $.log;
    }
    
    $(function(){
        $.DEBUG = /debug=true/i.test(location.search);
        if ($.DEBUG) {
            $.use('util-debug');
        }
        //����Jasmine���Խű�
        $.JASMINE = /jasmine=true/i.test(location.search);
        if ($.JASMINE) {
            $.add('ext-jasmine-specs', {
                requires: ['ext-jasmine'],
                js: FUJ.stack
            });
            $.use('ext-jasmine-specs', function(){
                $.use('ext-jasmine-html, ext-jasmine-jquery', function(){
                    FUJ.Env = jasmine.getEnv();
                    var trivialReporter = new jasmine.TrivialReporter();
                    
                    FUJ.Env.addReporter(trivialReporter);
                    FUJ.Env.specFilter = function(spec){
                        return trivialReporter.specFilter(spec);
                    };
                    //$.jasmineEnv.execute();
                    jasmineReady = true;
                });
            });
        }
    });
    //figo��̬������
    FE.test = {};
})(jQuery);
