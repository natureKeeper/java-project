
var xxxDataGrid = function() {

	var dataStore, 
		mainPanel,
		toolbarPanel,
		criteriaPanel,
		ridPanel,
		columnModel,
		pagingToolbar;

	var selectionModel = new Ext.grid.CheckboxSelectionModel();

	var isInited = false;

	var margins = '0 0 0 0';
	
	return {
		init: function() {
			this.createCriteriaPanel();
			this.createDataGird();
			this.createQueryPanel();
			this.createMainPanel();
		
			isInited = true;
		},
		
		
		createCriteriaPanel: function() {
			criteriaPanel = new Ext.Panel(
				{
					id:'xxxCriteriaPanel',
					region:'north',
					split: true,
					collapsed:true,
					collapseMode:'mini',
					height:88,
					autoLoad: {
						url:'XMLHttpRequestGenerateQryCondtionTable.do?customListFormName=SiteNodeListForm&resourceBeanNameParam=SiteNode',
						scripts:true,
						scrop:this
					}
 				}
 			);
		},
		createQueryPanel: function() {
						var height = 210;
						var width = 260;
						var html = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">"
								+"<tr><td>"
								+"<input type=\"radio\" name=\"exportOption\" value=\"0\" checked/>"
								+"<span style=\"font-size: 12px;\">\u5bfc\u51fa\u9009\u4e2d\u9879</span>"
								+"</td></tr>"
								+"<tr><td>"
								+"<input type=\"radio\" name=\"exportOption\" value=\"1\" />"
								+"<span style=\"font-size: 12px;\">\u5bfc\u51fa\u5f53\u524d\u9875</span>"
								+"</td></tr>"
								+"<tr><td>"
								+"<input type=\"radio\" name=\"exportOption\" value=\"2\" />"
								+"<span style=\"font-size: 12px;\">\u5bfc\u51fa\u5f53\u524d\u9875\u540e</span>"
								+"<input type=\"text\" style=\"width:30;\" name=\"exportPages\" value=\"2\" onkeypress=\"if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;\"/>"
								+"<span style=\"font-size: 12px;\">\u9875(\u5305\u62ec\u5f53\u524d\u9875)</span>"
								+"</td></tr>"
								+"<tr><td><HR style=\"border:3 double #987cb9\" width=\"95%\" color=#987cb9 SIZE=1/></td></tr>";
						html = html	+"<tr><td>"
								+"<input type=\"radio\" name=\"exportOption2\" value=\"0\" checked/>"
								+"<span style=\"font-size: 12px;\">导出当前列</span>"
								+"</td></tr>"
								+"<tr><td>"
								+"<input type=\"radio\" name=\"exportOption2\" value=\"1\" />"
								+"<span style=\"font-size: 12px;\">选择导出列</span>"
								+'      <select name=\"选择导出列\" id=\"ffff\">    '+
								'        <option value=\"1\">aaaaaaaa</option>    '+
								'        <option value=\"2\">bbbbb5</option>    '+
								'        <option value=\"3\">26-29</option>    '+
								'        <option value=\"4\">30-35</option>    '+
								'        <option value=\"5\">Over35</option>    '+
								'      </select> '
								+"</td></tr>";
						html = html+'<tr><td>'
						+'<br><button type="button">导出</button>&nbsp;&nbsp;'
						+'<button type="button">取消</button>'
						+'</td></tr>';
						html = html	+"</table>";

											var menu = new Ext.menu.Menu({
													id: 'basicMenu', 
													items: [
															{
																	xtype:'panel',
													                title: '\u5bfc\u51fa\u9009\u9879',
								       	 				width: width,
												        height: height,
												        layout: 'fit',
												        modal:true,
												        bodyStyle: 'padding:5px;',
												        buttonAlign: 'center',
												        html:html
								           					 }	
														]});
			toolbarPanel = new Ext.Panel( 
				{
					id: 'xxxQueryPanel',
					title: '基站列表',
					layout: 'border',
//					bodyStyle: 'padding:0px',
					tbar: [
					{
							text:"查 询",
							handler: function() {
								extTabQryEvent(criteriaPanel,dataStore,"SiteNodeListForm");
							},
							iconCls:"fam_find",
							tooltip:"查 询"
						},
						'-',
						{
							text:"新 建",
							handler: function(){
								extTabAddEvent(mainPanel,"新建基站","noMenuCreateSiteNode."+URL_SUFFIX);
							},
							iconCls:"fam_add",
							tooltip:"新 建"
						}, {
							text:"查 看",
							handler: function() {
								extTabViewEvent(mainPanel,'noMenuViewSiteNode.'+URL_SUFFIX,grid,'commonName');
							},
							iconCls:"fam_application_view_list",
							tooltip:"查 看"
						}, {
							text:"编 辑",
							handler: function() {
								extTabEditEvent(mainPanel,'noMenuUpdateSiteNode.'+URL_SUFFIX,grid,'commonName');
							},
							iconCls:"fam_modify",
							tooltip:"编 辑"
						}, {
							text:"删 除",
							handler: function() {
								extTabDelEvent('XMLHttpRequestDelSiteNode.'+URL_SUFFIX,grid);
							},
							iconCls:"fam_delete",
							tooltip:"删 除"
						}, {
							text:"展 开",
							handler: function() {
								extCollapsedEvent(this,criteriaPanel);
							},
							iconCls:"fam_asc",
							tooltip:"展 开"
						},
						new Ext.Toolbar.Fill(),
						{
							text:"导出",
							menu:menu,
							iconCls:"fam_excel",
							tooltip:"导出"
						}
					],
					items:[
						//criteriaPanel,
						gridPanel
					]
 				}
 			);
		},
		
		createDataGird:function(){
			dataStore = new Ext.data.Store(
				{
					proxy: new Ext.data.HttpProxy(
						{
							url: 'XMLHttpRequestSiteNodeQryForYUI.do',
							method:'POST'
						}
					),
					reader: new Ext.data.XmlReader(
						{
							record: 'BGisSiteNode',
							idProperty: 'id',
							totalProperty: 'totalProperty'
						},
						[
							'commonName',
							'address',
							'alias',
							'Resource-status',
							'GisSiteNode-btsType',
							'GisSiteNode-btsFlag',
							'GisSiteNode-vipFlag',
							'GisSiteNode-coverageFlag',
							'GisSiteNode-freBand',
							'GisSiteNode-usageType',
							'GisSiteNode-zoneSort',
							'id',
							'objectId'
						]
					)
				}
			);
			columnModel = new Ext.grid.ColumnModel(
				[
					new Ext.grid.RowNumberer(),
					selectionModel,
					{header:"基站名称",dataIndex:"commonName",width:80,sortable:"true"},
					{header:"基站地址",dataIndex:"address",width:80,sortable:"true"},
					{header:"基站别名",dataIndex:"alias",width:80,sortable:"true"},
					{header:"状态",dataIndex:"Resource-status",width:56,sortable:"true"},
					{header:"基站类型",dataIndex:"GisSiteNode-btsType",width:80,sortable:"true"},
					{header:"基站标识",dataIndex:"GisSiteNode-btsFlag",width:80,sortable:"true"},
					{header:"Vip标识",dataIndex:"GisSiteNode-vipFlag",width:100,sortable:"true"},
					{header:"覆盖区域标识",dataIndex:"GisSiteNode-coverageFlag",width:120,sortable:"true"},
					{header:"频段",dataIndex:"GisSiteNode-freBand",width:56,sortable:"true"},
					{header:"基站用途",dataIndex:"GisSiteNode-usageType",width:80,sortable:"true"},
					{header:"区域类别",dataIndex:"GisSiteNode-zoneSort",width:80,sortable:"true"},
					{header:"id",dataIndex:"id",hidden: true,sortable:"true"},
					{header:"基站编号",dataIndex:"objectId",width:80,sortable:"true"}
				]
			);

			pagingToolbar = new Ext.PagingToolbar(
				{
					store: dataStore,
					pageSize: 20,
					displayInfo: true,
					displayMsg: '显示条目 {0} - {1}    {2}',
					emptyMsg: '没有查询记录'
				}
			);
			
			gridPanel = new Ext.grid.GridPanel(
				{
					id:'YUIGRID_SiteNode_Grid',
					region:'center',
					ds: dataStore,
					cm: columnModel,
					sm: selectionModel
					,
					layout:'fit',
					bbar: pagingToolbar
					,
					autoScroll:true,
					stripeRows: true,
					border:false
//					,
//					height:390,
//					bodyStyle:'border-top: 0px;',
//					loadMask: true
				}
			);
			
//			dataStore.load(
//				{
//					params: {
//						start:0, 
//						limit:20
//					}
//				}
//			);
		},
		
		createMainPanel: function() {
			mainPanel = new Ext.TabPanel(
				{
					id:'YUIGRID_SiteNode_Layout',
//					region:'center',
					anchor:'100% 100%',
					activeTab:0,
					bodyBorder:false,
					enableTabScroll:true,
					autoScroll:true,
					margins:margins,
					items:[
							toolbarPanel
					]
	 			}
 			);
 			return mainPanel;
		},
		
		getDataStore:function(){
			return dataStore;
		},
		
		getGridPanel:function(){
			return gridPanel;
		},
		
		getPagingToolbar:function(){
			return pagingToolbar;
		},
		
		getTabPanel:function(){
			return mainPanel;
		},
		
		getToolbar:function(){
			return toolbarPanel;
		},
		
		getCriteriaPanel:function(){
			return criteriaPanel;
		},
		
		getPageSize:function(){
			return 20;
		},
		
		isInited:function(){
			return isInited;
		},
		
		getName:function(){
			return 'xxxQueryGrid';
		}
	}
}();
