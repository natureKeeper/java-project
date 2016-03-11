<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {	
	result:'FAILURE',
	entityTypeId:${entityTypeId},
	entityTypeName:'${entityType.name}',
	entityTypeCode:'${entityType.code}',
	supplierEntityTypes:null
};
</script>


<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">

<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr>
<td class="x_banner_bar" ondblclick="//switchView();">
 &nbsp; <font class="x_banner_font">新增 "${entityType.code} ${entityType.name}" RelationshipType</font>
</td>
</tr>

<tr style="height:0;display:none;" ondblclick="Msg.hide(this);" title="关闭">
<td style="border-bottom:1 solid #98C0F4;"><div id="messageContainer" class="info_msg"></div></td>
</tr>

<tr>
<td>

	<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td valign="top" style="padding:10;">
		<div clas="box">
			<table class="x_form" border="0" cellspacing="0" cellpadding="0">
			<form id="fom" name="fom" method="POST" onsubmit="return false;">
			<input id="relationshipType.enable" name="relationshipType.enable" value="true" type="hidden" />
			<input id="relationshipType.clientEntityTypeId" name="relationshipType.clientEntityTypeId" value="${entityTypeId}" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">metaRelationshipType</td>
			<td class="x_form_field">
			<#if metaRelationshipTypes ? exists><select id="relationshipType.metaRelationshipTypeId" name="relationshipType.metaRelationshipTypeId" onchange="refreshSupplierEntityTypeContainer()" class="x_select">
			<option value="">-- please select --</option>
			<#list metaRelationshipTypes as t>
			<option value="${t.id}">${t.name}</option>
			</#list>
			</select><#else>metaRelationshipTypes not found </#if></td>
			</tr>
			<tr>
			<td class="x_form_label">supplierEntityTypeId</td>
			<td class="x_form_field" id="supplierEntityTypeContainer" name="supplierEntityTypeContainer"><font class="font_loading">Please select metaRelationshipType first!</font></td>
			</tr>		
			<tr>
			<td class="x_form_label">name</td>
			<td class="x_form_field"><input id="relationshipType.name" name="relationshipType.name" value="" class="x_text" /></td>				
			</tr>			
			<tr>
			<td class="x_form_label">code</td>
			<td class="x_form_field"><input id="relationshipType.code" name="relationshipType.code" value="" class="x_text" /></td>				
			</tr>	
			<tr>
			<td class="x_form_label">clientName</td>
			<td class="x_form_field"><input id="relationshipType.clientName" name="relationshipType.clientName" value="${entityType.name}" class="x_text" /></td>				
			</tr>	
			<tr>
			<td class="x_form_label">supplierName</td>
			<td class="x_form_field"><input id="relationshipType.supplierName" name="relationshipType.supplierName" value="" class="x_text" />
				</td>				
			</tr>
			</form>
			</table>
			<table class="x_form" border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td class="x_form_field" colspan="2"><br />
				<textarea id="statement" name="statement" style="height:200;width:100%;"></textarea>
			</td>
			</tr>
			</table>
		</div>
	</td>
	</tr>
	<tr>
	<td class="x_operation_bar" align="center">
		<input id="btnCreate" class="x_btn_disabled" value="Create" type="button" onclick="doCreate();" />
		<input id="btnCancel" class="x_btn" value="Cancel" type="button" onclick="doCancel();" />
	</td>
	</tr>
	</table>

</td>
</tr>
</table>

	
<script>
/*
function findAttainableMetaRelationshipTypeValueObjects() {
	J.json(
		'systemMetadataManagement!findMetaRelationshipTypes.html',
		'entityTypeId=' + ctx.entityTypeId,
		function(o) {
			ctx.attainableMetaRelationshipTypeValueObjects = o;
			refreshRawRelationshipTable();
		}
	);
}
*/

function refreshSupplierEntityTypeContainer() {
	
	if(''!=$('relationshipType.metaRelationshipTypeId').value) {
	//alert($('relationshipType.metaRelationshipTypeId').value);
		J.json(
			'systemMetadataManagement!findSupplierEntityTypeByMetaRelationshipTypeId.html',
			'metaRelationshipTypeId=' + $('relationshipType.metaRelationshipTypeId').value,
			function(o) {
				ctx.supplierEntityTypes = o;
				doRefreshSupplierEntityTypeContainer();
			}
		);
	}
	
}

function doRefreshSupplierEntityTypeContainer() {
	if(null!=ctx.supplierEntityTypes) {
		var p = [];
		p[p.length] = '<select id="relationshipType.supplierEntityTypeId" name="relationshipType.supplierEntityTypeId" class="x_select" onchange="onChangeSupplierEntityType()">';
		p[p.length] = '<option value="">-- please select --</option>';
		var t = null;
		for(var i=0;i<ctx.supplierEntityTypes.length;i++) {
			t = ctx.supplierEntityTypes[i];
			p[p.length] = '<option value="'+t.id+'">'+t.name+'</option>';
		}
		p[p.length] = '</select>';
		t = null;
		$('supplierEntityTypeContainer').innerHTML = p.join('');		
		$('btnCreate').className='x_btn';
	} else {
		$('supplierEntityTypeContainer').innerHTML = 'supplierEntityType not found';
		$('btnCreate').className='x_btn_disabled';
	}
}


function onChangeSupplierEntityType() {
	if(''!=$('relationshipType.supplierEntityTypeId').value) {
		if(null!=ctx.supplierEntityTypes) {
			var t = null;
			for(var i=0;i<ctx.supplierEntityTypes.length;i++) {
				t = ctx.supplierEntityTypes[i];
				if(t.id==$('relationshipType.supplierEntityTypeId').value) {
					$('relationshipType.name').value = ctx.entityTypeName + '2所属' + t.name;
					$('relationshipType.code').value = ctx.entityTypeCode + '2' + t.code;
					$('relationshipType.supplierName').value = '所属'+t.name;
					//$('relationshipType.supplierEntityTypeId').value = t.id;
					break;			
				}
			}			
			t = null;
		}	
	} else {
		$('relationshipType.name').value = '';
		$('relationshipType.code').value = '';
		$('relationshipType.supplierName').value = '';
		//$('relationshipType.supplierEntityTypeId').value = '';
	}
}

function doCreate() {
	var p = [];
	p[p.length] = Form.serialize('fom');
	//alert(p.join('/n'));
	J.json(
		'systemMetadataManagement!doCreateRelationshipType.html',
		p.join('&'),
		function(o) {
			Form.disable('fom');
			xbtnDisable('btnCreate');
			$('btnCancel').value = 'Close';			
			Msg.info('messageContainer', 'Create Successfully!');
			$('statement').value = o;
			ctx.result='SUCCESS';
		}
	);
	p = null;
}

function doCancel() {
	window.close();
}
</script>


</body>
<script>
function onLoad() {
	//findAttainableMetaRelationshipTypeValueObjects();
	window.status = 'onLoad';
}

function onUnload() {
	window.returnValue = ctx.result;
	window.status = 'onUnload';
}
</script>
</html>
