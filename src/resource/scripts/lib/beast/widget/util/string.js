/**
 * Created by IntelliJ IDEA.
 * User: zhangfan
 * Date: 11-9-23
 * Time: ����4:10
 * To change this template use File | Settings | File Templates.
 */
;(function($){

    $.namespace('jQuery.util.string');

    $.util.string = {
    //	/**
    //	 * ȥ���ַ������߿ո�
    //	 * @param {String} str
    //	 * @return {String}
    //	 */
    //	trim: function(str){
    //	    if(str && str.length > 0){
    //			return str.replace(/(^\s*)|(\s*$)/g, '');
    //		}
    //		return '';
    //	},
        /**
         * �ַ����Ƿ�Ϊ��
         * @param {String} str
         * @return {Boolean}
         */
        isEmpty: function(str){
            return (str || str.length > 0)?false:true;
        },
        /**
         * �ַ�����ͷ�ж�
         * @param {String} str
         * @param {String} startText
         * @return {Boolean}
         */
        startsWith: function(str,startText){
            return str && str.indexOf(startText) == 0;
        },
        /**
         * ȡ�ַ�����nλ���ַ�
         * @param {String} str �ַ���
         * @param {Int} n ��Nλ
         * @return {String} һ���ַ�
         */
        getChar: function(str, n){
            return str.substring(n, n+1);
        },
        /**
         * �滻���ַ�
         * @param {String} str ԭ�ַ���
         * @param {String} rChar �滻�ַ�
         * @return {String} �滻����ַ���
         */
        replaceFirstChar: function(str, rChar){
            return rChar + str.slice(1);
        },
        /**
         * ��ȡ�����ַ���֮����ı�
         * @param {String} str ԭ�ַ���
         * @param {String} start ��ʼ�ı�
         * @param {String} end �����ı�
         * @return {String} ��ȡ����ַ���
         */
        getBetweenText: function(str,start,end){
            return str.substring(str.indexOf(start)+start.length,str.indexOf(end));
        },
        /**
         * ��ȡ��ͷ��ĳ�ı�֮����ı�
         * @param {String} str ԭ�ַ���
         * @param {String} text ĳ�ı�
         * @return {String} ��ȡ����ַ���
         */
        getBeforeText: function(str, text){
            if(str.indexOf(text)<0) return str;
            return str.substring(0,str.indexOf(text));
        },
        /**
         * �ַ���ת�����ַ�����
         * @param {String} str
         * @return {Array}
         */
        toChars: function(str){
            if(!str || str.length <= 0) return null;
            var _chars = [];
            for(var i=0; i < str.length; i++){
                _chars[i] = this.getChar(str,i);
            };
            return _chars;
        },
        /**
         * ת���ַ���Ϊ�������ַ���Ϊ�գ��򷵻�0��
         * @param {String} str
         * @return {Int}
         */
        parseInt: function(str){
            str = '' + str;
            return (str && str.length > 0)?parseInt(str,10):0;
        }	,
        /**
         * �滻�ַ�
         * @param {String} str ԭ�ַ���
         * @param {String} s1 Ŀ���ַ�
         * @param {String} s2 �滻�ַ�
         * @return {String} �滻����ַ���
         */
        replaceAll:function(str,s1,s2){
            return str.replace(new RegExp(s1,"g"),s2);
        },
        /**
         * ����ַ����ĳ��ȡ�ע�⣺�����ַ���2������
         * @param {String} str
         * @return {Int}
         */
        byteLength: function(str){
            return str.replace(/[^\x00-\xff]/g,'aa').length;
        },
        /**
         * �滻λ��n�ϵ��ַ�
         * @param {String} str ԭ�ַ���
         * @param {Char} rChar �滻�ַ�
         * @param {Int} n λ��
         * @return {String} �滻����ַ���
         */
        replaceCharByPostion:function(str,rChar,n){
            return str.substring(0, n-1)+rChar+str.substring(n);
        },
        /**
         * &��<��",>ת��
         * @param {String} value
         * @return {String}
         */
      htmlEncode : function(value){
          return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      },
        /**
         * &gt;��&quot;&quo��&amp;t>ת��
         * @param {String} value
         * @return {String}
         */
      htmlDecode : function(value){
          return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      },
      /**
         * ����HTML�����ַ�
         * @param {String} str
         * @return {String}
         */
        stripTags: function(str) {
            if(!str || typeof str!='string') return '';
            return str.replace(/<\/?[^>]+>/gi, '');
        },
        /**
         * HTML�����ַ�ת��
         * @param {String} str
         * @return {String}
         */
        escapeHTML: function(str) {
            if(!str || typeof str!='string') return '';
            var div = document.createElement('div');
            var text = document.createTextNode(str);
            div.appendChild(text);
            return div.innerHTML;
        },
        /**
         * HTML�����ַ���ת��
         * @param {String} str
         * @return {String}
         */
        unescapeHTML: function(str) {
            if(!str || typeof str!='string') return '';
            var div = document.createElement('div');
            div.innerHTML = this.stripTags(str);
            return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
        },
        /**
         * ��ȡ�ַ������� ����˫�ֽ�
         * @param {String} pstr
         * @param {Number} num
         * @param {String} str
         * @return {String}
         */
        btSub : function(pstr,num,str){
            if(pstr===null||pstr==='')return '';
            var s = pstr.match(/(.{1})/g),k=[],laststr='',count=0;
            if(str)laststr = str;
            for(var i=0; i<num; i++){
                k.push(s[count]);
                count++;
                if(!/^[\u0000-\u00ff]$/.test(s[count])){i++;}
            }
            return k.join('')+laststr;
        }
    };
    $.extendIf( String.prototype, $.methodize( $.util.string ));
    $.add('util-string');
})(jQuery);