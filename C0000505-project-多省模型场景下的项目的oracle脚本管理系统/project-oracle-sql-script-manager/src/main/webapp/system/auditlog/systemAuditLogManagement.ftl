<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>



<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>

<tr>
<td align="center" style="vertical-align:text-top;padding:20;">
	
	<table style="width:400;border:1 solid #98C0F4;border-top:0;" cellpadding="0" cellspacing="0" border="0">
	<form id="fom" name="fom" method="POST" onsubmit="return false;">
	
	
	<#if cacheKeys ? exists>
		<#list cacheKeys as t>
		<label for="${t.name()}Cleared">
		<tr>
		<!-- td class="x_form_label"><input id="${t.name()}Cleared" name="clear" type="checkbox" value="${t.name()}" onclick="XCheck.checkItem('allCleared');" /></td -->
		<td style="height:30;" class="x_form_field">${t.text}</td>
		</tr>
		</label>
		</#list>
	</#if>
	
	
	<tr>
	<td colspan="2" align="right" style="border-top:1 solid #98C0F4;background-color:#EAF3FE;padding:3;">
	
		<input id="btnClear" type="button" class="x_btn" value="Clear" onclick="doClear();" />
		<!-- table style="width:100%;" cellpadding="0" cellspacing="0" border="0">		
		<tr>
		<label for="allCleared">
			<td class="x_form_label"><input id="allCleared" name="allCleared" type="checkbox" value="true" onclick="XCheck.checkAll('cleared');" /></td>
			<td class="x_form_field">select all</td>
		</label>
		<td class="x_form_field" align="right" style="padding:3;"> </td>	
		</tr>		
		</table -->
		
	</td>	
	</tr>
	</form>
	</table>
	
</td>
</tr>
</table>



<script>
function doClear() {
	/*
	var p = Form.serialize('fom');
	if(''==p) {
		alert('请先检查"CACHE ITEM"!');
		return;
	} else {
		xbtnDisable('btnClear1');
		xbtnDisable('btnClear2');
		J.json(
			'cacheManage!clear.html',
			p,
			function(o) {
				if('SUCCESS'==o.returnValue) {
					xbtnEnable('btnClear1');
					xbtnEnable('btnClear2');
					Msg.info('messageContainer', 'Clear Successfully!');			
				}			
			}
		);
	}*/
	xbtnDisable('btnClear');
	J.json(
		'systemCacheManagement!clearCache.html',
		'',
		function(o) {
			//if('SUCCESS'==o.returnValue) {
				xbtnEnable('btnClear');
				Msg.info('messageContainer', 'Cached cleared successfully in "' + o + '" millis.');			
			//}			
		}
	);
}
</script>



</body>
<script>
function onLoad() {
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>

