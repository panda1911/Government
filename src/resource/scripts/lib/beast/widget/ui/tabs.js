/**
 * @usefor widget tabs
 * @author wb_hongss.ciic
 * @date 2011.02.21
 * @update 2011.07.26 hongss ���� reset ��������ʹ��JS��̬����tab����ã�����������Ҳ�����뵽ԭtabs����Ч��
 * @update 2011.07.27 hongss �޸������޸ĺ� e.target�����title�в��ܼ�������Ԫ�ص�bug������e.currentTarget��OK��
 * @update 2011.08.09 hongss �޸��¼������Ľڵ�indexȡ�ֵܽڵ��е�index��bug����ȷ��Ӧ����ȡ��ָ��Ϊ����Ԫ�ؼ��е�index
 * @update 2011.08.14 hongss ��setInterval�ĳ�setTimeout������_autoPlay���ڶ������к�ִ�У�����animate��chrome��firefox�е�bug
 * @update 2011.09.19 hongss �޸��ڹ���Ч��������selected��Ч����
 * @update 2011.10.10 hongss ����ʼ����selected��Ϊ0ʱ������ʾ����Ч��
 * @update 2011.11.12 hongss �Ż��Զ����¼�show��select�Ļص������еĲ������Ż����Ϊ��{index:index, box:boxes}
 * @update 2011.12.07 hongss �޸� mouseover|mouseout�¼�����״̬�£�mouseover��title��/��title�Ƶ�box�� ��Ȼ���Զ����ŵ�����
 * 
 * ��setTabǰ��ֱ��������Զ����¼�select   show   last
 */
('tabs' in jQuery.fn) ||
(function($, undefined){

    $.widget('ui.tabs', {
        /**
         * Ĭ������
         */
        options: {
            isAutoPlay: true,               // �Ƿ��Զ������л� 
            timeDelay: 3,                   // �Զ��л���ʱ���� (��λ����)
            torpid:200,                     // ʱ�䴥��tab�л�ʱ���ٶۻ�����ʱ��(��λ������)��ֻ��˫�¼�����ʱ��������mouseover/mouseout
            event: 'mouseover|mouseout',    // �л����¼��������ͣ�����˫�¼�����ʹ�á�|������
            currentClass: 'current',        // ��ǰtab�Ĵ�����ʽ 
            titleSelector: '.f-tab-t',      // ����Ԫ�ؼ�
            boxSelector: '.f-tab-b',        // ����Ԫ�ؼ� 
            selected: 0                     // ���ó�ʼ��ʱ�ڼ�������Ϊ��ǰ״̬ 
        },
        _create: function() {
            var self = this,
            o = this.options,
            events, boxes;
            
            self.titles = self.element.find(o.titleSelector);
            self.boxes = self.element.find(o.boxSelector);
            
            self._setEffectStyle();
            
            //���titles��boxes��
            if (self.titles.length > self.boxes.length) {
                self.titles = self.titles.slice(0, self.boxes.length);
                for (var i=self.boxes.length; i<self.titles.length; i++) {
                    $(self.titles[i]).addClass('ui-state-disabled');
                }
            }
            //self.index = o.selected;
            self.index = 0;
            self.tHandle = null;
            //add by hongss on 2011.12.07 by hongss for pause autoPlay when hovering title
            self.isPause = false;
            //self.isScrolling = false;
            
            //��ʼ������ modify by hongss on 2011.10.10
            self._setTab(o.selected, null, true);
            
            //�Զ�����
            self._autoPlay(1);
            
            //titles�¼�����
            events = self._getEvents();
            if (events.length>1) {
                var timeId = null,
                eventObj = {};
                
                eventObj[events[0]] = function(e){
                    self.isPause = true;
                    if (timeId) {
                        clearTimeout(timeId);
                    }
                    var i = $(self.titles).index($(e.currentTarget));
                    
                    timeId = setTimeout(function(){
                        if (self.index!==i) {
                            self._setTab(i, e);
                        }
                        self._onTitleFocue();
                    }, o.torpid);
                }
                eventObj[events[1]] = function(e){
                    self.isPause = false;
                    clearTimeout(timeId);
                    timeId = setTimeout(function(){
                        self._autoPlay(1, e);
                    }, o.torpid);
                }
                
                $(self.titles).live(eventObj);
            } else if (events.length===1) {
                $(self.titles).live(events[0], function(e){
                    self._onTitleFocue();
                    var i = $(self.titles).index($(e.currentTarget));
                    if (self.index!==i) {
                        self._setTab(i, e);
                    }
                    self._autoPlay(1, e);
                });
            }
            
            //boxes�¼�������box��������ƶ���ȥ����ͣ����
            boxes = (this._getPrimalBoxes) ? this._getPrimalBoxes() : this.boxes;
            boxes.each(function(i){
                $(this).hover(function(){
                    self.isPause = true;
                    self._onTitleFocue();
                }, function(){
                    self.isPause = false;
                    self._autoPlay(1);
                });
            });
        },
        /**
         * @methed reset ����
         */
        reset: function(){
            this.titles = this.element.find(this.options.titleSelector);
            this.boxes = this.element.find(this.options.boxSelector);
        },
        /**
         * @methed _setTab ����tab
         * @param {num} idx ��Ҫ��ʾ��title���
         */
        _setTab: function(idx, e, isInit) {
            var primalIdx = idx, box = $(this.boxes[idx]);
            
            e = e || null;
            
            idx = this._getIndex(idx);
            
            //�Զ����¼� select
            this._trigger('select', e, {index:idx, box:box});
            if (this.options.effect!=='scroll') {
                this._lazyImg(idx);
                this._lazyHtml(idx);
            }

            this._setTitle(idx);
            if (isInit===true){
                this._initBox(idx);
            } else {
                this._setBox(idx, primalIdx);
            }
            
            this.index = idx;
            if (this.options.effect!=='scroll' && this.options.effect!=='fade') {
                //�Զ����¼� show
                this._trigger('show', e, {index:idx, box:box});
            }
            
        },
        /**
         * @methed _autoPlay �Զ�����
         */
        _autoPlay: function(n, e) {
            var self = this;
            n = Number(n) || 1;
            e = e || null;
            
            if (self.options.isAutoPlay===true && self.isPause===false ) {
                if (self.tHandle){
                    clearTimeout(self.tHandle);
                }
                self.tHandle = setTimeout(function(){
                    self._setTab(self.index+n, e);
                }, self.options.timeDelay*1000);
            }
        },
        
        /**
         * @methed _setTitle  title������
         * @param {num} idx
         */
        _setTitle: function(idx) {
            if (this.titles.length>0) {
                var className = this.options.currentClass;
                this.titles.removeClass(className);
                $(this.titles[idx]).addClass(className);
            }
        },
        
        /**
         * @methed _setBox  box������
         * @param {num} idx
         */
        _setBox: function(idx) {
            this._effectNone(idx);
        },
        
        _initBox: function(idx){
            this._effectNone(idx);
        },
        /**
         * @methed _effectNone  �޶���Ч����box����
         * @param {num} idx
         */
        _effectNone: function(idx) {
            this.boxes.hide();
            $(this.boxes[idx]).show();
            this._autoPlay(1);
        },
        /**
         * @methed _onTitleFocue 
         * @param {num} idx
         */
        _onTitleFocue: function() {
            if (this.tHandle) {
                clearTimeout(this.tHandle);
                this.tHandle = null;
            }
        },
        _setOption: function(key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            if (key === 'selected') {
                this._setTab(value);
            }
        },
        /**
         * @methed _lazyLoad ������ͼƬ
         * @param {num} idx
         */
        _lazyImg: $.noop,
       
        /**
         * @methed _lazyHtml ������HTML
         * @param {Object} idx
         */ 
        _lazyHtml: $.noop,
        
        /**
         * @methed _lazyScrollLoad ����-������ͼƬ
         */
        _lazyScrollImg: $.noop,
       
        /**
         * @methed _lazyScrollHtml ����-������HTML
         */ 
        _lazyScrollHtml: $.noop,
        
        /**
         * @methed _setEffectStyle ���ù���ʱ��Ҫ��STYLE
         */
        _setEffectStyle: $.noop,
        /**
         * @methed _getIndex ��ȡindex
         * @param {num} idx
         */
        _getIndex: function(idx) {
            var l = this.boxes.length;
            if (idx<0) {
                return (idx+l);
            } else if (idx>=l) {
                return (idx-l);
            } else {
                return idx;
            }
        },
        
        /**
         * @methed _getEvents ����������л�õ�events����������
         */
        _getEvents: function() {
            return $.trim(this.options.event).split('|');
        },
        
        /** 
         * @methed getPrev   ��ʾ��һ��tab
         */
        prev: function(n) {
            n = n || 1;
            this._onTitleFocue();
            this._setTab(this.index-n);
            this._autoPlay();
            return this;
        },
        
        /**
         * @methed getNext   ��ʾ��һ��
         */
        next: function(n) {
            n = n || 1;
            this._onTitleFocue();
            this._setTab(this.index+n);
            this._autoPlay();
            return this;
        },
        
        /**
         * @methed length  ����tab��
         */
        length: function() {
            return this.boxes.length;
        },
        
        /**
         * @methed idx ���ص�ǰindex
         */
        idx: function() {
            return this.index;
        },
        
        /**
         * @param {num} index  ����������������������һ����ʼ��
         */
        select: function(index) {
            if (index!==this.index) {
                this._setTab(index);
            }
            return this;
        }
    });
    $.add('ui-tabs');
})(jQuery);
