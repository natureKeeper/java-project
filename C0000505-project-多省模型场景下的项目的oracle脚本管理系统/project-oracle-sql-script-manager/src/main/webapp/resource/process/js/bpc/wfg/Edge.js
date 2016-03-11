//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/Edge.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:28:48
// SCCS path, id: /family/botp/vc/13/6/9/3/s.94 1.6
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
dojo.provide("bpc.wfg.Edge");

dojo.require("bpc.wfg.AnnotatedObject");

dojo.declare("bpc.wfg.Edge",null, {
	constructor: function() {
		this.target = null;
		this.source = null;
		this.entryOfFirstInSequence = null;
		this.exitOfLastInSequence = null;
		this.entryRegion = null;
		this.exitRegion = null;
	},
	getTarget: function() {
		return this.target;
	}, 
	setTarget: function(newTarget) {
		var oldTarget = this.target;
		this.target = newTarget;
		newTarget.getInEdges().push(this);
	},
	getSource: function() {
		return this.source;
	}, 
	setSource: function(newSource) {
		var oldSource = this.source;
		this.source = newSource;
		newSource.getOutEdges().push(this);
	},
	getEntryOfFirstInSequence: function() {
		return this.entryOfFirstInSequence;
	}, 
	setEntryOfFirstInSequence: function(newEntryOfFirstInSequence) {
		var oldEntryOfFirstInSequence = this.entryOfFirstInSequence;
		this.entryOfFirstInSequence = newEntryOfFirstInSequence;
	},
	getExitOfLastInSequence: function() {
		return this.exitOfLastInSequence;
	}, 
	setExitOfLastInSequence: function(newExitOfLastInSequence) {
		var oldExitOfLastInSequence = this.exitOfLastInSequence;
		this.exitOfLastInSequence = newExitOfLastInSequence;
	},
	getEntryRegion: function() {
		return this.entryRegion;
	}, 
	setEntryRegion: function(newEntryRegion) {
		var oldEntryRegion = this.entryRegion;
		this.entryRegion = newEntryRegion;
	},
	getExitRegion: function() {
		return this.exitRegion;
	}, 
	setExitRegion: function(newExitRegion) {
		var oldExitRegion = this.exitRegion;
		this.exitRegion = newExitRegion;
	},
	getContainer: function() { //Container
		return this.container;
	}, 
	setContainer: function(newContainer) {
		var oldContainer = this.container;
		this.container = newContainer;
	}
});
bpc.wfg.Edge.prototype.type = "bpc.wfg.Edge";
