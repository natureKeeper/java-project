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
<td>




	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

	<tr>
	<td class="x_tab_separator_container x_tab_container_background">
	
		<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
		<tr>
		<td class="x_tab_first" style="width:99%;"> &nbsp; MetaEntityType 抽象实体类型</td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on"><span class="x_tab_text_on">List</span></span></td>
		<td class="x_tab_last" style="width:10;">&nbsp;</td>	
		</tr>
		<tr><td colspan="3" class="x_tab_separator"></td></tr>
		</table>
		
	</td>
	</tr>
	
	<tr>
	<td>
		<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td class="x_toolbar">
			<input class="x_btn" value="Refresh" type="button" onclick="refreshMetaEntityTypeList();" />
			|
			<input class="x_btn_disabled" value="//Create" type="button" onclick="createMetaEntityType();" />			
			<input class="x_btn_disabled" value="//Update" type="button" />
			<input class="x_btn_disabled" value="//Delete" type="button" />
			</td>
		</tr>
		<tr>
		<td>
			<div id="xlistContainer" style="height:100%;width:100%;"></div>
			<script>
			var xlist = new XList();
			var xlistColumns = [
				{name:'id', text:'标识', width:'100'},
				{name:'name', text:'名称', width:'100'},
				{name:'code', text:'编码', width:'150'},
				{name:'enable', text:'激活', width:'100'},
				{name:'className', text:'代码类名', width:'300'},
				{name:'coreSequence', text:'核心序列', width:'200'},
				{name:'typeTable', text:'类型表名', width:'150'},
				{name:'coreTable', text:'核心表名', width:'150'},
				{name:'geoTable', text:'地理表名', width:'150'},
				{name:'backupTable', text:'备份表名', width:'150'},
				{name:'metaRelationshipTypeId', text:'是中间表 ', width:'100'},
				{name:'creator', text:'新增人', width:'100'},
				{name:'createDate', text:'新增时间', width:'150'},
				{name:'updater', text:'更新人', width:'100'},
				{name:'updateDate', text:'更新时间', width:'150'},
				{name:'version', text:'乐观锁 ', width:'100'}
			];
						
			var xlistContext = {
				container:'xlistContainer',
				rowId:'id'
			};
			xlist.create(xlistContext, xlistColumns);	
			</script>
		</td>
		</tr>
		</table>
		
	</td>
	</tr>
	</table>	
	
</td>
</tr>
</table>

<script>
function refreshMetaEntityTypeList() {

	xlist.clear();

	J.json(
		'systemMetadataManagement!findMetaEntityTypes.html',
		'',
		function(o) {	
			if(null!=o) {
				var t = null;
				for(var i = 0; i < o.length; i++) {
					t = o[i];
					xlist.addRow({
						id:t.id,					
						data:[
							t.id,
							'<font class="x_font_name">' + t.name + '</font>',
							t.code,
							(null!=t.enable)?t.enable:'-',
							t.className,
							t.coreSequence,
							t.typeTable,
							t.coreTable,
							t.spatialTable,
							t.backupTable,
							t.metaRelationshipTypeId,
							t.creator,
							t.createDate,
							t.updater,
							t.updateDate,
							t.version						
						]
					});
				}
				t = null;
			}
		}
	);
}

function createMetaEntityType() {
	if('SUCCESS'==dialog('systemMetadataManagement!createMetaEntityType.html')) {
		parent.refreshEntityExplorer();
		refreshMetaEntityTypeList();		
	}
}

function updateMetaEntityType() {
	if(xlist.value().length==1) {
		if('SUCCESS'==dialog('systemMetadataManagement!updateMetaEntityType.html?metaEntityTypeId='+xlist.value()[0])) {
			parent.refreshEntityExplorer();
			refreshMetaEntityTypeList();		
		}
	} else {
		alert('请仅选一条记录!');
	}
}

</script>


</body>
<script>
function onLoad() {
	refreshMetaEntityTypeList();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
