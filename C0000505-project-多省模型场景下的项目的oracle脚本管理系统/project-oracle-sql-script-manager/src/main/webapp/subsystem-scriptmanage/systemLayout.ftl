<html>
<head>
<#include "/resource/extjs/include.ftl" />
<link rel="stylesheet" type="text/css" href="${base}/resource/system/theme/default/style/system-usersession.css"></link>
<#include "/business/system/systemMenuInclude.ftl" />

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
    html : '<IFRAME name="_indexPanelName" id="_indexPanelId" width="100%" height="100%" frameborder="0" scrolling="no" src="systemManageNavigation!index.html"></IFRAME>'
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
	html : '<p id="_organizationManage" align="center"><a onClick="openOptionPanel(1);return false;"><br><img src ="resource/extjs/common/theme/default/image/organization.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">组织机构管理</a></p>'+
	'<br />'+
	'<p id="_userManage" align="center"><a onClick="openOptionPanel(2);return false;"><img src ="resource/extjs/common/theme/default/image/user.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">用户管理</a></p>'+
	'<br />'+
	'<p id="_roleManage" align="center"><a onClick="openOptionPanel(3);return false;"><img src ="resource/extjs/common/theme/default/image/group.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">角色管理</a></p>'+
	'<br />'+
	'<p id="_passwordManage" align="center"><a onClick="openOptionPanel(14);return false;"><img src ="resource/extjs/common/theme/default/image/security.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">安全策略管理</a></p>'+
	'<br />'+
	'<p id="_passwordManage" align="center"><a onClick="openOptionPanel(17);return false;"><img src ="resource/extjs/common/theme/default/image/notification.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">常用联系人</a></p>',
	width:200
});
var logPanel = new Ext.Panel({
    title: '日志管理',
    border:false,
    autoScroll:true,
    html : '<p id="_logManage1" align="center"><a onClick="openOptionPanel(5);return false;"><br><img src ="resource/extjs/common/theme/default/image/log1.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">用户登录日志</a></p>'+
	'<br />'+
	'<p id="_logManage2" align="center"><a onClick="openOptionPanel(6);return false;"><img src ="resource/extjs/common/theme/default/image/log2.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">资源维护日志</a></p>'+
	'<br />'+
	'<p id="_logManage4" align="center"><a onClick="openOptionPanel(8);return false;"><img src="resource/extjs/common/theme/default/image/log4.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">数据导入日志</a></p>'+
	'<br />'+
	'<p id="_logManage5" align="center"><a onClick="openOptionPanel(9);return false;"><img src="resource/extjs/common/theme/default/image/log5.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">接口日志</a></p>'+
	'<br />'+
	'<p id="_logManage7" align="center"><a onClick="openOptionPanel(11);return false;"><img src="resource/extjs/common/theme/default/image/log3.png" style="cursor:pointer"></p><p align="center" style="cursor:pointer">审计日志</a></p>'+
	'<br />'+
	'<p id="_logManage8" align="center"><a onClick="openOptionPanel(16);return false;"><img src="resource/extjs/common/theme/default/image/log3.png" style="cursor:pointer"></p><p align="center" style="cursor:pointer">用户点击率</a></p>',
	
	width:200
});

//'<br />'+
	//'<p id="_logManage3" align="center"><a onClick="openOptionPanel(7);return false;"><img src ="resource/extjs/common/theme/default/image/log3.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">系统维护日志</a></p>'+
//'<p id="_logManage5" align="center"><a onClick="openOptionPanel(9);return false;"><img src="resource/extjs/common/theme/default/image/log5.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">接口日志</a></p>'+
	//'<br />'+
	//'<p id="_logManage6" align="center"><a onClick="openOptionPanel(10);return false;"><img src="resource/extjs/common/theme/default/image/log6.png" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">后台服务日志</a></p>'+
	//'<br />'+
var systemSetPanel = new Ext.Panel({
    title: '系统设置',
    border:false,
    html : '<p id="_systemSet" align="center"><a onClick="openOptionPanel(12);return false;"><br><img width="50" height="50" src ="resource/extjs/common/theme/default/image/SystemSet.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">系统设置</p>'+
    '<br />'+
    '<p id="_systemSet2" align="center"><a onClick="openOptionPanel(15);return false;"><br><img width="50" height="50" src ="resource/extjs/common/theme/default/image/SystemSet.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">流程参数设置</p>'
});
var systemNoticePanel = new Ext.Panel({
	title:'系统公告',
	border:false,
	html:'<p id="_systemNotice" align="center"><a onClick="openOptionPanel(4);return false;"><br><img width="50" height="50" src ="resource/extjs/common/theme/default/image/notification.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">系统公告</p>'
});
var ftpPanel = new Ext.Panel({
	title:'Ftp下载',
	border:false,
	html:'<p id="_systemNotice" align="center"><a onClick="openOptionPanel(13);return false;"><br><img width="50" height="50" src ="resource/extjs/common/theme/default/image/notification.jpg" style= "cursor:pointer"></p><p align="center" style= "cursor:pointer">Ftp文件下载</p>'
});
function openOptionPanel(optionId){
	if(optionId == 1){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		organizationPanel = new Ext.Panel({
			title:'组织机构列表',
			id:'_organizationManagePanel',
			closeable:false,
			border:false,
			bodyStyle: 'padding:0px',
			html : '<IFRAME name="_findOrganizationPanelName" id="_findOrganizationPanelId" width="100%" height="100%" frameborder="0" scrolling="no" src="systemOrganizationManagement!findMainOrganization.html"></IFRAME>'
		});
		contentPanel.add(organizationPanel).show();
		contentPanel.doLayout();
	}else if (optionId == 2){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		userPanel = new Ext.Panel({
			title:'用户列表',
			id:'_userManagePanel',
			closeable:false,
			border:false,
			bodyStyle: 'padding:0px',
			html : '<IFRAME name="_findUserPanel" id="_findUserPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemUserManagement!findMainUser.html"></IFRAME>'
		});
		contentPanel.add(userPanel).show();
		contentPanel.doLayout();
	}else if (optionId == 3){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		groupPanel = new Ext.Panel({
			title:'角色列表',
			id:'_roleManagePanel',
			closeable:false,
			border:false,
			bodyStyle: 'padding:0px',
			html : '<IFRAME name="_findGroupPanel" id="_findGroupPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemGroupManagement!findMainGroup.html"></IFRAME>'
		});
		contentPanel.add(groupPanel).show();
		contentPanel.doLayout();
	}else if (optionId == 4){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		systemPanel = new Ext.Panel({
			title:'系统公告列表',
			id:'_systemNoticePanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findSystemNoticePanel" id="_findSystemNoticePanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemNoticeManagement!findSystemNotice.html"></IFRAME>'
		});
		contentPanel.add(systemPanel).show();
		contentPanel.doLayout();
	}else if (optionId == 5){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		userLoginLogpanel = new Ext.Panel({
			title:'用户登录日志',
			id:'_findUserLoginLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findUserLoginLogpanel" id="_findUserLoginLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findUserLoginLogpanel.html"></IFRAME>'
		});
		contentPanel.add(userLoginLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 6){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		var panel1 = new Ext.Panel({
			region:'center',
			bodyStyle:'padding:0px',
			border: false,
			html:'<IFRAME name="_findResourceLogpanel" id="_findResourceLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findResourceLogpanel.html"></IFRAME>'
		});
		var panel2 = new Ext.Panel({
			region:'center',
			bodyStyle:'padding:0px',
			border: false,
			html:'<IFRAME name="_findResourceLogHistoryPanel" id="_findResourceLogHistoryPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findResourceLogHistorypanel.html"></IFRAME>'
		});
		var tabPanel1 = new Ext.Panel({
			title: '资源维护当前日志',
			autoScroll:true,
			height:800,
			layout:'border',
			border: false,
			items:[panel1]
		});
		
		var tabPanel2 = new Ext.Panel({
			title: '资源维护历史日志',
			autoScroll:true,
			height:800,
			layout:'border',
			border: false,
			items:[panel2]
		});
		
		resourceLogpanel = new Ext.TabPanel({
			id:'_findResourceLogpanel',
			title:'资源维护日志',
		    deferredRender:false,
		    margins:'0 0 0 5',
		    layoutConfig:{
		        animate:true
		    },
		    activeTab:0,
		    height:'100',
		    enableTabScroll:true,
		    autoScroll:true,
		    listeners:{
		    	remove: function(tp, c){
		    		c.hide();
		    	}
		    },
		    autoDestroy: false,
		    items:[tabPanel1,tabPanel2]
		});
//		resourceLogpanel = new Ext.Panel({
//			title:'资源维护日志',
//			id:'_findResourceLogpanel',
//			closeable:false,
//			border:false,
//			bodyStyle:'padding:0px',
//			html:'<IFRAME name="_findResourceLogpanel" id="_findResourceLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findResourceLogpanel.html"></IFRAME>'
//		});
		contentPanel.add(resourceLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 7){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		systemLogpanel = new Ext.Panel({
			title:'系统维护日志',
			id:'_findSystemLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findSystemLogpanel" id="_findSystemLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findSystemLogpanel.html"></IFRAME>'
		});
		contentPanel.add(systemLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 8){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		dataImportLogpanel = new Ext.Panel({
			title:'数据导入日志',
			id:'_findDataImportLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findDataImportLogpanel" id="_findDataImportLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findDataImportLogpanel.html"></IFRAME>'
		});
		contentPanel.add(dataImportLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 9){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		interfaceLogpanel = new Ext.Panel({
			title:'接口日志',
			id:'_findInterfaceLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findInterfaceLogpanel" id="_findInterfaceLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findInterfaceLogpanel.html"></IFRAME>'
		});
		contentPanel.add(interfaceLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 10){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		serviceLogpanel = new Ext.Panel({
			title:'后台服务日志',
			id:'_findServiceLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
		html:'<IFRAME name="_findServiceLogpanel" id="_findServiceLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findServiceLogpanel.html"></IFRAME>'
		});
		contentPanel.add(serviceLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 11){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		auditLogpanel = new Ext.Panel({
			title:'审计日志',
			id:'_findAuditLogpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findAuditLogpanel" id="_findAuditLogpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findAuditLogpanel.html"></IFRAME>'
		});
		contentPanel.add(auditLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 16){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		clickPanel = new Ext.Panel({
			title:'用户点击率',
			id:'_findclickpanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findclickpanel" id="_findclickpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemLogManagement!findSystemAccessStatisticsPanel.html"></IFRAME>'
		});
		contentPanel.add(clickPanel).show();
		contentPanel.doLayout();
	}else if (optionId == 12){
		var url = 'systemSetManagement!isCheck.html';
		var paramObj = {};
		ajaxRequest(url,paramObj, function(parseObj) {
			if (parseObj.resultCode == '0') {
				Ext.Msg.alert('错误', parseObj.resultText);
			}else{
				contentPanel.removeAll(true);
				contentPanel.doLayout();
				systemSetpanel = new Ext.Panel({
					title:'系统设置',
					id:'_findSystemSetpanel',
					closeable:false,
					border:false,
					bodyStyle:'padding:0px',
					html:'<IFRAME name="_findSystemSetpanel" id="_findSystemSetpanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemSetManagement!systemSet.html"></IFRAME>'
				});
				contentPanel.add(systemSetpanel).show();
				contentPanel.doLayout();
			}
	    });
		
	}else if (optionId == 15){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		var serviceParameterPanel = new Ext.Panel({
			title:'流程参数设置',
			id:'_serviceParameterPanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_serviceParameterPanel" id="_serviceParameterPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="serviceParameter!gridPage.html"></IFRAME>'
		});
		contentPanel.add(serviceParameterPanel).show();
		contentPanel.doLayout();
		
	}else if (optionId == 14){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		securityPolicypanel = new Ext.Panel({
			title:'安全策略列表',
			id:'_findSecurityPolicyPanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_findSecurityPolicyPanel" id="_findSecurityPolicyPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="securityPolicyManagement!findSecurityPolicyPanel.html"></IFRAME>'
		});
		contentPanel.add(securityPolicypanel).show();
		contentPanel.doLayout();		
	}else if (optionId == 13){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		auditLogpanel = new Ext.Panel({
			title:'Ftp下载',
			id:'ftpPanel',
			closeable:false,
			border:false,
			bodyStyle:'padding:0px',
			html:'<IFRAME name="_ftpPanel" id="_ftpPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="ftp.html"></IFRAME>'
		});
		contentPanel.add(auditLogpanel).show();
		contentPanel.doLayout();
	}else if (optionId == 17){
		contentPanel.removeAll(true);
		contentPanel.doLayout();
		userPanel = new Ext.Panel({
			title:'常用联系人',
			id:'_userManagePanel',
			closeable:false,
			border:false,
			bodyStyle: 'padding:0px',
			html : '<IFRAME name="_findUserPanel" id="_findUserPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="systemUserManagement!findCommonUser.html"></IFRAME>'
		});
		contentPanel.add(userPanel).show();
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
        	accordionItem[accordionItem.length] = logPanel;
        	accordionItem[accordionItem.length] = systemSetPanel;
        	accordionItem[accordionItem.length] = systemNoticePanel;
        	accordionItem[accordionItem.length] = ftpPanel;
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
