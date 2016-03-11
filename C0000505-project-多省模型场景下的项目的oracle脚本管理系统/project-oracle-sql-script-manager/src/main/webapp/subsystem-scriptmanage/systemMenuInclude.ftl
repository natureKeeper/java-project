<style>
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
<div id="_mainTBar">
<table style="width:100%;height:55px;" border="0" cellspacing="0" cellpadding="0" class="toptable">
<tr style="width:100%;height:13px;">
<td colspan="2" class="toptable-top" >
	<#include "/system/usersession/head.ftl" />
</td>
</tr>
<tr style="width:100%;height:42px;">
<td class="bar_bannar">
	<table class="title_bannar" style="width:100%;height:42px;" border="0" cellspacing="0" cellpadding="0">
	<tr align="right">
		<td align="left" width="70%">&nbsp;</td>
		<td align="center" width="15%"><a style="font-size: 12px;color:white;" target="_self" onClick="changeSonTBar(1);return false;"></a></td>
		<td align="center" width="15%"><a style="font-size: 12px;color:white;text-decoration:none;" target="_self" href="desktop.html"></a></td>
	</tr>
	</table>
</td>
</tr>
<!--
<tr>
<td style="height:20px;">
	<table id="_sonTBarTable" style="font-size:12px;" cellspacing="0" cellpadding="0" border="0" width="100%" height="20" background="resource/extjs/common/theme/default/image/tbar-bg.jpg">
	<tr align="left">
		<td align="center" width="10%"><a style="font-size: 12px;color:white;" target="_self" onClick="openAuthorizationPanel();return false;"></a></td>
		<td align="center" width="10%"><a style="font-size: 12px;color:white;" target="_self" onClick=""></a></td>
		<td align="center" width="10%"><a style="font-size: 12px;color:white;" target="_self" onClick=""></a></td>
		<td align="center" width="70%">&nbsp;</td>
	</tr>
	</table>
</td>
</tr>
-->
</table>
</div>
<script language=javascript>
var mainTBarPanel = new Ext.Panel({
	id:'_main_tbar_panel',
    contentEl: '_mainTBar',
    border:false,
    region:'north',
    height:55
});
var mainBBar = new Ext.Panel({
    region:'south',
    height:17,
    border:false,
    bodyStyle: 'padding:0px',
// html:'<image src="resource/extjs/common/theme/default/image/toolbar/bbar.png"
// width="100%" height="15">'
    html:'<span class="bar_bottom" style="width:100%;height:17px;">${action.getSystemVersion()}</span>'
});
function openAuthorizationPanel(){
// systemLayout.addAuthorizationPanel();
// systemLayout.getContentPanel().doLayout();
}
function openLogPanel(){
	systemLayout.addLogPanel();
	systemLayout.getContentPanel().doLayout();
}
function openSystemPanel(){
	systemLayout.addSystemPanel();
	systemLayout.getContentPanel().doLayout();
}
function changeSonTBar(menuId){
	if(menuId==1){
		document.getElementById("_sonTBarTable").rows.item(0).cells.item(0).innerHTML='<a style="font-size: 12px;color:white;" onClick="openAuthorizationPanel();return false;" target="_self">权限管理</a>';
		document.getElementById("_sonTBarTable").rows.item(0).cells.item(1).innerHTML='<a style="font-size: 12px;color:white;" onClick="" target="_self">日志管理</a>';
		document.getElementById("_sonTBarTable").rows.item(0).cells.item(2).innerHTML='<a style="font-size: 12px;color:white;" onClick="" target="_self">系统设置</a>';
		document.getElementById("_sonTBarTable").rows.item(0).cells.item(3).innerHTML='&nbsp;';
		systemLayout.addAuthorizationPanel();
	}
}
</script>