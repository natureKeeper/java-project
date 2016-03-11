//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/Node.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:39:10
// SCCS path, id: /family/botp/vc/13/6/9/4/s.65 1.5
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
dojo.provide("bpc.wfg.Node");

dojo.require("bpc.wfg.AnnotatedObject");

dojo.declare("bpc.wfg.Node",bpc.wfg.AnnotatedObject, {
	constructor: function() {
		this.inDegree = 0;
		this.outDegree = 0;
		this.inEdges = [];
		this.outEdges = [];
	},
	getInDegree: function() {
		return this.inDegree;
	}, 
	getOutDegree: function() {
		return this.outDegree;
	}, 
	getContainer: function() { //Container
		return this.container;
	}, 
	setContainer: function(newContainer) {
		var oldContainer = this.container;
		this.container = newContainer;
	},
	getInEdges: function() {
		return this.inEdges;
	}, 
	getOutEdges: function() {
		return this.outEdges;
	} 
});
bpc.wfg.Node.prototype.type = "bpc.wfg.Node";
