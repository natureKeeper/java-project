//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/DynamicityDecorator.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 08:38:13
// SCCS path, id: /family/botp/vc/13/7/1/0/s.24 1.3
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
dojo.provide("bpc.dynamicity.DynamicityDecorator");

dojo.require("bpc.bpel.BpelDecorator");

dojo.declare("bpc.dynamicity.DynamicityDecorator", bpc.bpel.BpelDecorator, {
	drawDecoration: function(obj, container) {
		if (!container) {
			container = this.widget.decorations;
		}

		var element = obj.element;
		var status = element.color;
		var geo = obj.geo.current;
		var size = geo.fontSize * 2;

		if (status) {
			if (obj instanceof bpc.wfg.StructuredNode) {
				var head = obj.visualization.head;
				if (head) {
					var img = document.createElement("img");
					img.src = "../../bpel/images/aura" + status + ".png";
					img.className = "aura";
					img.style.top = geo.abs.top - geo.head.dim.height/2 - size + 'px';
					img.style.left = geo.abs.left + geo.dim.width/2 - geo.head.dim.width/2 - size + 'px';
					img.style.width = geo.head.dim.width + size * 2 + 'px';
					img.style.height = geo.head.dim.height + size * 2 + 'px';
					obj.visualization.decorations.push(img);
					container.appendChild(img);		
				
					var div = document.createElement("div");
					div.className = "stateIcon icon" + status;
					div.title = status;
					div.style.top = geo.abs.top - geo.head.dim.height/2 - 8 + 'px';
					div.style.left = geo.abs.left  + geo.dim.width/2 + geo.head.dim.width/2 - 8 + 'px';
					obj.visualization.decorations.push(div);
					container.appendChild(div);
				}			
			} else {
				var img = document.createElement("img");
				img.src = "../../bpel/images/aura" + status + ".png";
				img.className = "aura";
				img.style.top = geo.abs.top - size + 'px';
				img.style.left = geo.abs.left - size + 'px';
				img.style.width = geo.dim.width + size * 2 + 'px';
				img.style.height = geo.dim.height + size * 2 + 'px';
				obj.visualization.decorations.push(img);
				container.appendChild(img);
				
				var div = document.createElement("div");
				div.className = "stateIcon icon" + status;
				div.title = status;
				div.style.top = geo.abs.top  - 8 + 'px';
				div.style.left = geo.abs.left  + geo.dim.width - 8 + 'px';
				obj.visualization.decorations.push(div);
				container.appendChild(div);
			}
		}
	}
});
