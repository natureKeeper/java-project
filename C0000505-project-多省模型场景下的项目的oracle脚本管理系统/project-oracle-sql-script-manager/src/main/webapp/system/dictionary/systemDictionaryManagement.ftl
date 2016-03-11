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
	metaDictionaryTypeValueObjects:[]
};
</script>



</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

<tr>
<td style="width:35%;">

	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

	<tr>
	<td class="x_tab_separator_container x_tab_container_background">
	
		<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
		<tr>
		<td class="x_tab_first">&nbsp;</td>
		<td nowrap="true" valign="bottom"><span
		 class="x_tab_on" id="tabDictionaryExplorer" content="contentDictionaryExplorer" onclick="xTab(this);"><span class="x_tab_text_on">Dictionary</span></span><span
		 class="x_tab" id="tabCascadeExplorer" content="contentCascadeExplorer" onclick="xTab(this);"><span class="x_tab_text">Cascade</span></span></td>
		<td class="x_tab_last" align="right">&nbsp;<input class="icon_btn_refresh" onclick="refreshDictionaryExplorer();" type="button" title="Refresh" />&nbsp;</td>
		</tr>
		<tr><td colspan="3" class="x_tab_separator"></td></tr>
		</table>
		
	</td>
	</tr>
	
	<tr>
	<td>
	
		<!-- div id="contentDictionaryExplorer" style="display:block;">
			<div style="width:100%;height:100%;overflow:auto;padding:2;margin-top:0;">
				<script>
				var nodeTree = new WebFXLoadTree('模型', 'systemDictionaryManagement!findMetaDictionaryTypes.html');
				document.write(nodeTree);
				</script>
			</div>
		</div -->
		
		<div id="contentDictionaryExplorer" style="display:none;">
			
			<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0">
			
			<!-- tr>
			<td style="width:99%;height:20;padding-left:2;padding-right:0;"><input id="nameFilter" name="nameFilter" class="x_text" onkeyup="filterDictionaryExplorer();" /></td>
			<td style="width:20;padding-left:0;padding-right:2;"><input type="button" class="x_reference_btn" /></td>
			</tr  colspan="2"-->
			
			<tr>
			<td class="x_criteria_bar" style="height:24;padding-left:3;padding-right:3;"><input style="height:19;" id="nameFilter" name="nameFilter" class="x_text" onkeyup="doRefreshDictionaryExplorer();" /></td>
			</tr>
			
			<tr>
			<td>
				<div id="itemContainer" style="width:100%;height:100%;overflow:auto;padding-left:2;padding-right:2;margin-top:0;">
					<font class="x_font_loading">loading...</font>
				</div>
			</td>
			</tr>
			
			</table>
			
		</div>
		
		<div id="contentCascadeExplorer" style="display:none;">
		
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
function systemDictionaryManagement_manageMetaDictionaryTypes() {
	contentFrame.location.href = 'systemDictionaryManagement!manageMetaDictionaryTypes.html';
}

function systemDictionaryManagement_manageMetaDictionaryType(id) {
	contentFrame.location.href = 'systemDictionaryManagement!manageMetaDictionaryType.html?metaDictionaryTypeId=' + id;
}

function systemDictionaryManagement_manageDictionaryType(id) {
	contentFrame.location.href = 'systemDictionaryManagement!manageDictionaryType.html?dictionaryTypeId=' + id;
}

function refreshExplorer() {
	if($('tabDictionaryExplorer').className=='x_tab_on') {
		refreshDictionaryExplorer();
	} else {
	
	}
}

//┣┗┃1.	━
function refreshDictionaryExplorer() {
	Load.updater('itemContainer');
	J.json(
		'systemDictionaryManagement!findMetaDictionaryTypeValueObjects.html',
		'',
		function(o) {
			ctx.metaDictionaryTypeValueObjects = o;
			//alert(ctx.metaDictionaryTypeValueObjects);
			doRefreshDictionaryExplorer();
		}
	);
}

function doRefreshDictionaryExplorer() {
	
	Load.updater('itemContainer');
	
	var nameFilter = $F('nameFilter');
	var p = [];
	if(''==nameFilter 
		|| 
		(
			''!=nameFilter
			&&
			('MetaDictionaryType 元字典类型').toUpperCase().indexOf(nameFilter.toUpperCase())>-1
		)
	) {
		p[p.length] = '<span class="item" onclick="systemDictionaryManagement_manageMetaDictionaryTypes();" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);">MetaDictionaryType 元字典类型</span>';
	}
	if(null!=ctx.metaDictionaryTypeValueObjects && ctx.metaDictionaryTypeValueObjects.length > 0) {
		var metaDictionaryTypeValueObject = null;
		var metaDictionaryType = null;
		var dictionaryType = null;
		for(var i = 0; i < ctx.metaDictionaryTypeValueObjects.length; i++) {
			metaDictionaryTypeValueObject = ctx.metaDictionaryTypeValueObjects[i];
			metaDictionaryType = metaDictionaryTypeValueObject.metaDictionaryType;
			if(''==nameFilter 
				|| 
				(
					''!=nameFilter
					&&
					(((null!=metaDictionaryType.code)?metaDictionaryType.code:'') + ' - ' + ((null!=metaDictionaryType.name)?metaDictionaryType.name:'')).toUpperCase().indexOf(nameFilter.toUpperCase())>-1
				)
			) {
				p[p.length] = '<span class="item" onclick="systemDictionaryManagement_manageMetaDictionaryType(' + metaDictionaryType.id + ');" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);"> &nbsp;' + ((i==ctx.metaDictionaryTypeValueObjects.length-1)?'┗':'┣') + '━  [ ' + ((null!=metaDictionaryType.code)?metaDictionaryType.code:'') + ' - ' + ((null!=metaDictionaryType.name)?metaDictionaryType.name:'') + ' ]</span>';
			}
			if(null!=metaDictionaryTypeValueObject.dictionaryTypes && metaDictionaryTypeValueObject.dictionaryTypes.length>0) {
				for(var j = 0; j < metaDictionaryTypeValueObject.dictionaryTypes.length; j++) {
					dictionaryType = metaDictionaryTypeValueObject.dictionaryTypes[j];
					if(''==nameFilter 
						|| 
						(
							''!=nameFilter
							&&
							(((null!=dictionaryType.code)?dictionaryType.code:'') + ' - ' + ((null!=dictionaryType.name)?dictionaryType.name:'')).toUpperCase().indexOf(nameFilter.toUpperCase())>-1						
						)
					) {
						p[p.length] = '<span class="item" onclick="systemDictionaryManagement_manageDictionaryType(' + dictionaryType.id + ');" onmouseover="onItemOver(this);" onmouseout="onItemOut(this);" onmousedown="onItemDown(this);" onmouseup="onItemUp(this);"> &nbsp;' + ((i==ctx.metaDictionaryTypeValueObjects.length-1)?'&nbsp; ':'┃') + '&nbsp; &nbsp; ' + ((j==metaDictionaryTypeValueObject.dictionaryTypes.length-1)?'┗':'┣') + '━ ' + ((null!=dictionaryType.code)?dictionaryType.code:'') + ' - ' + ((null!=dictionaryType.name)?dictionaryType.name:'') + '</span>';			
					}
				}
			}			
		}
		metaDictionaryTypeValueObject = null;
		metaDictionaryType = null;
		dictionaryType = null;
	}
	$('itemContainer').innerHTML = p.join('');
}

</script>



</body>
<script>
function onLoad() {
	XResizer.vertical('verticalResizer');
	xTab($('tabDictionaryExplorer'));
	refreshDictionaryExplorer();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>

