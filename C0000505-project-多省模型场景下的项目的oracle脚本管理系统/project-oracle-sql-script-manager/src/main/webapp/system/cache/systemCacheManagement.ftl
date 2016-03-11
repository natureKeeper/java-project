<html>
<head>
<#include "/resource/prototype/include.ftl" />

<style>
.browser_item {	
	width:100%;
	height:20;
	/* cursor:hand; */
	font-size:12;
	color:#000085;
	padding-top:1;
	padding-right:3;
	font-family:Verdana,Simsun;
}
.x_form_label {
	width:30;
	height:30;
	/* cursor:pointer; */
	border-top:1 solid #98C0F4;
}
.x_form_field {
	/* cursor:pointer; */
	border-top:1 solid #98C0F4;
}
</style>

<script>
var ctx = {
	startTime:null
};
</script>

</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>

<tr>
<td align="center" style="vertical-align:text-top;padding:0;">
	
	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">
	<tr>
	<td style="height:30px;background-color:#EAF3FE;padding:3;border-bottom:1 solid #98C0F4;">
		<input id="btnClear" type="button" class="x_btn" value="Clear" onclick="doClear();" />
	</td>	
	</tr>	
	<tr>
	<td align="center">	

		<div class="box" style="padding:20;">
		
			<#if keys ? exists>
			<table class="x_form" style="width:80%;border-bottom:1 solid #98C0F4;" cellpadding="0" cellspacing="0" border="0">
				<#if endPoints ? exists>
				<tr>
					<td style="height:30;" class="x_form_field"><input type='checkbox' name='selectAllEndPoints' onclick="selectAllEndPoints(this);return;" checked=true>全选节点</td>
				</tr>
				<tr>
				<td style="height:30;" class="x_form_field">
				<#list endPoints as p>
				<input type='checkbox' id='${p}' name='endPoint' checked=true>${p}
				<#if (p_index%5)==4>
				<br>	
				</#if>
				</#list>
				</td>
				</tr>
				</#if>
				<tr>
				<td style="height:30;" class="x_form_field"><input type='checkbox' name='selectAllKeys' onclick="selectAllKeys(this);return;" checked=true>全选</td>
				</tr>
				<#list keys as t>
				<label for="${t}Cleared">
				<tr>
				<td style="height:30;" class="x_form_field"><input type='checkbox' id='${t}' name='casheKey' checked=true>CACHE KEY = ${t}</td>
				</tr>
				</label>
				</#list>
			
			</table>
			<#else>
			no cache key found
			</#if>	
			
		</div>
		
	</td>
	</tr>
	</table>
	
	
</td>
</tr>
</table>



<script>
function selectAllKeys(e){
	var tags = document.getElementsByName('casheKey');
	if(tags.length>0){
		for(var i=0;i<tags.length;i++){
			var checkBox = tags[i];
			if(e.checked){
				checkBox.checked=true;
			}else{
				checkBox.checked=false;
			}
		}
	}
	
}
function selectAllEndPoints(e){
	var tags = document.getElementsByName('endPoint');
	if(tags.length>0){
		for(var i=0;i<tags.length;i++){
			var checkBox = tags[i];
			if(e.checked){
				checkBox.checked=true;
			}else{
				checkBox.checked=false;
			}
		}
	}
	
}
function doClear() {
	var keys = [];
	var endPoints = [];
	var keyTags = document.getElementsByName('casheKey');
	var pointTags = document.getElementsByName('endPoint');
	if(keyTags.length>0){
		for(var i=0;i<keyTags.length;i++){
			var checkBox = keyTags[i];
			if(checkBox.checked){
				keys.push(checkBox.id);
			}else{
				continue;
			}
		}
	}
	if(pointTags.length>0){
		for(var i=0;i<pointTags.length;i++){
			var checkBox = pointTags[i];
			if(checkBox.checked){
				endPoints.push(checkBox.id);
			}else{
				continue;
			}
		}
	}
	if(keys.length==0){
		alert('请选择要清空的缓存');
		return;
	}
	if(endPoints.length==0){
		alert('请选择要清空的节点');
		return;
	}
	xbtnDisable('btnClear');
	ctx.startTime = new Date();
	
	J.json(
		'systemCacheManagement!clearCacheByCode.html',
		'keyStr='+keys.toString()+'&endPointStr='+endPoints.toString(),
		function(o) {
			//if('SUCCESS'==o.returnValue) {
				xbtnEnable('btnClear');
				
				var endTime = new Date();
				var endSecond = endTime.getHours()*60*60 + endTime.getMinutes()*60 + endTime.getSeconds();
				var startSecond = ctx.startTime.getHours()*60*60 + ctx.startTime.getMinutes()*60 + ctx.startTime.getSeconds();
				
				Msg.info('messageContainer', 'Cached cleared successfully in "' + (endSecond-startSecond) + '" second(s).');
				setTimeout('self.location.reload()',2000);
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

