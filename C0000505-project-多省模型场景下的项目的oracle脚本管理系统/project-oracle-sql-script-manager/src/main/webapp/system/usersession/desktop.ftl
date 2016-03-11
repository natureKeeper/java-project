<html>
<head>
<#include "/resource/prototype/include.ftl" />
<link rel="stylesheet" type="text/css" href="${base}/resource/system/theme/default/style/system-usersession.css"></link>
</head>


<style>

div#sidebar {
	border: 1px dotted #000;
	padding: 10px;
}
.module_shortcut_cube {
	text-align:center;	
}
.module_shortcut {
	cursor:hand;
	color:#231D1D;
	font-weight:bold;
	border:0px;
}

.container {
	width:100%;
	height:100%;
	overflow:auto;
}

.mask {   
    width:100%;   
    height:100%;  
    align:middle;
    /*position:relative;  */
    position:absolute; 
    background-color:#B6C2FE;   
    visibility:hidden; 
    /* visibility:visible;*/
    filter: alpha(opacity=50);
    opacity: .5;
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
    z-index:101;   
    /* display:none; */
}
.toptable{
margin:0;
padding:0;
}
.toptable-top{
color:#808080;
background:url(resource/extjs/common/theme/default/image/menu/topbable-top-bg.jpg);
text-align:right;
border-bottom:#b6c5ca 1px solid;
padding:0 10px 0 0;

font-size:12px;
}
</style>


<script>
function maskOn(container) {
	var cont = document.getElementById(container);
	var mask = document.getElementById(container+'Mask');
	Position.clone(cont, mask);
	document.getElementById(container+'Mask').style.visibility='visible';
}

function maskOff(container) {
	document.getElementById(container+'Mask').style.visibility='hidden';
}

</script>

<body style="margin:0;overflow-x:hidden;" scroll="no" onLoad="onLoad();" onUnload="onUnload();">

<!-- tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr -->

<tr>
<td>

	<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0" class="toptable">
	<tr>
	<td colspan="2" class="toptable-top" style="height:13px;">
		<#include "/system/usersession/head.ftl" />
	</td>
	</tr>
	<tr>
	<td class="bar_bannar" style="height:42px;">

		<table class="title_bannar" style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td>&nbsp;</td>
			<td width="240"><input type="text" style="vertial-align:middle;" /> &nbsp; <input type="button" class="img_btn_pain" style="vertial-align:middle;" value="搜索" /></td>
			<td width="90"><input type="button" class="img_btn_managementview" onClick="alert('管理视图');return false;"></td>
		</tr>
		</table>

	</td>
	</tr>
	<tr>
	<td style="height:99%;">

		<table style="width:100%;height:100%;" border="0" cellspacing="5" cellpadding="0">
		<tr>
			<td style="width:60%;">
			
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td height="50%;">
		
				<table class="module_table" style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td class="bg_module_title"><input type="button" class="icon_bullet" /> 待办工单</td>
				</tr>
				<tr>
				<td class="bg_module_toolbar" style="text-align:right"><strong>工单跟踪</strong> &nbsp; <input type="button" class="icon_warning" />将要超时的工单(0) <input type="button" class="icon_error" />已经超时的工单(0)</td>
				</tr>
				<tr>
				<td>
					<div id="workOrderContainer" name="workOrderContainer" class="container">
						<!--<iframe scrolling="no" frameborder="0" width="100%" height="100%" src='processConsole!showDesktop.html?taskViewType=todo'></iframe>-->
						<iframe scrolling="no" frameborder="0" width="100%" height="100%" src='processConsole!getTopNTasks.html?limit=7'></iframe>
					</div>					
				</td>
				</tr>		
				</table>
		
		
			</td>
			</tr>
			<tr>
			<td style="padding-top:5px;">
				
				<table class="module_table" style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td class="bg_module_title"><input type="button" class="icon_bullet" /> 系统模块</td>
				</tr>
				<tr>
				<td>
					<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
					<tr>
					<td class="module_shortcut_cube" height="100"><a class="module_shortcut" href="topoNavigation!resource.html" ><img width="84" height="84" border="0" src="${base}/resource/system/theme/default/image/module_resourcetopo.gif" /><br />资源拓扑</a></td>
					<td class="module_shortcut_cube"><a class="module_shortcut" href="processConsole.html" ><img width="84" height="84" border="0" src="${base}/resource/system/theme/default/image/module_servicefulfillment.gif" /><br />业务开通</a></td>
					<td class="module_shortcut_cube"><a class="module_shortcut" href="" ><img width="84" height="84" border="0" src="${base}/resource/system/theme/default/image/module_bulkchange.gif" /><br />网络割接</a></td>
					<td class="module_shortcut_cube"><a class="module_shortcut" href="reportShow.html" ><img width="84" height="84" border="0" src="${base}/resource/system/theme/default/image/module_statistics.gif" /><br />统计分析</a></td>
					<td class="module_shortcut_cube"><a class="module_shortcut" href="inventoryNavigation!resource.html"><img width="84" height="84" border="0" src="${base}/resource/system/theme/default/image/module_basicfunction.gif" /><br />基础功能</a></td>
					</tr>
					<tr>
					<td colspan="5" align="center" style="vertical-align:middle">
						<img width="100%" height="100%" border="0" src="${base}/resource/system/theme/default/image/statistics_function.gif" />
					</td>
					</tr>		
					</table>
			
				</td>
				</tr>				
				</table>
		
			</td>
			</tr>		
			</table>

			</td>		
			<td>
		
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td height="45%;">
				
				<table class="module_table" style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td class="bg_module_title"><input type="button" class="icon_bullet" /> 信息看板</td>
				</tr>
				<tr>
				<td height="30" style="vertical-align:bottom;">
					<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
					<tr>
					<td class="x_tab_first">&nbsp;</td>
					<td nowrap="true" valign="bottom">
						<span class="x_tab_on" content="content1" onClick="xTab(this);">
							<span class="x_tab_text_on">系统公告</span>
						</span>
						<span class="x_tab" content="content2" onClick="xTab(this);">
							<span class="x_tab_text">资源大家谈</span>
						</span>
						<span class="x_tab" content="content2" onClick="xTab(this);">
							<span class="x_tab_text">资源知识库</span>
						</span>
					</td>
					<td class="x_tab_last">&nbsp;</td>
					</tr>
					<tr><td colspan="3" class="x_tab_separator">
					</td></tr>
					</table>
				</td>
				</tr>
				<tr>
				<td>
					<div id="informationBoardContainer" class="container">
						<div id="content1" class="container" style="display:visiable;">
							<iframe scrolling="no" frameborder="0" width="100%" height="100%" src='systemNotificationManagement!showDesktop.html'></iframe>
						</div>
						<div id="content2" class="container" style="display:none;">Content签X2</div>
						<div id="content3" class="container" style="display:none;">Content签X3</div>
					</div>
				</td>
				</tr>		
				</table>
		
			</td>
			</tr>
			<tr>
			<td style="padding-top:5px;">
			
				<table class="module_table" style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td class="bg_module_title"><input type="button" class="icon_bullet" /> 资源报表</td>
				</tr>
				<tr>
				<td>
					<div id="statisticsContainer" name="statisticsContainer" class="container">
						&nbsp;
					</div>
				</td>
				</tr>		
				</table>
		
			</td>
			</tr>		
			</table>
			
			</td>
		</tr>		
		</table>
	
	</td>
	</tr>
	<tr>
	<td class="bar_bottom" style="height:17px;">
		版本信息${action.getSystemVersion()}
	</td>
	</tr>
	</table>
	
</td>
</tr>

</table>

<!--
<div id="workOrderContainerMask" name="workOrderContainerMask" class="mask">
	<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td style="vertical-align:middle;" align="center">
	<img width="32" height="32" border="0" src="${base}/resource/system/theme/default/image/loading.gif" /><br />加载中...
	</td>
	</tr>
	</table>
</div>
-->

	<div id="statisticsContainerMask" name="statisticsContainerMask" class="mask">
		<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td style="vertical-align:middle;" align="center">
		<img width="32" height="32" border="0" src="${base}/resource/system/theme/default/image/loading.gif" /><br />加载中...
		</td>
		</tr>
		</table>
	</div>
<!-- 
	<div id="informationBoardContainerMask" name="informationBoardContainerMask" class="mask">
		<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td style="vertical-align:middle;" align="center">
		<img width="32" height="32" border="0" src="${base}/resource/system/theme/default/image/loading.gif" /><br />加载中...
		</td>
		</tr>
		</table>
	</div>
-->



<script>

</script>

</body>
<script>
function onLoad() {
	//maskOn('workOrderContainer');
	maskOn('statisticsContainer');
	maskOn('informationBoardContainer');
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>