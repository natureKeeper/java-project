//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graphBSpace/ProcessWidget.js, flw-ProcessWidget, wbix
// Last update: 08/06/04 14:42:41
// SCCS path, id: /home/flowmark/vc/0/9/2/2/s.86 1.9
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
dojo.provide("bpc.graphBSpace.ComplexTooltip");

dojo.require("dijit.Tooltip");

dojo.declare("bpc.graphBSpace.ComplexTooltip",[dijit._MasterTooltip],{

		duration: 200,

        widgetsInTemplate: true,
		
        show: function(aroundNode){
			if(this.fadeOut.status() == "playing"){
				// previous tooltip is being hidden; wait until the hide completes then show new one
				this._onDeck=arguments;
				return;
			}
			
            // Firefox bug. when innerHTML changes to be shorter than previous
			// one, the node size will not be updated until it moves.
			this.domNode.style.top = (this.domNode.offsetTop + 1) + "px";

			// show it
			dojo.style(this.domNode, "opacity", 0);
			this.fadeIn.play();
			this.isShowingNow = true;
			this.aroundNode = aroundNode;
            this.update();
            return this;

		},
            hide: function(aroundNode){
            // summary: hide the tooltip
            if(this._onDeck){
            // this hide request is for a show() that hasn't even started yet;
            // just cancel the pending show()
            this._onDeck=null;
            return;
            }
            this.fadeIn.stop();
            this.isShowingNow = false;
            this.aroundNode = null;
            this.fadeOut.play();
        },

        update: function() {
             if (this.isShowingNow) {
                 var align = this.isLeftToRight() ? {'BR': 'BL', 'BL': 'BR'} : {'BL': 'BR', 'BR': 'BL'};
                 var pos = dijit.placeOnScreenAroundElement(this.domNode, this.aroundNode, align);
                 this.domNode.className="dijitTooltip dijitTooltip" + (pos.corner=='BL' ? "Right" : "Left");//FIXME: might overwrite class
             }
        },

        canBeReused: function() {
             return false;
             /*
             if(this.aroundNode && this.aroundNode === aroundNode){
                 return true;
             } else {
                 return false;
             }
             */
        }
	}
);

dijit.showComplexTooltip = function(/*DomNode*/ aroundNode){
	if(dijit._complexTT) {
        dijit._complexTT.destroyRecursive();
    } 
    dijit._complexTT = new bpc.graphBSpace.ComplexTooltip();
    return dijit._complexTT.show(aroundNode);
};

dijit.hideComplexTooltip = function(aroundNode){
	// summary: hide the tooltip
	if(dijit._complexTT) {
        return dijit._complexTT.hide(aroundNode);
    }
};

