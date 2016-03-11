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
 &nbsp; <font class="x_banner_font">新增 "${metaEntityType.name}" EntityType</font>
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
			<input id="entityType.metaEntityTypeId" name="entityType.metaEntityTypeId" value="${metaEntityTypeId}" type="hidden" />
			<input id="entityType.enable" name="entityType.enable" value="true" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">name 名称</td>
			<td class="x_form_field"><input id="entityType.name" name="entityType.name" value="${(entityType.name)?if_exists}" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label">code 编码</td>
			<td class="x_form_field"><input id="entityType.code" name="entityType.code" value="${(entityType.code)?if_exists}" class="x_text" /></td>
			</tr>
			<#if metaEntityType.spatialTable ? exists>
			<tr>
			<td class="x_form_label">spatial 是否空间</td>
			<td class="x_form_field"><input id="entityType.spatial" name="entityType.spatial" type="checkbox" value="true" /></td>
			</tr>
			</#if>
			<tr>
			<td class="x_form_label">icon 图标</td>
			<td class="x_form_field"><input id="entityType.value" name="entityType.icon" value="${(entityType.icon)?if_exists}" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label" style="width:25%;">extensionTable 扩展表</td>
			<td class="x_form_field"><#if availableExtensionTables ? exists><select id="entityType.extensionTable" name="entityType.extensionTable" class="x_select">
				<#list availableExtensionTables as t>
				<option value="${t}">${t}</option>
				</#list>
				</select>
				<#else>Please insert extensionTable first</#if>
			</td>
			</tr>
			
			</form>
			</table>
			<table class="x_form" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_form_field" colspan="2"><br />
				<textarea id="statement" name="statement" style="height:200;width:100%;"></textarea>
			</td>
			</tr>
			</table>
		</div>		
	</td>
	</tr>
	<tr>
	<td class="x_operation_bar" align="center">
		<input id="btnCreate" class="x_btn<#if availableExtensionTables ? exists><#else>_disabled</#if>" value="Create" type="button" onclick="doCreate();" />
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
		'systemMetadataManagement!doCreateEntityType.html',
		p.join('&'),
		function(o) {
			Form.disable('fom');
			xbtnDisable('btnCreate');
			$('btnCancel').value = 'Close';	
			Msg.info('messageContainer', 'Create Successfully!');
			$('statement').value = o;			
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
