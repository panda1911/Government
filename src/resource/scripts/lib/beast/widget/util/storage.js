/**
 * author honglun.menghl
 * date 2011-5-9
 * storage widget
 * dependence: jQuery
 * @update �޸�IE8�µ�BUG
 * @update �� flash ��λ�ø�Ϊ top 0px��left 0px �� �����°�� flash ���ڲ��ڿ��������ڵ� flash �����ܲ����г�ʼ������� flash storage ��ʼ��ʧ��
 */
('storage' in jQuery.util) ||
/*var STORE ={};*/
(function($){

    var _funcsCache = [], Engine, initStat = false, // calc dependence 
 dependence = (function(){
        var de = [];
        if (!$.support.JSON) {
            /*if(true){*/
            de.push('util-json');
        }
        if (!$.support.localStorage) {
            /*if(true){*/
            de.push('ui-flash-storage');
            Engine = 'swfStoreTemp'
        }
        else {
            Engine = window.localStorage
        }
        
        return de;
    })();
    
    /*var storage = $.extend({},$.EventTarget);*/
    
    
    $.extend($.util, {
        storage: $.extend({
            /**
             * store string to localStorage
             */
            setItem: function(key, value){
                try {
                    var result = Engine.setItem(key, value);
                } 
                catch (ex) {
                    this.trigger('error', {
                        exception: ex
                    });
                }
                return result;
            },
            
            /**
             * get string from localStorage
             */
            getItem: function(key){
                return Engine.getItem(key);
            },
            
            /**
             * set json to localStorage
             */
            setJson: function(key, value){
                return this.setItem(key, encodeURIComponent(JSON.stringify(value)));
            },
            
            /**
             * get json from localStorage
             */
            getJson: function(key){
                return JSON.parse(decodeURIComponent(this.getItem(key)));
            },
            
            /**
             * remove item from localStorage
             */
            removeItem: function(key){
                return Engine.removeItem(key);
            },
            
            /**
             * clear all data in localStorage
             */
            clear: function(){
                return Engine.clear();
            },
            
            /** 
             * return the number of key/value pairs  current in localStorage
             */
            getLength: function(){
                return $.support.localStorage ? Engine.length : Engine.getLength();
            },
            
            /**
             * return the name of nth key in the list
             */
            key: function(n){
                return Engine.key(n);
            },
            
            /** 
             * because of the fallback of flash(asyn mode) , all the operation must be wraped by this ready function
             */
            ready: function(func){
                if (initStat) {
                    func();
                }
                else {
                    _funcsCache.push(func);
                }
            }
        }, $.EventTarget)
    });
    
    /**
     * ��ʼ����������ʹ�õ� flash ģʽ����Ҫ�ȴ� flash store engine ׼����
     */
    function _init(){
        if (!initStat) {
            _loadDependence(function(){
                if (Engine === 'swfStoreTemp') {
                    $(function(){ //ȷ�� DOMReady
                        _initSwfStore();
                        $('#swf-storage').bind('contentReady.flash', function(){
                            Engine = $(this).flash('getEngine');
                            _completeInit();
                        }).bind('error.flash', function(ev, o){
                            $.util.storage.trigger('error', o);
                        }).bind('securityError.flash', function(ev, o){
                            $.util.storage.trigger('securityError', o);
                        });
                    });
                }
                else {
                    _completeInit();
                }
            });
        }
    }
    
    /**
     * ��������ʼ�����ı�״̬��ִ�������֮ǰ�����Ķ���
     */
    function _completeInit(){
        initStat = true;
        for (var i = 0, l = _funcsCache.length; i < l; i++) {
            _funcsCache[i]();
        }
    }
    
    /**
     * �������
     */
    function _loadDependence(callback){
        if (_isAllOk()) {
            callback();
            return;
        }
        for (var i = 0, l = dependence.length; i < l; i++) {
            (function(i){
                $.use(dependence[i], function(){
                    dependence[i] = true;
                    if (_isAllOk()) {
                        callback();
                    };
                                    });
            })(i)
        }
    }
    
    /**
     * ��ʼ��swf store
     */
    function _initSwfStore(){
        $('<div id="swf-storage">').appendTo('body').css({
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '1px',
            height: '1px'
        }).flash({
            module: 'storage'
        });
    }
    
    /**
     * �ж��Ƿ����е��������Ѿ�OK
     */
    function _isAllOk(){
        if (dependence.length === 0) {
            return true;
        }
        else {
            for (var i = 0, l = dependence.length; i < l; i++) {
                if (dependence[i] !== true) {
                    return false;
                }
            }
            return true;
        }
    }
    
    // auto init
    _init();
    $.add('util-storage')
})(jQuery);

