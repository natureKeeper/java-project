//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/Ior.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/08/14 05:14:14
// SCCS path, id: /family/botp/vc/14/2/8/9/s.11 1.1
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
dojo.provide("bpc.wfg.Ior");

dojo.require("bpc.wfg.LeafNode");

dojo.declare("bpc.wfg.Ior",bpc.wfg.LeafNode, {
	constructor: function() {
	}
});
bpc.wfg.Fork.prototype.type = "bpc.wfg.Ior";
