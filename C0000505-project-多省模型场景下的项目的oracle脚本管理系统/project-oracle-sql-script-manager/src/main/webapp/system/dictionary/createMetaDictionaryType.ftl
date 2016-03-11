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
 &nbsp; <font class="x_banner_font">新增 MetaDictionaryType</font>
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
			<input id="metaDictionaryType.enable" name="metaDictionaryType.enable" value="true" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">name 名称</td>
			<td class="x_form_field"><input id="metaDictionaryType.name" name="metaDictionaryType.name" class="x_text" onkeyup="//onTextKeyUp();" /></td>
			</tr>
			<tr>
			<td class="x_form_label">code 编码</td>
			<td class="x_form_field"><input id="metaDictionaryType.code" name="metaDictionaryType.code" class="x_text" onkeyup="//onTextKeyUp();" /></td>
			</tr>
			<tr>
			<td class="x_form_label">memo 备注</td>
			<td class="x_form_field"><textarea id="metaDictionaryType.memo" name="metaDictionaryType.memo" class="x_textarea"></textarea></td>
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
function onNameKeyUp() {
	//$('metaDictionaryType.code').value = $('metaDictionaryType.entityName').value + '.' + $('metaDictionaryType.attributeName').value
}
function onTextKeyUp() {
	//$('metaDictionaryType.name').value = $('metaDictionaryType.entityText').value + '.' + $('metaDictionaryType.attributeText').value
}
function doCreate() {
	var p = [];
	p[p.length] = Form.serialize('fom');
	
	J.json(
		'systemDictionaryManagement!doCreateMetaDictionaryType.html',
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
