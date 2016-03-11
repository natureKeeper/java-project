//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/wfg/AnnotatedObject.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 11:24:25
// SCCS path, id: /family/botp/vc/13/6/9/3/s.91 1.6
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
dojo.provide("bpc.wfg.AnnotatedObject");

dojo.declare("bpc.wfg.AnnotatedObject",null, {
	constructor: function() {
		this.comment = null;
		this.id = null;
		this.original = null;
		this.annotation = null;
	},
	getComment: function() {
		return this.comment;
	}, 
	setComment: function(newComment) {
		var oldComment = this.comment;
		this.comment = newComment;
	},
	getId: function() {
		return this.id;
	}, 
	setId: function(newId) {
		var oldId = this.id;
		this.id = newId;
	},
	isOriginal: function() {
		return this.original;
	}, 
	setOriginal: function(newOriginal) {
		var oldOriginal = this.original;
		this.original = newOriginal;
	},
	getAnnotation: function() {
		return this.annotation;
	} 
});
bpc.wfg.AnnotatedObject.prototype.type = "bpc.wfg.AnnotatedObject";
