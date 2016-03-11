//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/Daddeln.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 08:36:39
// SCCS path, id: /family/botp/vc/13/6/9/2/s.70 1.4
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
if(typeof window.addEventListener != 'undefined') {
	//.. gecko, safari, konqueror and standard
    browser = 'NS';
} else if(typeof document.addEventListener != 'undefined') {
	//.. opera 7
    browser = 'OP';
} else if(typeof window.attachEvent != 'undefined') {
	//.. win/ie
    browser = 'IE';
}

var table = null;
var ball = null;
var slider = null;
var leftBorder = null;
var topBorder = null;
var rightBorder = null;
var bottomBorder = 500;
var arrowCount = 0;
var enemyCount = 0;
var leftBorders = null;
var topBorders = null;
var whiteSpace = null;
var myWidget = null;
var sliderPos = 0;

function daddel(widget) {
	dojo.disconnect(widget.fishEyeLens.moveEvent);
	dojo.disconnect(widget.fishEyeLens.outEvent);
	myWidget = widget;
	var obj = widget.model.getRoot();
    obj.layout.removeLinks(obj);
	
	var root = myWidget.root;
    leftBorder = 0;
    rightBorder = leftBorder + obj.geo.dim.width;
    topBorder = 0;
    bottomBorder = window.innerHeight - 40 - getYPosition(widget.root);

    var node = document.createElement("div");
    node.className = "innerNode nodeBoxSelected";
	node.style.fontSize = '10px';

    var image = document.createElement('IMG');
    image.src = "bpc/graph/images/claimed.gif";
	image.style.top = 6 - (14 - 10)*1.3 + "px";
    image.className = "icon";
    node.appendChild(image);
	node.innerHTML += "Dong!";
	slider = node;	
	slider.style.zIndex = 99;
    slider.style.left = 100 + 'px';
    slider.style.top = bottomBorder + 'px';
    slider.currentX = 0;
    slider.oldX = 0;
    myWidget.root.appendChild(slider);
    
    if (browser != 'IE') {
        document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
    document.onmousemove = moveSlider;
    document.onmousedown = shoot;
    makeBall();
    moveBall(300,100,2,-2,0);
    var timer = window.setTimeout("makeEnemy()", 15000);
}

function makeBall() {
    var image = document.createElement('IMG');
    image.src = "bpc/graph/images/endnode.gif";
    ball = document.createElement('DIV');
    ball.style.display = 'block';
	ball.style.position = 'absolute';
    ball.id = 'ball';
    ball.style.zIndex = 99;
    ball.appendChild(image);
    myWidget.root.appendChild(ball);
}

function makeArrow() {
    var image = document.createElement('IMG');
    image.src = "bpc/graph/images/up.gif";
    var arrow = document.createElement('DIV');
    arrow.style.display = 'block';
	arrow.id = 'arrow' + arrowCount++;
    arrow.style.position = 'absolute';
    arrow.style.zIndex = 99;
    arrow.style.top = bottomBorder + 'px';
    arrow.style.left = sliderPos + slider.offsetWidth/2 + 'px';
    arrow.appendChild(image);
    myWidget.root.appendChild(arrow);
    moveArrow(arrow.id, bottomBorder);
}

function moveArrow(arrowId, y) {
   var arrow = document.getElementById(arrowId);
   if (arrow) {
	   arrow.style.top = y + 'px';
	   var enemy = document.getElementById("enemy0");
	   if (enemy) {
	   		x = arrow.offsetLeft;
	   		var xPos = enemy.offsetLeft;
			var yPos = enemy.offsetTop;
	   		if (y < yPos + 60 && y > yPos && x < xPos + 60 && x > xPos) {
		       myWidget.root.removeChild(arrow);
		       myWidget.root.removeChild(enemy);
		    var timer = window.setTimeout("makeEnemy()", 1000);
			}
	   }
	   if (y == topBorder) {
	       myWidget.root.removeChild(arrow);
	   } else {
	       y -= 10;
	       if (y < topBorder) {
	           y = topBorder;
	       }
	       var command = "moveArrow('" + arrow.id + "'," + y + ")";
	       var timer = window.setTimeout(command, 10);
	   }
   }
}

function makeEnemy() {
    var image = document.createElement('IMG');
    image.src = "bpc/graph/images/person.jpg";
    var enemy = document.createElement('DIV');
    enemy.style.display = 'block';
	enemy.id = 'enemy' + enemyCount;
    enemy.style.position = 'absolute';
    enemy.style.zIndex = 99;
    enemy.style.top = bottomBorder + 'px';
    enemy.style.left = rightBorder - sliderPos + slider.offsetWidth/2 + 'px';
    enemy.appendChild(image);
    myWidget.root.appendChild(enemy);
    moveEnemy(enemy.id, topBorder);
}

function moveEnemy(enemyId, y) {
   var enemy = document.getElementById(enemyId);
   if (enemy) {
	   enemy.style.top = y + 'px';
	   if (y > bottomBorder) {
	       myWidget.root.removeChild(enemy);
		    var timer = window.setTimeout("makeEnemy()", 3000);
	   } else {
	       y += 2;
	       if (y < topBorder) {
	           y = topBorder;
	       }
	       var command = "moveEnemy('" + enemy.id + "'," + y + ")";
	       var timer = window.setTimeout(command, 10);
	   }
   }
}

function moveBall(x, y, xOff, yOff, millis) {
    var stepRate = 10;
    var currentMillis = (new Date()).getTime();
    if (millis == 0) {
        millis = currentMillis;
    }
    var milliDiff = currentMillis - millis;
    var factor = milliDiff/stepRate;
    //alert(milliDiff + ' ' + factor);
    var oldX = x;
    var oldY = y;
    x += xOff * factor;
    y += yOff * factor;

    // collision detection
    for (var i = 0; i < myWidget.fishEyeLens.nodes.length; i++) {
		var node = myWidget.fishEyeLens.nodes[i];
		if (node.graph) {
			if (node.head) {
				var topBorderN = node.geo.center.y - node.geo.head.dim.height/2;
				var leftBorderN = node.geo.center.x - node.geo.head.dim.width/2;
				var rightBorderN = node.geo.center.x + node.geo.head.dim.width/2;
				var bottomBorderN = node.geo.center.y + node.geo.head.dim.height/2;
			} else {
				var topBorderN = node.geo.abs.top;
				var leftBorderN = node.geo.abs.left;
				var rightBorderN = node.geo.abs.left + node.geo.dim.width;
				var bottomBorderN = node.geo.abs.top + node.geo.dim.height;
			}
	        if (y >= topBorderN &&
	            y < bottomBorderN &&
	            x >= leftBorderN &&
	            x < rightBorderN) {
					
				if (node.graph) {
				 	myWidget.root.removeChild(node.graph);
					node.graph = null;			
				}
	
	            if (xOff > 0) {
	                var leftContact = yOff/xOff*(leftBorderN - oldX) + oldY;
	                if (leftContact >= topBorderN &&
	                    leftContact < bottomBorderN)  {
	                    xOff = -xOff;
	                } 
	            } else {
	                var rightContact = yOff/xOff*(rightBorderN - oldX) + oldY;
	                if (rightContact >= topBorderN &&
	                    rightContact < bottomBorderN)  {
	                    //alert('rightContact: ' + rightContact + ' topBorders: ' + topBorders[i] + ' ' + topBorders[i+1]);
	                    xOff = -xOff;
	                } 
	            }
	            if (yOff > 0) {
	                var topContact = xOff/yOff*(topBorderN - oldY) + oldX;
	                //alert(cell.style.backgroundColor + ' topContact: ' + topContact + ' leftBorders: ' + leftBorders[t] + ' ' + leftBorders[t+1]);
	                if (topContact >= leftBorderN &&
	                    topContact < rightBorderN)  {
	                    yOff = -yOff;
	                } 
	            } else {
	                var bottomContact = xOff/yOff*(bottomBorderN - oldY) + oldX;
	                //alert('bottomContact: ' + bottomContact + ' leftBorders: ' + leftBorders[t] + ' ' + leftBorders[t+1]);
	                if (bottomContact >= leftBorderN &&
	                    bottomContact < rightBorderN)  {
	                    yOff = -yOff;
	                } 
	            }
	
	            x = oldX;
	            y = oldY;
	        }
		}
		
    }

    // bounce at borders
    if (x > rightBorder && xOff > 0) {
        xOff = -xOff;
        x = rightBorder;
    }
    if (x < leftBorder && xOff < 0) {
        xOff = -xOff;
        x = leftBorder;
    }
    if (y > bottomBorder && yOff > 0) {
        var sliderX = sliderPos;
        if (sliderX < x && sliderX +slider.offsetWidth > x) {
            yOff = -yOff;
            y = bottomBorder;
            var sliderRest = (new Date()).getTime() - slider.lastMovement;

            if (sliderRest < 30) {
                var effet = (slider.currentX - slider.oldX) / 5;
                if (effet > 3) {
                    effet = 3
                }
                if (effet < -3) {
                    effet = -3
                }
                xOff = xOff + effet;
                if (xOff > 5) {
                    xOff = 5
                }
                if (xOff < -5) {
                    xOff = -5
                }
            }
        } else {
            x = 1000;
            y = bottomBorder;
            yOff = -yOff;
            xOff = -3;
        }
    }
    if (y < topBorder && yOff < 0) {
        yOff = -yOff;
        y = topBorder;
    }




    ball.style.top = (y - 8) + 'px';
    ball.style.left = (x - 8) + 'px';
    
    var timer = setTimeout("moveBall(" + x + "," + y + "," + xOff + "," + yOff + "," + currentMillis + ")", 10);
}

function moveSlider(e) {
        var x = 0
        if (browser == 'IE') {
            x = event.clientX + document.body.scrollLeft
        } else {  
            x = e.pageX
        }  
		x = myWidget.mousePos.x;
		sliderPos = x;
        if (x < leftBorder) x = leftBorder;
        if (x > rightBorder - slider.offsetWidth) x = rightBorder - slider.offsetWidth;
        slider.oldX = slider.currentX;
        slider.currentX = x;
        slider.lastMovement = (new Date()).getTime();
        slider.style.left = x + 'px';
        
        return true;
}

function shoot(e) {
    makeArrow();
    //alert(slider.style.left + ' ' + slider.style.top + ' ' + slider.style.height + ' ' + slider.style.width);
    return true;
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

