//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Flow.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:02:53
// SCCS path, id: /family/botp/vc/13/6/9/1/s.78 1.15
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.bpel.Flow");

dojo.require("bpc.bpel.Container");

dojo.declare("bpc.bpel.Flow", bpc.bpel.Container, {
	constructor: function(tempParent, tempName, tempValue){
	},

	calculate: function() {
		if (this.calculated) return;
		this.visibleNodes = new Array();

	    // find all links
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (child instanceof bpc.bpel.ProcessNode) {
				if (child.isVisible) {
					this.visibleNodes.push(child);
				}
	            child.clearConnections();
	            child.inFlow = true;
	            child.alreadyRendered = false;
	        }
	    }
		
	    // connect successors/predecessors
        this.linkInformation = [];
		for (var i in this.children) {
			var links = this.children[i];
			if (links.name == "bpws:links") {
				for (var t in links.children) {
					var link = links.children[t];
					if (link.name == "bpws:link") {
						var result = this.findSourceAndTarget(this, link);
						if (result.source && result.target) {
							if (result.source.parent != this || result.target.parent != this) {
								result.crossing = true;
							} else {
                                result.target.isStarter = false;
                            }
                            result.source.addSuccessor(result.target);
                            result.target.addPredecessor(result.source);
                            this.linkInformation.push(result);
						}
					}
				}
			}
		}
	    
        this.calculated = true;
	},
	
	findSourceAndTarget: function(obj, link, result, linkName) {
         if (!linkName) {
             linkName = link.getAttribute("name");
         }

		if (!result) result = {source: null, target: null, link: link, parent: obj, label: link.getAttribute("wpc:displayName"), name: link.generated?null:linkName, conditionIn: null, conditionOut: null};

		for (var i in obj.children) {
			var child = obj.children[i];
            if (!result.source || !result.target) {
                result = this.findSourceAndTarget(child, linkName, result, linkName);
            } else {
                return result;
            }
			if ((child.name == "bpws:source" || child.name == "bpws:target" || child.name == "wpc:faultSource") && child.getAttribute("linkName") == linkName) {
				
				if (child.name == "bpws:source") {
					result.source = this.findParentNode(child);
					result.conditionOut = this.findCondition(child);
                    //result.faultLink = true; // just for testing
				}					
				if (child.name == "wpc:faultSource") {
					result.source = this.findParentNode(child);
					result.conditionOut = this.findCondition(child);
                    result.faultLink = true;
				}					
				if (child.name == "bpws:target") {
					result.target = this.findParentNode(child);
					result.conditionIn = this.findCondition(child);
				}					
			}
		}
		return result;
	},
	
	findCondition: function(obj) {
		for (var i in obj.children) {
			var child = obj.children[i];
			if (child.name == "bpws:transitionCondition") {
				return child;
			}
		}
		return null;
	},
	
	findParentNode: function(obj) {
		if (obj instanceof bpc.bpel.ProcessNode) {
			return obj;
		} else {
			return this.findParentNode(obj.parent);
		}
	},
	
	createLink: function(source, target) {
	    
	    // add link on flow level
	    var links = null;
	    var linksArray = this.getNodesOfType("bpws:links");
	    if (linksArray.length > 0) {
	        links = linksArray[0];
	    } else {
	        links = new bpc.bpel.ProcessElement(this.widget, this, "bpws:links", null);
	        this.addChild(links);
	    }
	    
	    // find unique link name
	    var linkNameBase = "Link";
	    var linkName = null;
	    var count = 1;
	
	    var linkNames = links.getNodesOfType("bpws:link", null);
	    while (linkName == null) {
	        linkName = linkNameBase + count;
	        for (var i = 0; i < linkNames.length; i++) {
	            if (linkNames[i].getAttribute("name") == linkName) {
	                linkName = null;
	            }
	        }
	        count++;
	    }
	
	    var link = new bpc.bpel.ProcessElement(this.widget, links, "bpws:link", null);
	    var linkAttr = [ {name:"name", value:linkName} ];
	    link.attributes = linkAttr;
	    links.addChild(link);
	    
	    // add target tag for the target
	    var targets = null;
	    var targetsArray = target.getNodesOfType("bpws:targets");
	    if (targetsArray.length > 0) {
	        targets = targetsArray[0];
	    } else {
	        targets = new bpc.bpel.ProcessElement(this.widget, target, "bpws:targets", null);
	        target.addChild(targets);
	    }
	    
	    var targetLink = new bpc.bpel.ProcessElement(this.widget, targets, "bpws:target", null);
	    var targetAttr = [ {name:"linkName", value:linkName} ];
	    targetLink.attributes = targetAttr;
	    targets.addChild(targetLink);
	    
	
	    // add source tag for the source
	    var sources = null;
	    var sourcesArray = source.getNodesOfType("bpws:sources");
	    if (sourcesArray.length > 0) {
	        sources = sourcesArray[0];
	    } else {
	        sources = new bpc.bpel.ProcessElement(this.widget, source, "bpws:sources", null);
	        source.addChild(sources);
	    }
	    
	    var sourceLink = new bpc.bpel.ProcessElement(this.widget, sources, "bpws:source", null);
	    var sourceAttr = [ {name:"linkName", value:linkName} ];
	    sourceLink.attributes = sourceAttr;
	    sources.addChild(sourceLink);
	},
		
	removeFlowLink: function(linkName) {
	    var links = this.getNodesOfType("bpws:link");
	    for (var i = 0; i < links.length; i++) {
	        if (links[i].getAttribute("name") == linkName) {
	            links[i].deleteNode();
	            return;
	        }
	    }
	}
});



