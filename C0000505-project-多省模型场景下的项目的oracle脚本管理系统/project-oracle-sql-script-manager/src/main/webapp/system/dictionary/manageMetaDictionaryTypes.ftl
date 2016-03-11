<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>


<script>
var ctx = {
	metaDictionaryTypes:null,

	isShowEnabledOnly:false
};
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
		<td class="x_tab_first" style="width:99%;">&nbsp;MetaDictionaryType 抽象字典类型</td>
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
			<input class="x_btn" value="Refresh" type="button" onclick="refreshMetaDictionaryTypeList();" />
			|
			<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchMetaDictionaryTypeList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchMetaDictionaryTypeList(true);" />
			|
			<input class="x_btn_disabled" value="//Enable" type="button" onclick="updateMetaDictionaryType();" />
			<input class="x_btn_disabled" value="//Disable" type="button" onclick="updateMetaDictionaryType();" />
			|
			<input class="x_btn" value="Create" type="button" onclick="createMetaDictionaryType();" />
			<input class="x_btn" value="Update" type="button" onclick="updateMetaDictionaryType();" />			
		</tr>
		<tr>
		<td>
			<div id="xlistContainer" style="height:100%;width:100%;"></div>
			<script>
			var xlist = new XList();
			var xlistColumns = [
				{name:'id', text:'标识', width:'100'},
				{name:'name', text:'名称', width:'100'},
				{name:'code', text:'编码', width:'200'},
				{name:'enable', text:'激活', width:'100'},
				{name:'creator', text:'新增人', width:'100'},
				{name:'createDate', text:'新增时间', width:'150'},
				{name:'updater', text:'更新人', width:'100'},
				{name:'updateDate', text:'更新时间', width:'150'},
				{name:'memo', text:'备注', width:'100'},				
				{name:'version', text:'乐观锁version', width:'100'}
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
function refreshMetaDictionaryTypeList() {

	xlist.clear();

	J.json(
		'systemDictionaryManagement!findMetaDictionaryTypes.html',
		'',
		function(o) {
			if(null!=o) {
				ctx.metaDictionaryTypes = o;
				doRefreshMetaDictionaryTypeList();
			}
		}
	);
	
}

function doRefreshMetaDictionaryTypeList() {

	xlist.clear();

	var showAllCount = 0;
	var showEnabledOnlyCount = 0;
	
	if(null!= ctx.metaDictionaryTypes) {
		
		showAllCount = ctx.metaDictionaryTypes.length;
	
		var t = null;
		var enable = null;
		
		for(var i = 0; i < ctx.metaDictionaryTypes.length; i++) {
			t = ctx.metaDictionaryTypes[i];
			
			enable = (t.enable) ? true : false;
			
			if(enable) {
				showEnabledOnlyCount++;
			}
			
			if(!ctx.isShowEnabledOnly || (ctx.isShowEnabledOnly && enable)) {
				xlist.addRow({
					id:t.id,					
					data:[
						t.id,
						'<font class="x_font_name">' + t.name + '</font>',
						t.code,	
						(null!=t.enable ? t.enable+'' : '-'),	
						t.creator,		
						t.createDate,
						t.updater,
						t.updateDate,
						t.memo,
						t.version						
					]
				});			
			}
			
		}
		t = null;
	}
	
	$('btnShowAll').value='Show All(' + showAllCount + ')';
	$('btnShowEnabledOnly').value='Show Enabled Only(' + showEnabledOnlyCount + ')';
}

function switchMetaDictionaryTypeList(_isShowEnabledOnly) {
	ctx.isShowEnabledOnly=_isShowEnabledOnly;
	$('btnShowAll').className=(ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	$('btnShowEnabledOnly').className=(!ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	doRefreshMetaDictionaryTypeList();
}

function createMetaDictionaryType() {
	if('SUCCESS'==dialog('systemDictionaryManagement!createMetaDictionaryType.html?')) {
		parent.refreshDictionaryExplorer();
		refreshMetaDictionaryTypeList()
	}
}

function updateMetaDictionaryType() {
	if(xlist.value().length==1) {
		if('SUCCESS'==dialog('systemDictionaryManagement!updateMetaDictionaryType.html?metaDictionaryTypeId='+xlist.value()[0])) {
			parent.refreshDictionaryExplorer();
			refreshMetaDictionaryTypeList();
		}
	} else {
		alert('请仅选一条记录!');
	}
}

</script>


</body>
<script>
function onLoad() {
	refreshMetaDictionaryTypeList();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
