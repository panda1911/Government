/*
 * jQuery UI Portlets 1.1
 *
 * @author Denis 2011.02.24
 * @update Denis 2011.03.19
 * @update Denis 2011.03.24 �Ż�Drag�߼�
 * @update Denis 2011.06.14 ��ȡoffsetParent�ڵ㣬�޸���offsetParent����BODY������£��϶�ƫ�Ƶ�BUG
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 */
('portlets' in jQuery.fn) ||
(function($, undefined){
    var $each = $.each;
    /**
     * measure two points' distance
     * @param {Object} e
     * @param {Object} item
     * @return {Number} square of distance
     */
    function measure(e, item){
        return Math.pow(e.pageX - item.left, 2) + Math.pow(e.pageY - item.top, 2);
    }
    $.widget('ui.portlets', $.ui.mouse, {
        options: {
            appendTo: 'parent',
            axis: false,
            //columns: 'div.region',
            orientation: 'vertical',
            handle: false,
            helper: 'original',
            items: '> *',
            modal: true,
            opacity: false,
            placeholder: false,
            dropOnEmpty: true,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            revert: false,
            revertOuter: false,
            zIndex: 1000
            //change: function(){},
            //start: function(evnet, ui){},
            //stop: function(e, ui){}
        },
        _create: function(){
            var self = this;
            
            self.widget().addClass('ui-portlets');
            self.columns = [];
            self.items = [];
            //e position
            self.position = {};
            //Initialize mouse events for interaction
            self._mouseInit();
        },
        
        _destroy: function(){
            var self = this;
            self.widget().removeClass('ui-portlets ui-portlets-disabled');
            self._mouseDestroy();
        },
        
        _mouseCapture: function(e){
            var self = this, o = self.options, currentItem;
            //���� �������/����
            if (o.disabled || self.reverting) {
                return false;
            }
            
            //refresh Columns & Items
            self._refreshItems();
            //Find out if the clicked node (or one of its parents) is a actual item in self.items
            $(e.target).parents().andSelf().each(function(){
                if ($.data(this, 'portlets-item') === true) {
                    currentItem = $(this);
                    return false;
                }
            });
            
            if (!currentItem) {
                return false;
            }
            
            if (o.handle) {
                //check if click in handler area
                var validHandle = false;
                //����handler�е�Ԫ�أ��ж��Ƿ�Ϊe.target
                $(o.handle, currentItem).find('*').andSelf().each(function(){
                    if (this === e.target) {
                        validHandle = true;
                        return false;
                    }
                });
                
                if (!validHandle) {
                    return validHandle;
                }
            }
            //Call callbacks
            if (!self._trigger('capture', e, {
                currentItem: currentItem
            })) {
                return false;
            }
            
            self.currentItem = currentItem;
            
            return true;
        },
        
        _mouseStart: function(e){
            //noformat
            var self = this,
				elem = self.element,
				o = self.options, 
				currentItem = self.currentItem, 
				currentItemCache = (self.currentItemCache = self.currentItem.offset()), 
				helper, 
				offsetParent = currentItem.offsetParent().offset(),
				placeholder;
            //format
            $.extend(currentItemCache, {
                //Where the click happened, relative to the element
                click: {
                    left: e.pageX - currentItemCache.left,
                    top: e.pageY - currentItemCache.top
                },
                offset: offsetParent,
                width: currentItem.width(),
                height: currentItem.height()
            });
            //1.�ȳ�ʼ��ռλ��
            placeholder = (self.placeholder = self._createPlaceholder(e));
            
            //2.�ٳ�ʼ��helper
            helper = (self.helper = self._createHelper(e));
            
            //������굽currentItem���Ͻǵ�����
            if (o.cursorAt) {
                self._adjustOffsetFromHelper(o.cursorAt);
            }
            
            if (o.opacity) { // opacity option
                helper.css('opacity', o.opacity);
            }
            
            if (o.zIndex) { // zIndex option
                helper.css('zIndex', o.zIndex);
            }
            
            if (o.scroll) {
                //Get the next scrolling parent
                self.scrollParent = helper.scrollParent();
                if (self.scrollParent[0] !== document && self.scrollParent[0].tagName !== 'HTML') {
                    self.scrollParentCache = self.scrollParent.offset();
                }
            }
            
            if (o.modal) {
                var elemOffset = elem.offset();
                elem.prepend(self.modal = $('<div>', {
                    css: {
                        left: elemOffset.left - currentItemCache.offset.left,
                        top: elemOffset.top - currentItemCache.offset.top,
                        position: 'absolute',
                        zIndex: o.zIndex - 1,
                        backgroundColor: '#FFF',
                        opacity: 0
                    }
                }));
            }
            else {
                //��ֹ����ѡ��
                $(document).disableSelection();
            }
            
            
            //get currentColumn
            self._getCurrentColumn();
            self.originalColumn = self.currentColumn;
            
            self.dragging = true;
            //Call callbacks
            self._trigger('start', e, self._uiHash());
            //start���ܻ�ı�ṹ��������ˢ����������
            self.refreshPositions();
            
            return true;
        },
        
        _mouseDrag: function(e){
            //noformat
            var self = this,
				o = self.options, 
				columns = self.columns, 
				items = self.items,
				helper = self.helper, 
				currentItemCache = self.currentItemCache,
				position = self.position,
                currentColumn = self.currentColumn,
				scrollParent = self.scrollParent,
				scrollParentCache = self.scrollParentCache,
				isVertical = o.orientation === 'vertical',
				target,
				direction, 
                min = Number.MAX_VALUE;
			//format
            //Do scrolling
            if (o.scroll) {
                if (scrollParent[0] !== document && scrollParent[0].tagName !== 'HTML') {
                
                    if ((scrollParentCache.top + scrollParent[0].offsetHeight) - e.pageY < o.scrollSensitivity) {
                        scrollParent[0].scrollTop = scrollParent[0].scrollTop + o.scrollSpeed;
                    }
                    else if (e.pageY - scrollParentCache.top < o.scrollSensitivity) {
                        scrollParent[0].scrollTop = scrollParent[0].scrollTop - o.scrollSpeed;
                    }
                    
                    if ((scrollParentCache.left + scrollParent[0].offsetWidth) - e.pageX < o.scrollSensitivity) {
                        scrollParent[0].scrollLeft = scrollParent[0].scrollLeft + o.scrollSpeed;
                    }
                    else if (e.pageX - scrollParentCache.left < o.scrollSensitivity) {
                        scrollParent[0].scrollLeft = scrollParent[0].scrollLeft - o.scrollSpeed;
                    }
                }
                else {
                
                    if (e.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    }
                    else if ($(window).height() - (e.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }
                    if (e.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    }
                    else if ($(window).width() - (e.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }
                }
            }
            
            //Compute the helpers position
            $.extend(self.position, {
                left: e.pageX - currentItemCache.click.left - currentItemCache.offset.left,
                top: e.pageY - currentItemCache.click.top - currentItemCache.offset.top
            });
            
            //Set the helper position
            if (!o.axis || o.axis != 'y') {
                helper[0].style.left = position.left + 'px';
            }
            if (!o.axis || o.axis != 'x') {
                helper[0].style.top = position.top + 'px';
            }
            
            
            for (var i = columns.length - 1; i > -1; i--) {
                var column = columns[i], inColumn;
                //�ж��Ƿ��ڡ�Column����������
                if (isVertical) {
                    inColumn = column.left <= e.pageX && e.pageX <= column.left + column.width;
                }
                else {
                    inColumn = column.top <= e.pageY && e.pageY <= column.top + column.height;
                }
                //��ĳһColumn��
                if (inColumn) {
                    target = column.dom;
                    //�л�Column
                    if (currentColumn[0] !== target) {
                        currentColumn = self.currentColumn = $(target);
                        self._trigger('over', e, self._uiHash());
                    }
                    //Column������Item
                    if (currentColumn.hasClass('ui-portlets-unreceivable')) {
                        return;
                    }
                    //Init Column�߽�ֵ
                    var minEdge = Number.MAX_VALUE, maxEdge = Number.MIN_VALUE;
                    
                    for (var j = items.length - 1; j > -1; j--) {
                        var item = items[j];
                        //�ų���ǰ��
                        if (item.dom && item.dom === self.currentItem[0]) {
                            continue;
                        }
                        //�ų������ڵ�ǰColumn��item
                        if (!$.contains(currentColumn[0], item.dom)) {
                            continue;
                        }
                        //�Ƿ���ĳItem������
                        var distances, isOver = $.ui.isOver(e.pageY, e.pageX, item.top, item.left, item.height, item.width);
                        //����Column�ı߽�
                        minEdge = Math.min(isVertical ? item.top : item.left, minEdge);
                        maxEdge = Math.max(isVertical ? item.top + item.height : item.left + item.width, maxEdge);
                        if (isOver) {
                            target = item.dom;
                            //������굽��ǰItem���ĸ��ǵľ���
                            distances = [measure(e, {
                                left: item.left,
                                top: item.top
                            }), measure(e, {
                                left: item.left,
                                top: item.top + item.height
                            }), measure(e, {
                                left: item.left + item.width,
                                top: item.top
                            }), measure(e, {
                                left: item.left + item.width,
                                top: item.top + item.height
                            })];
                            //��ȡ��С����Ӷ�ȷ��placeholder�����λ��
                            $each(distances, function(i, distance){
                                if (distance < min) {
                                    min = distance;
                                    if (isVertical) {
                                        direction = i % 2 ? 'after' : 'before';
                                    }
                                    else {
                                        direction = i > 1 ? 'after' : 'before';
                                    }
                                }
                            });
                        }
                    }
                    //������겻���κ�Item�Ϸ����ų���ǰ������ж����λ��Column���Ϸ������·�
                    if (!direction) {
                        //���С�ڱ߽�
                        if ((isVertical ? e.pageY : e.pageX) < minEdge) {
                            direction = 'prepend';
                        }
                        //������ڱ߽����Column��û��Item
                        else if ((isVertical ? e.pageY : e.pageX) > maxEdge || maxEdge < 0) {
                            direction = 'append'
                        }
                    }
                    break;
                }
            }
            //�����ĳColumn������ ����direction
            if (target && direction) {
                //λ��û�иı�
                if (target === position.dom && direction === position.direction) {
                    return;
                }
                position.dom = target;
                position.direction = direction;
                var hasChanged = true;
                switch (direction) {
                    case 'append':
                        var lastItem = $(o.items + ':not(.ui-portlets-helper):last', target);
                        if (lastItem[0] === self.placeholder[0]) {
                            hasChanged = false;
                            break;
                        }
                        if (lastItem.length) {
                            target = lastItem;
                            direction = 'after';
                        }
                        break;
                    case 'prepend':
                        var firstItem = $(o.items + ':not(.ui-portlets-helper):first', target);
                        if (firstItem[0] === self.placeholder[0]) {
                            hasChanged = false;
                            break;
                        }
                        if (firstItem.length) {
                            target = firstItem;
                            direction = 'before';
                        }
                        break;
                    case 'before':
                        var prevItem = $(target).prev();
                        while (prevItem.length && prevItem.hasClass('ui-portlets-helper')) {
                            prevItem = prevItem.prev();
                        }
                        if (prevItem[0] === self.placeholder[0]) {
                            hasChanged = false;
                        }
                        break;
                    case 'after':
                        var nextItem = $(target).next();
                        while (nextItem.length && nextItem.hasClass('ui-portlets-helper')) {
                            nextItem = nextItem.next();
                        }
                        if (nextItem[0] === self.placeholder[0]) {
                            hasChanged = false;
                        }
                        break;
                }
                if (hasChanged) {
                    //����change�¼����¼�����false��ִ�����������ڵĲ���
                    if (direction === 'append' || direction === 'prepend') {
                        if ($.isFunction(o.dropOnEmpty)) {
                            hasChanged = o.dropOnEmpty.call(self.element[0], e, self._uiHash());
                            //dropOnEmpty����false ������֯Ĭ�ϵ�change�¼���������ҪrefreshPositions
                            if (!hasChanged) {
                                self.refreshPositions(true);
                            }
                        }
                        else {
                            hasChanged = o.dropOnEmpty;
                        }
                    }
                    if (!hasChanged) {
                        return;
                    }
                    self._trigger('change', e, self._uiHash());
                    $(target)[direction](self.placeholder);
                    //ˢ������
                    self.refreshPositions(true);
                }
                return;
            }
        },
        
        _mouseStop: function(e){
        
            if (!e) {
                return;
            }
            var self = this, o = self.options;
            
            if (o.revert) {
                var placeholder = self.placeholder, offset = placeholder.offset(), offsetParent = placeholder.offsetParent().offset(), rangeWidth = o.revertOuter ? 'outerWidth' : 'width', rangeHeight = o.revertOuter ? 'outerHeight' : 'height';
                self.reverting = true;
                $(self.helper).animate({
                    top: offset.top - offsetParent.top,
                    left: offset.left - offsetParent.left,
                    width: placeholder[rangeWidth](),
                    height: placeholder[rangeHeight]()
                }, parseInt(o.revert, 10) || 500, function(){
                    self._clear(e);
                });
            }
            else {
                self._clear(e);
            }
        },
        /**
         * ���»��currentColumn
         */
        _getCurrentColumn: function(){
            var self = this;
            $each(self.columns, function(){
                var column = $(this.dom);
                if ($.contains(column[0], self.currentItem[0])) {
                    self.currentColumn = column;
                    return false;
                }
            });
        },
        /**
         * ������굽item���ϽǾ���
         * @param {Object} obj
         */
        _adjustOffsetFromHelper: function(obj){
            var self = this;
            if ('left' in obj) {
                self.currentItemCache.click.left = obj.left;
            }
            if ('top' in obj) {
                self.currentItemCache.click.top = obj.top;
            }
        },
        
        _clear: function(e){
            var self = this, elem = self.element, o = self.options, currentItem = self.currentItem, helper = self.helper, placeholder = self.placeholder;
            
            self.reverting = false;
            
            if (helper[0] !== currentItem[0]) {
                helper.remove();
            }
            else {
                helper.removeClass('ui-portlets-helper').removeAttr('style');
            }
            placeholder.after(currentItem.show()).remove();
            
            $each(self.items, function(i){
                $(this.dom).removeData('portlets-item');
            });
            
            self._getCurrentColumn();
            
            self._trigger('stop', e, self._uiHash());
            
            if (o.modal) {
                self.modal.remove();
                delete self.modal;
            }
            else {
                //�ͷ�����ѡ��
                $(document).enableSelection();
            }
            $.extend(self, {
                items: [],
                columns: [],
                position: {},
                currentItem: null,
                currentItemCache: null,
                currentColumn: null,
                originalColumn: null,
                helper: null,
                placeholder: null,
                placeholderCache: null,
                scrollParent: null,
                dragging: false,
                reverting: false
            });
        },
        
        /**
         * ˢ��colums��items��Ϣ
         */
        _refreshItems: function(){
            var self = this, elem = self.element, o = self.options, columns;
            //�������Ϣ����
            columns = o.columns ? $(o.columns, elem) : elem;
            
            columns.each(function(){
                var column = $(this);
                self.columns.push({
                    dom: this
                });
            });
            columns.find(o.items).each(function(){
                var item = $(this);
                item.data('portlets-item', true);
                self.items.push({
                    dom: this
                });
            });
        },
        /**
         * ˢ��colums��items������Ϣ
         * @param {Object} fast
         */
        refreshPositions: function(fast){
            //noformat
            var self = this, elem = self.element, o = self.options, currentItem = self.currentItem; 
            //format
            
            $each(self.columns, function(){
                var columnCache = this, column = $(columnCache.dom);
                $.extend(columnCache, column.offset());
                columnCache.width = column.width();
                columnCache.height = column.height();
            });
            $each(self.items, function(){
                var itemCache = this, item = $(itemCache.dom);
                
                $.extend(itemCache, item.offset());
                if (!fast) {
                    itemCache.width = item.outerWidth();
                    itemCache.height = item.outerHeight();
                }
            });
            
            if (o.modal) {
                self.modal.css({
                    width: elem.outerWidth(),
                    height: elem.outerHeight()
                });
            }
            
            return self;
        },
        /**
         * ����ռλ����
         */
        _createPlaceholder: function(e){
            //noformat
            var self = this,
				o = self.options, 
				currentItem = self.currentItem, 
				placeholder = $.isFunction(o.placeholder)? $(o.placeholder.call(self.element[0], e, currentItem)):
					$(document.createElement(currentItem[0].nodeName)).height(self.currentItemCache.height).addClass(self.currentItem[0].className);
            //format
            placeholder.addClass('ui-portlets-placeholder');
            if (typeof o.placeholder === 'string') {
                placeholder.addClass(o.placeholder);
            }
            currentItem.after(placeholder);
            return placeholder;
        },
        /**
         * ������������
         * @param {Object} e
         */
        _createHelper: function(e){
            //noformat
            var self = this,
				o = self.options, 
				currentItem = self.currentItem, 
				currentItemCache = self.currentItemCache,
            	helper = ($.isFunction(o.helper) ? $(o.helper.call(self.widget(), e, currentItem)) : 
					currentItem.width(currentItemCache.width)
						.height(currentItemCache.height)
						.css('margin', 0))
						.addClass('ui-portlets-helper')
						.css({
			                position: 'absolute',
			                //Ϊ�γ�ʼ��left��top��ֵ��IE�£����������ֵ��������ȡhelper�����ʱ��������
			                left: currentItemCache.left - currentItemCache.offset.left,
			                top: currentItemCache.top - currentItemCache.offset.top
			            });
            //format
            //��������϶�original
            if (helper[0] !== currentItem[0]) {
                currentItem.hide();
                $(o.appendTo !== 'parent' ? o.appendTo : currentItem[0].parentNode)[0].appendChild(helper[0]);
            }
            return helper;
        },
        /**
         * �¼����ݵĲ���
         */
        _uiHash: function(){
            var self = this;
            return {
                columns: self.columns,
                items: self.items,
                currentItem: self.currentItem,
                currentColumn: self.currentColumn,
                originalColumn: self.originalColumn,
                helper: self.helper,
                placeholder: self.placeholder
            };
        }
    });
    
    $.extend($.ui.portlets, {
        version: '1.0'
    });
    $.add('ui-portlets');
})(jQuery);
