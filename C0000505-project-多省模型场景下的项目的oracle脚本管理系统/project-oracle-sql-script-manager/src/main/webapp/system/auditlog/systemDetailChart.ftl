<html>
<head>
<title>系统模块统计</title>
<script type="text/javascript" src="${base}/resource/jquery/component/jquery.min.js"></script>
<script type="text/javascript" src="${base}/resource/jquery/component/ux/highchart/highcharts.js"></script>
<script type="text/javascript" src="${base}/resource/jquery/component/ux/highchart/modules/exporting.js"></script>
<script type="text/javascript">
	
	var ServiceModuleCodeConst={
		Topology : '资源拓扑',
		WebGis : 'WebGis',
		Fulfillment : '业务开通',
		CutOver : '网络割接',
		Statistics : '统计分析',
		Inventory : '基础功能'
	}
	
	var mouthAxis=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
	var moduleAxis=['资源拓扑','WebGis','业务开通','网络割接','统计分析','基础功能'];
	
	
	
	
$(function () {
	Highcharts.setOptions({
        global:{
            useUTC : false//时区设置
        },
        credits : {
            enabled : false//去掉右下角的标志
        }
   //     animation:{
  //          enabled:false//去掉动画
  //      },
  //      exporting:{
  //          enabled:false//去掉截图
  //      }
    });
	
	//柱状图和线状图
	 var options={
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            title: {
               text: null
            },
            lang:{
            	loading: '导入中...',
            	exportButtonTitle : '导出',
            	printButtonTitle : '打印'
            },
            xAxis: {
                categories: moduleAxis
            },
            yAxis: {
                min: 0,
                title: {
                    text: '数量'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -100,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                  return ''+
					this.x +': '+ this.y +' 次';
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: '数量',
                data: [0,0,0,0,0,0]
            }]
        }
        
        //饼状图
        pieOptions = {
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
               text: null
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.y}</b><br>百分比:<b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y ;
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '数量',
                data: [
                    ['资源拓扑',   0],
                    ['WebGis',     0],
                    ['业务开通' ,0],
                    ['网络割接',    0],
                    ['统计分析',  0],
                    ['基础功能',  0]
                ]
            }]
        }
        
     /**
     * 根据月份和模块来进行统计
     */
     function setMouthAndModuleChart(data){
    	
        var topology = 0;
			var webGis = 0;
			var fulfillment = 0;
			var cutOver = 0;
			var statistics = 0;
			var inventory = 0;
    	$.each(data,function(i,item){
			var serviceModule = item.serviceModule;
			var count = item.count;
			
			
			switch(serviceModule){
				case 'Topology':{
					topology += count;
					break;
				}
				case 'WebGis':{
					webGis += count;
					break;
				}
				case 'Fulfillment':{
					fulfillment += count;
					break;
				}
				case 'CutOver':{
					cutOver += count;
					break;
				}
				case 'Statistics':{
					statistics += count;
					break;
				}
				case 'Inventory':{
					inventory += count;
					break;
				}
			}
			
			
		});
		options.series[0].data=[topology , webGis , fulfillment ,cutOver , statistics , inventory ];
			pieOptions.series[0].data=[
                    ['资源拓扑',   topology],
                    ['WebGis',     webGis],
                    ['业务开通' ,fulfillment],
                    ['网络割接',    cutOver],
                    ['统计分析',  statistics],
                    ['基础功能',  inventory]
                ]
            
			 redrawChart();
    }
	
	/**根据月份和模块进行查询**/
	function submit(){
		 var date = new Date();
      	 var year = date.getFullYear();
      	 var mon = $("#mouth ").val();
      	 var org =  $("#org ").val();
      	 $.getJSON("systemDetailChartManagement!findByAccessUser.html?accessMonth="+mon+"&accessYear="+year+"&organizationId="+org ,
			function(data){
			 chart.hideLoading();
				var result = data.result;
				if(result != '0'){
					setMouthAndModuleChart(result);
				}else{
				alert("没有数据！");
					options.series[0].data=[0 , 0 , 0 ,0 , 0 , 0 ];
					pieOptions.series[0].data=[
		                    ['资源拓扑',   0],
		                    ['WebGis',     0],
		                    ['业务开通' ,0],
		                    ['网络割接',    0],
		                    ['统计分析',  0],
		                    ['基础功能',  0]
		                ]
	            redrawChart();
			}
		}
		);
	}
	
	function redrawChart(){
		if(chart){
				chart.destroy();
			}
			var value = $("#chartType").val();
			var p;
			if(value == '0'){
				p = options
				p.chart.type = 'column';
				
			}else if(value == '1'){
				p = pieOptions;
				
			}else if(value == '2'){
				p = options
				p.chart.type = 'line';
			}
			chart = new Highcharts.Chart(p);
	}
	
	
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart(options);
      	 chart.showLoading();
      	 var date = new Date();
      	 var mon = date.getMonth() + 1;//当前月份
      	 var year = date.getFullYear();
      	 $("#mouth ").val(mon);
      	 
        $.getJSON("systemDetailChartManagement!findByAccessUser.html?accessMonth="+mon+"&accessYear="+year ,
			function(data){
			 chart.hideLoading();
				var result = data.result;
				if(result != '0'){
					setMouthAndModuleChart(result);
				}else{
					alert('没有数据！');
					
				}
			}
		);
		
		$.getJSON("systemDetailChartManagement!findAllLevel2Org.html" , function(data){
			var result = data.result;
				if(result != '0'){
					$.each(result,function(i,item){
					
						$("#org").append("<option value='"+item.id+"'>"+item.name+"</option>"); 
					})
				}else{
					alert('没有组织结构！');
				}
		});
		
		
		$("#chartType").change(function(){
			 redrawChart();
		})
		
		$("#submit").click(function(){
				submit();
			})

	});
});
	
</script>
<style type="text/css">
.bt_module_title {
	height: 24px;
	color: #5F5F5F;
	font-size: 13px;
	padding-left: 5px;
	padding-top:4px;
	font-weight: bold;
	margin: 0 auto;
	border-bottom: 1px solid #CCCCCC;
	background:url(${base}/resource/system/theme/default/image/bg_module_title.jpg);
}

.selectTable {
	width: 100%;
	border-collapse: collapse;
	border: 0px;
	background-color: #DFE8F6;
}
.selectTable tr td {
	height: 30px;
	font-size: 12px;
	font-family: Tahoma,宋体;
	border-width: 1px;
	border-color: #99BBE8;
	border-style: solid;
	padding: 0 10 0 10;
	white-space: nowrap;
}
</style>
</head>



<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">

<table class ="selectTable"><tr><td style="width: 30%">请选择月度：
	<select name="mouth" id="mouth">  
		<option value="0">全部</option>  
        <option value="1">1月</option>  
        <option value="2">2月</option>  
        <option value="3">3月</option>  
        <option value="4">4月</option>  
        <option value="5">5月</option>  
        <option value="6">6月</option>  
        <option value="7">7月</option>  
        <option value="8">8月</option>  
        <option value="9">9月</option>  
        <option value="10">10月</option>  
        <option value="11">11月</option>  
        <option value="12">12月</option>  
      </select> </td>
      
     <td style="width: 50%"> 组织机构： <select name="org" id="org"><option value="0">全部</option>    </select></td>
	<td style="width: 20%">
		<select name="chartType" id="chartType">
			<option value="0">柱状图</option>   
			<option value="1">饼状图</option> 
			<option value="2">线状图</option>   
	</select></td>	
		
		
		<td> <button id="submit">确定</button></td><tr>
</table>

    
		
		
		

<div id="container" style="height: 376px"></div>


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

