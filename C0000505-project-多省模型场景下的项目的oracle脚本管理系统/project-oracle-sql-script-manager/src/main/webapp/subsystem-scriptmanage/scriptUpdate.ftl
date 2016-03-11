<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">

<!-- extjs -->
<#include "/resource/extjs/include.ftl" />
<link rel="stylesheet" type="text/css" href="${base}/resource/system/theme/default/style/system-usersession.css"></link>
<link rel="stylesheet" type="text/css" href="${base}/resource/extjs/common/theme/default/style/xwt-default.css"></link>
<link rel="stylesheet" type="text/css" href="${base}/resource/business/authorization/style/icon.css" />


<script language="JavaScript" type="text/JavaScript">

var createGroup = function(){
var field_baseCreateGroup_1, field_baseCreateGroup_2,check,defaultBranchCombobox,defaultHeadCombobox,shanghaiBranchCombobox,shanghaiHeadCombobox; // [基本信息\备注信息\选择专业]
var formPanel, totailPanel,createFromCheckbox,createFromCbx_cbbx;
var isInited = false;

return {
	init:function(){
	this.createFromCheckbox();
	this.createFromCbx_cbbx();
	Ext.QuickTips.init();
	this.createBaseFieldSet();
	this.createFormPanel();
	this.createGroupMainPanel();
	
	Ext.onReady(function(){
 

	return new Ext.Viewport({
	layout:'fit',
	items:[totailPanel]
	});
	});
	isInited = true;
},

	createBaseFieldSet:function(){
		
	 check =  new Ext.form.FieldSet({
                    title: "执行环境与时间",
                    height: 200	,
                    id:'check',
                    layout: 'anchor',
                    items: []
                });
	
	field_baseCreateGroup_0 = new Ext.form.FieldSet({
	id :'field_baseCreateGroup_0',
	title : '注意事项',   
	autoHeight : true,   
	defaultType : 'checkboxfield',
	layout:'tableform',
	layoutConfig:{
	columns:1,
	border:false,
	baseCls : 'x-plain'
	},
	defaults : {
	anchor : '97%'  
	},   
	items : [
	{
       xtype: 'label',
        forId: 'myFieldId',
        html:'<font color="red">注意MR系统中如果是自己创建的MR，要把MR的报告人改为QA人员，否则QA人员不会发布这个MR的相关脚本</font>'

	}
	]   
	}); 

		
	field_baseCreateGroup_1 = new Ext.form.FieldSet({
	id :'field_baseCreateGroup_1',
	title : '基础信息',   
	autoHeight : true,   
	//defaultType : 'textfield',
	layout:'tableform',
	layoutConfig:{
	columns:2,
	border:false,
	baseCls : 'x-plain'
	},
	defaults : {
	anchor : '93%'  
	},   
	items : [
	{   
	xtype:'textfield',
	allowBlank : false,
	maxLength : 50,
	fieldLabel: '任务名称',   
	name:'name'
	},{   
	xtype:'textfield',
	maxLength : 50,
	fieldLabel: '所属MR编号',   
	name:'code'  
	},{  
	xtype:'textarea',
	maxLength : 30,
	fieldLabel: '任务描述',   
	name:'alias' 
	},{
	  	   xtype: 'label',
        forId: 'myFieldId',
        html:'<font color="red">注意MR系统中如果是自己创建的MR，要把MR的报告人改为QA人员，否则QA人员不会发布这个MR的相关脚本</font>'

	}
	]   
	});
	
	field_fieldSet_checkBox=new Ext.form.FieldSet({
		id :'field_fieldSet_checkBox',
		title : '最终发布省份',  
		items : [{
			xtype:'checkbox',
			boxLabel  : '全选',
			name:'allDestinationsCheck',
			inputValue: '3',
			id:'allDestinationsCheck',
			handler: function(){
			var array = Ext.getCmp('user_add_checkboxgroup').items;
			array.each(function(item){
			if(allDestinationsCheck.checked==true){
				item.setValue(allDestinationsCheck.checked);
			}else{
				item.setValue(allDestinationsCheck.checked);
			}
			});
			} 
			}]
	});
	field_baseCreateGroup_2 = new Ext.form.FieldSet({
	id :'field_baseCreateGroup_2',
	title : '请添加第1个脚本',   
	items : [
	{
	xtype:'textfield',
	maxLength : 100,
	fieldLabel: '脚本名称',   
	name:'text1'  
	},{
            xtype: 'radiogroup',
            fieldLabel: '脚本类别',
            cls: 'x-check-group-alt',
            items: [
                {boxLabel: '数据定义DDL(表结构修改等)', name: 'radio2', inputValue: 1},
                {boxLabel: '数据操作DML(数据增删改)', name: 'radio2', inputValue: 2, checked: true},
                {boxLabel: '存储过程PROC(begin语句块,过程等)', name: 'radio2', inputValue: 3}
      
            ]
        },{
      xtype: 'fileuploadfield',
    id: 'upfile1',
    fieldLabel: '系统文件',
    buttonText: '浏览...',
    emptyText: '请选择系统文件',
    labelStyle: 'text-align:right;width:70;',
    width: 100,
    name: 'upfile1',
    validateOnBlur: true,
    anchor: '50%'
    }
	]   
	}); 
},

createFromCbx_cbbx:function(){
//执行环境与时间的控件加载
Ext.Ajax.request({
	url: 'scriptCreateAction!getEnvironment.html',
	callback: function(options,success,response){
		if(success = true){
        	var obj = eval( "(" + response.responseText + ")" );
        	//拼接checkbox子项目
        	var checkboxitems="";
	
        	for(var i = 0;i<obj.ems.length;i++){

        			checkboxitems = "[";
                var groupid = obj.ems[i].id;
			var checkboxSingleItem = "{xtype:'checkbox',boxLabel:'"+obj.ems[i].name+"',name:'taskEnvironment',id:'taskEnvironment',inputValue:'"+obj.ems[i].id+"'";
			
			
         var combobox="new Ext.form.ComboBox({store: [['1','手工或开新分支时执行'],['2','立即执行'],['3','耗时脚本在深夜执行'],['4','不执行']],editable:false,id:'defaultBranchCbx"+obj.ems[i].id+"',name:'defaultBranchCbx"+obj.ems[i].id+"',hideTrigger:false})"
		
				checkboxSingleItem+="},"+combobox;
    			checkboxitems+=checkboxSingleItem;
    		checkboxitems+="]";
        	var add_cbbx_checkboxgroup = new Ext.form.CheckboxGroup({
    			name:'add_cbbx_checkboxgroup'+obj.ems[i].id,
    			id:'add_cbbx_checkboxgroup'+obj.ems[i].id,
          		columnWidth: .25,
      			cls: 'x-check-group-alt',
        	    items:eval(checkboxitems)
        	});
        	
        		check.add(add_cbbx_checkboxgroup);
        	 	check.doLayout();
            }
 
       

		} else {
			Ext.MessageBox.alert('信息提示',"加载权限失败");
		}
	}
});




},

 createFromCheckbox:function(){
 //最终发布身份的控件加载
 //动态加载发布省份控件
 Ext.Ajax.request({
	url: 'scriptCreateAction!getDestination.html',
	callback: function(options,success,response){
		if(success = true){
        	var obj = eval( "(" + response.responseText + ")" );
        	//拼接checkbox子项目
        	var checkboxitems="";
        	for(var i = 0;i<obj.dnn.length;i++){
        		if(checkboxitems!="")
        			checkboxitems+=",";
        		else
        			checkboxitems+="[";
                var groupid = obj.dnn[i].id;
    			var checkboxSingleItem = "{boxLabel:'"+obj.dnn[i].name+"',name:'"+obj.dnn[i].name+"',id:'"+obj.dnn[i].id+"',inputValue:'"+obj.dnn[i].id+"'";	                

    			checkboxSingleItem+="}";
//                	alert(checkboxSingleItem);
    			checkboxitems+=checkboxSingleItem;
            }
        	checkboxitems+="]";
//	        	alert(checkboxitems);
        	var itemsGroup = new Ext.form.CheckboxGroup({
    			name:'user_add_checkboxgroup',
    			id:'user_add_checkboxgroup',
        	    name:'items',
        	    items:eval(checkboxitems)
        	});

        	field_fieldSet_checkBox.add(itemsGroup);
        	field_fieldSet_checkBox.doLayout();

		} else {
			Ext.MessageBox.alert('信息提示',"加载权限失败");
		}
	}
});
 
 },

	createFormPanel:function(){
	
	formPanel = new Ext.FormPanel({
	id: '_createGroupFormPanel',
	title : '提交任务',
	region:'center',
	labelAlign: 'right',
	autoScroll:true,
	bodyStyle:'padding:5px 5px 5px 5px;border:0;background-color:#D5E2F2;',
	items : [field_baseCreateGroup_0,field_baseCreateGroup_1,field_fieldSet_checkBox,check,field_baseCreateGroup_2,
	  {
   xtype : 'panel',
   layout : 'form',
   defaultType : 'textfield',
   items : [ repFileNumber = new Ext.form.Field({
    inputType : 'hidden',
    name : 'repFileNumber',
    value : 2
   }), repFileDelete = new Ext.form.Field({
    inputType : 'hidden',
    name : 'repFileDelete'
   }) ]
  }
	],
	buttonAlign:'center',
	buttons: [
	{
	id:'_doCreateGroup',
	text : '保存',
	iconCls : 'fam_save',
	handler : function() {
	//保存
	}
	},{
	id:'_doCreateClearGroup',
	text : '清空',
	columnWidth : .20,
	iconCls : 'button_empty',
	handler : function() {
	formPanel.getForm().reset();
	}
	},
	{
	id:'addButtonjs',
	text : '追加脚本',
	iconCls : 'fam_save',
	handler : function(){
	 // 如果没有PDM，则隐藏单选框的那一行
 var number = repFileNumber.getValue();
 var fileName = 'text' + number;
 var radioName='radio'+number;
 var addfieldSetName='addfieldSet'+number;
 var upfileName='upfile'+number;
 repFileNumber.setValue(parseInt(number) + 1);
 var lText = '<a href="#" onclick="deleteInputAddEdit(\'' + fileName
   + '\')">删除</a>&nbsp;&nbsp;';
  
  var lText='请添加第'+number+'个脚本';
 field_baseCreateGroup_2.add(new Ext.form.FieldSet({
  		title: lText,
        id:addfieldSetName,
  		items : [{
	xtype:'textfield',
	maxLength : 100,
	fieldLabel: '脚本名称',   
	name:fileName  
	},{
            xtype: 'radiogroup',
            fieldLabel: '脚本类别',
            cls: 'x-check-group-alt',
            items: [
                {boxLabel: '数据定义DDL(表结构修改等)', name: radioName, inputValue: 1},
                {boxLabel: '数据操作DML(数据增删改)', name:radioName, inputValue: 2, checked: true},
                {boxLabel: '存储过程PROC(begin语句块,过程等)', name: radioName, inputValue: 3}
      
            ]
        },{
      xtype: 'fileuploadfield',
    id: upfileName,
    fieldLabel: '系统文件',
    buttonText: '浏览...',
    emptyText: '请选择系统文件',
    labelStyle: 'text-align:right;width:70;',
    width: 100,
    name: upfileName,
    validateOnBlur: true,
    anchor: '50%'
    }]
 }));
 field_baseCreateGroup_2.doLayout();
	}
	},
	{
	id:'delButtonjs',
	text : '删除脚本',
	iconCls : 'button_empty',
	handler : function() {
	
	
	var num=repFileNumber.getValue()-1;
	var removee=Ext.getCmp('addfieldSet'+num);
	field_baseCreateGroup_2.remove(removee);
	// removee.setVisible(false);
	if(num<2){
	 repFileNumber.setValue(2);
	}else{
	 repFileNumber.setValue(num);
	}
	
	 field_baseCreateGroup_2.doLayout();
	
	}
	}
	]
	});
},

	createGroupMainPanel:function(){
	
	totailPanel = new Ext.TabPanel({
	closable:true,
	border:false,
	activeTab:0,
	bodyStyle:'padding:5px 5px 5px 5px;border:0;background-color:#D5E2F2;',
	items:[formPanel]
	});
},
getFormPanel:function(){
return formPanel;
},
isInited:function(){
return isInited;
}
}
}();
if(!createGroup.isInited()){
createGroup.init();
}


</script>
</head>
</html>