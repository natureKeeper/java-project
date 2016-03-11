<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {
	entityTypeId:${(entityTypeId)?default(0)},
	entityType:{
		id:0
	},
	dataTypes:[<#if dataTypes ? exists><#list dataTypes as t>
		{
			text:'${(t.text)?if_exists?js_string}',
			value:${(t.value)?if_exists?js_string}
		}<#if t_has_next>,</#if>
	</#list></#if>],
	displays:[
		{
			text:'VISIABLE',
			value:1
		},
		{
			text:'HIDDEN',
			value:2
		},
		{
			text:'IGNORE',
			value:3
		}
	],
	
	attainableAttributeTypeParams:null,

	relationshipTypes:null,
		
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
		<td class="x_tab_first" style="width:99%;">&nbsp;EntityType: <span id="tabTitle" class="x_tab_title"><font class="x_font_loading">loading...</font></span></td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on" id="tabProperty" content="contentProperty" onclick="xTab(this);"><span class="x_tab_text_on">Property</span></span><span
		 class="x_tab" id="tabRelatedAttributeType" content="contentAttributeType" onclick="xTab(this);if('false'==this.loaded){refreshAttributeTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text">AttributeType</span></span><span
		 class="x_tab" id="tabRelationshipType" content="contentRelationshipType" onclick="xTab(this);if('false'==this.loaded){refreshRelationshipTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text">RelationshipType</span></span></td>
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
				<input class="x_btn_disabled" value="//Delete" type="button" />
				<input class="x_btn_disabled" value="//Update" type="button" /></td>
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
		
		
		
		
		<div id="contentAttributeType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshAttributeTypeList();" />
				|
				<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchAttributeTypeList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchAttributeTypeList(true);" />
				|
				<input class="x_btn_disabled" value="//Save" type="button" onclick="saveAttributeType();" />
				
				<input class="x_btn_disabled" value="//Delete" type="button" />
				<input class="x_btn_disabled" value="//Update" type="button" /></td>
			</tr>
			<tr>
			<td>
				<div id="attributeTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var attributeTypeList = new XList();
				var attributeTypeListColumns = [
					{name:'name', text:'名称', width:'160'},
					//{name:'code', text:'编码', width:'260'},
					{name:'tableName', text:'表名', width:'160'},
					{name:'columnName', text:'列名称', width:'160'},
					{name:'columnType', text:'列类型', width:'160'},
					{name:'dataType', text:'数据类型', width:'160'},	
					{name:'length', text:'数据长度', width:'160'},
					{name:'visible', text:'可见', width:'160'},
					{name:'readOnly', text:'只读', width:'160'},
					{name:'notNull', text:'不为空', width:'160'},
					{name:'dictionaryTypeId', text:'字典引用', width:'260'},	
					{name:'metaAttributeTypeId', text:'原属性类型', width:'200'},
					{name:'version', text:'乐观锁', width:'100'}
					
				];
							
				var attributeTypeListContext = {
					container:'attributeTypeListContainer',
					rowId:'attributeTypeId'
				};
				attributeTypeList.create(attributeTypeListContext, attributeTypeListColumns);	
				</script>
			</td>
			</tr>
			</table>
		</div>
		
		
		
		<div id="contentRelationshipType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshRelationshipTypeList();" />
				|
				<input class="x_btn" value="Create" type="button" onclick="createRelationshipType();" />
				<input class="x_btn_disabled" value="//Delete" type="button" />
				<input class="x_btn_disabled" value="//Update" type="button" /></td>
			</tr>
			<tr>
			<td>
				<div id="relationshipTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var relationshipTypeList = new XList();
				var relationshipTypeListColumns = [
					{name:'name', text:'名称', width:'200'},
					{name:'code', text:'编码', width:'200'},
					{name:'clientEntityType', text:'clientEntityType', width:'200'},
					{name:'supplierEntityType', text:'supplierEntityType', width:'200'},
					{name:'version', text:'乐观锁', width:'50'}
				];
							
				var relationshipTypeListContext = {
					container:'relationshipTypeListContainer',
					rowId:'relationshipTypeId'
				};
				relationshipTypeList.create(relationshipTypeListContext, relationshipTypeListColumns);	
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
		'systemMetadataManagement!viewEntityType.html',
		'entityTypeId=' + ctx.entityTypeId,
		'propertyContainer'
	);
}


function refreshAttributeTypeList() {
	
	attributeTypeList.clear();
	
	J.json(
		'systemMetadataManagement!findAttainableAttributeTypeParams.html',
		'entityTypeId=' + ctx.entityTypeId,
		function(o) {
			//if(null!=o) {
				ctx.attainableAttributeTypeParams = o;
				doRefreshAttributeTypeList();
			//}
		}
	);
}


function doRefreshAttributeTypeList() {

	attributeTypeList.clear();
	
	if(null!=ctx.attainableAttributeTypeParams) {
	
		var t = null;
		var name = null;
		var code = null;
		var enable = null;
		var columnName = null;
		//var enabledIds = attributeTypeList.value();
		
		for(var i = 0; i < ctx.attainableAttributeTypeParams.length; i++) {
			t = ctx.attainableAttributeTypeParams[i];
	
			enable = (null!=t.attributeType && t.attributeType.enable);
			//
			name = (null!=t.attributeType) ? t.attributeType.name : ((null!=t.metaAttributeType)?t.metaAttributeType.name:t.rawAttributeType.comments);
			code = (null!=t.attributeType) ? t.attributeType.code : ((null!=t.metaAttributeType)?t.metaAttributeType.columnName:t.rawAttributeType.columnName);
			columnName = (null!=t.metaAttributeType) ? t.metaAttributeType.columnName : t.rawAttributeType.columnName;
	
			//
			var f = true;
			if(true==ctx.isShowEnabledOnly) {
				f = enable;
			}
				
			if(f) {
				//var dateTypeSelect = getDateTypeSelect(i, t.dataType);
				//var displaySelect = getDisplaySelect(i, t.display);			
				attributeTypeList.addRow({
					id: t.tableName+"."+code,
					checked:enable,
					data:[										
						'<input id="name' + i + '" name="name' + i + '" class="x_text" value="' + name + '" />',
						//'<input id="code' + i + '" name="code' + i + '" class="x_text" value="' + code + '" />',
						t.tableName,
						columnName,
						(null!=t.metaAttributeType) ? t.metaAttributeType.columnType : t.rawAttributeType.dataType.text,
						'-',//(null!=t.metaAttributeType) ? t.metaAttributeType.dataType.name : t.rawAttributeType.dataType.dataType.text,
						(null!=t.metaAttributeType) ? t.metaAttributeType.length : t.rawAttributeType.dataLength,
						'-', //visible
						'-', //'<input id="readOnly' + i + '" name="readOnly' + i + '" type="checkbox" value="true"' + ((t.readOnly)?' checked="true"':'') + ' />',
						'-', //'<input id="notNull' + i + '" name="notNull' + i + '" type="checkbox" value="true"' + ((t.notNull)?' checked="true"':'') + ' />',
						'-', //'<input id="dictionaryTypeId' + i + '" name="dictionaryTypeId' + i + '" style="width:100;" id="" name="" class="x_text" value="' + t.dictionaryTypeId + '" />' + ((''==t.dictionaryTypeText)?'<font style="color:gray;">N/A</font>':t.dictionaryTypeText),
						(null!=t.metaAttributeType)? t.metaAttributeType.name : '-',
						(null!=t.attributeType)? t.attributeType.version : '1'
					]
				});
			}
		}
		t = null;
	}
}


function switchAttributeTypeList(_isShowEnabledOnly) {
	ctx.isShowEnabledOnly=_isShowEnabledOnly;
	$('btnShowAll').className=(ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	$('btnShowEnabledOnly').className=(!ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	doRefreshAttributeTypeList();
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

function getDisplaySelect(index, value) {
	var p = [];
	p[p.length] = '<select id="display' + index + '" name="display' + index + '" class="x_select">';
//	p[p.length] = '<option value=""></option>';
	var display = null;
	for(var i = 0; i < ctx.displays.length; i++) {
		display = ctx.displays[i];
		p[p.length] = '<option value="' + display.value + '"' + ((value==display.value) ? ' selected' : '') + '>' + display.text + '</option>';
	}
	display = null;
	p[p.length] = '</select>';
	return p.join('');
}
					
function onFindEntityType(o) {	
	if(null!=o.entityTypes) {
		var entityType = null;
		for(var i = 0; i < o.entityTypes.length; i++) {
			entityType = o.entityTypes[i];
			xlist.addRow({
				id:entityType.id,					
				data:[
					'<font class="x_font_name">' + entityType.text + '</font>',
					entityType.name,						
					entityType.typeTable,
					entityType.coreTable						
				]
			});
		}
		entityType = null;
	}
}

function toCreate() {
	if('SUCCESS'==dialog('systemMetadataManagementWizard!createEntityType.html')) {
		doRefresh('true');
	}
}

function saveAttributeType() {
	//alert(attributeTypeList.value().join('\n'));
	if(null!=attributeTypeList.value()) {
		var p = [];
		p[p.length] = 'entityTypeId=' + ctx.entityTypeId;
		
		var t = null;
		
		for(var i = 0; i < attributeTypeList.value().length; i++) {
			t = attributeTypeList.value()[i];
			var index = t.indexOf('.');
			
			p[p.length] = 'attainableAttributeTypeParams['+i+'].tableName=' + t.substring(0, t.indexOf('.'));
			p[p.length] = 'attainableAttributeTypeParams['+i+'].columnName=' + t.substring(t.indexOf('.')+1, t.length);
		}
		//alert(p.join('\n'));
		J.json(
			'systemMetadataManagement!saveAttributeTypes.html',
			p.join('&'),
			function(o) {
				if(null!=o) {
					ctx.attainableAttributeTypeParams = o;
					doRefreshAttributeTypeList();
				}
			}
		);		
	}
}

function saveAttributeTypeAdvanced() {
	if(null!=ctx.attainableAttributeTypeParams) {
		var p = [];
		var pi = 0;
		var enabledIds = attributeTypeList.value();
		var t = null;
		for(var i = 0; i < ctx.attainableAttributeTypeParams.length; i++) {
			t = ctx.attainableAttributeTypeParams[i];
			
			if(t.enable==false) {
				if(indexOf(t.id, enabledIds)>=0) {//create
					addAttributeType(i, 0, t, p, pi++);
				}
			} else {
				if(indexOf(t.id, enabledIds)>=0) {//update
					addAttributeType(i, t.id, t, p, pi++);
				} else {//delete
					addAttributeType(i, -t.id, t, p, pi++);
				}
			}			
		}
		t = null;
		alert(p.join('\n'));
		J.json(
			'systemMetadataManagement!saveAttributeTypes.html',
			p.join('&'),
			function(o) {
				if('SUCCESS'==o.returnValue) {
					findAttributeTypes('true');
				}
			}
		);
	}
}

function addAttributeType(i, id, attributeTypeValueObject, p, pi) {
	p[p.length] = 'attributeTypes[' + pi + '].id=' + id;
	p[p.length] = 'attributeTypes[' + pi + '].seqNo=' + (($('seqNo' + i)) ? $('seqNo' + i).value : attributeTypeValueObject.seqNo);
	p[p.length] = 'attributeTypes[' + pi + '].name=' + (($('name' + i)) ? $('name' + i).value : attributeTypeValueObject.name);
	p[p.length] = 'attributeTypes[' + pi + '].code=' + (($('code' + i)) ? $('code' + i).value : attributeTypeValueObject.code);
	p[p.length] = 'attributeTypes[' + pi + '].category=' + attributeTypeValueObject.category;
	p[p.length] = 'attributeTypes[' + pi + '].dataType=' + (($('dataType' + i)) ? $('dataType' + i).value : attributeTypeValueObject.dataType);
	p[p.length] = 'attributeTypes[' + pi + '].columnName=' + attributeTypeValueObject.columnName;
	p[p.length] = 'attributeTypes[' + pi + '].columnType=' + attributeTypeValueObject.columnType;
	p[p.length] = 'attributeTypes[' + pi + '].length=' + attributeTypeValueObject.length;	
	p[p.length] = 'attributeTypes[' + pi + '].entityTypeId=' + ctx.entityTypeId;
	p[p.length] = 'attributeTypes[' + pi + '].dictionaryTypeId=' + (($('dictionaryTypeId' + i)) ? $('dictionaryTypeId' + i).value : attributeTypeValueObject.dictionaryTypeId);
	//
	p[p.length] = 'attributeTypes[' + pi + '].display=' + (($('display' + i)) ? $('display' + i).value : attributeTypeValueObject.display);
	p[p.length] = 'attributeTypes[' + pi + '].readOnly=' + (($('readOnly' + i)) ? $('readOnly' + i).checked : attributeTypeValueObject.readOnly);
	p[p.length] = 'attributeTypes[' + pi + '].notNull=' + (($('notNull' + i)) ? $('notNull' + i).checked : attributeTypeValueObject.notNull);
	p[p.length] = 'attributeTypes[' + pi + '].abstractAttributeTypeId=' + attributeTypeValueObject.abstractAttributeTypeId;
	//
	p[p.length] = 'attributeTypes[' + pi + '].version=' + attributeTypeValueObject.version;
}
function indexOf(value, list) {
	for(var i = 0; i < list.length; i++) {
		if(value==list[i]) {
			return i;
		}
	}
}





function refreshRelationshipTypeList() {
	
	relationshipTypeList.clear();
	
	J.json(
		'systemMetadataManagement!findRelationshipTypes.html',
		'entityTypeId=' + ctx.entityTypeId,
		function(o) {
			//if(null!=o) {
				ctx.relationshipTypes = o;
				doRefreshRelationshipTypeList();
			//}
		}
	);
}

function doRefreshRelationshipTypeList() {

	relationshipTypeList.clear();

	if(null!=ctx.relationshipTypes) {
	
		var t = null;
		for(var i = 0; i < ctx.relationshipTypes.length; i++) {
			t = ctx.relationshipTypes[i];
			relationshipTypeList.addRow({
				id:t.id,					
				data:[
					'<font class="x_font_name">' + t.name + '</font>',
					t.code,						
					t.clientEntityType.name,
					t.supplierEntityType.name,
					t.version					
				]
			});
		}
		t = null;
	}
}


function createRelationshipType() {
	if('SUCCESS'==dialog('systemMetadataManagement!createRelationshipType.html?entityTypeId=' + ctx.entityTypeId)) {
		//parent.refreshEntityExplorer();
		refreshRelationshipTypeList();
	}
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
