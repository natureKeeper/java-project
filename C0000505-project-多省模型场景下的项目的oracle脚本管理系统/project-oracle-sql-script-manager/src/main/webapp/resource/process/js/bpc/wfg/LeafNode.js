//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/LeafNode.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:36:09
// SCCS path, id: /family/botp/vc/13/6/9/4/s.61 1.6
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
dojo.provide("bpc.wfg.LeafNode");

dojo.require("bpc.wfg.Node");

dojo.declare("bpc.wfg.LeafNode",bpc.wfg.Node, {
	constructor: function() {
		this.logicType = 0;
	},
	getLogicType: function() {
		return this.logicType;
	}, 
	setLogicType: function(newLogicType) {
		var oldLogicType = this.logicType;
		this.logicType = newLogicType;
	}
});
bpc.wfg.LeafNode.prototype.type = "bpc.wfg.LeafNode";
