/*
 * jQuery UI Flash-chart 1.1
 *
 * @author xutao 2011.03.24
 * @update Denis 2011.06.14 ʹ���µ�flash���ע�᷽ʽ
 * @update Denis 2011.07.27 �ṩswf�Ŀ�����
 * Depends:
 *	jQuery.ui.flash
 */
('chart' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util, chart = function(){
        /**
         * ͼ���������
         */
        if ($util.flash.hasVersion(10)) {
            var self = this, swfid = self.element[0].id, o = self.options, //ͼ������line:����ͼ bar:��״ͼ hbar:ˮƽ��״ͼ pie:��ͼ 
 				swfurl = o.swf || $util.substitute('http://img.china.alibaba.com/swfapp/chart/yid-chart-{0}.swf', [o.type]);
            o = self.options = $.extend(true, {
                width: 700,
                height: 400,
                swf: swfurl,
                //����ű�
                allowScriptAccess: 'always',
                flashvars: {
                    startDelay: 500,
                    //�¼�����
                    eventHandler: 'jQuery.util.flash.triggerHandler'
                }
            }, o);
            $.extend(self, {
                /**
                 * ����Chart�����ò���
                 */
                _getFlashConfigs: function(){
                    var self = this, configs;
                    //����ԭʼ����
                    configs = $.ui.flash.prototype._getFlashConfigs.call(self);
                    //����ȥ������Ĳ���
                    delete configs.type;
                    //�����swfid��ʵ������id
                    configs.flashvars.swfid = swfid;
                    return configs;
                },
                /**
                 * ����XML�����ļ�
                 * @param {string} xmlurl xml�����ļ���URL
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                load: function(dataurl, charset){
                    charset = charset || 'utf-8';
                    return this.obj.load(dataurl, charset);
                },
                /**
                 * ����CSS�ļ�
                 * @param {string} cssurl css�ļ���URL
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                loadCSS: function(cssurl, charset){//����CSS�ļ�
                    charset = charset || 'utf-8';
                    return this.obj.loadCSS(cssurl, charset);
                },
                /**
                 * ����XML�ַ���
                 * @param {string} xmlString xml�ַ���
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                parse: function(xmlString){
                    return this.obj.parse(xmlString);
                },
                /**
                 * ����CSS�ַ���
                 * @param {string} cssString css�ַ���
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                parseCSS: function(cssString){
                    return this.obj.parseCSS(cssString);
                },
                /**
                 * ����ĳ�����ݿɼ���
                 * @param {int} index ��������
                 * @param {boolean} active �ɼ���true|false
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                setDatasetVisibility: function(index, active){
                    return this.obj.setDatasetVisibility(index, active);
                },
                /**
                 * ���ĳ�����ݵĿɼ���
                 * @param {int} index ��������
                 * @return {boolean} �ɼ�����true�����ɼ�����false
                 */
                getDatasetVisibility: function(index){
                    return this.obj.getDatasetVisibility(index);
                },
                /**
                 * ����ĳ�����ݵļ���״̬
                 * @param {int} index ��������
                 * @param {boolean} active �Ƿ񼤻�true|false
                 * @return {boolean} �ɹ�����true�����򷵻�false
                 */
                setDatasetActivity: function(index, active){
                    return this.obj.setDatasetActivity(index, active);
                },
                /**
                 * ���ĳ�����ݵļ���״̬
                 * @param {int} index ��������
                 * @return {boolean} �����true��δ�����false
                 */
                getDatasetActivity: function(index){
                    return this.obj.getDatasetActivity(index);
                }
            });
            return true;
        }
        return false;
    };
    $util.flash.regist('chart', chart);
    $.add('ui-flash-chart');
})(jQuery);
