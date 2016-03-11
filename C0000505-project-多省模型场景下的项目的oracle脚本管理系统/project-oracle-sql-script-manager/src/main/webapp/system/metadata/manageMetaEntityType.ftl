<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {
	metaEntityTypeId:${(metaEntityTypeId)?default(0)},
	metaEntityType:{
		id:0
	},
	dataTypes:[<#if dataTypes ? exists><#list dataTypes as t>
		{
			text:'${(t.text)?if_exists?js_string}',
			value:${(t.value)?if_exists?js_string}
		}<#if t_has_next>,</#if>
	</#list></#if>],
	
	attainableMetaAttributeTypeParams:null,
	
	attainableMetaRelationshipTypeParams:null,
	
	entityTypes:null,
	
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
		<td class="x_tab_first" style="width:99%;">&nbsp;MetaEntityType: <span id="tabTitle" class="x_tab_title"><font class="x_font_loading">loading...</font></span></td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on" id="tabProperty" content="contentProperty" onclick="xTab(this);"><span class="x_tab_text_on">Property</span></span><span
		 class="x_tab" id="tabMetaAttributeType" content="contentMetaAttributeType" onclick="xTab(this);if('false'==this.loaded){refreshMetaAttributeTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text">MetaAttributeType</span></span><span
		 class="x_tab" id="tabMetaRelationshipType" content="contentMetaRelationshipType" onclick="xTab(this);if('false'==this.loaded){refreshMetaRelationshipTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text">MetaRelationshipType</span></span><span
		 class="x_tab" id="tabEntityType" content="contentEntityType" onclick="xTab(this);if('false'==this.loaded){refreshEntityTypeList();this.loaded='true';}" loaded="false"><span class="x_tab_text"> EntityType</span></span></td>
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
		
		
		
		
		<div id="contentMetaAttributeType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="doRefreshMetaAttributeTypeList();" />
				|
				<input id="btnShowAll" name="btnShowAll" class="x_btn_disabled" value="Show All" type="button" onclick="switchMetaAttributeTypeList(false);" /><input id="btnShowEnabledOnly" name="btnShowEnabledOnly" class="x_btn" value="Show Enabled Only" type="button" onclick="switchMetaAttributeTypeList(true);" />
				|
				<input class="x_btn_disabled" value="//Save" type="button" onclick="saveMetaAttributeType();" /></td>
			</tr>
			<tr>
			<td>
				<div id="metaAttributeTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var metaAttributeTypeList = new XList();
				var metaAttributeTypeListColumns = [
					{name:'id', text:'标识', width:'100'},
					{name:'name', text:'名称', width:'160'},
					{name:'code', text:'编码', width:'160'},
					{name:'tableType', text:'表类型', width:'100'},
					{name:'primaryKey', text:'主键', width:'100'},
					{name:'referenceKey', text:'引用键', width:'100'},
					{name:'foreignKey', text:'外键', width:'100'},
					{name:'versionKey', text:'乐观键', width:'100'},		
					{name:'columnName', text:'列名称', width:'120'},
					{name:'columnType', text:'列类型', width:'120'},
					{name:'dataType', text:'数据类型', width:'160'},
					{name:'length', text:'数据长度', width:'100'},
					{name:'visible', text:'显示', width:'80'},
					{name:'notNull', text:'非空', width:'80'},
					{name:'metaDictionaryTypeId', text:'抽象字典引用', width:'260'},
					{name:'version', text:'乐观锁', width:'100'}
				];
							
				var metaAttributeTypeListContext = {
					container:'metaAttributeTypeListContainer',
					rowId:'metaAttributeTypeId'
				};
				metaAttributeTypeList.create(metaAttributeTypeListContext, metaAttributeTypeListColumns);	
				</script>
			</td>
			</tr>
			</table>
		</div>
		
		<div id="contentMetaRelationshipType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshMetaRelationshipTypeList();" />
				|
				<input class="x_btn" value="Create" type="button" onclick="createMetaRelationshipType();" />
				<input class="x_btn_disabled" value="//Update" type="button" /></td>
			</tr>
			<tr>
			<td>
				<div id="metaRelationshipTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var metaRelationshipTypeList = new XList();
				var metaRelationshipTypeListColumns = [
					{name:'id', text:'标识', width:'50'},
					{name:'name', text:'名称', width:'160'},
					{name:'code', text:'编码', width:'160'},
					{name:'relationshipTable', text:'关系表', width:'200'},
					{name:'multiplicityType', text:'多重性', width:'100'},
					{name:'clientMetaEntityType', text:'clientMetaEntityType', width:'200'},	
					{name:'clientMetaAttributeType', text:'clientMetaAttributeType', width:'200'},
					{name:'supplierMetaEntityType', text:'supplierMetaEntityType', width:'200'},					
					{name:'supplierMetaAttributeType', text:'supplierMetaAttributeType', width:'200'},									
					{name:'version', text:'乐观锁', width:'100'}
				];
							
				var metaRelationshipTypeListContext = {
					container:'metaRelationshipTypeListContainer',
					rowId:'metaRelationshipTypeId'
				};
				metaRelationshipTypeList.create(metaRelationshipTypeListContext, metaRelationshipTypeListColumns);	
				</script>
			</td>
			</tr>
			</table>
		</div>
		
		
		<div id="contentEntityType" style="display:none;">
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_toolbar">
				<input class="x_btn" value="Refresh" type="button" onclick="refreshEntityTypeList();" />
				|
				<input class="x_btn" value="Create" type="button" onclick="createEntityType();" />
				<input class="x_btn_disabled" value="//Delete" type="button" />
				<input class="x_btn_disabled" value="//Update" type="button" /></td>
			</tr>
			<tr>
			<td>
				<div id="entityTypeListContainer" style="height:100%;width:100%;"></div>
				<script>
				var entityTypeList = new XList();
				var entityTypeListColumns = [
					{name:'id', text:'id 标识', width:'100'},
					{name:'name', text:'name 名称', width:'100'},
					{name:'code', text:'code 编码', width:'100'},
					{name:'enable', text:'enable 激活', width:'100'},
					{name:'spatial', text:'是否空间', width:'100'},					
					{name:'icon', text:'icon 图标', width:'100'},
					{name:'extensionTable', text:'卫星表名', width:'300'},
					{name:'creator', text:'新增人', width:'100'},
					{name:'createDate', text:'新增时间', width:'150'},
					{name:'updater', text:'更新人', width:'100'},
					{name:'updateDate', text:'更新时间', width:'150'},
					{name:'version', text:'乐观锁', width:'50'}
				];
							
				var entityTypeListContext = {
					container:'entityTypeListContainer',
					rowId:'entityTypeId'
				};
				entityTypeList.create(entityTypeListContext, entityTypeListColumns);	
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
		'systemMetadataManagement!viewMetaEntityType.html',
		'metaEntityTypeId=' + ctx.metaEntityTypeId,
		'propertyContainer'
	);
}

function refreshMetaAttributeTypeList() {
	
	metaAttributeTypeList.clear();
	
	J.json(
		'systemMetadataManagement!findAttainableMetaAttributeTypeParams.html',
		'metaEntityTypeId=' + ctx.metaEntityTypeId,
		function(o) {
			//if(null!=o) {
				ctx.attainableMetaAttributeTypeParams = o;
				doRefreshMetaAttributeTypeList();
			//}
		}
	);
}

function doRefreshMetaAttributeTypeList() {

	metaAttributeTypeList.clear();


	if(null!=ctx.attainableMetaAttributeTypeParams) {
		
		var t = null;
		var name = null;
		var code = null;
		var enable = null;
		
		//alert(ctx.attainableMetaAttributeTypeParams.length);
		for(var i = 0; i < ctx.attainableMetaAttributeTypeParams.length; i++) {
			t = ctx.attainableMetaAttributeTypeParams[i];
			
			if(null==t.rawMetaAttributeType) {
				alert('rawMetaAttributeType not found: '+t.tableType.text+': '+t.metaAttributeType.name);
			} else {
				
				enable = (null!=t.metaAttributeType);
				//
				name = enable ? t.metaAttributeType.name : t.rawMetaAttributeType.comments;
				code = enable ? t.metaAttributeType.code : ((null!=t.fieldName)?t.fieldName:t.rawMetaAttributeType.columnName.replace('_','').toLowerCase());
				
				//
				var f = true;
				if(true==ctx.isShowEnabledOnly) {
					f = enable;
				}
			
				if(f) {
					var dateTypeSelect = getDateTypeSelect(i, t.dataType);			
					metaAttributeTypeList.addRow({
						id: t.rawMetaAttributeType.columnName,
						checked: enable,
						disabled: true,
						data:[							
							enable ? t.metaAttributeType.id : '-',
							'<input id="name' + i + '" name="name' + i + '" class="x_text" style="100%" value="' + name + '" />',
							code,//'<input id="code' + i + '" name="code' + i + '" class="x_text" style="100%" value="' + code + '" />',
							t.tableType.text,
							enable ? t.metaAttributeType.primaryKey : '',	
							enable ? t.metaAttributeType.referenceKey : '',
							enable ? t.metaAttributeType.foreignKey : '',
							enable ? t.metaAttributeType.versionKey : '',	
							enable ? t.metaAttributeType.columnName : t.rawMetaAttributeType.columnName,
							enable ? t.metaAttributeType.columnType : t.rawMetaAttributeType.dataType.name,
							enable ? t.metaAttributeType.dataType.name : '',
							enable ? t.metaAttributeType.length : t.rawMetaAttributeType.dataLength,
							enable ? t.metaAttributeType.visible : '',
							enable ? t.metaAttributeType.notNull : '',
							enable ? '<input id="metaDictionaryTypeId' + i + '" name="metaDictionaryTypeId' + i + '" style="width:100%;" id="" name="" class="x_text" value="' + t.metaDictionaryTypeId + '" type="hidden" />' + ((null==t.metaDictionaryType)?'<font style="color:gray;">&nbsp;</font>':t.metaDictionaryType.name) : '',
							enable ? t.metaAttributeType.version : '1'				
						]
					});
				}
			}
		}
		t = null;
	}
}




function refreshEntityTypeList() {
	
	entityTypeList.clear();
	
	J.json(
		'systemMetadataManagement!findEntityTypes.html',
		'metaEntityTypeId=' + ctx.metaEntityTypeId,
		function(o) {
			if(null!=o) {
				ctx.entityTypes = o;
				doRefreshEntityTypeList();
			}
		}
	);
}

function doRefreshEntityTypeList() {

	entityTypeList.clear();

	var t = null;
	var name = null;
	var code = null;
	var enable = null;
	var spatial = null;

	for(var i = 0; i < ctx.entityTypes.length; i++) {
		t = ctx.entityTypes[i];
		
		enable = (null!=t.enable);
		spatial = (null!=t.spatial);
		//
	
		entityTypeList.addRow({
			id: t.id,
			//checked: enable,
			data:[	
				t.id,
				'<font class="x_font_name">' + t.name + '</font>',
				t.code,
				(enable)?t.enable:'-',
				(spatial)?t.spatial:'',
				'<img src="${base}/context/assets/business/' + t.icon + '.16.png" alt="' + t.icon + '.16.png" width="16" height="16" />',
				t.extensionTable,
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




function createEntityType() {
	if('SUCCESS'==dialog('systemMetadataManagement!createEntityType.html?metaEntityTypeId=' + ctx.metaEntityTypeId)) {
		parent.refreshEntityExplorer();
		refreshEntityTypeList();
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

function saveMetaAttributeType() {
	if(null!=ctx.attainableMetaAttributeTypeParams) {		
		var p = [];
		var pi = 0;
		var enabledIds = metaAttributeTypeList.value();
		var t = null;
		for(var i = 0; i < ctx.attainableMetaAttributeTypeParams.length; i++) {
			t = ctx.attainableMetaAttributeTypeParams[i];
			
			if(t.enable==false) {
				if(indexOf(t.id, enabledIds)>=0) {//create
					addMetaAttributeType(i, 0, t, p, pi++);
				}
			} else {
				if(indexOf(t.id, enabledIds)>=0) {//update
					addMetaAttributeType(i, t.id, t, p, pi++);
				} else {//delete
					addMetaAttributeType(i, -t.id, t, p, pi++);
				}
			}			
		}
		t = null;
		
		J.json(
			'systemMetadataManagement!saveMetaAttributeTypes.html',
			p.join('&'),
			function(o) {
				if('SUCCESS'==o.returnValue) {
					findMetaAttributeTypes('true');
				}
			}
		);
	}	
}

function addMetaAttributeType(i, id, metaAttributeTypeValueObject, p, pi) {
	p[p.length] = 'metaAttributeTypes[' + pi + '].id=' + id;
	p[p.length] = 'metaAttributeTypes[' + pi + '].name=' + (($('name' + i)) ? $('name' + i).value : metaAttributeTypeValueObject.name);
	p[p.length] = 'metaAttributeTypes[' + pi + '].code=' + (($('code' + i)) ? $('code' + i).value : metaAttributeTypeValueObject.code);
	p[p.length] = 'metaAttributeTypes[' + pi + '].category=' + metaAttributeTypeValueObject.category;
	p[p.length] = 'metaAttributeTypes[' + pi + '].dataType=' + (($('dataType' + i)) ? $('dataType' + i).value : metaAttributeTypeValueObject.dataType);
	p[p.length] = 'metaAttributeTypes[' + pi + '].columnName=' + metaAttributeTypeValueObject.columnName;
	p[p.length] = 'metaAttributeTypes[' + pi + '].columnType=' + metaAttributeTypeValueObject.columnType;
	p[p.length] = 'metaAttributeTypes[' + pi + '].length=' + metaAttributeTypeValueObject.length;	
	p[p.length] = 'metaAttributeTypes[' + pi + '].metaEntityTypeId=' + ctx.metaEntityTypeId;
	p[p.length] = 'metaAttributeTypes[' + pi + '].metaDictionaryTypeId=' + (($('metaDictionaryTypeId' + i)) ? $('metaDictionaryTypeId' + i).value : metaAttributeTypeValueObject.metaDictionaryTypeId);
	p[p.length] = 'metaAttributeTypes[' + pi + '].version=' + metaAttributeTypeValueObject.version;
}

function indexOf(value, list) {
	for(var i = 0; i < list.length; i++) {
		if(value==list[i]) {
			return i;
		}
	}
}

function switchMetaAttributeTypeList(_isShowEnabledOnly) {
	ctx.isShowEnabledOnly=_isShowEnabledOnly;
	$('btnShowAll').className=(ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	$('btnShowEnabledOnly').className=(!ctx.isShowEnabledOnly)?'x_btn':'x_btn_disabled';
	doRefreshMetaAttributeTypeList();
}









function refreshMetaRelationshipTypeList() {
	
	metaRelationshipTypeList.clear();
	
	J.json(
		'systemMetadataManagement!findAttainableMetaRelationshipTypeParams.html',
		'metaEntityTypeId=' + ctx.metaEntityTypeId,
		function(o) {
			//if(null!=o) {
				ctx.attainableMetaRelationshipTypeParams = o;
				doRefreshMetaRelationshipTypeList();
			//}
		}
	);
}


function doRefreshMetaRelationshipTypeList() {
	
	metaRelationshipTypeList.clear();

	var t = null;
	var name = null;
	var code = null;
	var enable = null;
	var spatial = null;

	if(null!=ctx.attainableMetaRelationshipTypeParams) {
		for(var i = 0; i < ctx.attainableMetaRelationshipTypeParams.length; i++) {
			t = ctx.attainableMetaRelationshipTypeParams[i];
			
			//enable = (null!=t.enable);
			//spatial = (null!=t.spatial);
			//
		
			metaRelationshipTypeList.addRow({
				id: t.id,
				//checked: enable,
				data:[	
					(null==t.metaRelationshipType)?'&nbsp;':t.metaRelationshipType.id,
					'<font class="x_font_name">' + t.name + '</font>',
					t.code,
					t.rawMetaRelationshipType.clientTableName,
					t.multiplicityType.text,
					t.clientMetaEntityType.name,					
					t.clientMetaAttributeType.columnName,
					t.supplierMetaEntityType.name,			
					t.supplierMetaAttributeType.columnName,
					(null==t.metaRelationshipType)?'&nbsp;':t.metaRelationshipType.version					
				]
			});
		
		}
	}
	t = null;
}



function createMetaRelationshipType() {
	if('SUCCESS'==dialog('systemMetadataManagement!createMetaRelationshipType.html?metaEntityTypeId=' + ctx.metaEntityTypeId)) {
		//parent.refreshEntityExplorer();
		refreshMetaRelationshipTypeList();
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
