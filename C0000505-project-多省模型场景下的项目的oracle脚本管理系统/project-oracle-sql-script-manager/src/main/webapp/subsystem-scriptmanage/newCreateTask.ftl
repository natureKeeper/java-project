<html>
<head>
<#include "/resource/extjs/include.ftl" />
<link rel="stylesheet" type="text/css" href="${base}/resource/system/theme/default/style/system-usersession.css"></link>
<#include "/subsystem-scriptmanage/systemMenuInclude.ftl" />

</head>
<div id="container">
</div>

<script>
// ctx是个object，主要用于记录页面之间传递的参数
var ctx = {
	userName:'${(userName)?if_exists?js_string}',
	user:{
		id:'${(user.id)?if_exists?js_string}',
		dept:'${(user.dept)?if_exists?js_string}',
		group:'${(user.group)?if_exists?js_string}'
	}
};
</script>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">
<script language="JavaScript" type="text/JavaScript">
var organizationPanel, userPanel, groupPanel, systemPanel;
var indexPanel = new Ext.Panel({
    title:'首页',
    closable:false,
    bodyStyle: 'padding:0px',
    html : '<IFRAME name="_indexPanelName" id="_indexPanelId" width="100%" height="100%" frameborder="0" scrolling="no" src="scriptCreateAction!index.html"></IFRAME>'
});
var contentPanel = new Ext.TabPanel({
	id:'_authorizationSystemIndexId',
    region:'center',
    activeTab:0,
	bodyBorder:false,
	enableTabScroll:true,
	autoScroll:true,
    items:[indexPanel]
});
var authorizationPanel = new Ext.Panel({
	title:'权限管理',
	frame:false,
	border:false,
	html : '<p id="_organizationManage" align="center"><a onClick="openOptionPanel(1);return false;"><br><img src ="resource/extjs/common/theme/default/image/organization.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">脚本上传</a></p>',
	width:200
});


var systemNoticePanel = new Ext.Panel({
	title:'系统公告',
	border:false,
	html:'<p id="_systemNotice" align="center"><a onClick="openOptionPanel(4);return false;"><br><img width="50" height="50" src ="resource/extjs/common/theme/default/image/notification.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">系统公告</p>'
});

function openOptionPanel(optionId){
	if(optionId == 1){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		organizationPanel = new Ext.Panel({
			title:'脚本上传',
			id:'_organizationManagePanel',
			closeable:false,
			border:false,
			bodyStyle: 'padding:0px',
			html : '<IFRAME name="_findOrganizationPanelName" id="_findOrganizationPanelId" width="100%" height="100%" frameborder="0" scrolling="no" src="scriptCreateAction!scriptUpdate.html"></IFRAME>'
		});
		contentPanel.add(organizationPanel).show();
		contentPanel.doLayout();
	}
	
}
var systemLayout = function(){
	var mainPanel,menuPanel;
    var accordionPanel;
    var isInited = false;
    return {
        init:function(){
    		this.createMenuPanel();
    		this.createOutlookBar();
    		Ext.onReady(function(){
    			systemLayout.createMainPanel();
    		});
            isInited = true;
        },
        createMainPanel:function(){
        	mainPanel = new Ext.Viewport({
                layout:'border',
                items:[contentPanel,mainTBarPanel,mainBBar,accordionPanel]
            });
        },
        createMenuPanel:function(){
        	menuPanel = new Ext.Panel({
                title:'权限管理',
                split:true,
            	collapseMode:'mini',
            	collapsed:false,
            	border:false,
                region:'west',
                width:170,
                layout:'fit'
            });
        },
        createOutlookBar : function(){
        	var accordionItem = [];
        	accordionItem[accordionItem.length] = authorizationPanel;
        	var activeItem = -1;
			Ext.each(accordionItem, function(item, index){
		        if (!item.disabled){
		        	activeItem = index;
		        	return false;
		        }
		    })
		    var collapsed = false;
			if(activeItem == -1)
				collapsed = true;
			accordionPanel = new Ext.Panel({
                region:'west',
                margins:'0 0 0 5',
                split:true,
                width: 170,
                layout:'accordion',
                collapsible: false,
                collapseMode:'mini',
                defaults: {
                    collapsed: collapsed
                },
                items: accordionItem,
                activeItem: activeItem
            });
        },
        getContentPanel:function(){
        	return contentPanel;
        },
        getIndexPanel:function(){
        	return indexPanel;
        },
        isInited:function(){
            return isInited;
        },
        getName:function(){
            return 'systemLayout';
        }
    }
}();
if(!systemLayout.isInited()){
	systemLayout.init();
}
</script>
</body>
<script>




function onLoad() {
	window.status = 'onLoad';
}
function onUnload() {
	window.status = 'onUnload';
}
</script>
</html>
