//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/Bubble.js, flw-ProcessWidget, wbi612
// Last update: 08/05/29 12:51:46
// SCCS path, id: /home/flowmark/vc/0/8/8/1/s.39 1.10
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
dojo.provide("bpc.graph.Bubble");

dojo.declare("bpc.graph.Bubble", null, {
	constructor: function(widget){
	    this.widget = widget;
		this.bubbleNode = null;
		this.bubbleTimer = null;
        this.inBubble = null;
	},

	showBubble: function(obj, actions) {
	    if (this.bubbleNode) {
            this.closeNow();
        }
        this.bubbleNode = document.createElement("div");
	    this.bubbleNode.id = "bubble";
	    this.bubbleNode.className = "bubble";
	    this.bubbleNode.innerHTML = "<div><div class='bubbleLeft'></div><div id='bubbleContent' class='bubbleMiddle'></div><div class='bubbleRight'></div></div>"
						
        this.widget.root.appendChild(this.bubbleNode);

	    var content = document.getElementById("bubbleContent");
	
	    for (var i = 0; i < actions.length; i++) {
	        var action = actions[i];
	        var tooltip = action.caption;
	        var icon = action.className + ' bubbleIcon';
	        var func = action.func;
			var keepOpen = action.keepOpen;
	
	        var image = document.createElement("div");
	        image.className = icon + " bubbleIcon";
			image.setAttribute("title", tooltip);
			image.setAttribute("alt", tooltip);
			dojo.connect(this.bubbleNode, 'onmouseover', this, "mousein");
			dojo.connect(this.bubbleNode, 'onmouseout', this, "mouseout");
			if (!keepOpen) dojo.connect(image, 'onclick', this, "closeNow");
			dojo.connect(image, 'onmouseup', this, func);
	        image.setAttribute("onmouseover", "this.style.border='1px solid grey'");
	        image.setAttribute("onmouseout", "this.style.border='1px solid white'");
	        image.actionTarget = obj;
	        content.appendChild(image);
	    }

		//this.bubbleNode.style.width = 11 + 7 + 24*actions.length + 'px';
	
        var parentNode = obj.visualization.head?obj.visualization.head:obj.visualization.graph;						
        var left = 0;
        if (obj.visualization.head) {
            left = obj.geo.current.center.x + obj.geo.current.head.dim.width/2 - 5;
            this.bubbleNode.style.top = obj.geo.current.center.y - obj.geo.current.head.dim.height/2 - 25 + 'px';
        } else {
            left = obj.geo.current.abs.left + obj.geo.current.dim.width - 5;
            this.bubbleNode.style.top = obj.geo.current.abs.top - 25 + 'px';
        }

        if (left + this.bubbleNode.offsetWidth > this.widget.root.offsetWidth) {
            left = this.widget.root.offsetWidth - this.bubbleNode.offsetWidth;
        }
        this.bubbleNode.style.left = left + 'px';

        this.inBubble = null;
        var bubble = this;
        var tempTarget = this.bubbleNode;
        this.bubbleTimer = window.setTimeout(function(){bubble.closeBubble(tempTarget);}, 2000);
	},

    closeNow: function() {
         if (this.bubbleNode) {
             this.widget.root.removeChild(this.bubbleNode);
             this.bubbleNode = null;
             this.inBubble = null;
         }
    },

	closeBubble: function(target) {
         if (!this.inBubble && target == this.bubbleNode) {
             this.closeNow();
         }
	},

    mousein: function(e) {
        var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (target.parentNode && !(target.id && target.id == "bubble")) {
	        target = target.parentNode;
	    }
        this.inBubble = target;
    }, 

    mouseout: function(e) {
        var target = e.target;
		var relatedTarget = e.relatedTarget;
	    while (target.parentNode && !(target.id && target.id == "bubble")) {
	        target = target.parentNode;
	    }
	    while (relatedTarget && relatedTarget.parentNode && !(relatedTarget.id && relatedTarget.id == "bubble")) {
	        relatedTarget = relatedTarget.parentNode;
	    }

        if (!relatedTarget || relatedTarget != target) {
            this.inBubble = null;
            var bubble = this;
            var tempTarget = target;
            this.bubbleTimer = window.setTimeout(function(){bubble.closeBubble(target);}, 2000);
        }
    },

    debug: function(text) {
         var div = dojo.byId("debugWindow");
         if (!div) {
             var div = document.createElement("div");
             div.id = "debugWindow";
             div.setAttribute("style", "border: 1px solid black;display: block; position: absolute;top: 50px; left: 50px; width: 300px; height: 200px; overflow: auto; z-index: 1000");
             document.body.appendChild(div);
         }
         div.innerHTML = div.innerHTML + ", " + text;
    }
});