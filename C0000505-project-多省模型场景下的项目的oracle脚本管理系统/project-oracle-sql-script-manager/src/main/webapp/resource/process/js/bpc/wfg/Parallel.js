//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/Parallel.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/08/14 05:15:42
// SCCS path, id: /family/botp/vc/14/2/8/9/s.12 1.1
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
dojo.provide("bpc.wfg.Parallel");

dojo.require("bpc.wfg.LeafNode");

dojo.declare("bpc.wfg.Parallel",bpc.wfg.LeafNode, {
	constructor: function() {
	}
});
bpc.wfg.Fork.prototype.type = "bpc.wfg.Parallel";
