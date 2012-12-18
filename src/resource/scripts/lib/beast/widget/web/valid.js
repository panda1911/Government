/*
 * ����֤���Valid 3.0
 * @update Denis 2011.11.09 �Ż�"add"���������Դ�����֤����
 */
('Valid' in FE.ui) ||
(function($, UI, undefined){
    var regExps = {
        isFloat: /^[-\+]?\d+(\.\d+)?$/,
        isUrl: /^(http|https):\/\//,
        isEmail: /^[\w\-]+(\.[\w\-]*)*@[\w\-]+([\.][\w\-]+)+$/,
        isMobile: /^1\d{10}$/,
        isInt: /^[-\+]?\d+$/,
        isID: /^\d{17}[\d|X]|\d{15}$/
    }, rtrim = /^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g, defaults = {
        active: true, //�Ƿ񼤻���֤��ϵ true/false
        lazy: true, //true: ��ʼ����δ���ı� ������֤
        required: false, //�Ƿ������ Ĭ��Ϊ��
        evt: 'blur', //������֤���¼����� blur keyup��YUI֧�ֵ��κ��¼��� Ĭ��Ϊblur
        type: 'string', //���ݸ�ʽ Ĭ��Ϊ�ַ��� 'float' С��(��������) 'int' ���� 'email' ���� 'mobile' �ֻ� 'url' �����ַ 'reg' �Զ���������ʽ 'fun' �Զ�����֤����'remote'�첽��֤
        trim: true, //�Ƿ�������ֵ�������ҿո�
        round: 2, //��typeΪfloatʱ ��ȷ��С��λ�� Ĭ��2λ
        cache: true //�Ƿ񻺴�ǰһ�ε�ֵ(ÿ�δ����¼�����ֵ�Ƿ��б仯������һ����֤)
        //isValid: null, //��֤���״̬ Ĭ��Ϊδ���й���֤
        //value: null, //��������
        //min: null, //��typeΪstring float��intʱ��Ч ָ��(����)��Сֵ
        //max: null, //��typeΪstring float��intʱ��Ч ָ��(����)���ֵ
        //reg: null, //��typeΪregʱ��Ч ����������ʽ
        //fun: null, //��typeΪfunʱ��Ч ������֤��function ��function����ֵΪtrue/'�����ı�'
        //msg: null, //��typeΪfun����ʱ��Ч String�Զ�����֤�������صĴ�����ʾ��Ϣ���� 
        //key: null //����������Ĺؼ���
    };
    
    /**
     * ��֤��
     * @param {Object} els
     * @param {Object} options
     */
    function Valid(els, options){
        els = $(els);
        options = options || {};
        this._els = [];
        this._elConfigs = [];
        this.onValid = options.onValid || this.onValid;
        if (els.length) {
            this.add(els);
        }
    }
    
    Valid.prototype = {
        onValid: function(){
            return true;
        },
        /**
         * ��ʼ��|׷����Ԫ��
         * @method add
         * @param {HTMLElement | Array} els ��Ҫ������֤�Ķ������󼯺�
         * @param {Object} options ��Ҫ�������Ľڵ���е����ã���ѡ
         */
        add: function(els, options){
            var self = this;
            els = $(els);
            for (var i = 0, len = els.length, o, el; i < len; i++) {
                //�Ѿ�����
                if (self._els.indexOf(els[i]) > -1) {
                    continue;
                }
                el = $(els[i]);
                //׷��Ԫ��
                self._els.push(els[i]);
                try {
                    o = options || $.extendIf(eval('(' + (el.data('valid') || el.attr('valid') || '{}') + ')'), defaults);
                    o.defValue = val(els[i], o);
                } 
                catch (e) {
                    $.log('valid�������ݸ�ʽ����');
                }
                //׷������
                self._elConfigs.push(o);
                //�����¼���
                el.bind(o.evt + '.valid', {
                    el: els[i],
                    cfg: o,
                    opt: o
                }, $.proxy(validHandler, self));
                //�����س��¼�
                if (els[i].nodeName === 'INPUT') {
                    el.bind('keydown.valid', els[i], enterPressHandler);
                }
                
            }
        },
        /**
         * �Ƴ���Ԫ��
         * @method valid
         * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ����}��ֻ�����ڵĶ����ܽ�����֤
         */
        remove: function(els){
            var self = this;
            if (typeof els === 'number') {
                if (els < self._els.length) {
                    els = [self._els[els]];
                }
                else {
                    return;
                }
            }
            els = $(els);
            for (var i = 0, len = els.length, options, idx; i < len; i++) {
                idx = self._els.indexOf(els[i]);
                //����������
                if (idx < 0) {
                    continue;
                }
                options = self._elConfigs[idx];
                //�Ƴ�validע��ļ����¼�
                $(self._els[idx]).unbind('.valid');
                //�Ƴ������س��¼�
                //self.active(self._els[idx],false); ���ó�δ����
                self._els.splice(idx, 1);
                self._elConfigs.splice(idx, 1);
            }
        },
        /**
         * ������֤
         * @method valid
         * @param {HTMLElement | Array | Number} els ��Ҫ���м����{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ����ܽ��м���
         * @param {Boolean | String} mark (optional) true/false�򿪹رռ���״̬ 'op'�෴ѡ��(opposite����д)
         * @return {Boolean} �������а�����δ��֤ͨ���� �򷵻�false
         */
        active: function(els, mark){
            var self = this;
            if (typeof els === 'string' || typeof els === 'boolean' || !els) {
                mark = (mark === undefined ? els : mark);
                els = self._els;
            }
            if (typeof els === 'number') {
                if (els < self._els.length) {
                    els = [self._els[els]];
                }
                else {
                    return;
                }
            }
            els = $(els);
            for (var i = 0, len = els.length, options, idx; i < len; i++) {
                idx = self._els.indexOf(els[i]);
                //����������
                if (idx < 0) {
                    continue;
                }
                //��ȡ��Ӧ����֤����
                options = self._elConfigs[idx];
                if (mark === undefined || mark === true) {
                    //ԭ���ͼ����
                    if (options.active) {
                        continue;
                    }
                    options.active = true;
                }
                else if (mark === 'op') {
                    options.active = !options.active;
                }
                else {
                    //ԭ����δ�����
                    if (!options.active) {
                        continue;
                    }
                    options.active = false;
                }
                //����Ϊ��ʼ����֤״̬
                if (options.active) {
                    delete options.isValid;
                }
                else {
                    self.onValid.call(self._els[idx], 'default', options); //ʧȥ����ʱ������֤
                    delete options.value;
                }
            }
        },
        /**
         * ������֤���
         * @param {Object} els
         */
        reset: function(els){
            this.active(els, false);
            this.active(els, true);
        },
        /**
         * ��֤
         * @method valid
         * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ����ܽ�����֤
         * @param {Object} configs ��֤ʱ��ʱͳһ������֤����
         * @param {Boolean} disfocus �Ƿ�۽�
         */
        valid: function(els, configs, disfocus){
            var self = this;
            if (typeof els === 'number') {
                if (els < self._els.length) {
                    els = [self._els[els]];
                }
                else {
                    return;
                }
            }
            //�������� Ĭ��Ϊ�������ж���
            if (!els) {
                els = self._els;
            }
            //������ǰ
            if (configs === true) {
                disfocus = true;
                configs = undefined;
            }
            els = $(els);
            for (var i = 0, k, len = els.length; i < len; i++) {
                var options = {}, idx = self._els.indexOf(els[i]);
                if (idx < 0) {
                    continue;
                }
                //��ȡ��Ӧ����֤����
                $.extend(options, self._elConfigs[idx]);
                /*2010.05.24 reset configs*/
                if (configs) {
                    $.extend(options, configs);
                }
                //��δ������֤�� ������֤
                if (!options.active) {
                    continue;
                }
                //��ֹlazy
                options.lazy = false;
                
                //����δ��ȷ��֤��Ԫ�� ����δ��֤������֤δͨ���ĺͲ�������֤״̬��
                if (options.isValid !== true || !options.cache) {
                    //��δ��֤����Ԫ�ؽ�����֤
                    if (options.isValid === undefined || !options.cache) {
                        //���ڴ������֤״̬ͳһ��Ϊfalse �����½�����֤ 
                        options.isValid = false;
                        //�ֶ���֤��ȥĬ��ֵ
                        delete options.defValue;
                        validHandler.call(self, {
                            data: {
                                el: self._els[idx],
                                cfg: self._elConfigs[idx],
                                opt: options
                            }
                        }); //������֤����
                    }
                    //�����׸���֤δͨ����Ԫ������
                    if (options.isValid === false && k === undefined) {
                        k = idx;
                    }
                }
            }
            //������һ��δ��֤ͨ��
            if (typeof k === 'number') {
                if (!disfocus) {
                    $(self._els[k]).not(':hidden').focus();
                }
                return false;
            }
            return true; //ȫ����֤ͨ��
        },
        /**
         * ��ȡѡ�����������
         * @method getConfig
         * @param {HTMLElement | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ���������
         * @param {Object} configs ����
         */
        getConfig: function(el){
            var self = this, i = (typeof el === 'number' ? el : self._els.indexOf($(el).get(0)));
            return i < 0 ? null : self._elConfigs[i];
        },
        /**
         * ����ѡ�����������
         * @method setConfig
         * @param {HTMLElement | Array | Number} els ��Ҫ������֤��{ ���� | ���󼯺� | ���� }��ֻ�����ڵĶ���������
         * @param {Object} configs ����
         */
        setConfig: function(els, configs){
            var self = this;
            if (typeof els === 'number') {
                if (els < self._els.length) {
                    els = [self._els[els]];
                }
                else {
                    return;
                }
            }
            else if ($.isPlainObject(els)) {
                configs = els;
                els = undefined;
            }
            //�������� Ĭ��Ϊ�������ж���
            if (!els) {
                els = self._els;
            }
            els = $(els);
            for (var i = 0, j = els.length; i < j; i++) {
                var idx = self._els.indexOf(els[i]);
                if (idx < 0) {
                    continue;
                }
                $.extend(self._elConfigs[idx], configs);
            }
        }
    };
    /**
     * ��ȡ���ֱ����͵�ֵ
     * @param {Object} elements
     * @param {Object} options
     */
    function val(el, options){
        switch (el.tagName.toLowerCase()) {
            case 'input':
                var type = el.type.toLowerCase();
                if (type === 'text' || type === 'password') {
                    if (options.trim) {
                        el.value = el.value.replace(rtrim, '');
                    }
                    return el.value;
                }
                if (type === 'password') {
                    return el.value;
                }
                if (type === 'radio' || type === 'checkbox') {
                    return el.checked ? 'checked' : '';
                }
                return el.value;
            case 'textarea':
            default:
                if (options.trim) {
                    el.value = el.value.replace(rtrim, '');
                }
                return el.value;
            case 'select':
                return el.selectedIndex < 0 ? null : el.options[el.selectedIndex].value;
        }
    }
    
    /**
     * �����س��¼�
     * @param {Object} event
     */
    function enterPressHandler(e){
        if (e.keyCode === 13) {
            $(e.data).triggerHandler('blur');
        }
    }
    
    /**
     * ��֤�ص�����
     * @param {Object} e
     * @param {Object} obj
     */
    function validHandler(e){
        //2010.06.09: cfg Դ������ options ��ʱ���� ����isValid����
        var data = e.data, el = data.el, cfg = data.cfg, options = data.opt, value = val(el, options);
        if (!options.active) {
            return;
        }
        //����ǰ��ո�
        if (options.lazy) {
            if (value === options.defValue) {
                return;
            }
            options.lazy = false;
        }
        //�����ޱ仯 ������֤
        //2011.05.19 Denis ��cacheΪfalse��ʱ�򣬴��߼���Ч
        if (options.cache && value === options.value) {
            return;
        }
        //�Զ��巽������ ����ָ��Ĭ�Ϸ���
        var onValid = this.onValid;
        //����ֵ����
        if (options.cache) {
            cfg.value = value;
        }
        //����֤״̬Ϊfalse
        cfg.isValid = options.isValid = false;
        //����ֵΪ��(����radio��checkbox��δѡ��) ���ж�required����
        if (!value) {
            //��֤�Ƿ������
            if (options.required) {
                return onValid.call(el, 'required', options);
            }
            
            //������Զ��巽����֤��û��ָ��required:true������֤ͨ����������Ҫ�����Զ��巽���ٴ���֤��
            if (options.type !== 'fun') {
                cfg.isValid = options.isValid = true;
                //��֤ͨ��
                return onValid.call(el, 'pass', options);
            }
        }
        
        switch (options.type) {
            case 'string':
                if (typeof options.min === 'number' && value.length < options.min) {
                    return onValid.call(el, 'min', options);
                }
                if (typeof options.max === 'number' && value.length > options.max) {
                    return onValid.call(el, 'max', options);
                }
                break;
            case 'float':
                if (!regExps.isFloat.test(value)) {
                    return onValid.call(el, 'float', options);
                }
                var fval = value * 1;
                if (typeof options.min === 'number') {
                    fval = fval.toFixed(options.round);
                }
                if (options.cache) {
                    cfg.value = value;
                }
                if (typeof options.min === 'number' && fval < options.min) {
                    return onValid.call(el, 'min', options);
                }
                if (typeof options.max === 'number' && fval > options.max) {
                    return onValid.call(el, 'max', options);
                }
                break;
            case 'int':
                if (!regExps.isInt.test(value)) {
                    return onValid.call(el, 'int', options);
                }
                var ival = value * 1;
                if (typeof options.min === 'number' && ival < options.min) {
                    return onValid.call(el, 'min', options);
                }
                if (typeof options.min === 'number' && ival > options.max) {
                    return onValid.call(el, 'max', options);
                }
                break;
            case 'email':
                if (!regExps.isEmail.test(value)) {
                    return onValid.call(el, 'email', options);
                }
                break;
            case 'mobile':
                if (!regExps.isMobile.test(value)) {
                    return onValid.call(el, 'mobile', options);
                }
                break;
            case 'url':
                if (!regExps.isUrl.test(value)) {
                    return onValid.call(el, 'url', options);
                }
                break;
            case 'reg':
                if (!options.reg.test(value)) {
                    return onValid.call(el, 'reg', options);
                }
                break;
            case 'fun':
                options.msg = options.fun.call(el, options);
                if (typeof options.msg === 'string') {
                    return onValid.call(el, 'fun', options);
                }
                break;
            case 'remote':
                return options.fun.call(el, {
                    cfg: cfg,
                    opt: options
                }, onValid);
            default:
                return onValid.call(el, 'unkown', options);
        }
        cfg.isValid = options.isValid = true;
        //��֤ͨ��
        return onValid.call(el, 'pass', options);
    }
    
    Valid.regExps = regExps;
    UI.Valid = Valid;
    
    $.add('web-valid');
})(jQuery, FE.ui);
