<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {
	result:'FAILURE'
};
</script>


<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">



<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr>
<td class="x_banner_bar" ondblclick="//switchView();">
 &nbsp; <font class="x_banner_font">新增 MetaDictionary</font>
</td>
</tr>

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>

<tr>
<td>

	<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td valign="top" style="padding:10;">	
		<div clas="box">
			<table class="x_form" border="0" cellspacing="0" cellpadding="0">
			<form id="fom" name="fom" method="POST" onsubmit="return false;">
			<input id="metaDictionary.metaDictionaryTypeId" name="metaDictionary.metaDictionaryTypeId" value="${metaDictionaryTypeId}" type="hidden" />
			<input id="metaDictionary.ordinal" name="metaDictionary.ordinal" value="${metaDictionary.ordinal}" type="hidden" />
			<input id="metaDictionary.enable" name="metaDictionary.enable" value="true" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">name 名称</td>
			<td class="x_form_field"><input id="metaDictionary.name" name="metaDictionary.name" value="${(metaDictionary.name)?if_exists}" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label">code 编码</td>
			<td class="x_form_field"><input id="metaDictionary.code" name="metaDictionary.code" value="${(metaDictionary.code)?if_exists}" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label">value 值</td>
			<td class="x_form_field"><input id="metaDictionary.value" name="metaDictionary.value" value="${metaDictionary.value}" class="x_text" /></td>
			</tr>
			</form>
			</table>
		</div>		
	</td>
	</tr>
	<tr>
	<td class="x_operation_bar" align="center">
		<input id="btnCreate" class="x_btn" value="Create" type="button" onclick="doCreate();" />
		<input id="btnCancel" class="x_btn" value="Cancel" type="button" onclick="doCancel();" />
	</td>
	</tr>
	</table>

</td>
</tr>
</table>

	
<script>
function doCreate() {
	var p = [];
	p[p.length] = Form.serialize('fom');
	
	J.json(
		'systemDictionaryManagement!doCreateMetaDictionary.html',
		p.join('&'),
		function(o) {
			Form.disable('fom');
			xbtnDisable('btnCreate');
			$('btnCancel').value = 'Close';			
			Msg.info('messageContainer', 'Create Successfully! (id=' + o.id + ')');
			ctx.result='SUCCESS';
		}
	);
	p = null;
}

function doCancel() {
	window.close();
}
</script>


</body>
<script>
function onLoad() {
	window.status = 'onLoad';
}

function onUnload() {
	window.returnValue = ctx.result;
	window.status = 'onUnload';
}
</script>
</html>
