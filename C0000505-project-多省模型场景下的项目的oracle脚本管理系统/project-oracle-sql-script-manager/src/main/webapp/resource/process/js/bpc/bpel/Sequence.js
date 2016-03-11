//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Sequence.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:09:57
// SCCS path, id: /family/botp/vc/13/6/9/1/s.89 1.9
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
dojo.provide("bpc.bpel.Sequence");

dojo.require("bpc.bpel.Sequential");

dojo.declare("bpc.bpel.Sequence", bpc.bpel.Sequential, {
	constructor: function(tempParent, tempName, tempValue){
	    //this.isHidden = this.isHidden();
	},
	
	checkIfHidden: function() {
	
         var name = this.getAttribute("name");
	    if (this.parent && 
            name && 
            name.substr(0,14) == "HiddenSequence" &&
	        (this.parent instanceof bpc.bpel.Case ||
	        this.parent instanceof bpc.bpel.Scope ||
	        this.parent instanceof bpc.bpel.While ||
	        this.parent instanceof bpc.bpel.CompensationHandler ||
	        this.parent instanceof bpc.bpel.ScopeHandlers ||
	        this.parent instanceof bpc.bpel.Process)) {
	        return true;
	    } else {
	        return false;
	    }
	}
});


