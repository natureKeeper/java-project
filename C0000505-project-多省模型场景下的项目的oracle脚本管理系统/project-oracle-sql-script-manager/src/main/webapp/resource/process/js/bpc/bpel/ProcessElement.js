//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/ProcessElement.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 07:05:59
// SCCS path, id: /family/botp/vc/13/6/9/1/s.83 1.5
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
dojo.provide("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.ProcessElement", null, {
	constructor: function(widget, tempParent, tempName, tempValue){
		this.widget = widget;
	    this.namespace = null;
	    this.name = "";
	    this.shortName = "";
	    if (tempName != undefined) {
	        var i = tempName.indexOf(':');
	        if (i > -1) {
	            this.namespace = tempName.substring(0,i);
	            this.shortName = tempName.substring(i + 1);
	        } else {
	            this.shortName = tempName;
	        }
	    }
	    this.name = tempName;
	
	    this.value = tempValue;
	    this.attributes = new Array();
	    this.parent = tempParent;
	    this.children = new Array();
	},

	/*************************
	 *  Attributes
	 *************************/
	
	getAttribute: function(key) {
	    for (var i = 0; i < this.attributes.length; i++) {
	        if (this.attributes[i].name == key) {
	            return this.attributes[i].value;
	        }
	    }
	    return null;
	},
	
	getAttributeWithValue: function(value) {
	    for (var i = 0; i < this.attributes.length; i++) {
	        if (this.attributes[i].value == value) {
	            return this.attributes[i].name;
	        }
	    }
	    return null;
	},
	
	addAttribute: function(tempAttribute) {
	    this.attributes.push(tempAttribute);
	},
	
	setAttribute: function(key, value) {
	    for (var i = 0; i < this.attributes.length; i++) {
	        if (this.attributes[i].name == key) {
	            this.attributes[i].value = value;
	            return;
	        }
	    }
	    this.addAttribute({name: key, value: value});
	},
	
	getIndexOfAttribute: function(key) {
	    for (var i = 0; i < this.attributes.length; i++) {
	        if (this.attributes[i].name == key) {
	            return i;
	        }
	    }
	    return -1;
	},
	
	removeAttribute: function(key) {
	    var index = this.getIndexOfAttribute(key);
	    if (index > -1) {
	        this.attributes.splice(index, 1);
	    }
	},
	
	/*************************
	 *  Children
	 *************************/
	
	addChild: function(tempChild) {
	    this.children.push(tempChild);
	},
	
	insertAfterChild: function(previousSibling, tempChild) {
	    this.children.splice(this.getIndexOfChild(previousSibling) + 1, 0, tempChild);
	},
	
	insertBeforeChild: function(nextSibling, tempChild) {
	    this.children.splice(this.getIndexOfChild(nextSibling), 0, tempChild);
	},
	
	replaceChild: function(oldChild, newChild) {
	    this.children[this.getIndexOfChild(oldChild)] = newChild;
	},
	
	getIndexOfChild: function(child) {
	    for (var i = 0; i < this.children.length; i++) {
	        if (this.children[i] == child) {
	            return i;
	        }
	    }
	    return false;
	},
	
	removeChild: function(child) {
	    this.children.splice(this.getIndexOfChild(child), 1);
	},
	
	
	/*************************
	 *  Misc
	 *************************/
	
	print: function(container) {
	    container.innerHTML += this.name + ' ' + this.value + '<br>\n';
	    container.innerHTML += "children: " + ' ' + this.children.length + '<br>\n';
	    for (var i = 0; i < node.attributes.length; i++) {
	        container.innerHTML += ' ---> ' + this.attributes[i].name + ' = "' + this.attributes[i].value + '"<br>\n';
	    }
	},
	
	getBpel: function(level) {
	    if (!level) {
	        level = 0;
	    }
	    var spaces = "";
	    for (var i = 0; i <= level*4; i++) {
	        spaces += " ";
	    }
	    var bpel = "";
	    bpel += spaces + "<" + this.name;
	    for (var i = 0; i < this.attributes.length; i++) {
	        bpel += " " + this.attributes[i].name + "=\"" + this.attributes[i].value + "\"";
	    }
	    if (this.children.length == 0 && this.value == null) {
	        bpel += "/>\n";
	    } else {
	        bpel += ">\n";
	        if (this.children.length > 0) {
	            for (var i = 0; i < this.children.length; i++) {
	                bpel += this.children[i].getBpel(level + 1);
	            }
	        }
	        if (this.value != null) {
	            bpel += this.value;
	        }
	        bpel += spaces + "</" + this.name + ">\n";
	    }
	    return bpel;
	},
	
	deleteNode: function() {
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[0];
	        // child will be removed from the array in this call so we always use index 0
	        child.deleteNode();
	    }
	    this.parent.removeChild(this);
		this.parent.changed = true;
		this.parent.calculated = false;
	},

	// utility functions
	getNodesOfType: function(type, array) {
	    if (!array) {
	        var array = new Array();
	    }
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        child.getNodesOfType(type, array);
	    }
	    if (this.name == type) {
	        array.push(this);
	    }
	    return array;
	},
	
	getNodesWithValue: function(attr, value, array) {
	    if (!array) {
	        var array = new Array();
	    }
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        child.getNodesWithValue(attr, value, array);
	    }
	    if (this.getAttribute(attr) == value) {
	        array.push(this);
	    }
	    return array;
	},
	
	getNodesWithProperty: function(attr, value, array) {
	    if (!array) {
	        var array = new Array();
	    }
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        child.getNodesWithProperty(attr, value, array);
	    }
	    if (this[attr]) {
	    	if (this[attr] == value) {
		        array.push(this);
	    	}
	    }
	    return array;
	},
	
	getNodesOfClass: function(type, array) {
	    if (!array) {
	        var array = new Array();
	    }
	    for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        child.getNodesOfClass(type, array);
	    }
	    if (this instanceof type) {
	        array.push(this);
	    }
	    return array;
	},
	
	cloneSubtree: function(o) {
		if(!o){ return o; }
		if(dojo.isArray(o)){
			var r = [];
			for(var i = 0; i < o.length; ++i){
				r.push(this.cloneSubtree(o[i]));
			}
			return r; // Array
		}
		if(!dojo.isObject(o)){
			return o;	
		}
		if(o.nodeType && o.cloneNode){ // isNode
			return o.cloneNode(true); // Node
		}
		if(o instanceof Date){
			return new Date(o.getTime());	// Date
		}
		var r = null; // specific to dojo.declare()'d classes!
		if (o instanceof bpc.bpel.ProcessElement) {
			r = new o.constructor(this.widget, null, o.name, o.value);
			r.calculated = false;
			r.changed = true;
		} else {
			r = new o.constructor(); // specific to dojo.declare()'d classes!
		}
		// Generic objects
		for(var i in o){
			if(!(i in r) || r[i] != o[i]){
				if (i == "graph" ||
					i == "head" ||
					i == "layout" ||
					i == "parent") {
					r[i] = null;
				} else if (i == "links" ||
					i == "predecessors" ||
					i == "successors" ||
					i == "predecessorLinks" ||
					i == "successorLinks" ||
					i == "links" ||
					i == "cases") {
					r[i] = [];	
				} else  if (i == "changed"){
					r[i] = true;
				} else  if (i == "calculated"){
					r[i] = false;
				} else if (i == "geo" ||
						i == "geoNew") {
 					r[i] = o.getEmptyGeo();					
				} else {
					r[i] = this.cloneSubtree(o[i]);
				}
			}
		}
		return r; // Object
	},

	// if we clone the parent we would end in an endless recursion. this methods sets the parent for every node.
	fixParentsAfterClone: function() {
	    for (var i = 0; i < this.children.length; i++) {
	        this.children[i].parent = this;
	        this.children[i].fixParentsAfterClone();
	    }
	}
	
});

