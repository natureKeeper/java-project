dojo.provide("bpc.admin.ProcessStructureEventHandler");
dojo.require("bpc.admin.EventHandler");

dojo.declare("bpc.admin.ProcessStructureEventHandler", bpc.admin.EventHandler, {

    nodeUp: function(obj, target) {
        if (this.widget.detailLevel == 2) {
            // task only view
            return;
        }
        var headSelected = false;
        if (target == obj.visualization.head) {
            headSelected = true;
        }
        //
        // The Process Structure View does not require a context menu.
        // Just return.		
        //           
    },

    showContextMenu: function(obj, target) {
        var headSelected = false;
        if (target == obj.visualization.head) {
            headSelected = true;
        }
        
        if ((obj.visualization.head && headSelected) || obj instanceof bpc.wfg.Activity) {
            var actions = new Array();
            var eventHandler = this;                        

            if (obj.element instanceof bpc.bpel.Case) {
                 if (obj.element.shortName == "case") {
                     actions.push({caption: labelShowBPEL, className: "iconBubbleBpel", func: function(){eventHandler.showCaseCondition(obj);}});                 
                 }                 
             } else {
                 actions.push({caption: labelShowBPEL, className: "iconBubbleBpel", func: function(){eventHandler.showBpel(obj);}});
                 actions.push({caption: labelShowProperties, className: "iconBubbleProperties", func: function(){eventHandler.showPropertiesDialog(obj);}});
             }

             if (actions.length > 0) {
                 this.bubble.showBubble(obj, actions);			
             }
        }

    },

    showPropertiesDialog: function(obj) {
        var info = document.createElement("div");        
        var table = document.createElement("table");
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);
        info.appendChild(table);	    
        //
        //  Activity Name 
        // 
        var activityName = obj.element.getAttribute("name");
        if (activityName != null) {
            var row = this.createTableRow(labelActivityName + "  ",activityName);
            tBody.appendChild(row);
        }                
        //
        // Description Property
        //        
        var descriptions = obj.element.getNodesOfType("wpc:description");
        if (descriptions != null && descriptions.length > 0) {
            if (descriptions[0].parent == obj.element) {
                 var row = this.createTableRow(labelActivityDescription + "  ",descriptions[0].value);
                 tBody.appendChild(row);
            }               
        }      
        //
        // Business Relevant Property
        // 
        var businessRelevant = obj.element.getAttribute("wpc:businessRelevant");
        if (businessRelevant != null) {
            var row = null;
            if (businessRelevant == "yes") {
                row = this.createTableRow(labelBusinessRelevant + "  ",yes);
            } else {
                row = this.createTableRow(labelBusinessRelevant + "  ",no);
            }
            tBody.appendChild(row);
        } else {
             //
             // Criteria used by deployment
             //
             var row = null;
             switch (obj.element.bpcStateString) {
             case "invoke":             
             case "receive":
             case "reply":
             case "pick":
             case "scope":
                 row = this.createTableRow(labelBusinessRelevant + "  ",yes);
                 break;
             default:
                 if (obj.element instanceof bpc.bpel.Activity && obj.element.isTask()) {
                     row = this.createTableRow(labelBusinessRelevant + "  ",yes);
                 } else {
                     row = this.createTableRow(labelBusinessRelevant + "  ",no);
                 }                 
                 break;
             }
        }
        //
        // Activity Instance Id
        // 
        var aiid = obj.element.bpcOID;
        if (aiid != null) {
            var row = this.createTableRow(labelActivityId + "  ",aiid);
            tBody.appendChild(row);
        }

        //
        // Check whether a property could be found
        // 
        if (tBody.rows.length == 0) {
            var row = this.createTableRow("  ",labelNoProperties);
            tBody.appendChild(row);
        }

        // Defect 562487: Issue 2
        var displayName = obj.element.getDisplayName();        
        if (displayName == null || displayName == "") {            
            // On Firefox this logic is already provided by getDisplayName on IE it does not work
            displayName = activityName;
        }
        
		var label = labelActivityDetails.replace(/\{0\}/g,displayName);
        var properties = {
            hasShadow: true,
            title: label
        };
        this.widget.root.appendChild(info);
        var infoPopup = new dijit.Dialog(properties, info);        
        // Defect 562487: Issue 3
        // dojo does not make the dialog as width as is required for the title, therefore we add 20 pixel
        infoPopup.domNode.style.width = infoPopup.domNode.offsetWidth + 20;        
        infoPopup.show();
    }


});
