<script language="JavaScript" type="text/JavaScript">
var i18nObj = {
	<#assign keys=action.getTexts("messages").getKeys()/>
	<#list keys as key>
		'${key}':'${action.getText('${key}')}',
	</#list>
	end:'aa'
};
function getText(key){
	if(!Ext.isEmpty(i18nObj[key])){
		return i18nObj[key];
	}else{
		return '';
	}
}
</script>