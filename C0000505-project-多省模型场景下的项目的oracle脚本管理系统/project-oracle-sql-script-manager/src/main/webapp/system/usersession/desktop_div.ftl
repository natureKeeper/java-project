<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>中国移动网络资源管理系统</title>
		<link rel="stylesheet" type="text/css" href="../../resource/system/theme/default/style/index_div.css">
		<link rel="stylesheet" type="text/css" href="../../resource/jquery/component/ux/ad-gallery/ad-gallery.css">
		<link rel="stylesheet" type="text/css" href="../../resource/jquery/component/ux/ui.tab/ui.tabs.css">
		<link rel="stylesheet" type="text/css" href="../../resource/jquery/component/ux/jqGrid/redmond/jquery-ui-1.8.2.custom.css">
		<link rel="stylesheet" type="text/css" href="../../resource/jquery/component/ux/jqGrid/ui.jqgrid.css">
		<script type="text/javascript" src="../../resource/jquery/component/jquery.min.js"></script>
		<script type="text/javascript" src="../../resource/jquery/component/ux/highchart/highcharts.js"></script>
		<script type="text/javascript" src="../../resource/jquery/component/ux/ad-gallery/jquery.ad-gallery.js"></script>
		<script type="text/javascript" src="../../resource/jquery/component/ux/ui.tab/ui.tabs.min.js"></script>
		<script type="text/javascript" src="../../resource/jquery/component/ux/jqGrid/jquery.jqGrid.min.js"></script>
		<script type="text/javascript">
$(document).ready(function() {
	 var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'chart',
				defaultSeriesType: 'column'
			},
			title: {
				text: null
			},
			xAxis: {
				categories: ['资源拓拨', '业务开通', '网络割接', '统计分析', '基础功能']
			},
			yAxis: {
				min: 0,
				title: {
					text: '点击次数(万次)',
					style: {
						  color: '#FFFFFF'
					}
				}
			},
			credits: {
				enabled: false
			},
			legend: {
				layout: 'vertical',
				backgroundColor: '#FFFFFF',
				align: 'left',
				verticalAlign: 'top',
				x: -100,
				y: -100,
				floating: true,
				shadow: true
			},
			tooltip: {
				formatter: function() {
					return ''+
						this.x +': '+ this.y +' 万次';
				}
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
		        series: [{
				name: '模块',
				data: [49.9, 71.5, 106.4, 129.2, 144.0],
				dataLabels: {
					enabled: true,
					rotation: -90,
					color: '#FFFFFF',
					align: 'right',
					x: -3,
					y: 10,
					formatter: function() {
						return this.y;
					},
					style: {
						font: 'normal 13px Verdana, sans-serif'
					}
				}	
			}]
		});
	 $('img.image0').data('ad-desc', 'example1');
	 $('img.image1').data('ad-title', 'hohoho');
	 $('img.image2').data('ad-desc', 'example3');
	 $('img.image3').data('ad-desc', 'example4');
	 var galleries = $('.ad-gallery').adGallery();
	 
	  $('#infosigntab ul').tabs();
		
			 $("#singinfo").jqGrid({        
					datatype: "local",
				   	colNames:['id','Last Sales','Name', 'Stock', 'Ship via','Notes'],
				   	colModel:[
				   		{name:'id',index:'id', width:90, sorttype:"int", editable: true},
						{name:'sdate',index:'sdate',width:90, editable:true, sortable:false},
				   		{name:'name',index:'name', width:150,editable: true,editoptions:{size:"20",maxlength:"30"}},
				   		{name:'stock',index:'stock', width:60, editable: true,edittype:"checkbox",editoptions: {value:"Yes:No"}},
				   		{name:'ship',index:'ship', width:90, editable: true,edittype:"select",editoptions:{value:"FE:FedEx;IN:InTime;TN:TNT;AR:ARAMEX"}},
				   		{name:'note',index:'note', width:200, sortable:false,editable: true,edittype:"textarea", editoptions:{rows:"2",cols:"10"}}		
				   	],
					onSelectRow: function(id){
						
			 		},
					editurl: "server.php"
				});
				var mydata3 = [
						{id:"12345",name:"中央",note:"note",stock:"Yes",ship:"FedEx", sdate:"2007-12-03"},
						{id:"23456",name:"Laptop",note:"Long text ",stock:"Yes",ship:"InTime",sdate:"2007-12-03"},
						{id:"34567",name:"LCD Monitor",note:"note3",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
						{id:"45678",name:"Speakers",note:"note",stock:"No",ship:"ARAMEX",sdate:"2007-12-03"},
						{id:"87654",name:"Server",note:"note2",stock:"Yes",ship:"TNT",sdate:"2007-12-03"},
						{id:"98765",name:"Matrix Printer",note:"note3",stock:"No", ship:"FedEx",sdate:"2007-12-03"}
						];
				for(var i=0;i < mydata3.length;i++)
					$("#singinfo").jqGrid('addRowData',mydata3[i].id,mydata3[i]);
});
</script>
	</head>
	<body>
		<div id="container">
			<div id="navbar">
				<div id="top_right_section">
					<ul>
						<li>
							欢迎:<span class="span_anchor">User&nbsp;</span>登录|
						</li>
						<li>
							在线人数:<span class="span_anchor">YYY</span>&nbsp;人|
						</li>
						<li>
							<a href=""><span style="font-weight:bold;color:black">系统管理</span></a>&nbsp;|&nbsp;<span class="span_anchor">帮助</span>&nbsp;|&nbsp;<span class="span_anchor">icon&nbsp;退出</span>&nbsp;
						</li>
					</ul>
				</div>
			</div>
			<div id="menu">
				<div id="belond">
					&nbsp;
				</div>
				<div id="blank_content">
					&nbsp;
				</div>
				<div id="research">
					<input type="text"/>
					<input type="button" class="img_btn_pain" value="搜索" onclick="alert('搜索')"/>&nbsp;&nbsp;&nbsp;<img style="margin-top:5px" src="../../resource/system/theme/default/image/img_btn_managementview.gif"
						onclick="alert('试图');return false" />
				</div>
			</div>
			<div id="menu_blank">&nbsp;</div>
			<div id="main_content">
				<div id="left_main">
					<div id="pending_workorder">
						<div id="bt_module_title">
							<img src="../../resource/system/theme/default/image/icon_bullet.gif" />
							待办工单
						</div>
						<div id="bg_module_toolbar">
							<div style="float:right">
							<strong>工单跟踪</strong> &nbsp;
							<img src="../../resource/system/theme/default/image/icon_warning.gif" />
							将要超时的工单(5)
							<img src="../../resource/system/theme/default/image/icon_error.gif" />
							已经超时的工单(10)
							</div>
						</div>
						<div id="pending_work_order_content">
							<table id="singinfo"></table>
						</div>
					</div>
					<div id="left_main_blank">&nbsp;</div>
					<div id="system_module">
						<div id="bt_module_title">
							<img src="../../resource/system/theme/default/image/icon_bullet.gif" />
							系统模块
						</div>
						<div id="module">
							<div id="module_blank">&nbsp;</div>
							<div id="resource">
								<a href="topoNavigation!resource.html"><img width="84" height="84"
										src="../../resource/system/theme/default/image/module_resourcetopo.gif" /> <br>&nbsp;资源拓展</a>
							</div>
							<div id="resource">
								<a href="processConsole.html"><img width="84" height="84"
										src="../../resource/system/theme/default/image/module_servicefulfillment.gif" /> <br>&nbsp;业务开通</a>
							</div>
							<div id="resource">
								<a href=""><img width="84" height="84"
										src="../../resource/system/theme/default/image/module_bulkchange.gif" /> <br>&nbsp;网络割接</a>
							</div>
							<div id="resource">
								<a href="reportShow.html"><img width="84" height="84"
										src="../../resource/system/theme/default/image/module_statistics.gif" /> <br>&nbsp;统计分析</a>
							</div>
							<div id="resource">
								<a href="inventoryNavigation!resource.html"><img width="84" height="84"
										src="../../resource/system/theme/default/image/module_basicfunction.gif" /> <br>&nbsp;基础功能</a>
							</div>
						</div>
						<div id="chart">
							&nbsp;
						</div>
					</div>
				</div>
				<div id="right_main">
					<div id="info_sign">
						<div id="bt_module_title">
							<img src="../../resource/system/theme/default/image/icon_bullet.gif" />
							信息看板
						</div>
						<div id="infosigntab">
							 <ul>
							 	<li><a href="#tab1"><span>系统公告</span></a></li>
							 	<li><a href="#tab2"><span>资源大家谈</span></a></li>
							 	<li><a href="#tab3"><span>资源知识库</span></a></li>
							 </ul>
							 <div id="tab1">系统公告内容</div>
							 <div id="tab2">资源大家谈内容</div>
							 <div id="tab3">资源知识库内容</div>
						</div>
					</div>
					<div id="right_main_blank">&nbsp;</div>
					<div id="resource_report">
						<div id="bt_module_title">
							<img src="../../resource/system/theme/default/image/icon_bullet.gif" />
							资源报表
						</div>
						<div id="gallery" class="ad-gallery">
							<div class="ad-image-wrapper">
							</div>
							<div class="ad-nav">
								<div class="ad-thumbs">
									<ul class="ad-thumb-list">
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_1.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t1.jpg"
													title="Thank"
													alt="image 1.jpg"
													class="image0"></a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_5.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t5.jpg"
													title="A title"
													alt="image 10.jpg"
													class="image1"> </a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_6.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t6.jpg"
													title="tit for"
													alt="Timage 11.jpg"
													class="image2"> </a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_7.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t7.jpg"
													title="A ti"
													alt="image 12.jpg"
													class="image3"> </a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_2.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t2.jpg"
													title="2jpg"
													alt="image 12.jpg"
													class="image4"> </a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_3.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t3.jpg"
													title="oks"
													alt="image 12.jpg"
													class="image5"> </a>
										</li>
										<li>
											<a href="../../resource/jquery/component/ux/ad-gallery/img/garraly_4.jpg"> <img src="../../resource/jquery/component/ux/ad-gallery/img/thumbs/garraly_t4.jpg"
													title="yesterday"
													alt="image 12.jpg"
													class="image6"> </a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="main_botton_blank">&nbsp;</div>
			<div id="botton">
				&nbsp;&nbsp;&nbsp;版本信息${action.getSystemVersion()}
			</div>
		</div>
	</body>
</html>