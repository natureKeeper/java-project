<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<#include "/resource/extjs/include.ftl" />
<style>
div#sidebar {
	border: 1px dotted #000;
	padding: 10px;
}
.

</style>
<script>
function createOrderPanel(){
	var myDatas = [
		['10001','广州MSC1割接','2010-11-26 23:30','2010-11-26 23:30','XX','审核'],
		['10002','广州番禺游乐园基站改造','2010-11-29 22:50','2010-11-29 22:50','XX','审核'],
		['10003','珠海BSC割接','2010-12-01 20:00','2010-12-01 20:00','XX','审核']
	];
	var store = new Ext.data.ArrayStore({
		fields: [
		   {name: 'orderId'},
		   {name: 'orderTitle'},
		   {name: 'assignTime',type: 'date', dateFormat: 'Y-m-d h:i'},
		   {name: 'dealTime', type: 'date', dateFormat: 'Y-m-d h:i'},
		   {name: 'assignDept'},
		   {name: 'status'}
		]
	});
	var orderPanel = new Ext.grid.GridPanel({
		id:'_orderGrid',
		store: store,
		region:'center',
		columns: [
			{id:'orderId',header: '工单编号', width: 80, sortable: true, dataIndex: 'orderId'},
			{header: '工单主题', width: 75, sortable: true, dataIndex: 'orderTitle',id:'orderTitle'},
			{header: '派单时间', width: 150, sortable: true, dataIndex: 'assignTime', renderer: Ext.util.Format.dateRenderer('Y-m-d h:i')},
			{header: '处理时限', width: 150, sortable: true, dataIndex: 'dealTime', renderer: Ext.util.Format.dateRenderer('Y-m-d h:i')},
			{header: '派单部门', width: 85, sortable: true, dataIndex: 'assignDept'},
			{header: '当前环节', width: 85, sortable: true, dataIndex: 'status'}
		],
		stripeRows: true,
		autoExpandColumn: 'orderTitle',
		title: '<image src="resource/extjs/common/theme/default/image/desktop/title.jpg"> 代办工单'  
	});
	store.loadData(myDatas);
	return orderPanel;
}
function createSystemAffichePanel(){
	var myDatas = [
		['2010-11-23 23:30','XXXX','A'],
		['2010-11-24 23:31','XXXX','B'],
		['2010-11-25 23:32','XXXX','C']
	];
	var store = new Ext.data.ArrayStore({
		fields: [
		   {name: 'createTime',type: 'date', dateFormat: 'Y-m-d h:i'},
		   {name: 'title'},
		   {name: 'username'}
		]
	});
	var systemAffichePanel = new Ext.grid.GridPanel({
		id:'_systemAffichePanel',
		store: store,
		columns: [
			{header: '发布时间', width: 150, sortable: true, dataIndex: 'createTime', renderer: Ext.util.Format.dateRenderer('Y-m-d h:i')},
			{header: '公告标题', width: 75, sortable: true, dataIndex: 'title',id:'title'},
			{header: '发布人', width: 75, sortable: true, dataIndex: 'username'}
		],
		stripeRows: true,
		autoExpandColumn: 'title',
		height: 350,
		width: 400,
		title: '系统公告'  
	});
	store.loadData(myDatas);
	return systemAffichePanel;
}
Ext.onReady(function(){
	var tbarPanel = new Ext.Panel({
	    contentEl: '_deskTopTBar',
	    border:false,
	    region:'north',
	    height:36
	});
	var orderPanel = createOrderPanel();
	var systemModulePanel = new Ext.Panel({
		title:'<image src="resource/extjs/common/theme/default/image/desktop/title.jpg"> 系统模块',
		bodyStyle:'background-color:#E8E8E8;',
		height:300,
		region:'south',
		html:'<table style="font-size:12px;" cellspacing="0" cellpadding="0" border="0" width="100%" height="100">'+
		'<tr align="center">'+
		'<td><image src="resource/extjs/common/theme/default/image/desktop/sys_module01.png"></td>'+
		'<td><image src="resource/extjs/common/theme/default/image/desktop/sys_module02.png"></td>'+
		'<td><image src="resource/extjs/common/theme/default/image/desktop/sys_module03.png"></td>'+
		'<td><image src="resource/extjs/common/theme/default/image/desktop/sys_module04.png"></td>'+
		'<td><image src="resource/extjs/common/theme/default/image/desktop/sys_module05.png"></td></tr><tr align="center">'+
		'<td>资源拓扑/GIS</td>'+
		'<td>业务开通</td>'+
		'<td>网络割接</td>'+
		'<td>统计分析</td>'+
		'<td>基础功能</td></tr></table>'
	});
	var systemAffichePanel = createSystemAffichePanel();
	var infoPanel = new Ext.Panel({
		region:'center',
		title:'<image src="resource/extjs/common/theme/default/image/desktop/title.jpg"> 信息看板',
		layout:'fit',
		items:[new Ext.TabPanel({
			activeTab: 0,
			items:[systemAffichePanel]
		})]
	});
	var resourceReportPanel = new Ext.Panel({
		title:'<image src="resource/extjs/common/theme/default/image/desktop/title.jpg"> 资源报表',
		region:'south',
		height:350
	});
	var leftPanel = new Ext.Panel({
		region:'center',
		layout:'border',
		items:[systemModulePanel,orderPanel]
	});
	var rightPanel = new Ext.Panel({
		region:'east',
		width:500,
		layout:'border',
		items:[infoPanel,resourceReportPanel]
	});
	var viewport = new Ext.Viewport({
		layout:'border',
		style :{marginBottom:'30px'}, 
        items:[leftPanel,rightPanel,tbarPanel]
        //autoHeight:true,
        //height:800,
        //width:600
	});
});
</script>
</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">
<div style="display:none">
<div id="_deskTopTBar">
	<table style="font-size:12px;background-image: url(resource/extjs/common/theme/default/image/toolbar/tbar.png);background-repeat: no-repeat;background-color:#009CEB;" cellspacing="0" cellpadding="0" border="0" width="100%" height="30" background="">
		<tr align="right">
			<td align="center" width="70%">&nbsp;</td>
			<td align="center" width="30%" style='vertical-align:middle;'><input type="text" style='vertical-align:middle;'><input type="button" value="搜索"><image src="resource/extjs/common/theme/default/image/desktop/btn_gl.png" onClick="alert('管理视图');return false;"></td>
		</tr>
	</table>
</div>
</div>
<div id="sidebar" style="display:none;">
aaaa



<br>
<br>
<br>
<br><br>
<br>
<br>
<br>
<br>


bbbb
</div>
<!--form id="_form">
<table width="100%" height="100%">
<tr>
<td align="center" style="vertial-align:middle;">
desktop
|
<a href="inventoryNavigation!resource.html" target="_self">基础功能</a>
|


</td>
</tr>
</table>
</form-->
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