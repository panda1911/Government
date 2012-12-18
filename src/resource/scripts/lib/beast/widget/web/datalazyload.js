/**
 * @todo : ����������
 * @author : yu.yuy
 * @createTime : 2011-04-25
 * @version : 1.2
 * @update : yu.yuy 2011-11-02 ���bind����������bind�����Ż��˱�����Դ�ص�����
 * @update : yu.yuy 2011-11-10 (1)�����Ӵ��ײ��պõ�������λ�õ��ж��߼���(2)�ϳ��첽������hash����������Դ���������DOMԪ��һ�������һ�����飻(3)ʹ��attr����data��ȡ�Զ������Ե�ֵ��
 * @update : yu.yuy 2011-12-19 ����IE��ͬһͼƬ��onload�¼�ֻ����һ�Σ��⵼����ҳ���жദ����ͬһͼƬ��ʱ����ֶദͼƬ�޷��������������Ա����޸���ȥ��ͼƬ����ʱ�Ľ��Զ�����
 */
('datalazyload' in FE.util) || 
    (function($, Util){
    var WIN = window,
    DOC = document,
    IMGSRCNAME = 'data-lazyload-src',
    FNCLASSNAME = 'lazyload-fn',
    FNATTRIBUTE = 'data-lazyload-fn-body',
    TEXTAREACLASSNAME = 'lazyload-textarea',
    datalazyload = function(){
        var _defaultThreshold = 200,
        _threshold = 0,
        options = {},
        _isRunning = false,
        _viewportHeight = 0,
        _scollBody = $(WIN),
        //��Դ��
        resourcePool = {
            img : [],
            fn : [],
            textarea : []
        },
        /*
         * �ϲ����飬ȥ���ظ��
         */
        _uniqueMerge = function(des,a){
            for(var i=0;i<a.length;i++){
                for(var j=0,len=des.length;j<len;j++){
                    if(a[i] === des[j]){
                        a.splice(i,1);
                        break;
                    }
                }
            }
            $.merge(des,a);
        },
        /*
         * ������Դ���飬�޳�����Ҫ�����
         */
        _filter = function(array, method, context){
            var item;
            for(var i=0;i<array.length;) {
                item = array[i];
                if(_checkPosition(item)){
                    array.splice(i, 1);
                    method.call(context,item);
                }
                else{
                    i++;
                }
            }
        },
        /*
         * ��������
         */
        _throttle = function(method, context){
            clearTimeout(method.tId);
            method.tId = setTimeout(function(){
                method.call(context);
            },100);
        },
        /*
         * ��ȡ��ǰ�Ӵ��߶�
         */
        _getViewportHeight = function(){
            return _scollBody.height();
        },
        /*
         * �󶨹��������������¼�
         */
        _bindEvent = function(){
            if(_isRunning){
                return;
            }
            _scollBody.bind('scroll.datalazyload', function(e){
                _throttle(_loadResources);
            }); 
            _scollBody.bind('resize.datalazyload', function(e){
                _viewportHeight = _getViewportHeight();
                _throttle(_loadResources);
            });
            _isRunning = true;
        },
        /*
         * �Ƴ����������������¼�
         */
        _removeEvent = function(){
            if(!_isRunning){
                return;
            }
            _scollBody.unbind('scroll.datalazyload');
            _scollBody.unbind('resize.datalazyload');
            _isRunning = false;
        },
        /*
         * �ռ�������Ҫ�����ص���Դ
         */
        _collect = function(container){
            var imgs = $('img['+IMGSRCNAME+']',container).toArray(),
            fns = $('.'+FNCLASSNAME,container).toArray(),
            textareas = $('.'+TEXTAREACLASSNAME,container).toArray();
            _uniqueMerge(resourcePool['img'],imgs);
            _uniqueMerge(resourcePool['fn'],fns);
            _uniqueMerge(resourcePool['textarea'],textareas);
        },
        /*
         * ���ظ���Դ
         */
        _loadResources = function(){
            _filter(resourcePool['img'], _loadImg);
            _filter(resourcePool['fn'], _runFn);
            _filter(resourcePool['textarea'], _loadTextarea);
                
            //���������Դ���Լ��أ�����������������¼�
            if(resourcePool['img'].length===0 && resourcePool['fn'].length===0 && resourcePool['textarea'].length===0){
                _removeEvent();
                //that._trigger('complete');
            }
        },
        /*
         * ����ͼƬ
         */
        _loadImg = function(el){
            var src;
            el = $(el);
            src = el.attr(IMGSRCNAME);
            if(src){
                //el.css('display', 'none');
                el.attr('src',src);
                el.removeAttr(IMGSRCNAME);
                //el.load(function(){
                //    $(this).fadeIn('show');
                //});
            }
        },
        /*
         * ִ���첽����
         */
        _runFn = function(a){
            var el,
            fn,
            fnStr;
            if($.isArray(a)){
                el = a[0];
                fn = a[1];
            }
            else{
                el = a;
            }
            if(fn){
                fn(el);
            }
            el = $(el);
            fnStr = el.attr(FNATTRIBUTE);
            if(fnStr){
                fn = _parseFunction(fnStr);
                fn(el);
                el.removeAttr(FNATTRIBUTE);
            }
        },
        /*
         * ��ָ����textareaԪ������ȡ���ݣ���������Ⱦ��ҳ����
         */
        _loadTextarea = function(el){
            el = $(el);
            el.html($('textarea', el).val());
        },
        /*
         * ���ַ���ת��Ϊ����ִ�еĺ���
         */
        _parseFunction = function(s){
            var a = s.split('.'),
            l=a.length,
            o = WIN;
            for(var i=($.isWindow(a[0])?1:0);i<l;i++){
                if($.isFunction(o[a[i]]) || $.isPlainObject(o[a[i]])){
                    o = o[a[i]];
                }
                else{
                    return null;
                }
            }
            if($.isFunction(o)){
                return o;
            }
            return null;
        },
        /*
         * �ж�Ԫ���Ƿ��Ѿ����˿��Լ��صĵط�
         */
        _checkPosition = function(el){
            var ret = false,
            currentScrollTop = $(DOC).scrollTop(),
            benchmark = currentScrollTop + _viewportHeight + _threshold,
            currentOffsetTop = $(el).offset().top;
            if(currentOffsetTop <= benchmark){
                ret = true;
            }
            return ret;
        },
        _toFnArray = function(els,fn){
            var ret = [],
            l;
            if(!els){
                return ret;
            }
            l = els.length;
            if(!l){
                ret.push([els,fn]);
            }
            else if(l > 0){
                for(var i=0;i<l;i++){
                    ret.push([els[i],fn])
                }
            }
            return ret;
        };
        return {
                
            /**
                         * ��ʼ��
                         */
            init : function(){
                if(!_isRunning){
                    _viewportHeight = _getViewportHeight();
                    _bindEvent();
                }
                _loadResources();
            },
            /*
                         * ע��
                         */
            register : function(options){
                var containers = options.containers;
                _threshold = options.threshold || _defaultThreshold;
                for(var i=0,l=containers.length;i<l;i++){
                    this.bind(containers[i],$.proxy(this.add, this));
                }
                this.init();
            },
            /*
                         * �����Ҫ�����ص���Դ
                         */
            add : function(container){
                _collect(container);
                this.init();
            },
            /*
                         * ���첽�����������ڸ���Ԫ���ϣ�������Ԫ��һ�ع�ʹ����ú�����
                         */
            bind : function(el,fn){
                var els = _toFnArray(el,fn);
                if(els.length === 0){
                    return;
                }
                _uniqueMerge(resourcePool['fn'],els);
            }
        }
    };
    Util.datalazyload = datalazyload();
})(jQuery, FE.util);