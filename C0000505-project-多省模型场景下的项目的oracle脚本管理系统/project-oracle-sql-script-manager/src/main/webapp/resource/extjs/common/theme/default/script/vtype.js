Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';
//Ext自带验证包括alpha（纯字母），alphanum（字母和数字），email，url
/**
 * Ext校验
 */
Ext.apply(Ext.form.VTypes, {
    percent : function(val, field) {
        if (val>100) {
            return false;
        }else{
            return true;
        }
    },
    percentText:'不能大于100',
    maskSize : function(val, field) {
        if (val>32) {
            return false;
        }else if(val<1){
            return false;
        }else{
            return true;
        }
    },
    maskSizeText:'掩码位数应在1-32之间',
    ip : function(val, field) {
        if(!Ext.isEmpty(val)){
            var reg = new RegExp(/^(?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/);
            return reg.test(val);    
        }else{
            return true;
        }
    },
    ipText:'IP地址格式不对',
    positiveInteger : function(val, field) {
		if(!Ext.isEmpty(val)){
			var reg = new RegExp(/^[0-9]*[1-9][0-9]*$/);
			return reg.test(val);    
		}else{
			return true;
		}
	},
	positiveIntegerText:'请填写正整数',
	noExponent : function(val, field) {
		if(!Ext.isEmpty(val)){
			if(val.indexOf('e')>=0){
				return false; 
			}else{
				return true;
			}
			   
		}else{
			return true;
		}
	},
	noExponentText:'请勿使用科学计数法'
});