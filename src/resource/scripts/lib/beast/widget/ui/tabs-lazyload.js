/**
 * @usefor widget tabs extend lazyload
 * @author wb_hongss.ciic
 * @date 2011.03.25
 * @update 2011.07.13 hongss ����ͼƬ�����س߶ȣ���СͼƬ����ʱ��˸�Ŀ��ܣ���Ԥ��������һ��tab����ʾ��ͼƬ
 * @update 2011.08.02 hongss �����Ƿ�Ԥ�ȼ�����һ��tab�����ݣ�img or html����������
 * 
 * ��Html lazy load���������Զ����¼�  after
 */

 ;(function($, undefined){
     var FE_TEMP_ID = 'fe-temp-tabs-id';
     
     $.extend($.ui.tabs.prototype.options, {
         lazyImg: 'data-lazy-src',   //�����������ڳ���ԭimg��ǩ�е�src����ֵ
         lazyHtml: 'fe-lazy-html',   //class�������ݴ�class������������ж��Ƿ�ִ��html������
         isPreLoad: true             //����ֵ���Ƿ�Ԥ������һ��tab�����ݣ�img or html����Ĭ��ΪԤ����
     });
     
     $.extend($.ui.tabs.prototype, {
         /**
          * @methed _lazyImg ͼƬ������
          * @param {num} idx
          */
         _lazyImg: function(idx){
            var lazyImg = this.options.lazyImg,
            imgs = this._getBoxes(idx).find('img['+lazyImg+']');
            
            this._setImgsAttr(imgs);
         },
         /**
          * @methed _lazyHtml HTML������
          * @param {num} idx
          */
        _lazyHtml: function(idx) {
            var boxes = this._getBoxes(idx);
            
            this._setLazyHTML(boxes, idx);
        },
        /**
         * @methed _getBoxes ���ص�ǰ��Ҫ���ص�box�����ڷǹ���Ч����������
         * @param {num} idx
         */
        _getBoxes: function(idx) {
            var boxes = $(this.boxes[idx]);
            if (this.options.isPreLoad===true){
                boxes = boxes.add($(this.boxes[idx+1]));
            }
            return boxes;
        },
         
         /**
         * @methed _lazyScrollLoad ����-������ͼƬ
         */
         _lazyScrollImg: function(boxes){
             var lazyImg = this.options.lazyImg,
             //boxes = this._getScrollBoxes(),
             imgs = boxes.find('img['+lazyImg+']');
             
             this._setImgsAttr(imgs);
         },
         
         /**
         * @methed _lazyScrollHtml ����-������HTML
         */ 
         _lazyScrollHtml: function(boxes){
             var lazyHtml = this.options.lazyHtml,
             //boxes = this._getScrollBoxes(),
             textareas = boxes.find('textarea.'+lazyHtml);
             
             this._setLazyHTML(boxes);
         },
         
         /**
          * @methed _setImgsAttr ����ͼƬ����
          * @param {Object} imgs
          */
         _setImgsAttr: function(imgs){
             var lazyImg = this.options.lazyImg;
             if (imgs.length>0) {
                imgs.each(function(i){
                    $(this).attr('src', $(this).attr(lazyImg));
                    $(this).removeAttr(lazyImg);
                });
            }
         },
         
         /**
          * @methed _setLazyHTML ����������HTML
          * @param {Object} textareas
          */
         _setLazyHTML: function(boxes, idx){
             var _self = this;
             boxes.each(function(i){
                 var box = boxes.eq(i),
                 textareas = box.find('textarea.'+_self.options.lazyHtml),
                 l = textareas.length;
                 if (l>0) {
                     var id = FE_TEMP_ID+'-'+(Math.floor(Math.random()*10000));
                     textareas.each(function(i){
                         var strHTML = $(this).val();
                         if (i===l-1) {
                             strHTML += '<span id='+id+'></span>';
                         }
                         $(this).replaceWith(strHTML);
                     });
                     
                     _self._available(id, function(){
                         var data = (idx) ? {index:idx, boxes:box} : {boxes:box};
                         $('#'+id).remove();
                         //�����Զ����¼� after
                         _self._trigger('after', null, data);
                     }, box);
                 }
             });
             
         },
         /**
          * @methed _getScrollBoxes ���ع�������ʾ�����boxes   move to tabs-effect by hongss on 2011.11.12
          */
         /*_getScrollBoxes: function(){
             var primalBoxes = this.element.find(this.options.boxSelector),
             parent = this._getBoxesParent().parent(),
             subLength = this._getSubLength(),
             hasScroll, viewlength, i, size, n,
             boxes = $();
             if (this._isHorizontal()){
                 hasScroll = parent.scrollLeft();
                 viewlength = parent.width();
             } else {
                 hasScroll = parent.scrollTop();
                 viewlength = parent.height();
             }
             //i ��ʾ�Ѿ�����������
             i = (hasScroll>0)? Math.ceil(hasScroll/subLength) : 0;
             //n=1��Ԥ������һ�����ݣ�n=2Ԥ������һ������
             n = (this.options.isPreLoad===true) ? 2 : 1;
             size = i+(Math.ceil(viewlength/subLength))*n;
             for (i; i<size; i++) {
                 boxes = boxes.add(primalBoxes.eq(i));
             }
             return boxes;
         },*/
         /**
          * @methed _available  �ж�DOM�ڵ��Ƿ��Ѿ�����
          * @param {string} id  ���жϵ�ID
          * @param {Object} fn  ��Ҫִ�еĺ���
          * @param {Object} o   thisָ��
          */
         _available: function(id, fn, o) {
             if (!id || !$.isFunction(fn)) { return; }
             
             var retryCount = 1,
             timeId = $.later(40, o, function(){
                 if ($('#'+id).length>0 && !!(fn()||1) || ++retryCount>500) {
                     timeId.cancel();
                 }
             }, [], true);
         }
     });
 })(jQuery);
 