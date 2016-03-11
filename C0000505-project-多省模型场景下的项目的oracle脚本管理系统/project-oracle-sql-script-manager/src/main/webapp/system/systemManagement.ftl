<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">


<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">

<tr>
<td class="x_tab_separator_container x_tab_container_background">

	<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">
	<tr>
	<td class="x_tab_first">&nbsp;</td>
	<td nowrap="true" valign="bottom"><span
	 class="x_tab" id="tabCacheManagement" content="contentCacheManagement" onclick="onTabClick(this);" url="systemCacheManagement.html" loaded="false"><span class="x_tab_text">Cache</span></span><span
	 class="x_tab" id="tabDictionaryManagement" content="contentDictionaryManagement" onclick="onTabClick(this);" url="systemDictionaryManagement.html" loaded="false"><span class="x_tab_text">Dictionary</span></span><span
	 class="x_tab" id="tabMetadataManagement" content="contentMetadataManagement" onclick="onTabClick(this);" url="systemMetadataManagement.html" loaded="false"><span class="x_tab_text">Metadata</span></span><span
	 class="x_tab" id="tabTermModelManagement" content="contentTermModelManagement" onclick="onTabClick(this);" url="businessMetadataManagement.html" loaded="false"><span class="x_tab_text">TermModel</span></span><span
	 class="x_tab" id="tabAuditLogManagement" content="contentAuditLogManagement" onclick="onTabClick(this);" url="systemAuditLogManagement.html" loaded="false"><span class="x_tab_text">AuditLog</span></span></td>
	<td class="x_tab_last" align="right">&nbsp;<input class="icon_btn_main" onclick="self.location.href='main.html';" type="button" title="Back to Main" />&nbsp;</td>
	</tr>
	<tr><td colspan="3" class="x_tab_separator"></td></tr>
	</table>
	
</td>
</tr>

<tr>
<td>

	<div id="contentCacheManagement" style="display:none;"></div>
	<div id="contentDictionaryManagement" style="display:none;"></div>
	<div id="contentMetadataManagement" style="display:none;"></div>
	<div id="contentTermModelManagement" style="display:none;"></div>
	<div id="contentSupportModelManagement" style="display:none;"></div>
	<div id="contentAuditLogManagement" style="display:none;"></div>

</td>
</tr>
</table>


<script>
function loadContent(the) {
	//alert(the.url);
	if('false'==the.loaded) {
		var frameId = 'frame' + the.content;
		$(the.content).innerHTML = '<iframe id="' + frameId + '" height="100%" width="100%" frameborder="0"></iframe>';
		eval('window.frames.' + frameId + '.location.href = \'' + the.url + '\';');
		the.loaded = 'true';
	}
}

function onTabClick(the) {
	loadContent(the);
	xTab(the);
}
</script>

</body>
<script>
function onLoad() {
	onTabClick($('tabCacheManagement'));
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>

