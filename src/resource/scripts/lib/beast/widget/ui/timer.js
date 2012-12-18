/**
 * jQuery UI Timer 1.2
 *
 * by Denis 2011.07.01
 * Depends:
 *	jquery.ui.core.js
 * @update Denis 2011.11.25 �޸��޷�ֹͣ���ٿ�ʼ
 * @update Denis 2011.12.28 ȥ��Ĭ�ϵ�from���ã���û�д���from����ʱ��Ĭ��Ϊ�ͻ��˵�ǰʱ��
 * @update Denis 2012.03.26 �޸�����ʱ������ļ�ʱ���
 */
('timer' in jQuery.fn) ||
(function($, undefined){
    var TMAP = ['year', 'month', 'day', 'hour', 'minute', 'second'], FMAP = {
        year: 'yyyy',
        month: 'MM',
        day: 'dd',
        hour: 'hh',
        minute: 'mm',
        second: 'ss'
    };
    $.widget('ui.timer', {
        options: {
            format: 'y-M-d hh:mm:ss', //�� ʱ �� ��
            //from: new Date()
            to: new Date(),
            step: 1,
            animate: false,
            autoStart: true
        },
        _create: function(){
            this._render();
        },
        _render: function(){
            var self = this, elem = self.element, o = self.options, tmp = '<dl><dd></dd></dl>';
            elem.addClass('ui-timer');
            //����ռλ����
            $.each(TMAP, function(i, item){
                var placeholder = $('.' + item, elem);
                if (placeholder.length) {
                    self['ph' + item] = placeholder;
                    if (o.animate) {
                        placeholder.html(item === 'year' ? tmp : (tmp + tmp));
                        self['ph' + item] = placeholder.children();
                    }
                }
            });
            if (o.autoStart) {
                self.start();
            }
        },
        /**
         * ��ʼ��ʱ
         */
        start: function(){
            var self = this, o = self.options, aim;
            if (!self.timer) {
                //��ʼ��ʱ��
                aim = self.aim = new Date(o.to - (o.from || new Date())); //Ŀ�����ʼ�Ĳ�ֵ
                //�����ʱ��
                self.timer = $.later(1000 * o.step, self, self._interval, undefined, true);
                self._interval();
            }
            return self;
        },
        /**
         * ֹͣ��ʱ
         */
        stop: function(){
            var self = this;
            if (self.timer) {
                self.timer.cancel();
                delete self.timer;
                self._trigger('stop');
            }
        },
        /**
         * ��ʱѭ������
         */
        _interval: function(){
            var self = this, aim = self.aim;
            if (aim < 0) {
                self.stop();
                return;
            }
            var o = self.options, format = o.format, aimMap = {
                year: aim.getFullYear() - 1970,
                month: aim.getUTCMonth(),
                day: aim.getUTCDate() - 1,
                hour: aim.getUTCHours(),
                minute: aim.getUTCMinutes(),
                second: aim.getUTCSeconds()
            };
            if (o.animate) {
                $.each(TMAP, function(i, item){
                    var preVal = self[item] || 0, val = aimMap[item];
                    if (self['ph' + item] && preVal !== val) {
                        //animate
                        self._animate(self['ph' + item], preVal, val);
                        self[item] = val;
                    }
                });
            } else {
                $.each(TMAP, function(i, item){
                    var val = aimMap[item];
                    if (self['ph' + item] && self[item] !== val) {
                        self['ph' + item].html((val < 10 && format.indexOf(FMAP[item]) > -1) ? '0' + val : val);
                        self[item] = val;
                    }
                });
            }
            //����ʱ��
            self.aim = new Date(self.aim - 1000 * o.step);
        },
        /**
         * ����ִ�к���
         * @param {Object} dds dd����
         * @param {Object} pre ֮ǰ��ֵ
         * @param {Object} now ֮���ֵ
         */
        _animate: function(dls, pre, now){
            var self = this, o = self.options, len = dls.length, i = 0, p, n;
            pre = self._strFix(pre, len);
            now = self._strFix(now, len);
            for (; i < len; i++) {
                p = pre.charAt(i);
                n = now.charAt(i);
                if (p !== n) {
                    var dl = $(dls[i]), di = dl.children(), dd = $('<dd>').addClass('num' + n);
                    dl.append(dd);
                    di.animate({
                        marginTop: '-' + di.height() + 'px'
                    }, 800, function(){
                        $(this).remove();
                    });
                }
            }
        },
        /**
         * �Բ��㳤�ȵ��ַ�������0
         * @param {Object} len
         */
        _strFix: function(str, len){
            str = str + '';
            var i = len - str.length;
            while (i) {
                str = '0' + str;
                i--;
            }
            return str;
        },
        /**
         * �������
         */
        _destroy: function(){
            var self = this;
            self.stop();
            self.element.removeClass('ui-timer');
        }
    });
    
    $.add('ui-timer');
})(jQuery);
