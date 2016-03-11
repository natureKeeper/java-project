//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/WFGraph.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:46:36
// SCCS path, id: /family/botp/vc/13/6/9/4/s.70 1.5
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
dojo.provide("bpc.wfg.WFGraph");

dojo.require("bpc.wfg.AnnotatedObject");

dojo.declare("bpc.wfg.WFGraph",bpc.wfg.AnnotatedObject, {
	constructor: function() {
		this.root = null;
	},
	getRoot: function() {
		return this.root;
	}, 
	setRoot: function(newRoot) {
		var oldRoot = this.root;
		this.root = newRoot;
	}
});
bpc.wfg.WFGraph.prototype.type = "bpc.wfg.WFGraph";
