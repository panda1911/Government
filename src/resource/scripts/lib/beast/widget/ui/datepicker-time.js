/**
 * jQuery UI Datepicker-time
 *
 * Depends:
 *	jQuery.ui.datepicker
 * @version 1.1 �޸��·���Ծ��BUG���Ż����ڲ��� ---- Denis
 * @update 2012.02.28 �ṩ��հ�ť ---- ����
 */
('TimeSelector' in jQuery.ui.datepicker) ||
(function($, undefined){
    $.extend($.ui.datepicker, {
        /**
         * ʱ��ѡ������
         * @constructor S.Calendar.TimerSelector
         * @param {object} ft ,timer���ڵ�����
         * @param {object} father ָ��S.Calendarʵ����ָ�룬��Ҫ������Ĳ���
         */
        TimeSelector: function(ft, father){
            //����
            this.father = father;
            this.fcon = ft.parent('div.box');
            this.popupannel = $('div.selectime', this.fcon);//��ѡʱ��ĵ�����
            if (typeof father._time == 'undefined') {//ȷ����ʼֵ�͵�ǰʱ��һ��
                father._time = father.options.date;
            }
            this.time = father._time;
            this.status = 's';//��ǰѡ���״̬��'h','m','s'�����жϸ����ĸ�ֵ
            this.ctime = $('<div>', {
                'class': 'time',
                html: 'ʱ�䣺<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><div class="cta"><button class="u"></button><button class="d"></button></div>'
            });
            this.button = $('<button>', {
                'class': 'ok',
                html: 'ȷ��'
            });
            this.clearBtn = $('<button>', {
                'class': 'clear',
                html: '���'
            });
            //Сʱ
            this.h_a = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            //����
            this.m_a = ['00', '10', '20', '30', '40', '50'];
            //��
            this.s_a = ['00', '10', '20', '30', '40', '50'];
            
            this._init(ft);
        }
    });
    $.extend($.ui.datepicker.TimeSelector.prototype, {
        //����
        /**
         * ������Ӧ������html��ֵ��������a��
         * ������Ҫƴװ������
         * ���أ�ƴ�õ�innerHTML,��β��Ҫ��һ���رյ�a
         *
         */
        parseSubHtml: function(a){
            var in_str = '';
            for (var i = 0; i < a.length; i++) {
                in_str += '<a href="javascript:void(0);" class="item">' + a[i] + '</a>';
            }
            in_str += '<a href="javascript:void(0);" class="x">x</a>';
            return in_str;
        },
        /**
         * ��ʾselectime����
         * ����������õ�innerHTML
         */
        showPopup: function(instr){
            var self = this;
            this.popupannel.html(instr);
            this.popupannel.removeClass('fd-hide');
            var status = self.status;
            $('span', self.ctime).removeClass('on');
            switch (status) {
                case 'h':
                    $('span.h', self.ctime).addClass('on');
                    break;
                case 'm':
                    $('span.m', self.ctime).addClass('on');
                    break;
                case 's':
                    $('span.s', self.ctime).addClass('on');
                    break;
            }
        },
        /**
         * ����selectime����
         */
        hidePopup: function(){
            this.popupannel.addClass('fd-hide');
        },
        /**
         * ������������������ļ��裬��������time��ʾ����
         */
        render: function(){
            var self = this;
            var h = self.get('h');
            var m = self.get('m');
            var s = self.get('s');
            self.father._time = self.time;
            $('span.h', self.ctime).html(h > 9 ? h : ('0' + h));
            $('span.m', self.ctime).html(m > 9 ? m : ('0' + m));
            $('span.s', self.ctime).html(s > 9 ? s : ('0' + s));
            return self;
        },
        //�����set��get��ֻ�Ƕ�time�Ĳ��������������������������
        /**
         * set(status,v)
         * h:2
         */
        set: function(status, v){
            var self = this;
            v = Number(v);
            switch (status) {
                case 'h':
                    self.time.setHours(v);
                    break;
                case 'm':
                    self.time.setMinutes(v);
                    break;
                case 's':
                    self.time.setSeconds(v);
                    break;
            }
            self.render();
        },
        /**
         * get(status)
         */
        get: function(status){
            var self = this;
            var time = self.time;
            switch (status) {
                case 'h':
                    return time.getHours();
                case 'm':
                    return time.getMinutes();
                case 's':
                    return time.getSeconds();
            }
        },
        
        /**
         * add()
         * ״ֵ̬����ı�����1
         */
        add: function(){
            var self = this;
            var status = self.status;
            var v = self.get(status);
            v++;
            self.set(status, v);
        },
        /**
         * minus()
         * ״ֵ̬����ı�����1
         */
        minus: function(){
            var self = this;
            var status = self.status;
            var v = self.get(status);
            v--;
            self.set(status, v);
        },
        
        
        //����
        _init: function(ft){
            var self = this;
            ft.html('').append(self.ctime);
            ft.append(self.button);
            ft.append(self.clearBtn);
            self.render();
            self.popupannel.bind('click.ui-datepicker-time', function(e){
                var el = $(e.target);
                if (el.hasClass('x')) {//�ر�
                    self.hidePopup();
                }
                else if (el.hasClass('item')) {//��ѡһ��ֵ
                    var v = Number(el.html());
                    self.set(self.status, v);
                    self.hidePopup();
                }
            });
            //ȷ���Ķ���
            self.button.bind('click.ui-datepicker-time', function(e){
                //��ʼ����ȡ�����date
                var father = self.father, o = father.options, d = typeof father.dt_selected == 'undefined' ? father.selected : father.dt_selected;
                d.setHours(self.get('h'));
                d.setMinutes(self.get('m'));
                d.setSeconds(self.get('s'));
                self.father._setOption('date', d)._trigger('timeSelect', e, {
                    date: d
                });
                
                if (o.popup && o.closable) {
                    self.father.hide(e);
                }
            });
            
            // ��յĶ��� added on 2.27 ����
            self.clearBtn.bind('click.ui-datepicker-time', function(e){
                var father = self.father;
                
                father.clear();
                father.hide(e);
            });
            
            //ctime�ϵļ����¼������¼������Ҽ��ļ���
            //TODO �����Ƿ�ȥ��
            self.ctime.bind('keyup.ui-datepicker-time', function(e){
                var KC = $.ui.keyCode;
                if (e.keyCode == KC.UP || e.keyCode == KC.LEFT) {//up or left
                    //e.stopPropagation();
                    e.preventDefault();
                    self.add();
                }
                if (e.keyCode == KC.DOWN || e.keyCode == KC.RIGHT) {//down or right
                    //e.stopPropagation();
                    e.preventDefault();
                    self.minus();
                }
            });
            //�ϵļ�ͷ����
            $('button.u', self.ctime).bind('click.ui-datepicker-time', function(){
                self.hidePopup();
                self.add();
            });
            //�µļ�ͷ����
            $('button.d', self.ctime).bind('click.ui-datepicker-time', function(){
                self.hidePopup();
                self.minus();
            });
            //����ѡ��Сʱ
            $('span.h', self.ctime).bind('click.ui-datepicker-time', function(){
                var in_str = self.parseSubHtml(self.h_a);
                self.status = 'h';
                self.showPopup(in_str);
            });
            //����ѡ�����
            $('span.m', self.ctime).bind('click.ui-datepicker-time', function(){
                var in_str = self.parseSubHtml(self.m_a);
                self.status = 'm';
                self.showPopup(in_str);
            });
            //����ѡ����
            $('span.s', self.ctime).bind('click.ui-datepicker-time', function(){
                var in_str = self.parseSubHtml(self.s_a);
                self.status = 's';
                self.showPopup(in_str);
            });
        }
    });
    $.add('ui-datepicker-time');
})(jQuery);
