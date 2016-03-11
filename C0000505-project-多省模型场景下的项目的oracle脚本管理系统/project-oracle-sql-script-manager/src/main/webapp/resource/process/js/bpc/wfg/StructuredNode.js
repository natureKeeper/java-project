//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/StructuredNode.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:43:33
// SCCS path, id: /family/botp/vc/13/6/9/4/s.68 1.5
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
dojo.provide("bpc.wfg.StructuredNode");

dojo.require("bpc.wfg.Node");

dojo.declare("bpc.wfg.StructuredNode",bpc.wfg.Node, {
	constructor: function() {
		this.edges = [];
		this.entries = [];
		this.exits = [];
		this.nodes = [];
	},
	getEdges: function() {
		return this.edges;
	}, 
	getEntries: function() {
		return this.entries;
	}, 
	getExits: function() {
		return this.exits;
	}, 
	getNodes: function() {
		return this.nodes;
	}, 
	addNode: function(node) {
		this.nodes.push(node);
		node.container = this;
	},
	addEdge: function(edge) {
		this.edges.push(edge);
		edge.container = this;
	}
});
bpc.wfg.StructuredNode.prototype.type = "bpc.wfg.StructuredNode";
