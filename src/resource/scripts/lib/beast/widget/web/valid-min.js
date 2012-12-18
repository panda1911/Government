("Valid" in FE.ui)||(function($,UI,undefined){var regExps={isFloat:/^[-\+]?\d+(\.\d+)?$/,isUrl:/^(http|https):\/\//,isEmail:/^[\w\-]+(\.[\w\-]*)*@[\w\-]+([\.][\w\-]+)+$/,isMobile:/^1\d{10}$/,isInt:/^[-\+]?\d+$/,isID:/^\d{17}[\d|X]|\d{15}$/},rtrim=/^[\s\u00A0\u3000]+|[\s\u00A0\u3000]+$/g,defaults={active:true,lazy:true,required:false,evt:"blur",type:"string",trim:true,round:2,cache:true};function Valid(els,options){els=$(els);options=options||{};this._els=[];this._elConfigs=[];this.onValid=options.onValid||this.onValid;if(els.length){this.add(els)}}Valid.prototype={onValid:function(){return true},add:function(els,options){var self=this;els=$(els);for(var i=0,len=els.length,o,el;i<len;i++){if(self._els.indexOf(els[i])>-1){continue}el=$(els[i]);self._els.push(els[i]);try{o=options||$.extendIf(eval("("+(el.data("valid")||el.attr("valid")||"{}")+")"),defaults);o.defValue=val(els[i],o)}catch(e){$.log("valid�������ݸ�ʽ����")}self._elConfigs.push(o);el.bind(o.evt+".valid",{el:els[i],cfg:o,opt:o},$.proxy(validHandler,self));if(els[i].nodeName==="INPUT"){el.bind("keydown.valid",els[i],enterPressHandler)}}},remove:function(els){var self=this;if(typeof els==="number"){if(els<self._els.length){els=[self._els[els]]}else{return}}els=$(els);for(var i=0,len=els.length,options,idx;i<len;i++){idx=self._els.indexOf(els[i]);if(idx<0){continue}options=self._elConfigs[idx];$(self._els[idx]).unbind(".valid");self._els.splice(idx,1);self._elConfigs.splice(idx,1)}},active:function(els,mark){var self=this;if(typeof els==="string"||typeof els==="boolean"||!els){mark=(mark===undefined?els:mark);els=self._els}if(typeof els==="number"){if(els<self._els.length){els=[self._els[els]]}else{return}}els=$(els);for(var i=0,len=els.length,options,idx;i<len;i++){idx=self._els.indexOf(els[i]);if(idx<0){continue}options=self._elConfigs[idx];if(mark===undefined||mark===true){if(options.active){continue}options.active=true}else{if(mark==="op"){options.active=!options.active}else{if(!options.active){continue}options.active=false}}if(options.active){delete options.isValid}else{self.onValid.call(self._els[idx],"default",options);delete options.value}}},reset:function(els){this.active(els,false);this.active(els,true)},valid:function(els,configs,disFocus){var self=this;if(typeof els==="number"){if(els<self._els.length){els=[self._els[els]]}else{return}}if(!els){els=self._els}if(configs===true){disFocus=true;configs=undefined}els=$(els);for(var i=0,k,len=els.length;i<len;i++){var options={},idx=self._els.indexOf(els[i]);if(idx<0){continue}$.extend(options,self._elConfigs[idx]);if(configs){$.extend(options,configs)}if(!options.active){continue}options.lazy=false;if(options.isValid!==true||!options.cache){if(options.isValid===undefined||!options.cache){options.isValid=false;delete options.defValue;validHandler.call(self,{data:{el:self._els[idx],cfg:self._elConfigs[idx],opt:options}})}if(options.isValid===false&&k===undefined){k=idx}}}if(typeof k==="number"){if(!disFocus){$(self._els[k]).not(":hidden").focus()}return false}return true},getConfig:function(el){var self=this,i=(typeof el==="number"?el:self._els.indexOf($(el).get(0)));return i<0?null:self._elConfigs[i]},setConfig:function(els,configs){var self=this;if(typeof els==="number"){if(els<self._els.length){els=[self._els[els]]}else{return}}else{if($.isPlainObject(els)){configs=els;els=undefined}}if(!els){els=self._els}els=$(els);for(var i=0,j=els.length;i<j;i++){var idx=self._els.indexOf(els[i]);if(idx<0){continue}$.extend(self._elConfigs[idx],configs)}}};function val(el,options){switch(el.tagName.toLowerCase()){case"input":var type=el.type.toLowerCase();if(type==="text"||type==="password"){if(options.trim){el.value=el.value.replace(rtrim,"")}return el.value}if(type==="password"){return el.value}if(type==="radio"||type==="checkbox"){return el.checked?"checked":""}return el.value;case"textarea":default:if(options.trim){el.value=el.value.replace(rtrim,"")}return el.value;case"select":return el.selectedIndex<0?null:el.options[el.selectedIndex].value}}function enterPressHandler(e){if(e.keyCode===13){$(e.data).triggerHandler("blur")}}function validHandler(e){var data=e.data,el=data.el,cfg=data.cfg,options=data.opt,value=val(el,options);if(!options.active){return}if(options.lazy){if(value===options.defValue){return}options.lazy=false}if(options.cache&&value===options.value){return}var onValid=this.onValid;if(options.cache){cfg.value=value}cfg.isValid=options.isValid=false;if(!value){if(options.required){return onValid.call(el,"required",options)}if(options.type!=="fun"){cfg.isValid=options.isValid=true;return onValid.call(el,"pass",options)}}switch(options.type){case"string":if(typeof options.min==="number"&&value.length<options.min){return onValid.call(el,"min",options)}if(typeof options.max==="number"&&value.length>options.max){return onValid.call(el,"max",options)}break;case"float":if(!regExps.isFloat.test(value)){return onValid.call(el,"float",options)}var fval=value*1;if(typeof options.min==="number"){fval=fval.toFixed(options.round)}if(options.cache){cfg.value=value}if(typeof options.min==="number"&&fval<options.min){return onValid.call(el,"min",options)}if(typeof options.max==="number"&&fval>options.max){return onValid.call(el,"max",options)}break;case"int":if(!regExps.isInt.test(value)){return onValid.call(el,"int",options)}var ival=value*1;if(typeof options.min==="number"&&ival<options.min){return onValid.call(el,"min",options)}if(typeof options.min==="number"&&ival>options.max){return onValid.call(el,"max",options)}break;case"email":if(!regExps.isEmail.test(value)){return onValid.call(el,"email",options)}break;case"mobile":if(!regExps.isMobile.test(value)){return onValid.call(el,"mobile",options)}break;case"url":if(!regExps.isUrl.test(value)){return onValid.call(el,"url",options)}break;case"reg":if(!options.reg.test(value)){return onValid.call(el,"reg",options)}break;case"fun":options.msg=options.fun.call(el,options);if(typeof options.msg==="string"){return onValid.call(el,"fun",options)}break;case"remote":return options.fun.call(el,{cfg:cfg,opt:options},onValid);default:return onValid.call(el,"unkown",options)}cfg.isValid=options.isValid=true;return onValid.call(el,"pass",options)}Valid.regExps=regExps;UI.Valid=Valid;$.add("web-valid")})(jQuery,FE.ui);