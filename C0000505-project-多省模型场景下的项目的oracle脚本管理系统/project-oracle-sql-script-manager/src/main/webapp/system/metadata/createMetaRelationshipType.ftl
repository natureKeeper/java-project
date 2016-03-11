<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<script>
var ctx = {	
	result:'FAILURE',
	metaEntityTypeId:${metaEntityTypeId},
	attainableMetaRelationshipTypeValueObjects:null
};
</script>


<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">



<table style="width:100%;height:100%;" cellspacing="0" cellpadding="0" border="0" align="center">

<tr>
<td class="x_banner_bar" ondblclick="//switchView();">
 &nbsp; <font class="x_banner_font">新增 "${metaEntityType.code} ${metaEntityType.name}" MetaRelationshipType</font>
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
			<input id="attainableMetaRelationshipTypeValueObject.enable" name="attainableMetaRelationshipTypeValueObject.enable" value="true" type="hidden" />
			<tr>
			<td class="x_form_label" style="width:25%;">relationshipTable</td>
			<td class="x_form_field" id="rawRelationshipContainer" name="rawRelationshipContainer"><font class="font_loading">loading...</font></td>
			</tr>
			<tr>
			<td class="x_form_label">name 名称</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.name" name="attainableMetaRelationshipTypeValueObject.name" value="" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label">code 编码</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.code" name="attainableMetaRelationshipTypeValueObject.code" value="" class="x_text" /></td>
			</tr>
			<tr>
			<td class="x_form_label">relationshipTable </td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.relationshipTable" name="attainableMetaRelationshipTypeValueObject.relationshipTable" value="" class="x_text" />
				<input id="attainableMetaRelationshipTypeValueObject.relationshipMetaEntityTypeId" name="attainableMetaRelationshipTypeValueObject.relationshipMetaEntityTypeId" value="" type="hidden" /></td>
			</tr>
			<tr>
			<td class="x_form_label">multiplicityType 多重度</td>
			<td class="x_form_field"><input id="multiplicityTypeText" name="multiplicityTypeText" value="" class="x_text" />
				<input id="attainableMetaRelationshipTypeValueObject.multiplicityType" name="attainableMetaRelationshipTypeValueObject.multiplicityType" value="" type="hidden" /></td>
			</tr>			
			<tr>
			<td class="x_form_label">clientName</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.clientName" name="attainableMetaRelationshipTypeValueObject.clientName" value="" class="x_text" />
				<input id="attainableMetaRelationshipTypeValueObject.clientMetaEntityTypeId" name="attainableMetaRelationshipTypeValueObject.clientMetaEntityTypeId" value="" type="hidden" />
				<input id="attainableMetaRelationshipTypeValueObject.clientMetaAttributeTypeId" name="attainableMetaRelationshipTypeValueObject.clientMetaAttributeTypeId" value="" type="hidden" /></td>				
			</tr>	
			<tr>
			<td class="x_form_label">clientColumnName</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.clientColumnName" name="attainableMetaRelationshipTypeValueObject.clientColumnName" value="" class="x_text" /></td>				
			</tr>		
			<tr>
			<td class="x_form_label">supplierName</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.supplierName" name="attainableMetaRelationshipTypeValueObject.supplierName" value="" class="x_text" />
				<input id="attainableMetaRelationshipTypeValueObject.supplierMetaEntityTypeId" name="attainableMetaRelationshipTypeValueObject.supplierMetaEntityTypeId" value="" type="hidden" />
				<input id="attainableMetaRelationshipTypeValueObject.supplierMetaAttributeTypeId" name="attainableMetaRelationshipTypeValueObject.supplierMetaAttributeTypeId" value="" type="hidden" /></td>				
			</tr>
			<tr>
			<td class="x_form_label">supplierColumnName</td>
			<td class="x_form_field"><input id="attainableMetaRelationshipTypeValueObject.supplierColumnName" name="attainableMetaRelationshipTypeValueObject.supplierColumnName" value="" class="x_text" /></td>				
			</tr>	
			</form>
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
function findAttainableMetaRelationshipTypeValueObjects() {
	J.json(
		'systemMetadataManagement!findAttainableMetaRelationshipTypeValueObjects.html',
		'metaEntityTypeId=' + ctx.metaEntityTypeId,
		function(o) {
			ctx.attainableMetaRelationshipTypeValueObjects = o;
			refreshRawRelationshipTable();
		}
	);
}

function refreshRawRelationshipTable() {
	if(null!=ctx.attainableMetaRelationshipTypeValueObjects) {
		var p = [];
		var rawRelationshipAvaliable = false;
		p[p.length] = '<select id="rawRelationship" name="rawRelationship" class="x_select" onchange="onRawRelationshipChange()">';
		p[p.length] = '<option value="">-- please select --</option>';
		var t = null;
		for(var i=0;i<ctx.attainableMetaRelationshipTypeValueObjects.length;i++) {
			t = ctx.attainableMetaRelationshipTypeValueObjects[i];
			if(null==t.metaRelationshipType) {
				rawRelationshipAvaliable = true;
				var r = t.rawMetaRelationshipType.clientTableName;
				r = r + '.' + t.rawMetaRelationshipType.clientColumnName;
				r = r + ' -> ' + t.rawMetaRelationshipType.supplierTableName;
				r = r + '.' + t.rawMetaRelationshipType.supplierColumnName;
				p[p.length] = '<option value="'+r+'">'+r+'</option>';
			}
		}
		t = null;
		if(true==rawRelationshipAvaliable) {
			p[p.length] = '</select>';
			$('rawRelationshipContainer').innerHTML = p.join('');
			$('btnCreate').className='x_btn';
		} else {
			p=null;
			$('rawRelationshipContainer').innerHTML = 'No Raw Relationship Avaliable';
			$('btnCreate').className='x_btn_disabled';
		}
	}
}

function onRawRelationshipChange() {
	if(null!=ctx.attainableMetaRelationshipTypeValueObjects) {
		var t = null;
		var tableColumn = null;
		for(var i=0;i<ctx.attainableMetaRelationshipTypeValueObjects.length;i++) {
			t = ctx.attainableMetaRelationshipTypeValueObjects[i];
			
			var r = t.rawMetaRelationshipType.clientTableName;
			r = r + '.' + t.rawMetaRelationshipType.clientColumnName;
			r = r + ' -> ' + t.rawMetaRelationshipType.supplierTableName;
			r = r + '.' + t.rawMetaRelationshipType.supplierColumnName;
			
			if($('rawRelationship').value==r) {
			
				if('ManyToOne'==t.multiplicityType.name) {
				
					$('attainableMetaRelationshipTypeValueObject.name').value = t.clientMetaEntityType.name + '2' + t.clientMetaAttributeType.name;
					var code = t.clientMetaAttributeType.code;
					//alert(code);
					//alert(code.substr(code.length - 2, 2));
					if (code.substr(code.length - 2, 2)=='Id') {
						code = code.substr(0, code.length - 2);
					}
					//alert(code.substr(code.length - 3, 3));
					if (code.substr(code.length - 3, 3)=='_ID') {
						code = code.substr(0, code.length - 3);
					}
					code = code.substr(0, 1).toUpperCase() + code.substr(1, code.length - 1);
					//alert(code);
					//alert(t.clientMetaEntityType.code);
					
					//alert($('attainableMetaRelationshipTypeValueObject.code'));
					$('attainableMetaRelationshipTypeValueObject.code').value = t.clientMetaEntityType.code + '2' + code;
					
					$('attainableMetaRelationshipTypeValueObject.relationshipTable').value=t.clientMetaEntityType.coreTable;
					$('attainableMetaRelationshipTypeValueObject.relationshipMetaEntityTypeId').value=-1;

					$('multiplicityTypeText').value='n-1';
					$('attainableMetaRelationshipTypeValueObject.multiplicityType').value='ManyToOne';
					
					$('attainableMetaRelationshipTypeValueObject.clientName').value=t.clientMetaEntityType.name;
					$('attainableMetaRelationshipTypeValueObject.clientMetaEntityTypeId').value=t.clientMetaEntityType.id;
					$('attainableMetaRelationshipTypeValueObject.clientMetaAttributeTypeId').value=t.clientMetaAttributeType.id;
					$('attainableMetaRelationshipTypeValueObject.clientColumnName').value=t.clientMetaAttributeType.columnName;
					
					$('attainableMetaRelationshipTypeValueObject.supplierName').value=t.clientMetaAttributeType.name;
					$('attainableMetaRelationshipTypeValueObject.supplierMetaEntityTypeId').value=t.supplierMetaEntityType.id;
					$('attainableMetaRelationshipTypeValueObject.supplierMetaAttributeTypeId').value=t.supplierMetaAttributeType.id;
					$('attainableMetaRelationshipTypeValueObject.supplierColumnName').value=t.supplierMetaAttributeType.columnName;
				
				} else {
					if(null==t.relationshipMetaEntityType) {
						refreshClientColumnName();
					} else {
						if(t.relationshipMetaEntityType.relationshipTable && true==t.relationshipMetaEntityType.relationshipTable) {
							refreshClientColumnName();
						} else {
							alert('should never used');
							//$('attainableMetaRelationshipTypeValueObject.name').value = t.clientMetaEntityType.name + '2' + t.clientMetaAttributeType.name;							
						}
					}
				}
			}			
		}
		t = null;
	}
}

function refreshClientColumnName() {
	alert('refreshClientColumnName');
}

function doCreate() {
	var p = [];
	p[p.length] = Form.serialize('fom');
	//alert(p.join('\n'));
	J.json(
		'systemMetadataManagement!doCreateMetaRelationshipType.html',
		p.join('&'),
		function(o) {
			Form.disable('fom');
			xbtnDisable('btnCreate');
			$('btnCancel').value = 'Close';			
			Msg.info('messageContainer', 'Create Successfully!');
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
	findAttainableMetaRelationshipTypeValueObjects();
	window.status = 'onLoad';
}

function onUnload() {
	window.returnValue = ctx.result;
	window.status = 'onUnload';
}
</script>
</html>
