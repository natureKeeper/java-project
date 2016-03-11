///BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation  2005, 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

	    window.onresize = resizeMonitor;
	    window.onload = initMonitor;
	    sliderPos = 0;
	    setWidth = 0; 
	    setHeight = 0;
	    zoomFactor = 0;

	    function addDebug() {
	        var debug = document.getElementById('debug');
	        if (debug != null) {
	            document.removeChild(debug);
	        }
	        var debugHTML = "<div id='debug' style='border: solid 2px;display: block; position: absolute; z-index: 999; top: 400px; left: 600px;height:500px;width:700px;'/>";
	        document.body.innerHTML += debugHTML;
	    }

	    function debug(text) {
	        var debug = document.getElementById('debug');
	        debug.innerHTML += text + " ";
	    }

	    function calculateNavigatorSize() {
	        if (isRTL()) {
	            var layoutTable = document.getElementById("mainGrid");
	            // retrieve the pageBodyNavigator element
	            var grids = layoutTable.getElementsByTagName("td");
	            for (var i = 0; i < grids.length; i++) {
	                grid = grids[i];            
	                if ("pageBodyNavigator" == grids[i].className) {
	                    break;
	                }
	            }                             
	            return grid.offsetWidth;           
	        } else {
	            return 0;
	        }
	    }

	    function calculateContentSize() {
	        var layoutTable = document.getElementById("mainGrid");
	        // retrieve the pageBodyNavigator element
	        var grids = layoutTable.getElementsByTagName("td");
	        for (var i = 0; i < grids.length; i++) {
	            grid = grids[i];            
	            if ("pageBodyContent" == grids[i].className) {
	                break;
	            }
	        }                                       
	        return grid.offsetWidth;           
	    }

	    function resizeMonitor() {
	         if (isRTL()) {
	             resizeMonitorRTL();
	         } else {
	             resizeMonitorLTR();
	         }
	    }

	    function resizeMonitorLTR() {
	        var scrollerX=18;
	        var scrollerY=45;
	        if (navigator.appName.indexOf("Microsoft") != -1) {
	            windowHeight=document.body.clientHeight-scrollerY;
	            windowWidth=document.body.clientWidth-scrollerX;
	        } else {
	            windowHeight=window.innerHeight-scrollerY;
	            windowWidth=window.innerWidth-scrollerX;
	        }
	        var svgbox = document.getElementById('svgbox');
	        var boxWidth = windowWidth - getXPosition(svgbox) - 10;
	        var boxHeight = windowHeight - getYPosition(svgbox);
	        if (boxHeight < 250) {
	            boxHeight = 250;
	        }

	        svgbox.style.width = boxWidth + 'px';
	        svgbox.style.height = boxHeight + 'px';
	        
            document.embeds[0].width = boxWidth + 'px';
            document.embeds[0].height = boxHeight + 'px';
	        
            // Set the size of the box where information about selected elements are shown
	        var monitorDiv = document.getElementById('pageContent:content:monitorDiv');
			var monitorInfoWidth = windowWidth - getXPosition(monitorDiv) - 10;			

	        // alert(monitorInfoWidth + "," + monitorInfoHeight);
			monitorDiv.style.width = monitorInfoWidth + 'px';			

	        var panelContainer = getElement('panelContainer', 'div');
	        var totalHeight = getYPosition(svgbox) - getYPosition(panelContainer) + svgbox.offsetHeight;
	        panelContainer.style.height = totalHeight + 'px';
	    }


	    function resizeMonitorRTL() {            
	        var scrollerX=18;
	        var scrollerY=45;
	        var rightMargin = calculateNavigatorSize();
	        if (navigator.appName.indexOf("Microsoft") != -1) {
	            windowHeight=document.body.clientHeight-scrollerY;
	            windowWidth=document.body.clientWidth-scrollerX;
	        } else {
	            windowHeight=window.innerHeight-scrollerY;
	            windowWidth=window.innerWidth-scrollerX;
	        }
	        // alert(windowWidth + ":" + windowHeight);
	        windowWidth = windowWidth - rightMargin;
	        var svgbox = document.getElementById('svgbox');
	        var boxWidth = windowWidth - 40;
	        var boxHeight = windowHeight - getYPosition(svgbox);
	        if (boxHeight < 250) {
	            boxHeight = 250;
	        }

	        // first trial
	        svgbox.style.width = boxWidth + 'px';
	        svgbox.style.height = boxHeight + 'px';

            document.embeds[0].width = boxWidth+ 'px';
            document.embeds[0].height = boxHeight+ 'px';
	        
            if (document.all) {
	            // IE
	            svgbox.style.right = 40 + 'px'; 
	        } else {
	            svgbox.style.left = 0 + 'px';
	        }
	         
	        
	        var panelContainer = getElement('panelContainer', 'div');
	        var totalHeight = getYPosition(svgbox) - getYPosition(panelContainer) + svgbox.offsetHeight;
	        panelContainer.style.height = totalHeight + 'px';            

	        var boxWidth = calculateContentSize() - 40 - scrollerX;
	        // second trial
	        svgbox.style.width = boxWidth + 'px';
	        svgbox.style.height = boxHeight + 'px';      
	        var svgbuttons = document.getElementById('svgbuttons');
	        if (document.all) {
	            // IE
	            svgbuttons.style.right = 8 + 'px';
	        } else {
	            var svgbuttonsLeft = boxWidth + 10;
	            svgbuttons.style.left = svgbuttonsLeft + 'px';           
	        }
	        
	    }

	    function resetMonitor() {
           var embed = document.embeds[0];
	       var embedHeight = embed.offsetHeight;
	       var embedWidth = embed.offsetWidth;
	       setHeight = initHeight > embedHeight?embedHeight:initHeight;
	       setWidth = initWidth > embedWidth?embedWidth:initWidth;
           
	       if (setHeight < 250) {
	           setHeight = 250;
	       }
	       var zoomFactorY = (((initHeight * 1.5) - setHeight) / setHeight)/4;
	       var zoomFactorX = (((initWidth * 1.5) - setWidth) / setWidth)/4;
	       zoomFactor = zoomFactorX < zoomFactorY?zoomFactorY:zoomFactorX;
	       
           if (zoomFactor < 0) {
	           zoomFactor = 0;
	       }
	    }

	    
	    function initMonitor() {
	    	if (isSVGAvail()) {
                showWaitAnimation();
	        	var slider = document.getElementById('sliderBar');
	        	var sliderHandle = document.getElementById('sliderHandle');
	        	slider.onmousedown = startDrag;
	        	sliderHandle.onmousedown = startDrag;
				
                resizeView();
                resizeMonitor();
	        	resetMonitor();
                if (isIE()) {
                    var node = svgDoc.getElementById("graph");
                    node.setAttribute("height", initHeight);
                    node.setAttribute("width", initWidth);
                }
                // add a hidden element to the details block;
	        	panel = getElement('monitorDiv', 'div');                        	
	        	panel.appendChild(document.createTextNode('Test'));
	        	panel.style.visibility = 'hidden';       
	            panel.onmouseout = setTimer;
	            panel.onmouseover = clearTimer;
                killPopup('waitAnimation');
                setZoom(0);				
	        }
	    }
	            
	            
	    function clearTimer() {            
	        var timer = panel.timer;
	        if (timer != null) {
	            clearTimeout(timer);
	            panel.timer = null;
	        }            
	    }

	    function setTimer() {            
	        panel.timer = setTimeout(hideSVGDetails,2000);
	    }
	        
	    function hideSVGDetails() {
	        panel.style.visibility = 'hidden';
	    }

	    function showInfo(svgnode) {                      
	        clearTimer();
	        panel.style.visibility = 'visible';
	        var node= panel.firstChild;
	        if (node != null) {
	            panel.removeChild(node);
	        }
	        var attr = svgnode.getAttributeNode('id');
	        var id = attr != null ? attr.value : null;
	        var title = activityDetails;
	        if (id != null && id.indexOf("_joinCondition") != -1) {
				title = joinConditionDetails;
	        } else if (id != null && id.indexOf("_link") != -1) {
				title = transitionConditionDetails
	        } else if (id != null && id.indexOf("_condition") != -1) {
                // case handling
                title = joinConditionDetails;
            } else if (id != null) {
				title = activityDetails;
	        }
	        var table = document.createElement('table');                             
	        var infoArray = [];                       
	        var children = svgnode.getElementsByTagName("*");                                                  
	        for (var i = 0; i < children.length; i++) {
	            var node = children.item(i);
	            if (node.nodeType == 1) {                                          
	                if (node.tagName != null) {                                  
	                    if (node.tagName == 'use') {
	                        infoArray.push(getLabel(node.getAttribute('xlink:href')));
	                    } else if (node.tagName == 'text') {
	                        if (node.firstChild != null  && node.firstChild.nodeType == 3) {
	                        	// it is a text node
	                        	infoArray.push(node.firstChild.nodeValue);	
	                        }                            
	                        var tspans = node.getElementsByTagName("*");
	                        if (tspans.length > 0) {
	                            for(var j=0; j < tspans.length; j++) {
	                            	var tspan = tspans.item(j);
                                    if (tspan.firstChild && tspan.firstChild.nodeValue) {                                                                                
                                        infoArray.push(tspan.firstChild.nodeValue);
                                    }
	                            }
	                        }                          
	                    }                               
	                }
	            }
	        }                      
	        var tbody = document.createElement('tbody');                    
	        if (title == activityDetails) {
	            var tr = null;
	            if (infoArray.length > 1) {
	                tr = createRow(title,infoArray[1]);    
	            } else {
	                tr = createRow(title,'');
	            }                 
	            tbody.appendChild(tr);   
	            for (var j = 2; j + 1 < infoArray.length; j = j + 2) {                 	           
		            tr = createRow(infoArray[j],infoArray[j+1]);
	    	        tbody.appendChild(tr);
	        	}           
	        } else if (infoArray.length > 1) {
	        	// dealing with a condition
	            var tr = createRow(title,'');
	            tbody.appendChild(tr);
	            for (var j=1; j < infoArray.length; j++) {
	            	tr = document.createElement('tr');
	        		var td = document.createElement('td');
	        		td.span = "2";
	        		td.className = 'detailsValue';
                    var text = document.createTextNode(infoArray[j]);
	        		td.appendChild(text);                       
	        		tr.appendChild(td);
	        	    tbody.appendChild(tr);				            	
	            }				            	                            	
	        }
	        table.appendChild(tbody);
	        panel.appendChild(table);
	    }
	    
	    function createRow(property, value) {
	    	var tr = document.createElement('tr');
	        var td1 = document.createElement('td');
	        var td2 = document.createElement('td');
	        td1.innerHTML = property;
	        td2.innerHTML = value;                     
	        td1.className = 'detailsProperty';
	        td2.className = 'detailsValue';
	        tr.appendChild(td1);
	        tr.appendChild(td2);
	        return tr;   
	   	}

	    function hideInfo(svgnode) {
	        setTimer();
	    }
	   
	    function getLabel(label) {            
	        var id = label.substring(1,label.length);            
	        var symbol = svgDoc.getElementById(id);            
	        var text = symbol != null ? symbol.getElementsByTagName('text').item(0) : null;                       
	        if (text == null) {
	            return '-';
	        } else {               
	            return text.firstChild.nodeValue;                
	        }
	    }

	    function registerSVG(tempSVG) {
	        svgDoc = tempSVG;
	    }

		function getYPosition(anchor) {
		    element = anchor;
			if (element != null) {
				var ctop = 0;
				while (element.offsetParent) {
					ctop += element.offsetTop;
					element = element.offsetParent;
				}
				if (document.body.currentStyle &&
					document.body.currentStyle['marginTop']) {
					ctop += parseInt(
					document.body.currentStyle['marginTop']);
				}
				return ctop;
			}
		}

	    function getXPosition(anchor) {
	        element = anchor;
	    	if (element != null) {
	    		var cleft = 0;
	    		while (element.offsetParent) {
	    			cleft += element.offsetLeft;
	    			element = element.offsetParent;
	    		}
	    		return cleft;
	    	}
	    }

	    function setSlider(pos) {
	        if (pos < 0) pos = 0;
	        if (pos > 4) pos = 4;
	        sliderPos = pos;
	        var sliderHandle = document.getElementById('sliderHandle');
	        sliderHandle.style.top = (6 + 20*sliderPos) + 'px';
	    }


	    function startDrag(e) {
	        document.onmousemove = doDrag;
	        document.onmouseup = endDrag;
	        doDrag(e);
	        return false;
	    }

	    function doDrag(e) {
	        e = e || window.event;
	        mousePos = null;
	        if (e.pageX || e.pageY) {
	            mousePos = {x:e.pageX, y:e.pageY};
	        } else {
	            mousePos = {x:e.clientX + document.body.scrollLeft - document.body.clientLeft,
	                        y:e.clientY + document.body.scrollTop  - document.body.clientTop};
	        }
	         
	        var target = e.target || e.srcElement;
	        if (target.id == 'sliderBar' || target.id == 'sliderHandle') {
	            var slider = document.getElementById('sliderBar');
	            var baseY = getYPosition(slider.parentNode);
	            var pos = Math.round((mousePos.y - baseY - 6)/20) ;
	            setSlider(pos);
	        } else {
	            endDrag(e);
	        }
	        return false;
	    }

	    function endDrag(e) {
	        document.onmouseup = null;
	        document.onmousemove = null;
	        setZoom(sliderPos);
	        return false;
	    }

	    function moveSVG(mode) {
	            var node = svgDoc.getElementById("graph");
	            if (node == null) {
	                    alert("node not available");
	            } else {
	                    var viewBox = node.getAttribute("viewBox");
	                    if (mode == "in" && sliderPos != 4) {
	                        setZoom(sliderPos + 1);
	                    } else if (mode == "out" && sliderPos != 0) {
	                        setZoom(sliderPos - 1);
	                   } else if (mode == "reset") {
	                        sliderPos = 0;
	                        setSlider(sliderPos);
	                        resetMonitor();
	                        setZoom(0);
	                        hideSVGDetails();
	                    }
	            }                
	    }    

        function isIE() {
            if(typeof window.attachEvent != 'undefined') {
                return true;
            }
            return false;
        }

	    function setZoom(level) {
            if (isIE()) {
	            sliderPos = level;
	            setSlider(sliderPos);
	            var node = svgDoc.getElementById("graph");
                var t = node.currentTranslate;
                var oldScale = node.currentScale;
                var newScale = sliderPos*zoomFactor + 1;
                var wOld = setWidth * oldScale;
                var wNew = setWidth * newScale;
                var hOld = setHeight * oldScale;
                var hNew = setHeight * newScale;
                var txNew = (setWidth/2-t.x)/wOld*wNew-(setWidth/2);
                var tyNew = (setHeight/2-t.y)/hOld*hNew-(setHeight/2);
                node.setCurrentScale(newScale);
                if (newScale == 1) {
                    t.x = 0;
                    t.y = 0;
                } else {
                    t.x = - txNew;
                    t.y = - tyNew;
                }
                node.setCurrentTranslate(t);
            } else {
                showWaitAnimation();
	            var embed = document.embeds[0];
	            var scrollPosX = (embed.scrollLeft + embed.clientWidth/2)/embed.scrollWidth;
	            var scrollPosY = (embed.scrollTop + embed.clientHeight/2)/embed.scrollHeight;
	            sliderPos = level;
	            setSlider(sliderPos);
	            var node = svgDoc.getElementById("graph");
                node.setAttribute("height", setHeight * (1 + sliderPos * zoomFactor));
	            node.setAttribute("width", setWidth * (1 + sliderPos * zoomFactor));
	            embed.scrollLeft = (scrollPosX * embed.scrollWidth) - (embed.clientWidth/2);
	            embed.scrollTop = (scrollPosY * embed.scrollHeight) - (embed.clientHeight/2);
                killPopup('waitAnimation');
            }
	    }