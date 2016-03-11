<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {
	dictionaryTypeId:${(dictionaryTypeId)?default(0)},
	dictionaryType:{
		id:${(dictionaryTypeId)?default(0)}
	},
		
	dictionaryValueObjects:null,

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
		<td class="x_tab_first" style="width:99%;">&nbsp;DictionaryType: <span id="tabTitle" class="x_tab_title"><font class="x_font_loading">loading...</font></span></td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on" id="tabProperty" content="contentProperty" onclick="xTab(this);"><span class="x_tab_text_on">Property</span></span><span
		 class="x_tab" id="tabDictionary" content="contentDictionary" onclick="xTab(this);if('false'==this.loaded){refreshDictionaryList();this.loaded='true';}" loaded="false"><span class="x_tab_text">Dictionary</span></span></td>
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
				<input class="x_btn" value="//Update" type="button" /></td>
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
				
		
		<div id="contentDictionary" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input id="btnRefreshDictionaryList" name="btnRefreshDictionaryList" class="x_btn" value="Refresh" type="button" onclick="refreshDictionaryList();" />
				|
				<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchDictionaryList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchDictionaryList(true);" />
				|
				<input id="btnSaveDictionarys" name="btnSaveDictionarys" class="x_btn" value="Save" onclick="saveDictionarys();" type="button" /></td>
			</tr>
			<tr>
			<td>
				<div id="dictionaryListContainer" style="height:100%;width:100%;"></div>
				<script>
				var dictionaryList = new XList();
				var dictionaryListColumns = [
					{name:'id', text:'标识', width:'100'},
					{name:'name', text:'名称', width:'100'},
					{name:'code', text:'编码', width:'100'},
					{name:'enable', text:'激活', width:'100'},
					{name:'ordinal', text:'顺序', width:'100'},
					{name:'value', text:'值', width:'100'},
					{name:'creator', text:'新增人', width:'100'},
					{name:'createDate', text:'新增时间', width:'150'},
					{name:'updater', text:'更新人', width:'100'},
					{name:'updateDate', text:'更新时间', width:'150'},
					{name:'version', text:'乐观锁', width:'100'}
				];
							
				var dictionaryListContext = {
					container:'dictionaryListContainer',
					rowId:'dictionaryId'
				};
				dictionaryList.create(dictionaryListContext, dictionaryListColumns);	
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
		'systemDictionaryManagement!viewDictionaryType.html',
		'dictionaryTypeId=' + ctx.dictionaryTypeId,
		'propertyContainer'
	);
}

function refreshDictionaryList() {
	
	dictionaryList.clear();
	$('btnShowAll').value='Show All(0)';
	$('btnShowEnabledOnly').value='Show Enabled Only(0)';
	
	J.json(
		'systemDictionaryManagement!findDictionaryValueObjects.html',
		'dictionaryTypeId=' + ctx.dictionaryTypeId,
		function(o) {
			if(null!=o) {
				ctx.dictionaryValueObjects = o;
				doRefreshDictionaryList();
			}
		}
	);
}

function doRefreshDictionaryList() {

	dictionaryList.clear();
	
	var showAllCount = 0;
	var showEnabledOnlyCount = 0;

	if(null!= ctx.dictionaryValueObjects) {
		
		showAllCount = ctx.dictionaryValueObjects.length;
		
		var t = null;
		var enable = null;
		
		for(var i = 0; i < ctx.dictionaryValueObjects.length; i++) {
			t = ctx.dictionaryValueObjects[i];
			
			enable = (null!=t.dictionary && t.dictionary.enable) ? true : false;
			
			if(enable) {
				showEnabledOnlyCount++;
			}
			
			//
			var f = true;
			if(true==ctx.isShowEnabledOnly) {
				f = enable;
			}

			if(f) {
				dictionaryList.addRow({
					id: (null!=t.dictionary ? t.dictionary.id : -1),
					checked: enable,
					readOnly: enable,
					data:[							
						(null!=t.dictionary ? t.dictionary.id : '-'),
						'<input id="name' + i + '" name="name' + i + '" class="x_text" style="100%" value="' + (enable ? t.dictionary.name : t.metaDictionary.name) + '" />',
						t.metaDictionary.code,
						(null!=t.dictionary && null!=t.dictionary.enable ? t.dictionary.enable+'' : '-'),
						'<input id="ordinal' + i + '" name="ordinal' + i + '" class="x_text" style="100%" value="' + (enable ? t.dictionary.ordinal : (t.metaDictionary.ordinal>0?t.metaDictionary.ordinal:'')) + '" />',
						t.metaDictionary.value,
						(null!=t.dictionary && t.dictionary.creator ? t.dictionary.creator : '-'),
						(null!=t.dictionary && t.dictionary.createDate ? t.dictionary.createDate : '-'),
						(null!=t.dictionary && t.dictionary.updater ? t.dictionary.updater : '-'),
						(null!=t.dictionary && t.dictionary.updateDate ? t.dictionary.updateDate : '-'),
						(null!=t.dictionary ? t.dictionary.version : 1)
					]
				});
			}
		}
		t = null;
	}
	
	$('btnShowAll').value='Show All(' + showAllCount + ')';
	$('btnShowEnabledOnly').value='Show Enabled Only(' + showEnabledOnlyCount + ')';
}

function switchDictionaryList(_isShowEnabledOnly) {
	ctx.isShowEnabledOnly=_isShowEnabledOnly;
	$('btnShowAll').className=(ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	$('btnShowEnabledOnly').className=(!ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	doRefreshDictionaryList();
}

function saveDictionarys() {

	xbtnDisable('btnSaveDictionarys');
	
	var p = [];
	p[p.length] = 'dictionaryTypeId=' + ctx.dictionaryTypeId;
	
	if(null!=ctx.dictionaryValueObjects) {		
		
		var pi = 0;
		//var enabledIds = dictionaryList.value();
		var t = null;
		var enable = null;
		for(var i = 0; i < ctx.dictionaryValueObjects.length; i++) {
			t = ctx.dictionaryValueObjects[i];
			
			addDictionaryType(i, dictionaryList.valueAll()[i], t, p);
		}
		t = null;
		
		//alert(p.join('\n'));
		
		J.json(
			'systemDictionaryManagement!saveDictionarys.html',
			p.join('&'),
			function(o) {
				xbtnEnable('btnSaveDictionarys');
				if(null!=o) {
					ctx.dictionaryValueObjects = o;
					doRefreshDictionaryList();
				}
			}
		);
	}	
}

function addDictionaryType(i, id, dictionaryValueObject, p) {
	p[p.length] = 'dictionarys[' + i + '].id=' + id;
	p[p.length] = 'dictionarys[' + i + '].name=' + $('name' + i).value;
	//p[p.length] = 'dictionarys[' + i + '].code=' + $('name' + i).value;
	p[p.length] = 'dictionarys[' + i + '].enable=' + dictionaryList.isChecked(i);
	p[p.length] = 'dictionarys[' + i + '].ordinal=' + $('ordinal' + i).value;
	p[p.length] = 'dictionarys[' + i + '].dictionaryTypeId=' + ctx.dictionaryTypeId;
	p[p.length] = 'dictionarys[' + i + '].metaDictionaryId=' + dictionaryValueObject.metaDictionary.id;
	p[p.length] = 'dictionarys[' + i + '].version=' + ((null!=dictionaryValueObject.dictionary) ? dictionaryValueObject.dictionary.version : 1);
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
