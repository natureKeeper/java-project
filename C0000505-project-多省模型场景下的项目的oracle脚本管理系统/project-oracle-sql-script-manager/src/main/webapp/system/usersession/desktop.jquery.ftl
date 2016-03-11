<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>中国移动网络资源管理系统</title>
<link rel="stylesheet" type="text/css" href="${base}/resource/system/theme/default/style/index_div.css">
<link rel="stylesheet" type="text/css" href="${base}/resource/jquery/component/ux/ad-gallery/ad-gallery.css">
<link rel="stylesheet" type="text/css" href="${base}/resource/jquery/component/ux/ui.tab/ui.tabs.css">
<script type="text/javascript" src="${base}/resource/jquery/component/jquery.min.js"></script>
<script type="text/javascript" src="${base}/resource/jquery/component/ux/highchart/highcharts.js"></script>
<script type="text/javascript" src="${base}/resource/jquery/component/ux/ad-gallery/jquery.ad-gallery.js"></script>
<script type="text/javascript" src="${base}/resource/jquery/component/ux/ui.tab/ui.tabs.min.js"></script>

<script type="text/javascript">
var winWidth=0;
var winHeight=0;
$(function() {
	var options={
		chart: {
			renderTo: 'chart',
			defaultSeriesType: 'column',
			plotBackgroundColor:'#e9fefc',
			marginBottom:13,
			marginTop:12,
			spacingBottom:0
		},
		title: {
			text: null
		},
		xAxis: {
			categories: ['资源拓扑', 'GIS' , '业务开通', '网络割接', '统计分析', '基础功能']
		},
		yAxis: {
			lineWidth:1,
			maxPadding:0.02,
			tickPixelInterval:15,
			title: {
				text: '点击次数'
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
			x: -200,
			y: -100,
			floating: true,
			shadow: true
		},
		tooltip: {
			formatter: function() {
				return ''+
					this.x +': '+ this.y +' 次';
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
        series: [
	        {
				name: '模块',
				dataLabels: {
					enabled: true,
					color: '#000000',
					align: 'center',
					x: -3,
					y: 0,
					formatter: function() {
						return this.y;
					},
					style: {
						font: 'normal 13px Verdana, sans-serif'
					}
				}
			}
		]
	};

	$.getJSON("systemAuditLogManagement!findModuleHits.html?random="+Math.random(),
			function(data){
				var inventory=0,gis=0,statistics=0,cutover=0,topo=0,fulfillment=0;
				$.each(data,function(i,item){
					if(item.ServiceModuleCode_=='Topology')
						topo=item.COUNT_;
					else if(item.ServiceModuleCode_=='WebGis')
						gis=item.COUNT_;
					else if(item.ServiceModuleCode_=='Fulfillment')
						fulfillment=item.COUNT_;
					else if(item.ServiceModuleCode_=='CutOver')
						cutover=item.COUNT_;
					else if(item.ServiceModuleCode_=='Statistics')
						statistics=item.COUNT_;
					else if(item.ServiceModuleCode_=='Inventory')
						inventory=item.COUNT_;
				});
				options.series[0].data=[topo,gis,fulfillment,cutover,statistics,inventory];
				var chart = new Highcharts.Chart(options);
			}
	);
	
	$('.ad-gallery').adGallery();
	 
	$('#infosigntab ul').tabs();
	
	//getWarningAlarmNums();
	
	getOnlineUserCount();
	
	$("#useronline").bind('click',function(){
		getOnlineUserCount();
	});
	
	findDimensions();
	
	showAutoPushNotice();
	
	window.onresize=findDimensions;
	
	window.onunload=closeClearUserSession;
});

function openSystemDetailChartPage(){
	window.showModalDialog("systemDetailChartManagement!openChartPage.html","systemDetailChartPage","status:false;dialogWidth:600px;dialogHeight:400px");
}

function showAutoPushNotice(){
	var url = 'systemDeskTopNoticeManagement!findAutoPushNotice.html';
	$.getJSON(url,function(returnObj){
		if(returnObj.resultCode==1){
			var showDetailUrl = 'systemNoticeManagement!htmlNotice.html?option=view&noticeId='+returnObj.row.id;
			features = "dialogWidth:600px;dialogHeight:540px;scrollbars:yes;status:no;help:no;resizable:1;";
			openModalDialogWindow(showDetailUrl,window,features);
		}else if(returnObj.resultCode==0){
			alert(returnObj.resultText);
		}
	});
}

function closeClearUserSession(){
	//如果关闭窗口则移除userSession
	if(self.screenTop>9000){
		location="logout.html?random="+Math.random();
	}
}
function getOnlineUserCount(){
	$.getJSON("systemUserSessionManagerment!countOnlineUser.html?random="+Math.random(),
	          function(data){
	          	$("#useronline").html(data);
	          }
	);
}
function findDimensions()
{
	   //获取窗口宽度
	   if (window.innerWidth)
	  	 	winWidth = window.innerWidth;
	   else if ((document.body) && (document.body.clientWidth))
	   		winWidth = document.body.clientWidth;
	   //获取窗口高度
	   if (window.innerHeight)
	  	 winHeight = window.innerHeight;
	   else if ((document.body) && (document.body.clientHeight))
	  	 winHeight = document.body.clientHeight;
	   //通过深入Document内部对body进行检测，获取窗口大小
	   if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
	   {
		   winHeight = document.documentElement.clientHeight;
		   winWidth = document.documentElement.clientWidth;
	   }
	  $("#main_content").css({width:'99%',height:winHeight-88,margin:'auto'});
}
function checkLogout(){
	if (!confirm("确认退出系统吗?")){
		return;
	}
	location="logout.html?random="+Math.random();
}
function getWarningAlarmNums(){
	$.getJSON("processConsole!countOverTimeNums.html",
	          function(data){	          	
	          	//alert(data.WARNING+"|"+data.ALARM);
	          	$("#todoNums").html(data.TODO);
	          	$("#warningNums").html(data.WARNING);
	          	$("#alarNums").html(data.ALARM);
	          }
	);
}
function updateUserInfo(){
	var date_info = new Date();
	var url = 'systemUserManagement!updateUserInfo.html?userId='+${userContext.user.id}+'&count_Num='+date_info;
	var features = 'dialogWidth:450px;dialogHeight:290px;scrollbars:yes;status:no;help:no;resizable:1;';
	var rtnValues = openModalDialogWindow(url, window,features);
}
function openModalDialogWindow(URL,winObj,features){
	if (document.all) {
		if (null == features){
			features = "dialogWidth:1050px;dialogHeight:530px;scrollbars:yes;status:no;help:no;resizable:1;";
		}
		return window.showModalDialog(URL,winObj,features);
	}else if(isMoz){
		if (null == features){
			features = "modal=yes,width=1050,height=530,scrollbars=yes,status=no,help=no,resizable=1";
		}else{
			var featureArray = features.split(";");
			var newFeature = new Array();
			var modalExist = false;
			for(var i = 0 ; i < featureArray.length; i ++){
				if ("" == featureArray[i]){
					continue;
				}
				var tmp = featureArray[i].split(":");
				if ("dialogWidth" == tmp[0]){
					newFeature.push("width");
				}else if ("dialogHeight" == tmp[0]){
					newFeature.push("height");
				}else if ("modal" == tmp[0]){
					modalExist = true;
				}else{
					newFeature.push(tmp[0]);
				}
				newFeature.push("=");
				newFeature.push(tmp[1]);
				newFeature.push(",");
			}
			if (!modalExist){
				newFeature.push("modal=yes")
			}
			features = newFeature.join("");
		}
		//alert(features);
		return window.open(URL,winObj,features);
	}
}
</script>
</head>
<body style="margin:0;overflow-x:hidden;overflow-y:hidden;" scroll="no">
	<div id="container">
		<div id="navbar">
			<div id="top_right_section">
			<ul>
			<li>
				欢迎:<span class="span_anchor"><a>${userContext.user.name}</a></span>&nbsp;登录 |
			</li>
			<li>
				在线人数:<span class="span_anchor" id="useronline">加载中...</span>&nbsp;人 |
			</li>
			<li>
				<a href="systemManageNavigation!execute.html" class="unita">系统管理 </a>
				| <a class="span_anchor" href="systemManageNavigation!help.html">帮助</a> |
				<span class="span_anchor"><a onclick="updateUserInfo();">密码修改</a></span>|
				<a href="#" class="unita" onClick="checkLogout();"><img src="resource/system/theme/default/image/logout.jpg" align="absmiddle"/>&nbsp;退出&nbsp;</a>
			</li>
			</ul>
			</div>
		</div>
		<div id="menu">
			<div id="belond">
				&nbsp;
			</div>
			<div id="blank_content">&nbsp;</div>
			<div id="research">
				<input type="text" class="research_texts"/><div id="text_imgbtn">&nbsp;</div>
				<input type="button" class="img_btn_pain" value="搜索"/><div id="imgbtn_manager">&nbsp;</div>
				<input type="button" class="img_btn_managementview" onClick="location.href='${managementViewUrl}?userId=${userContext.user.id}'">
			</div>
		</div>
		<div id="menu_blank">&nbsp;</div>
		<div id="main_content">
			<div id="left_main">
				<div id="pending_workorder">
					<div id="bt_module_title">
						<img src="${base}/resource/system/theme/default/image/icon_bullet.gif">
						待办工单
					</div>
					<div id="bg_module_toolbar">
						<div style="float:right">						
						<a href="processConsole!showDesktop.html?taskViewType=todo" target="processConsole">所有待办工单</a>						
						<!--
						(<span id="todoNums"></span>)
						<img src="${base}/resource/process/images/clock_yellow.gif" align="bottom">
						<a href="processConsole!showDesktop.html?taskViewType=todo&overTimeType=1" target="processConsole">将要超时的工单</a>(<span id="warningNums"></span>)
						<img src="${base}/resource/process/images/clock_red.gif" align="bottom">
						<a href="processConsole!showDesktop.html?taskViewType=todo&overTimeType=2" target="processConsole">已经超时的工单</a>(<span id="alarNums"></span>)
						-->
						&nbsp;
						<strong><a target="_top" href="processConsole.html?action=openTodoTasks">更多...</a></strong>
						</div>
					</div>
					<div id="pending_work_order_content">
						<iframe name="processConsole" scrolling="no" frameborder="0" width="100%" height="100%" src='processConsole!showDesktop.html?taskViewType=todo'></iframe>
					</div>
				</div>
				<div id="left_main_blank">&nbsp;</div>
				<div id="system_module">
					<div id="bt_module_title">
					<a  style="float:right;padding:5px;" href="javascript:openSystemDetailChartPage();">详细统计图</a>
						<img src="${base}/resource/system/theme/default/image/icon_bullet.gif" />
						系统模块
											
						
						&nbsp;
						
						
					</div>
					<div id="module">
						<div id="module_blank">&nbsp;</div>
						<div id="resource">
							<a href="topoNavigation!resource.html"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_resourcetopo.gif"/><br>资源拓扑</center></a>
						</div>
						<div id="resource">
							<a href="contextRedirectAction!webgisRedirect.html?userId=${userContext.user.id}&serviceModuleCode=WebGis" target="_blank"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_resourcegis.gif"/><br>GIS</center></a>
						</div>
						<div id="resource">
							<a href="processConsole.html?serviceModuleCode=Fulfillment"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_servicefulfillment.gif"/><br>业务开通</center></a>
						</div>
						<div id="resource">
							<a href="switchConsole.html?serviceModuleCode=CutOver"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_bulkchange.gif" /><br>网络割接</center></a>
						</div>
						<div id="resource">
							<a href="reportShow.html"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_statistics.gif"><br>统计分析</center></a>
						</div>
						<div id="resource">
							<a href="inventoryNavigation!resource.html"><center><img width=84 height=84 src="${base}/resource/system/theme/default/image/module_basicfunction.gif"/><br>基础功能</center></a>
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
						<img src="${base}/resource/system/theme/default/image/icon_bullet.gif" />
						信息看板
					</div>
					<div id="infosigntab">
						 <ul>
						 	<li><a href="#tab1"><span>系统公告</span></a></li>
						 	<li><a href="#tab2"><span>资源大家谈</span></a></li>
						 	<li><a href="#tab3"><span>资源知识库</span></a></li>
						 </ul>
						 <div id="tab1">
							 <iframe scroll="no"  frameborder="0" id="systemreport" src='systemDeskTopNoticeManagement!showDesktop.html'></iframe>
						 </div>
						 <div id="tab2">资源大家谈内容</div>
						 <div id="tab3">资源知识库内容</div>
					</div>
				</div>
				<div id="right_main_blank">&nbsp;</div>
				<div id="resource_report">
					<div id="bt_module_title" style="vertial-align:middle;">
						<img src="${base}/resource/system/theme/default/image/icon_bullet.gif" />
						资源报表
					</div>
					<div id="gallery" class="ad-gallery">
						<div class="ad-image-wrapper">
						</div>
						<div class="ad-nav">
							<div class="ad-thumbs">
								<ul class="ad-thumb-list">
									<#if provinceKey?? && provinceKey == "shanxi">
										<li>
											<a href="${base}/business/statistics/thumb/columnChart_BSC_Shanxi.jpg"> <img src="${base}/business/statistics/thumb/columnChart_BSC_Shanxi.thumb.jpg" 
													longdesc="reportShow.html"
													class="image0" /></a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/lineChart_BSC_Shanxi.jpg"> <img src="${base}/business/statistics/thumb/lineChart_BSC_Shanxi.thumb.jpg" 
													longdesc="reportShow.html"
													class="image1" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/pieChart_Site_Shanxi.jpg"> <img src="${base}/business/statistics/thumb/pieChart_Site_Shanxi.thumb.jpg" 
													longdesc="reportShow.html"
													class="image2" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/pieChart_BSC_Shanxi.jpg"> <img src="${base}/business/statistics/thumb/pieChart_BSC_Shanxi.thumb.jpg" 
													longdesc="reportShow.html"
													class="image3" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/pieChart_Cell_Shanxi.jpg"> <img src="${base}/business/statistics/thumb/pieChart_Cell_Shanxi.thumb.jpg" 
													longdesc="reportShow.html"
													class="image4" /> </a>
										</li>
									<#else>
										<li>
											<a href="${base}/business/statistics/thumb/barChart.jpg"> <img src="${base}/business/statistics/thumb/barChart.thumb.jpg" 
													longdesc="reportShow.html"
													class="image0" /></a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/lineChart.jpg"> <img src="${base}/business/statistics/thumb/lineChart.thumb.jpg" 
													longdesc="reportShow.html"
													class="image1" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/pieChart.jpg"> <img src="${base}/business/statistics/thumb/pieChart.thumb.jpg" 
													longdesc="reportShow.html"
													class="image2" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/columnchart.jpg"> <img src="${base}/business/statistics/thumb/columnchart.thumb.jpg" 
													longdesc="reportShow.html"
													class="image3" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/lineChart2.jpg"> <img src="${base}/business/statistics/thumb/linechart2.thumb.jpg" 
													longdesc="reportShow.html"
													class="image4" /> </a>
										</li>
										<li>
											<a href="${base}/business/statistics/thumb/pieChart2.jpg"> <img src="${base}/business/statistics/thumb/piechart2.thumb.jpg" 
													longdesc="reportShow.html"
													class="image5" /> </a>
										</li>
									</#if>
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