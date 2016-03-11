<html>
<head>
<#include "/resource/prototype/include.ftl" />

<style>
.item      ,
.item_over ,
.item_down {
	margin:1;
	padding:1;	
	height:19;
	width:100%;
	cursor:hand;
	font-size:12;
	padding-left:10;
	/* display:block-inline;	
	display:inline-block;
	vertical-align:top;	*/
	font-family:Verdana,Simsun;	
	/* background:url(../image/icon/16/item.gif) no-repeat 3px middle; */
}

.item {
	color:#2D5593;
	border:1 solid #E4F0FE;
	background-color:#F5F9FE;
}

.item_over {
	color:#1C2F4D;
	border:1 solid #C3DAF9;
	background-color:#E1EFFE;
}

.item_down {
	color:#131D2A;
	border:1 solid #4F7EBE;
	background-color:#C3DAF9;
}
</style>

<script>
function onItemOver(the) {
	the.className = 'item_over';
}
function onItemOut(the) {
	the.className = 'item';
}
function onItemDown(the) {
	the.className = 'item_down';
}
function onItemUp(the) {
	the.className = 'item_over';
}

function coverContent() {
	//Position.clone($('contentContainer'),$('contentCover'));
	$('contentCover').style.display = '';
}

function disCoverContent() {	
	$('contentCover').style.display = 'none';
}
</script>


<script>
var ctx = {
	metaEntityTypeValueObjects:[]
};
</script>



</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

<tr>
<td style="width:26%;">

	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

	<tr>
	<td class="x_tab_separator_container x_tab_container_background">
	
		<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
		<tr>
		<td class="x_tab_first">&nbsp;</td>
		<td nowrap="true" valign="bottom"><!-- span
		 class="x_tab" id="tabHierarchyExplorer" content="contentHierarchyExplorer" onclick="xTab(this);"><span class="x_tab_text">Hierarchy</span></span --><span
		 class="x_tab_on" id="tabEntityExplorer" content="contentEntityExplorer" onclick="xTab(this);"><span class="x_tab_text_on">Entity</span></span><!-- span
		 class="x_tab" id="tabRelationshipExplorer" content="contentRelationshipExplorer" onclick="xTab(this);"><span class="x_tab_text">Relationship</span></span --></td>
		<td class="x_tab_last" align="right">&nbsp;<input class="icon_btn_refresh" onclick="refreshExplorer();" type="button" title="Refresh" />&nbsp;</td>
		</tr>
		<tr><td colspan="3" class="x_tab_separator"></td></tr>
		</table>
		
	</td>
	</tr>
	
	<tr>
	<td>
		<!-- div id="contentHierarchyExplorer" style="display:none;">
			<div style="width:100%;height:100%;overflow:auto;padding:2;margin-top:0;">
				<script>
				var nodeTree = new WebFXLoadTree('模型', 'systemMetadataManagement!findMetaEntityTypes.html');
				document.write(nodeTree);
				</script>
			</div>
		</div -->
		
		<div id="contentEntityExplorer" style="display:block;">
			
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			
			<!-- tr>
			<td style="width:99%;height:20;padding-left:2;padding-right:0;"><input id="nameFilter" name="nameFilter" class="x_text" onkeyup="filterEntityExplorer();" /></td>
			<td style="width:20;padding-left:0;padding-right:2;"><input type="button" class="x_reference_btn" /></td>
			</tr  colspan="2" -->
			
			<tr>
			<td class="x_criteria_bar" style="height:24;padding-left:3;padding-right:3;"><input style="height:19;" id="nameFilter" name="nameFilter" class="x_text" onkeyup="doRefreshEntityExplorer();" /></td>
			</tr>
			
			<tr>
			<td>
				<div id="entityContainer" style="width:100%;height:100%;overflow:auto;padding-left:2;padding-right:2;margin-top:0;">
					<font class="x_font_loading">loading...</font>
				</div>
			</td>
			</tr>
			
			</table>
			
		</div>
		
		<div id="contentRelationshipExplorer" style="display:none;">
			
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
						
			<tr>
			<td class="x_criteria_bar" style="height:24;padding-left:3;padding-right:3;"><input style="height:19;" id="nameFilter" name="nameFilter" class="x_text" onkeyup="filterEntityExplorer();" /></td>
			</tr>
			
			<tr>
			<td>
				<div id="relationshipContainer" style="width:100%;height:100%;overflow:auto;padding-left:2;padding-right:2;margin-top:0;">
					<font class="x_font_loading">loading...</font>
				</div>
			</td>
			</tr>
			
			</table>
			
		</div>

	</td>
	</tr>
	</table>
	
</td>

<td class="x_resizer_vertical"><div id="verticalResizer" onmousedown="coverContent();" onmouseup="disCoverContent();"></div></td>

<td>
	<div id="content" name="content" style="width:100%;height:100%;overflow:auto;">
		<iframe id="contentFrame" name="contentFrame" src="" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
	</div>
</td>

</tr>
</table>


<div id="contentCover" class="x_resizer_cover" style="position:absolute;top:0;left:0;display:none;z-index:10;">&nbsp;</div>



<script>
function systemMetadataManagement_manageMetaEntityTypes() {
	contentFrame.location.href = 'systemMetadataManagement!manageMetaEntityTypes.html';
}

function systemMetadataManagement_manageMetaEntityType(id) {
	contentFrame.location.href = 'systemMetadataManagement!manageMetaEntityType.html?metaEntityTypeId=' + id;
}

function systemMetadataManagement_manageEntityType(id) {
	contentFrame.location.href = 'systemMetadataManagement!manageEntityType.html?entityTypeId=' + id;
}

function refreshExplorer() {
	if($('tabEntityExplorer').className=='x_tab_on') {
		refreshEntityExplorer();
	} else {
		//refreshRelationshipExplorer();
	}
}

//┣┗┃1.	━
function refreshEntityExplorer() {

	Load.updater('entityContainer');

	J.json(
		'systemMetadataManagement!findMetaEntityTypeValueObjectsWithEntityTypes.html',
		'',
		function(o) {
			ctx.metaEntityTypeValueObjects = o;
			doRefreshEntityExplorer();
		}
	);
}

function doRefreshEntityExplorer() {
	
	Load.updater('entityContainer');

	var nameFilter = $F('nameFilter');
	var p = [];
	if(''==nameFilter 
		|| 
		(
			''!=nameFilter
			&&
			('MetaEntityTypes - 元实体类型').toUpperCase().indexOf(nameFilter.toUpperCase())>-1
		)
	) {
		p[p.length] = '<span class="item" onclick="systemMetadataManagement_manageMetaEntityTypes();" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);">MetaEntityTypes - 元实体类型</span>';
	}
	if(null!=ctx.metaEntityTypeValueObjects && ctx.metaEntityTypeValueObjects.length > 0) {
		var metaEntityTypeValueObject = null;
		var metaEntityType = null;
		var entityType = null;
		for(var i = 0; i < ctx.metaEntityTypeValueObjects.length; i++) {
		
			metaEntityTypeValueObject = ctx.metaEntityTypeValueObjects[i];
			
			metaEntityType = metaEntityTypeValueObject.metaEntityType;
			
			if(''==nameFilter 
				|| 
				(
					''!=nameFilter
					&&
					(((metaEntityType.code)?metaEntityType.code:'') + ' - ' + ((metaEntityType.name)?metaEntityType.name:'')).toUpperCase().indexOf(nameFilter.toUpperCase())>-1
				)
			) {
				p[p.length] = '<span class="item" onclick="systemMetadataManagement_manageMetaEntityType(' + metaEntityType.id + ');" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);"> &nbsp;' + ((i==ctx.metaEntityTypeValueObjects.length-1)?'┗':'┣') + '━  [ ' + ((metaEntityType.code)?metaEntityType.code:'') + ' - ' + ((metaEntityType.name)?metaEntityType.name:'') + ' ]</span>';
			}
			
			if(null!=metaEntityTypeValueObject.entityTypes && metaEntityTypeValueObject.entityTypes.length > 0) {
				for(var j = 0; j < metaEntityTypeValueObject.entityTypes.length; j++) {
					entityType = metaEntityTypeValueObject.entityTypes[j];
					if(''==nameFilter 
						|| 
						(
							''!=nameFilter
							&&
							(((entityType.code)?entityType.code:'') + ' - ' + ((entityType.name)?entityType.name:'')).toUpperCase().indexOf(nameFilter.toUpperCase())>-1						
						)
					) {
						p[p.length] = '<span class="item" onclick="systemMetadataManagement_manageEntityType(' + entityType.id + ');" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);"> &nbsp;' + ((i==ctx.metaEntityTypeValueObjects.length-1)?'&nbsp; &nbsp;':'┃') + ' &nbsp; ' + ((j==metaEntityTypeValueObject.entityTypes.length-1)?'┗':'┣') + '━ <img style="margin-bottom:-4px;" width="16" height="16" src="${base}/context/assets/business/' + entityType.icon + '.16.png" alt="' + entityType.icon + '" /> ' + ((entityType.code)?entityType.code:'') + ' - ' + ((entityType.name)?entityType.name:'') + '</span>';			
						//p[p.length] = '<span class="item" onclick="systemMetadataManagement_manageEntityType(' + entityType.id + ');" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);"> &nbsp;' + ((i==ctx.metaEntityTypeValueObjects.length-1)?'&nbsp; &nbsp;':'┃') + ' &nbsp; ' + ((j==metaEntityTypeValueObject.entityTypes.length-1)?'┗':'┣') + '━  ' + ((entityType.code)?entityType.code:'') + ' - ' + ((entityType.name)?entityType.name:'') + '</span>';
					}
				}
			}
		}
		metaEntityTypeValueObject = null;
		metaEntityType = null;
		entityType = null;
	}
	$('entityContainer').innerHTML = p.join('');
}

</script>

	

</body>
<script>
function onLoad() {
	XResizer.vertical('verticalResizer');
	//xTab($('tabEntityExplorer'));
	refreshEntityExplorer();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>

