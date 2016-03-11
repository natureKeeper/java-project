<title>${action.getText("system.title")?default("platform")}</title>
<script>
var hexA0s = unescape(' %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0 %A0');
//hexA0s = hexA0s + hexA0s + hexA0s + hexA0s;
//hexA0s = hexA0s + hexA0s + hexA0s + hexA0s;
//hexA0s = hexA0s + hexA0s + hexA0s + hexA0s;
document.title = '${action.getText("system.title")?default("platform")}';// + hexA0s + hexA0s;
hexA0s = null;
var ctx = {
	user:{
		id:'${(user.id)?if_exists?js_string}',
		username:'${(user.username)?if_exists?js_string}',
		officePhone:'${(user.officePhone)?if_exists?js_string}',
		mobile:'${(user.mobile)?if_exists?js_string}'
	}
};
var deleteEntityTimeout = ${deleteEntityTimeout!0};
</script>
<meta http-equiv="Pragma" Content="No-cach"></meta>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
<!-- extjs -->
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/component/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/common/theme/default/style//ux-ext-all.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/common/theme/default/style/panel.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/common/theme/default/style/customer-dataview.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/common/theme/default/style/multiple-sorting.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/component/ux/fileuploadfield/css/fileuploadfield.css" />
<link rel="stylesheet" type="text/css"	href="${base}/resource/extjs/component/ux/css/Ext.ux.form.LovCombo.css" />
	<script type="text/javascript" src="${base}/resource/extjs/component/ext-base-debug.js"></script>
	<!--script type="text/javascript" src="${base}/resource/extjs/component/ext-all.js"></script-->
	<script type="text/javascript" src="${base}/resource/extjs/component/ext-all-debug.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/layout/tableformlayout.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/CheckColumn.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/public.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/vtype.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/common.js"></script>
	<script type="text/JavaScript" src="${base}/resource/extjs/component/ux/fileuploadfield/FileUploadField.js"></script>
	<script type="text/JavaScript" src="${base}/resource/extjs/component/ux/tab/AddTabButton.js"></script>	
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/FileUpload.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/ComboBox.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/Ext.ux.form.LovCombo.js"></script>
	<script type="text/JavaScript" src="${base}/resource/extjs/component/ux/ComboTree.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/DataViewTransition.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/Reorderer.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/component/ux/ToolbarReorderer.js"></script>
	<script type="text/javascript" src="${base}/resource/extjs/common/theme/default/script/gxlu-utilities.js"></script>
	<script type="text/javascript">
	Ext.BLANK_IMAGE_URL = '${base}/resource/extjs/component/resources/images/default/s.gif';
	</script>
<!-- common -->
<link rel="stylesheet" type="text/css" href="${base}/resource/extjs/common/theme/default/style/button.css" />
<link rel="stylesheet" type="text/css" href="${base}/resource/extjs/common/theme/default/style/lee-ext-all.css"></link>


	<!--script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/common/script/prototype.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/common/script/commons.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/common/script/support.js"></script>
	
<link rel="stylesheet" type="text/css" href="${base}/resource/prototype/component/theme/default/style/index.css"></link>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xtree.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xloadtree.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xmlextras.js"></script>
	
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xform.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xcalendar.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xlist.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xpagination.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xresizer.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xtab.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xbutton.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/prototype/component/script/xsuggest.js"></script-->	

