/**
 * Created by IntelliJ IDEA.
 * User: zhangfan
 * Date: 11-9-23
 * Time: ����4:26
 * To change this template use File | Settings | File Templates.
 */
;(function($){

    $.namespace('jQuery.util.number');

    $.util.number = {
        /**
         * ��ȷ�ļӷ�����
         * @param {Number|String} s1 ������
         * @param {Number|String} s2 ����
         * @param {String} opt �ӺŻ����:'+'��'-'
         * @return {Number}
         */
        add: function(s1, s2, opt){
            if(!opt) opt = '+';
            s1 = this.toNumber(s1);
            s2 = this.toNumber(s2);

            if(this.isInt(s1) && this.isInt(s2)) return eval('s1'+opt+'s2');
            s1=this.toString(s1);s2=this.toString(s2);

            var m = Math.pow(10,Math.max(this.getDigitsLength(s1),this.getDigitsLength(s2)));
            var n1=this.multiply(s1,m);
            var n2=this.multiply(s2,m);

            return (!opt || opt=='-')?this.divide(n1-n2,m):this.divide(n1+n2,m);
        },
        /**
         * ��ȷ�ļ�������
         * @param {Number|String} s1 ������
         * @param {Number|String} s2 ����
         * @return {Number}
         */
        subtract: function(s1, s2){
            return this.add(s1, s2, '-');
        },
        _insertString: function(s,ch,pos){
            return s.substring(0,pos)+ch+s.slice(pos);
        },
        /**
         * ������ת��ΪString��֧�ֿ�ѧ��������ʽ������
         * @param {Number|String} s
         * @return {String}
         */
        toString: function(s){
            if(s==null || typeof s == 'undefined') return '';
            var n = this.toNumber(s);
            var t = n.toString().toLowerCase();
            if(t.indexOf('e')<=0) return t;

            var sNum = Math.abs(n).toString();
            var dotP = sNum.indexOf('.');
            var eP = sNum.indexOf('e');

            var rNum = sNum.substring(0,eP);
            var power = sNum.slice(eP+1);
            if(power=='' || power=='+' || power=='-' || this.isZero(power)){//���������ֱ�ӷ���
                return (Math.abs(n)!=n)?'-'+rNum:rNum;
            };

            var tempNum = rNum.replace('.','').replace(/0/g,'');
            var digitLen = dotP<0?0:eP-dotP-1;

            var zero=[];pLen=Math.abs(power);
            if(this.isPlus(power)){
                for(var i=0;i<pLen;i++){
                    zero.push('0');
                }
                tempNum = tempNum+zero.join('');
                if(digitLen>0) tempNum = this._insertString(tempNum,'.',tempNum.length-digitLen);
            }else{
                for(var i=0,len=pLen+digitLen;i<len;i++){
                    zero.push('0');
                }
                tempNum = zero.join('')+tempNum;
                tempNum = this._insertString(tempNum,'.',tempNum.length-digitLen-pLen);
            }
            //ȥ����ͷ�������
            tempNum=tempNum.replace(/^0+\./g,'0.');
            tempNum=tempNum.replace(/0+$/g,'');
            return (Math.abs(n)!=n)?'-'+tempNum:tempNum;
        },
        /**
         * ��ȷ�ĳ˷�����
         * @param {Number|String} s1 ������
         * @param {Number|String} s2 ����
         * @return {Number}
         */
        multiply: function(s1, s2){
            s1 = this.toNumber(s1);
            s2 = this.toNumber(s2);
            if(s2 == 0 || s1 == 0) return 0;
            if(this.isInt(s1) && this.isInt(s2)) return s1*s2;
            if(s1===1) return s2; if(s2===1) return s1;

            var m=0;s1=this.toString(s1);s2=this.toString(s2);
            try{m+=s1.split(".")[1].length}catch(e){};
            try{m+=s2.split(".")[1].length}catch(e){};
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
        },
        /**
         * ��ȷ�ĳ�������
         * @param {Number|String} s1 ������
         * @param {Number|String} s2 ����������Ϊ0��NULL
         * @return {Number}
         */
        divide: function(s1, s2){
            s1 = this.toNumber(s1);
            s2 = this.toNumber(s2);
            if(s1==0) return 0;
            if(s2==0) {
                alert('��������Ϊ��');
                return null;
            }
            s1=this.toString(s1);s2=this.toString(s2);

            var m1 = this.getDigitsLength(s1);
            var m2 = this.getDigitsLength(s2);
            var n1 = Number(s1.replace('.',''));
            var n2 = Number(s2.replace('.',''));

            return this.multiply(n1/n2,Math.pow(10,m2-m1));
        },
        /**
         * ת��Ϊ����
         * @param {Object} s
         * @return {Number}
         */
        toNumber: function(s){
            if(!this.isNumber(s)) return 0;
            if(typeof s == 'string') {
                var f = parseFloat(s.replace(/,/g, ""));
                return isNaN(f)?0:f;
            }else{
                return Number(s);
            }
        },
        /**
         * ת��Ϊ������
         * ע�⣺�������ֵ��������ݲ���mode��ֵ��
         *
         * @param {Number|String} s
         * @param {Int} mode ������������ģʽ��ȱʡ=0����ȡֵ��Χ��0=�������룻1=ȫ�룻2=ȫ��
         * @return {Int} ����
         */
        toInt: function(s, mode){
            if(this.isInt(s)) return s;
            if(!mode) mode = 0;

            switch(mode){
                case 0: return Math.round(this.toNumber(s)); break;
                case 1: return Math.ceil(this.toNumber(s));break;
                case 2: return Math.floor(this.toNumber(s));break;
            }
        },
        /**
         * �Ƿ�������
         * @param {Number|String} s
         * @return {Boolean}
         */
        isNumber: function(s){
            if(s==null || typeof s == 'undefined') return false;
            if(Object.prototype.toString.apply(s) === '[object Number]'){

                return true;
            }else if(typeof s == 'string'){
                if(s.toLowerCase().indexOf('e')>=0) return !isNaN(s);
                if(s.indexOf(',')>0){
                    var p0 = s.lastIndexOf(',');
                    var p1 = s.lastIndexOf('.');
                    if(p0 > p1 && p1 > -1) return false;
                }
                var n = s.replace(/,/g, "");
                return (!n || isNaN(n))?false:true;
            }
            return false;
        },
        /**
         * �Ƿ��Ǹ�����
         * @param {Number|String} s
         * @return {Boolean}
         */
        isFloat: function(s){
            if(!this.isNumber(s)) return false;

            s = s.toString();
            var f = s.replace(/,/g, "");
            if(f.indexOf('.') >= 0) return true;
            return false;
        },
        /**
         * �Ƿ�������
         * @param {Number|String} s
         * @return {Boolean}
         */
        isInt: function(s){
            if(!this.isNumber(s)) return false;
            return !this.isFloat(s);
        },
        /**
         * �Ƿ�����
         * @param {Number|String} s
         * @return {Boolean}
         */
        isZero: function(s){
            if(!this.isNumber(s)) return false;
            return parseFloat(s)==0;
        },
        /**
         * �Ƿ��Ǹ������㲻�Ǹ�����
         * @param {Number|String} s
         * @return {Boolean}
         */
        isNegative: function(s){
            if(!this.isNumber(s)) return false;
            var n = this.toNumber(s);
            return !this.isZero(s) && Math.abs(n)!=n;
        },
        /**
         * �Ƿ����������㲻��������
         * @param {Number|String} s
         * @return {Boolean}
         */
        isPlus: function(s){
            if(!this.isNumber(s)) return false;
            var n = this.toNumber(s);
            return !this.isZero(s) && Math.abs(n)==n;
        },
        /**
         * ȡ����
         * @param {Number|String} s
         * @return {Number}
         */
        reverseValue: function(s){
            if(!this.isNumber(s)) return 0;

            if(this.isNegative(s)){
                return this.toNumber(s.toStirng().slice(1));
            };

            return this.toNumber('-'+s);
        },
        /**
         * ȡ����ֵ
         * @param {Number|String} s
         * @return {Number}
         */
        absValue: function(s){
            if(!this.isNumber(s)) return 0;
            return Math.abs(s);
        },
        /**
         * ȡС������
         * @param {Number|String} s
         * @return {Int}
         */
        getDigitsLength: function(s){
            if(!this.isNumber(s)) return -1;
            if(this.isInt(s)) return 0;

            s = s.toString();
            var d = s.split('.')[1];
            return d?d.toString().length:0;
        },
        /**
         * ȡ����λ����
         * @param {Number|String} s
         * @return {Int}
         */
        getIntegersLength: function(s){
            if(!this.isNumber(s)) return -1;
            return this.toInt(s).toString().length;
        },
        /**
         * ��������
         * @param {Number|String} s
         * @param {Int} digit ����С��λ��
         * @return {Number}
         */
        round: function(s, digit){
            if(!this.isNumber(s)) return 0;
            var n = this.toNumber(s);
            if(this.isInt(n)) return n;

            if(!digit){
                digit = 0;
            }else if(!this.isInt(digit) || digit < 0) {
                digit = 3;
            }
            return this.toNumber(n.toFixed(digit));
        },
        /**
         * ��ʽ��������֣�Ϊ�ı���
         * @param {Number|String} s
         * @param {String} pattern ��ʽ:"#,###.###"
         * @param {Boolean} forceZero ���Ϊ������ʱ��ǿ����С��λ��0
         * @return {String}
         */
        formatMoney: function(s, pattern,forceZero){
            if(!this.isNumber(s)) return '0';
            if(!pattern) pattern = '#,###.###';
            var p = pattern.split('.');
            var digit = parseInt(p[1].length);
            if(forceZero){
                var sNum = this.round(s, digit).toFixed(digit).toString();
            }else{
                var sNum = this.round(s, digit).toString();
            }
            if(p[0].indexOf(',') > 0){
                var isNeg = false;
                if(this.isNegative(sNum)){
                    isNeg = true;
                    sNum = sNum.slice(1);
                }

                var iLen = (this.isFloat(sNum))?sNum.indexOf('.'):sNum.length;
                if(iLen <= digit) return sNum;
                var arr = [];
                var pos1 = 0;
                var pos2 = iLen % 3;
                while(pos2 <= sNum.length){
                    var sSlice = sNum.slice(pos1,pos2);
                    if(sSlice) arr[arr.length] = sSlice;

                    pos1 = pos2;
                    if(pos2 == (iLen-3)){
                        pos2 = sNum.length;
                    }else{
                        pos2+=3;
                    }
                }
                return ((isNeg)?'-':'')+arr.join(',');
            }
            return sNum;
        },
        /**
         * ʹ��"+-*\"������������������
         * @param {Number|String} v1
         * @param {String} opt ��������"+-*\"
         * @param {Number|String} v2
         * @return {Number}
         */
        calc:function(v1,opt,v2){
            var rst = null;
            switch(opt){
                case '+': rst = this.add(v1, v2);break;
                case '-': rst = this.subtract(v1, v2);break;
                case '*': rst = this.multiply(v1, v2);break;
                case '\\': rst = this.divide(v1, v2);break;
            }
            return rst;
        },
        /**
         * ��������˳�򣬼���"+-*\"��������
         * ���磺jQuery.util.arth(v1, "+", v2, "-", v1, "-", v2);
         * @return {Number}
         */
        arth:function(){
            if(arguments==null || arguments.length<=0) return null;

            var result = null;
            for (var i = 1; i < arguments.length; i=i+2){
                if(i==1){
                    result = this.calc(arguments[i-1],arguments[i],arguments[i+1]);
                }else{
                    result = this.calc(result,arguments[i],arguments[i+1]);
                }
            }

            return result;
        }

    };

    $.extendIf( Number.prototype, $.methodize( $.util.number, null, ['toNumber','arth'] ));
    $.add('util-number');
})(jQuery);