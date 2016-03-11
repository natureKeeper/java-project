<html>
<head>
<#include "/resource/prototype/include.ftl" />

<style>

.severity_ERROR {
	color:red;
}
.severity_WARN {	
	color:yellow;
}
.messageBox { 
	overflow:auto;  
    width:1000;   
    height:500;  
    align:middle;
    text-align:left;
    /*position:relative;  */
    position:absolute; 
    background-color:#E0E2FD;   
    visibility:hidden; 
    /* visibility:visible;*/
    filter: alpha(opacity=90);
    opacity: .9;
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";
    z-index:101;   
    /* display:none; */
}

</style>

</head>


<script>
var ctx = {
	
	pagination: {
		index:1, 
		length:0, 
		size:20,
		count:0, 
		counted:true, 
		items:null
	}
};

function refreshAuditLogList() {	
	if(null!=ctx.pagination.items) {
		var t = null;
		for(var i = 0; i < ctx.pagination.items.length; i++) {
			t = ctx.pagination.items[i];
			
			xlist.addRow({
				id:t.id,					
				data:[
					//t.id,
					'<font style="font-weight:bold;" class="severity_'+t.auditLogSeverity.text+'"> &nbsp; [ ' + t.auditLogSeverity.text + ' ]</font>',
					t.operator,
					t.startTime,
					'<span style="text-align:right;width:100%;height:100%;"><input type="button" class="x_btn" style="width:20;height:100%;" onclick="findAuditLogMessage('+t.id+');" value="..." /></span>',
					t.interfaceOperation,
					//t.targetImplementation
					
				]
			});
		}
	}
	t = null;
	
	xpagination.set(ctx.pagination);
}
		



</script>



<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>

<tr>
<td>




	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

	<tr>
	<td class="x_tab_separator_container x_tab_container_background">
	
		<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
		<tr>
		<td class="x_tab_first" style="width:10;">&nbsp;</td>
		<td nowrap="true" valign="bottom"><span
			 class="x_tab_on" id="tabAuditLogList" content="contentAuditLogList" onclick="xTab(this);"><span class="x_tab_text_on">AuditLog 审计日志</span></span><span
			 class="x_tab" id="tabAuditLogHits" content="contentAuditLogHits" onclick="xTab(this);" ><span class="x_tab_text">服务 Hits</span></span></td>
		<td class="x_tab_last" style="width:99%;">&nbsp;</td>	
		</tr>
		<tr><td colspan="3" class="x_tab_separator"></td></tr>
		</table>
		
	</td>
	</tr>
	
	<tr>
	<td>
		<div id="contentAuditLogList" style="display:visible;">
	
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Find" type="button" onclick="findAuditLogs();" /><!--
				|
				<input class="x_btn_disabled" value="//Create" type="button" onclick="createAuditLog();" />			
				<input class="x_btn_disabled" value="//Update" type="button" />
				<input class="x_btn_disabled" value="//Delete" type="button" /> -->
				</td>
			</tr>
			<tr>
			<td class="x_criteria_bar" style="padding:10;"><!--  align="center" -->
				<table style="width:80%;" class="x_form" border="0" cellspacing="0" cellpadding="0">
				<form id="fom" name="fom" onsubmit="return false;">
				<tr>
					<td class="x_form_label" style="width:20%;">Severity<td>
					<td class="x_form_field" style="width:30%;">
						<select id="auditLogSeverity" name="auditLogSeverity" type="text" value="//TODO" class="x_text" />
						<option value="-">-- ALL --</option>
						<#if auditLogSeveritys ? exists><#list auditLogSeveritys as t>
						<option value="${t.name()}" <#if t.name()="ERROR">selected="true"</#if>>${t.text}</option>
						</#list></#if>
						</select>
					<td>
					<td class="x_form_label" style="width:20%;">Operator<td>
					<td class="x_form_field" style="width:30%;">
						<!-- input id="auditLogCriteria.operator" name="auditLogCriteria.operator" type="text" class="x_text" / -->
						
						<select id="auditLogCriteria.operator" name="auditLogCriteria.operator" type="text" class="x_text" />
							<option value="-">-- ALL --</option>
							<#if users ? exists><#list users as t>
							<option value="${t.name}">${(action.capitalize(t.name))?if_exists} ${(t.name)?default("unamed")}</option>
							</#list></#if>
						</select>
						
					<td>
				</tr>
				</form>
				</table>
			</tr>
			<tr>
			<td style="height:99%;">
				<div id="xlistContainer" style="height:100%;width:100%;"></div>
				<script>
				var xlist = new XList();
				var xlistColumns = [
					{name:'auditLogSeverity', text:'severity', width:'100'},
					{name:'operator', text:'operator', width:'100'},
					{name:'startTime', text:'timestamp', width:'150'},					
					{name:'message', text:'message', width:'80'},
					{name:'interfaceOperation', text:'interface', width:'800'}
					//{name:'targetImplementation', text:'implementation', width:'200'},
				];
							
				var xlistContext = {
					container:'xlistContainer',
					rowType:'empty',
					rowId:'id',
					onRowDblClickHandler: function(o) {
						alert('o.rowId='+o.rowId);
					}
				};
				xlist.create(xlistContext, xlistColumns);	
				</script>
			</td>
			</tr>
			<tr>
			<td class="x_pagination_bar">
				<div id="xpaginationContainer"></div>
		
				<script>
				function onPagination(p) {
					//$('result').innerHTML = $H(p).toQueryString();
					findAuditLogs(p);
				}
				var context = {
					container: 'xpaginationContainer',
					count: 101,
					index: 2,
					size: 10,
					length: 10,
					onPaginationHandler: onPagination
				};
				var xpagination = new XPagination();
				xpagination.create(context);
				</script>
			</td>
			</tr>
			</table>
		</div>
		
		<div id="contentAuditLogHits" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input 
				class="x_btn" value="Refresh" type="button" onclick="findHitsByOperator();" 
				/><!-- input 
				class="x_btn" value="Find" type="button" onclick="findAuditLogs();"/>
				</td -->
			</tr>
			
			<tr>
			<td style="height:99%;">
				<div id="hitsContainer" style="height:100%;width:100%;overflow:auto;">
				&nbsp;
				<div>
			</td>
			</tr>			
			</table>
		</div>
	</td>
	</tr>
	</table>	
	
</td>
</tr>
</table>



<div id="messageBox" name="messageBox" class="messageBox" ondblclick="messageBoxOff();">
loading...
</div>



<script>

function messageBoxOn(message) {
	var messageBox = document.getElementById('messageBox');
	var xlistContainer = document.getElementById('xlistContainer');
	Position.clone(xlistContainer, messageBox);
	messageBox.innerHTML = '<pre>'+message+'</pre>';
	document.getElementById('messageBox').style.visibility='visible';
}

function messageBoxOff() {
	document.getElementById('messageBox').style.visibility='hidden';
}


function findAuditLogs(pagination) {
	
	xlist.clear();

	pagination = pagination || ctx.pagination;
	
	var p = [];
	p[p.length] = 'pagination.index='+pagination.index;	
	p[p.length] = 'pagination.size='+pagination.size;
	p[p.length] = 'pagination.count='+pagination.count;
	p[p.length] = 'pagination.counted=true';
	
	var operator = $('auditLogCriteria.operator').value;
	if('-'!=operator) {
		p[p.length] = 'auditLogCriteria.operator='+operator;
	}
	
	var auditLogSeverity = $('auditLogSeverity').value;	
	if('-'!=auditLogSeverity) {	
		p[p.length] = 'auditLogSeverity='+ auditLogSeverity;
	}

	//alert(p.join('\n'));
	
	J.json(
		'systemAuditLogManagement!findAuditLogs.html',
		p.join('&'),
		function(o) {
			ctx.pagination = o;
			refreshAuditLogList();
		}
	);
}

function findAuditLogMessage(auditLogId) {
	J.json(
		'systemAuditLogManagement!findAuditLogById.html',
		'auditLogId='+auditLogId,
		function(o) {
			if(null!=o && null!=o.message) {
				messageBoxOn(o.message);
			} else {
				messageBoxOn('empty message');
			}
		}
	);
}

function findHitsByOperator() {
	J.updater('systemAuditLogManagement!findOperatorHits.html', '', 'hitsContainer');
}

</script>


</body>
<script>
function onLoad() {
	refreshAuditLogList();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>

