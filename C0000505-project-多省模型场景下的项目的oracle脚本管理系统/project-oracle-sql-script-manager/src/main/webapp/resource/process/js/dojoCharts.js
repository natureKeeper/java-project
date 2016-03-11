//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.8 09/08/06 00:09:12
//
//**************************************

		dojo.registerModulePath("bpc", "../../bpc");
	  
		dojo.require("dijit.dijit");
		dojo.require("bpc.charting.Axis2D");
		dojo.require("dojox.charting.Chart2D");
		dojo.require("dijit.form.Button");
		dojo.require("dijit.form.CheckBox");
		dojo.require("dojox.string.Builder");
	
		var chart  = null;
		
		colors = [					//    Process / Activity state
					"white",		// 0  not needed
					"olive",		// 1  inactive
					"red",			// 2  Running / Ready
					"blue",			// 3  Finished / Running
					"green",		// 4  Compensating / Skipped
					"coral",		// 5  Failed / Finished
					"salmon",		// 6  Terminated / Failed
					"seagreen",		// 7  Compensated / Terminated
					"slategrey",	// 8  Terminating / Claimed
					"steelblue",	// 9  Failing / not needed
					"white",		// 10 not needed
					"darkorchid",	// 11 Suspended / Waiting
					"chocolate",	// 12 Compensation Failed / Expired
					"steelblue"		// 13 not needed / Stopped
				];
				
		fills = [					//    Process / Activity state
                    "white",		// 0  not needed
                    "olive",		// 1  inactive
					"lightpink",	// 2  Running / Ready
					"lightskyblue",	// 3  Finished / Running
					"lightgreen",	// 4  Compensating / Skipped
					"lightcoral",	// 5  Failed / Finished
					"lightsalmon",	// 6  Terminated / Failed
					"lightseagreen",// 7  Compensated / Terminated
					"lightslategrey",// 8  Terminating / Claimed
					"lightsteelblue",// 9  Failing / not needed
					"white",		// 10 not needed
					"plum",			// 11 Suspended / Waiting
					"burlywood",	// 12 Compensation Failed / Expired
					"lightsteelblue",// 13 not needed / Stopped
				];
		
		initDojo = function(){
			createBarChart();
		};
		
		function createBarChart(){
//			var labelsX = [{value: 0, text: "" }];
//			var j = 0;
//			for (i=0; i<=labels.length; i++) {
//				labelsX[i] = {value: i, text: "" };
//			}
			if(chart!=null){
				chart.destroy();
				chart = null;
			}
			var axisType = "Default";
			if( dojo.isFF ) {
				// in Firefox labels in LTR are drawn beside the chart
				//  -> use patched Axis2D
				// with patched Axis2D in IE. labels are not drawn at all 
				axisType = bpc.charting.Axis2D;
			}
			chart = new dojox.charting.Chart2D("DivObserverChart");
			chart.addAxis("x", {
				fixLower: "major", fixUpper: "minor", natural: true, type: axisType
//				, labels: labelsX
				});
			chart.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, natural: true, type: axisType});
			chart.addPlot("default", {type: "Columns"});
			for (i=0; i<series.length; i++) {
				var seriesLabel = "Series" + i;
				var currentSeries = [];
				for (j=0; j<series.length; j++) {
					if (i==j){
						currentSeries[j] = series[j];
					} else {
						currentSeries[j] = 0;
					}
				}
				chart.addSeries(seriesLabel, currentSeries, {stroke: {color: colors[states[i]]}, fill: fills[states[i]]});
			}
			chart.render();
			createLegend("Bar");
		}
		
		function createLegend(chartType){
			var sb = new dojox.string.Builder();
			sb.append('<table style="margin:auto;" cellpadding="0" cellspacing="2" border="0">');
			sb.append('<tr>&nbsp;</tr><tr>&nbsp;</tr>');
			for(var i=0; i<series.length; i++){
				sb.append("</tr><tr>");
				sb.append('<td width="4">&nbsp;</td>');
				if(chartType=="BarMovingLabel"){
					sb.append('<td width="10" bgcolor="' + fills[states[i]] + '" onMouseOver="showLabel(' + i + ')"  onMouseOut="hideLabel(' + i + ')">&nbsp;</td>');
				} else {
                    if(states[0]!=states[1]){ // by state query - use color coding
					    sb.append('<td width="10" bgcolor="' + fills[states[i]] + '">&nbsp;</td>');
				        sb.append('<td width="4">&nbsp;</td>');
                    }
					sb.append('<td width="10" align="right">' + (i+1) + '</td>');
				}
				sb.append('<td width="10">&nbsp;</td>');
				sb.append('<td> &lrm; '  + labels[i] + ' &#x202C; </td>');
			}
			sb.append('</tr></table>');
			dojo.byId("DivObserverChartLegend").innerHTML = sb;
        }

		function showLabel(i){
			var margin = 25 + 31*i;
			dojo.byId("DivLabelState").style.marginLeft=margin+'px';
			dojo.byId("DivLabelState").innerHTML=labels[i];
		}
        
		function hideLabel(i){
			dojo.byId("DivLabelState").innerHTML='';
		}
		
		function createTheme(myColors){
			myTheme=new dojox.charting.Theme({
				chart:{
					stroke:null,
					fill: "white"
				},
				plotarea:{
					stroke:null,
					fill: "#e7eef6"
				},
				axis:{
					stroke:{ color:"#fff",width:2 },
					line:{ color:"#fff",width:1 },
					majorTick:{ color:"#fff", width:2, length:12 },
					minorTick:{ color:"#fff", width:1, length:8 },
					font:"normal normal normal 8pt Tahoma",
					fontColor:"#999"
				},
				series:{
					outline:{ width:1, color:"#fff" },
					stroke:{ width:2, color:"#666" },
					fill:new dojo.Color([0x66, 0x66, 0x66, 0.8]),
					font:"normal normal normal 7pt Tahoma",	//	label
					fontColor:"#000"
				},
				marker:{	//	any markers on a series.
					stroke:{ width:2 },
					fill:"#333",
					font:"normal normal normal 7pt Tahoma",	//	label
					fontColor:"#000"
				},
				colors: myColors
			});
			return myTheme;
		}
		
		function createPieChart(){
			if(chart!=null){
				chart.destroy();
				chart = null;
			}
			var pieSeries = [];
			var myColors = [];
			var j = 0;
			for (i=0; i<series.length; i++) {
				if (series[i]!=0) {
					pieSeries[j] = series[i];
					myColors[j] = fills[states[i]];
					j++;
				}
			}
			// avoid display bug in pie with only one value
			if (pieSeries.length==1){
				pieSeries[1] = 0.00001;
				myColors[1] = myColors[0]; 
			}
			chart = new dojox.charting.Chart2D("DivObserverChart");
			chart.setTheme(createTheme(myColors));
			chart.addPlot("default", {
				type: "Pie", 
				font: "normal normal bold 12pt Tahoma", 
				fontColor: "black", 
				labelOffset: -25,
				precision: 0
			});
			chart.addSeries("PieSeries", pieSeries);
			chart.render();
			createLegend("Pie");
		}

		function updateChart(chartType){
			dojo.byId('DivObserverChart').innerHTML="";
			if (chartType=="Pie") {
				createPieChart();
			} else if (chartType=="Line") {
				createLineChart();
			} else {
				createBarChart();
			}
		}

		function createLineChart(){
			if(chart!=null){
				chart.destroy();
				chart = null;
			}
			var strokeColor = fills[states[0]];
            var axisType = "Default";
            if( dojo.isFF ) {
                // in Firefox labels in LTR are drawn beside the chart
                //  -> use patched Axis2D
                // with patched Axis2D in IE. labels are not drawn at all 
                axisType = bpc.charting.Axis2D;
            }
			chart = new dojox.charting.Chart2D("DivObserverChart");
			chart.addAxis("x", {
				fixLower: "major", fixUpper: "minor", natural: true, includeZero: true,  type: axisType
				});
			chart.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, natural: true, type: axisType });
			chart.addPlot("default", {type: "StackedLines", markers: true, shadows: {dx: 2, dy: 2, dw: 2}});
			chart.addSeries("Process templates by state", series, {stroke: {color: strokeColor, width: 2}, marker: "m-3,-3 l0,6 6,0 0,-6 z"});
			chart.render();
			createLegend("Line");
		}
	
	dojo.addOnLoad(initDojo);