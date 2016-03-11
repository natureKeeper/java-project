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
 &nbsp; <font class="x_banner_font">修改 MetaDictionaryType</font>
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
			<input id="metaDictionaryType.id" name="metaDictionaryType.id" value="${(metaDictionaryType.id)?if_exists}" type="hidden" />
			<input id="metaDictionaryType.version" name="metaDictionaryType.version" value="${(metaDictionaryType.version)?if_exists}" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">name 名称</td>
			<td class="x_form_field"><input id="metaDictionaryType.name" name="metaDictionaryType.name" value="${(metaDictionaryType.name)?if_exists}" class="x_text" onkeyup="//onTextKeyUp();" /></td>
			</tr>
			<tr>
			<td class="x_form_label" style="width:25%;">code 编码</td>
			<td class="x_form_field"><input id="metaDictionaryType.code" name="metaDictionaryType.code" value="${(metaDictionaryType.code)?if_exists}" class="x_text" onkeyup="//onTextKeyUp();" /></td>
			</tr>
			</form>
			</table>
		</div>		
	</td>
	</tr>
	<tr>
	<td class="x_operation_bar" align="center">
		<input id="btnUpdate" class="x_btn" value="Update" type="button" onclick="doUpdate();" />
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
function doUpdate() {
	var p = [];
	p[p.length] = Form.serialize('fom');
	
	J.json(
		'systemDictionaryManagement!doUpdateMetaDictionaryType.html',
		p.join('&'),
		function(o) {
			Form.disable('fom');
			xbtnDisable('btnUpdate');
			$('btnCancel').value = 'Close';			
			Msg.info('messageContainer', 'Update Successfully! (id=' + o.id + ')');
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
