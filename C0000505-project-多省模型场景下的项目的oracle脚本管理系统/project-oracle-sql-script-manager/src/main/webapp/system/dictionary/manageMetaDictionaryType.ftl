<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {
	metaDictionaryTypeId:${(metaDictionaryTypeId)?default(0)},
	metaDictionaryType:{
		id:${(metaDictionaryTypeId)?default(0)}
	},
	
	metaDictionarys:null,
	
	dictionaryTypes:null,
	
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
		<td class="x_tab_first" style="width:99%;">&nbsp;MetaDictionaryType: <span id="tabTitle" class="x_tab_title"><font class="x_font_loading">loading...</font></span></td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on" id="tabProperty" content="contentProperty" onclick="xTab(this);"><span class="x_tab_text_on">Property</span></span><span
		 class="x_tab" id="tabMetaDictionary" content="contentMetaDictionary" onclick="xTab(this);if('false'==this.loaded){refreshMetaDictionaryList();this.loaded='true';}" loaded="false"><span class="x_tab_text">MetaDictionary</span></span><span
		 class="x_tab" id="tabDictionaryType" content="contentDictionaryType" onclick="xTab(this);if('false'==this.loaded){refreshDictionaryTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text">DictionaryType</span></span></td>
		<td class="x_tab_last" style="width:10;">&nbsp;</td>	
		</tr>
		<tr><td colspan="3" class="x_tab_separator"></td></tr>
		</table>
		
	</td>
	</tr>
	
	<tr>
	<td>
	
	
		<div id="contentProperty" style="display:block;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshProperty();" />
				|
				<input class="x_btn" value="//Enable" type="button" onclick="updateMetaDictionaryType();" />
				<input class="x_btn" value="//Disable" type="button" onclick="updateMetaDictionaryType();" />
				|
				<input class="x_btn" value="Update" type="button" onclick="updateMetaDictionaryType();" />
			</td>
			</tr>
			<tr>
			<td>
				<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td style="vertical-align:text-top;padding:10;">
					<div id="propertyContainer">
						<font class="x_font_loading">loading...</font>
					</div>
				</td>
				</tr>
				</table>
			</td>
			</tr>
			</table>
		</div>
				
		
		<div id="contentMetaDictionary" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshMetaDictionaryList();" />
				|
				<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchDictionaryList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchDictionaryList(true);" />
				|
				<input class="x_btn" value="Create" type="button" onclick="createMetaDictionary();" />
				<input class="x_btn" value="//Update" type="button" />
			</td>
			</tr>
			<tr>
			<td>
				<div id="metaDictionaryListContainer" style="height:100%;width:100%;"></div>
				<script>
				var metaDictionaryList = new XList();
				var metaDictionaryListColumns = [
					{name:'id', text:'标识', width:'100'},
					{name:'name', text:'名称', width:'100'},
					{name:'code', text:'编码', width:'200'},
					{name:'enable', text:'激活', width:'100'},
					{name:'ordinal', text:'顺序', width:'100'},
					{name:'value', text:'值', width:'100'},
					{name:'creator', text:'新增人', width:'100'},
					{name:'createDate', text:'新增时间', width:'150'},
					{name:'updater', text:'更新人', width:'100'},
					{name:'updateDate', text:'更新时间', width:'150'},
					{name:'version', text:'乐观锁', width:'100'}
				];
							
				var metaDictionaryListContext = {
					container:'metaDictionaryListContainer',
					rowId:'metaDictionaryId'
				};
				metaDictionaryList.create(metaDictionaryListContext, metaDictionaryListColumns);	
				</script>
			</td>
			</tr>
			</table>
		</div>
		
		
		<div id="contentDictionaryType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshDictionaryTypeList();" />
				|
				<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchDictionaryList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchDictionaryList(true);" />
				|
				<input class="x_btn" value="Create" type="button" onclick="createDictionaryType();" />
				<input class="x_btn" value="//Update" type="button" />
			</td>
			</tr>
			<tr>
			<td>
				<div id="dictionaryTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var dictionaryTypeList = new XList();
				var dictionaryTypeListColumns = [
					{name:'id', text:'标识', width:'100'},
					{name:'name', text:'名称', width:'100'},
					{name:'code', text:'编码', width:'200'},
					{name:'enable', text:'激活', width:'100'},
					{name:'creator', text:'新增人', width:'100'},
					{name:'createDate', text:'新增时间', width:'150'},
					{name:'updater', text:'更新人', width:'100'},
					{name:'updateDate', text:'更新时间', width:'150'},
					{name:'version', text:'乐观锁', width:'100'}
				];
							
				var dictionaryTypeListContext = {
					container:'dictionaryTypeListContainer',
					rowId:'dictionaryTypeId'
				};
				dictionaryTypeList.create(dictionaryTypeListContext, dictionaryTypeListColumns);	
				</script>
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

<script>
function refreshProperty() {
	
	Load.updater('tabTitle');
	
	J.updater(
		'systemDictionaryManagement!viewMetaDictionaryType.html',
		'metaDictionaryTypeId=' + ctx.metaDictionaryTypeId,
		'propertyContainer'
	);
}

function refreshMetaDictionaryList() {
	
	metaDictionaryList.clear();
	
	J.json(
		'systemDictionaryManagement!findMetaDictionarys.html',
		'metaDictionaryTypeId=' + ctx.metaDictionaryTypeId,
		function(o) {
			if(null!=o) {
				ctx.metaDictionarys = o;
				doRefreshMetaDictionaryList();
			}
		}
	);
}

function doRefreshMetaDictionaryList() {

	var t = null;
	for(var i = 0; i < ctx.metaDictionarys.length; i++) {
		t = ctx.metaDictionarys[i];
		
		//
		//var f = true;
		//if(true==ctx.isShowEnabledOnly) {
		//	f = t.enable;
		//}
	
		//if(f) {
			metaDictionaryList.addRow({
				id:t.id,
				data:[							
					t.id,
					'<font class="x_font_name">'+t.name+'</font>',
					t.code,
					(null!=t.enable)?t.enable+'':'-',
					t.ordinal,
					t.value,
					t.creator,
					t.createDate,
					t.updater,
					t.updateDate,
					t.version			
				]
			});
		//}
	}
	t = null;
}

function createMetaDictionary() {
	if('SUCCESS'==dialog('systemDictionaryManagement!createMetaDictionary.html?metaDictionaryTypeId=' + ctx.metaDictionaryTypeId)) {
		refreshMetaDictionaryList();		
	}
}






function refreshDictionaryTypeList() {

	dictionaryTypeList.clear();

	J.json(
		'systemDictionaryManagement!findDictionaryTypes.html',
		'metaDictionaryTypeId=' + ctx.metaDictionaryTypeId,
		function(o) {
			if(null!=o) {
				ctx.dictionaryTypes = o;
				doRefreshDictionaryTypeList();
			}
		}
	);
}


function doRefreshDictionaryTypeList() {

	var t = null;
	for(var i = 0; i < ctx.dictionaryTypes.length; i++) {
		t = ctx.dictionaryTypes[i];
		
		//
		//var f = true;
		//if(true==ctx.isShowEnabledOnly) {
		//	f = t.enable;
		//}
	
		//if(f) {
			dictionaryTypeList.addRow({
				id:t.id,
				data:[							
					t.id,
					'<font class="x_font_name">'+t.name+'</font>',
					t.code,
					(null!=t.enable)?t.enable+'':'-',
					t.creator,
					t.createDate,
					t.updater,
					t.updateDate,
					t.version			
				]
			});
		//}
	}
	t = null;
}



function createDictionaryType() {
	if('SUCCESS'==dialog('systemDictionaryManagement!createDictionaryType.html?metaDictionaryTypeId=' + ctx.metaDictionaryTypeId)) {
		parent.refreshDictionaryExplorer();
		refreshDictionaryTypeList();
	}
}



function updateMetaDictionaryType() {
	if('SUCCESS'==dialog('systemDictionaryManagement!updateMetaDictionaryType.html?metaDictionaryTypeId='+ctx.metaDictionaryTypeId)) {
		parent.refreshDictionaryExplorer();
		refreshProperty();
	}
}




function getDateTypeSelect(index, value) {
	var p = [];
	p[p.length] = '<select id="dataType' + index + '" name="dataType' + index + '" class="x_select">';
	p[p.length] = '<option value=""></option>';
	var dataType = null;
	for(var i = 0; i < ctx.dataTypes.length; i++) {
		dataType = ctx.dataTypes[i];
		p[p.length] = '<option value="' + dataType.value + '"' + ((value==dataType.value) ? ' selected' : '') + '>' + dataType.text + '</option>';
	}
	dataType = null;
	p[p.length] = '</select>';
	return p.join('');
}

function saveDictionaryType() {
	if(null!=ctx.dictionaryTypeValueObjects) {		
		var p = [];
		var pi = 0;
		var enabledIds = dictionaryTypeList.value();
		var t = null;
		for(var i = 0; i < ctx.dictionaryTypeValueObjects.length; i++) {
			t = ctx.dictionaryTypeValueObjects[i];
			
			if(t.enable==false) {
				if(indexOf(t.id, enabledIds)>=0) {//create
					addDictionaryType(i, 0, t, p, pi++);
				}
			} else {
				if(indexOf(t.id, enabledIds)>=0) {//update
					addDictionaryType(i, t.id, t, p, pi++);
				} else {//delete
					addDictionaryType(i, -t.id, t, p, pi++);
				}
			}			
		}
		t = null;
		
		J.json(
			'systemDictionaryManagement!saveDictionaryTypes.html',
			p.join('&'),
			function(o) {
				if('SUCCESS'==o.returnValue) {
					findDictionaryTypes('true');
				}
			}
		);
	}	
}

function addDictionaryType(i, id, dictionaryTypeValueObject, p, pi) {
	p[p.length] = 'dictionaryTypes[' + pi + '].id=' + id;
	p[p.length] = 'dictionaryTypes[' + pi + '].name=' + (($('name' + i)) ? $('name' + i).value : dictionaryTypeValueObject.name);
	p[p.length] = 'dictionaryTypes[' + pi + '].code=' + (($('code' + i)) ? $('code' + i).value : dictionaryTypeValueObject.code);
	p[p.length] = 'dictionaryTypes[' + pi + '].category=' + dictionaryTypeValueObject.category;
	p[p.length] = 'dictionaryTypes[' + pi + '].dataType=' + (($('dataType' + i)) ? $('dataType' + i).value : dictionaryTypeValueObject.dataType);
	p[p.length] = 'dictionaryTypes[' + pi + '].columnName=' + dictionaryTypeValueObject.columnName;
	p[p.length] = 'dictionaryTypes[' + pi + '].columnType=' + dictionaryTypeValueObject.columnType;
	p[p.length] = 'dictionaryTypes[' + pi + '].length=' + dictionaryTypeValueObject.length;	
	p[p.length] = 'dictionaryTypes[' + pi + '].metaDictionaryTypeId=' + ctx.metaDictionaryTypeId;
	p[p.length] = 'dictionaryTypes[' + pi + '].metaDictionaryTypeId=' + (($('metaDictionaryTypeId' + i)) ? $('metaDictionaryTypeId' + i).value : dictionaryTypeValueObject.metaDictionaryTypeId);
	p[p.length] = 'dictionaryTypes[' + pi + '].version=' + dictionaryTypeValueObject.version;
}

function indexOf(value, list) {
	for(var i = 0; i < list.length; i++) {
		if(value==list[i]) {
			return i;
		}
	}
}

function switchDictionaryTypeList(_isShowEnabledOnly) {
	ctx.isShowEnabledOnly=_isShowEnabledOnly;
	$('btnShowAll').className=(ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	$('btnShowEnabledOnly').className=(!ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	refreshDictionaryTypeList();
}

</script>


</body>
<script>
function onLoad() {
	refreshProperty();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
