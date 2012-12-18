/**
 * @usefor widget tabs extend effect
 * @author wb_hongss.ciic
 * @date 2011.05.4
 * @update 2011.06.03 hongss �޸�F5ˢ�º����Ч����scrolLeft/scrollTop���ָ�����ʼ��״̬������
 * @update 2011.08.14 hongss ��setInterval�ĳ�setTimeout������_autoPlay���ڶ������к�ִ�У�����animate��chrome��firefox�е�bug
 * @update 2011.10.10 hongss ����ʼ����selected��Ϊ0ʱ������ʾ����Ч��
 * @update 2011.11.12 hongss �Ż��Զ����¼�show��select�Ļص������еĲ������Ż����Ϊ��{index:index, box:boxes}
 * @update 2012.02.14 hongss �޸��������ôﵽ��ʼ״̬����һ�����޷���������ʱ�������������bug
 */

 ;(function($, undefined){
     
     $.extend($.ui.tabs.prototype.options, {
         effect: 'none',            //����Ч����none(�޶���Ч��)��scroll(����Ч��)��fade(��������Ч��), function()(�Զ��嶯��)��
         speed: 'slow',             //���������ٶȣ�����Ϊ���֣�����λ�����룩
         perItem: 1,                //ÿ�ι�������Ԫ�����������˲���ֻ��effect:scrollʱ��Ч��
         scrollType: 'fill',        //ѭ�������ķ�ʽ����ѡֵ��loop|fill|break�� ��ֵΪloopʱtitleSelector������Ч����ֵΪfillʱ����Ч�����˲���ֻ��effect:scrollʱ��Ч��
         easing: 'swing',           //����Ч����swing|easeInQuad|easeOutQuad
         subLength: null,           //����ʱ��ÿ����Ԫ�صĿ��ߣ��ȣ�Ĭ���Զ����㣻���˲���ֻ��effect:scrollʱ��Ч��
         direction: 'left'          //�������򣬿�ѡֵ��left|right|up|down�����˲���ֻ��effect:scrollʱ��Ч��
     });
     
     $.extend($.ui.tabs.prototype, {
         /**
          * @methed _initBox  ��ʼ��ʱbox������
          * @param {num} idx
          * @update add by hongss on 2011.10.10 
          */
         _initBox: function(idx){
            if (this.options.effect==='scroll'){
                this._initScroll(idx);
            } else {
                this._effectNone(idx);
            }
         },
         /**
          * @methed _setBox  box������
          * @param {num} idx
          * ����Ч����none(�޶���Ч��)��scroll(����Ч��)��fade(��������Ч��)��
          *          ��effectΪfunctionʱΪ�Զ���Ч������ʱfunction����һ������idx��thisָ��ǰbox
          */
         _setBox: function(idx, primalIdx) {
             var self = this;
             if ($.isFunction(self.options.effect)){
                 self.options.effect.call(self.boxes[idx], idx);
             } else {
                 switch (self.options.effect){
                     case 'none':
                        self._effectNone(idx);
                        break;
                     case 'scroll':
                        self._effectScroll(idx, primalIdx);
                        break;
                     case 'fade':
                        self._effectFade(idx);
                        break;
                     default:
                        self._effectNone(idx);
                 }
             }
         },
         /**
          * @methed _initScroll  ��ʼ��ʱ����Ч����scrollLeft/scrollTop����
          * @param {num} idx
          * @update add by hongss on 2011.10.10 
          */
         _initScroll: function(idx){
            var perLength = this._getPerLength(),
            parent = this._getBoxesParent().parent(),
            initLength = idx * perLength;
            //�Զ����¼� select
            this._trigger('select', null, {index:idx, box:boxes});
            //��ʼ����λ������
            if (this._isHorizontal()){
                parent.scrollLeft(initLength);
            } else {
                parent.scrollTop(initLength);
            }
            var boxes = this._getScrollBoxes();
            //�Զ����¼� show
            this._trigger('show', null, {index:idx, box:boxes});
            //������ͼƬ��HTML
            this._lazyScrollImg(boxes);
            this._lazyScrollHtml(boxes);
         },
         /**
          * @methed _effectScroll  ����Ч����box����
          * @param {num} idx
          */
         _effectScroll: function(idx, primalIdx) {
             var self = this, options = self.options,
             perLength = self._getPerLength(),
             parent = self._getBoxesParent().parent(),
             direction = options.direction,
             length = self.boxes.length,
             scrollLength, scrollSign,
             tempIdx = idx, tempIndex = self.index;
             
             if (options.scrollType==='loop'){
                 tempIdx = primalIdx;
             }
             scrollLength = (tempIdx-tempIndex) * perLength;
             
             if (direction==='right'||direction==='down') {
                 scrollSign = '-='+scrollLength+'px';
             }else {
                 scrollSign = '+='+scrollLength+'px';
             }
             //�Զ����¼� select
             //this._trigger('select', null, {index:idx, box:boxes});
            
             if (self._isHorizontal()) {
                 self._setLoopScrollOffset('scrollLeft', tempIdx, scrollLength);
                 
                 parent.animate({
                     scrollLeft: scrollSign
                 }, options.speed, options.easing, function(){
                     var boxes = self._getScrollBoxes();
                     //�Զ����¼� show
                     self._trigger('show', null, {index:idx, box:boxes});
                     self._lazyScrollImg(boxes);
                     self._lazyScrollHtml(boxes);
                     self._autoPlay(1);
                 });
             } else {
                self._setLoopScrollOffset('scrollTop', tempIdx, scrollLength);
                 
                 parent.animate({
                     scrollTop: scrollSign
                 }, options.speed, options.easing, function(){
                     var boxes = self._getScrollBoxes();
                     //�Զ����¼� show
                     self._trigger('show', null, {index:idx, box:boxes});
                     self._lazyScrollImg(boxes);
                     self._lazyScrollHtml(boxes);
                     self._autoPlay(1);
                 });
                
             }
         },
         /**
          * @methed
          * @param {Object} idx
          */
         _setLoopScrollOffset: function(scroll, idx, scrollLength){
             if (this.options.scrollType === 'loop') {
                 var index = this.index, 
                 parent = this._getBoxesParent().parent(), 
                 scrollOffset = parent[scroll](),
                 primalSize = this._getPrimalSize();
                 
                 if (idx > index && scrollOffset >= primalSize) {
                     parent[scroll](scrollOffset - primalSize);
                 }
                 if (idx < index && scrollOffset < Math.abs(scrollLength)) {
                     parent[scroll](scrollOffset + primalSize);
                 }
             }
         },
         /**
          * @methed _effectFade  ��������Ч����box����
          * @param {num} idx
          */
         _effectFade: function(idx) {
             var self = this,
             boxes = $(self.boxes[idx]);
             self.boxes.hide();
             $(boxes).fadeIn(self.options.speed, function(){
                //�Զ����¼� show
                self._trigger('show', null, {index:idx, box:boxes});
                self._autoPlay(1);
             });
         },
         /**
          * @methed _setScrollStyle ���ù���ʱ��Ҫ��STYLE
          */
         _setEffectStyle: function(){
             if (this.options.effect==='scroll'){
                 var initOffset = this._getPerLength() * this.index,
                 parent = this._getBoxesParent().parent();
             
                 if (this._isHorizontal()){
                     this._setOffset('width');
                     parent.scrollLeft(initOffset);
                 } else {
                     this._setOffset('height');
                     parent.scrollTop(initOffset);
                 }
                 
                 this._setSubLength();
                 this._setPerItem();
                 this._setBoxes();
                 
             }
         },
         /**
          * @methed _setOffset ���ÿ��/�߶�
          */
         _setOffset: function(cssName){
             var boxes = this._getPrimalBoxes(),
             parent = this._getBoxesParent(),
             boxesLength = boxes.length * this._getSubLength(),
             teamsLength = this._getTeamCount() * this._getPerLength();
             
             switch (this.options.scrollType){
                 case 'loop':
                    parent.append(boxes.clone(true));
                    parent.css(cssName, boxesLength*2);
                    break;
                 case 'break':
                    parent.css(cssName, boxesLength);
                    break;
                 default:
                    parent.css(cssName, teamsLength);
             }
         },
         /**
          * @methed _getPrimalSize ���ԭʼ��δ����ǰ�ģ������Ԫ�صĿ��/�߶�
          */
         _getPrimalSize: function(){
             var primalSize = this._getPrimalBoxes().length * this._getSubLength();
             this._getPrimalSize = function(){ return primalSize; }
             return primalSize;
         },
         /**
          * @methed _getPrimalBoxes ����ԭʼ��boxes
          */
         _getPrimalBoxes: function(){
             var boxes = this.element.find(this.options.boxSelector);
             this._getPrimalBoxes = function(){ return boxes; }
             return boxes;
         },
         /**
          * @methed _getBoxesParent ����boxes�Ĺ�ͬ����Ԫ��
          */
         _getBoxesParent: function(){
             var boxes = this._getPrimalBoxes(),
             parent = boxes.parent();
             this._getBoxesParent = function() { return parent; }
             return parent;
         },
         /**
          * @methed _getTeamCount ��������
          */
         _getTeamCount: function(){
             var boxes = this._getPrimalBoxes(),
             teamCount = Math.ceil(boxes.length/this.options.perItem);
             this._getTeamCount = function(){ return teamCount; }
             return teamCount;
         },
         /**
          * @methed _setBoxes ��perItem>1ʱ����this.boxesת������Ԫ�ؼ���ɵ�����
          *     ע���˷�����effectType:loopʱ������
          */
         _setBoxes: function(){
             if (this.options.perItem > 1){
                 var perItem = this.options.perItem,
                 boxes = this._getPrimalBoxes(),
                 n = this._getTeamCount(),
                 arrBoxes = [];
                 
                 for (var i=0; i<n; i++){
                     arrBoxes[i]=boxes.slice(i*perItem, (i+1)*perItem);
                 }
                 this.boxes = arrBoxes;
             }
         },
         /**
          * @methed _isHorizontal �ж��Ƿ�Ϊˮƽ����ģ�����true/false
          */
         _isHorizontal: function() {
             var options = this.options;
             //left|right����true��up|down����false��Ĭ��Ϊ'left'
             switch (options.direction) {
                case 'left':
                    return true;
                    break;
                case 'right':
                    return true;
                    break;
                case 'up':
                    return false;
                    break;
                case 'down':
                    return false;
                    break;
                default:
                    options.direction = 'left';
                    return true;
            }
         },
         /**
          * @methed _getLength ������Ԫ�صĸ߶Ȼ���
          */
         _getSubLength: function() {
             var isHorizontal = this._isHorizontal(),
             options = this.options,
             subLength;
             //���������subLength��subLengthΪ������ֱ��ȡ���õ�ֵ�������Զ�ȡ
             if (options.subLength) {
                 subLength = options.subLength;
             } else {
                 //���ˮƽ������ȡouterWidth()�� ����ȡouterHeight()
                 if (isHorizontal){
                     subLength = this.boxes.eq(0).outerWidth();
                 } else {
                     subLength = this.boxes.eq(0).outerHeight();
                 }
             }
             this._getSubLength = function(){ return subLength; }
             return subLength;
         },
         /**
          * @methed _getPerLength ����ÿ�ι����ĸ߶Ȼ���
          */
         _getPerLength: function() {
             var subLength = this._getSubLength(),
             options = this.options,
             perLength;
             perLength = subLength * options.perItem;
             this._getPerLength = function(){ return perLength; }
             return perLength;
         },
         /**
          * @methed _setSubLength ����subLength
          */
         _setSubLength: function(){
             this.subLength = (this.subLength && this._isNumber(this.subLength)) ? this.subLength : null;
         },
         /**
          * @methed _setPerItem ����perItem
          */
         _setPerItem: function() {
             this.perItem = (this._isNumber(this.perItem)) ? this.perItem : 1;
         },
         /**
          * @methed _getScrollBoxes ���ع�������ʾ�����boxes
          */
         _getScrollBoxes: function(){
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
         },
         /**
          * @methed _isNumber  �ж��Ƿ�Ϊ���֣�����true/false
          */
         _isNumber: function(num){
             return (num - 0) == num && num.length > 0;
         }
     });
 })(jQuery);
 