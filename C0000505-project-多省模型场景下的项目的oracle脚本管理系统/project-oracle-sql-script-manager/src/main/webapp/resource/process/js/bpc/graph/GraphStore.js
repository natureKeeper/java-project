//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/graph/GraphStore.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/10/08 12:21:28
// SCCS path, id: /family/botp/vc/13/6/9/3/s.18 1.10
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
dojo.provide("bpc.graph.GraphStore");

dojo.require("dojox.data.dom");
dojo.declare("bpc.graph.GraphStore",null,{
	constructor: function(requestArgs, loadURL, storeURL, resources) {
	    this.requestArgs = requestArgs?requestArgs:{};
		this.loadURL = "";
	    this.resources = resources?resources:[];
		this.openRequests = 0;
		this.localFileSystem = false;
	},
	
	setLoadURL: function(loadURL) {
		this.loadURL = loadURL;
	},

	setRequestArgs: function(args) {
		this.requestArgs = args;
	},
	
	setResources: function(resources) {
		this.resources = resources;
	},
	
	setRequestArgs: function(requestArgs) {
		this.requestArgs = requestArgs;
	},
	
	getFile: function(fileName, caller, callBack, reload) {
		this.openRequests++;
		// get file from internal cache
		if (!reload && this.resources) {
			dojo.forEach(this.resources, function(item) { 
				if (item.name && item.name == fileName) {
					callBack(item.data);
					return;
				}
			}); 
		}
		
		if (this.localFileSystem) {
			// only a hack for the demo
			if (fileName) {
				fileNameInURL = this.localFolder + fileName;
			} else {
				fileNameInURL = this.localFolder + this.componentFile;
			}
	
            console.debug("loading: " + fileNameInURL);
			var callObj = this;
		    dojo.xhrGet({
		        url: fileNameInURL,
		        load: function(data) { callObj.handleFile(callObj, data, fileName, caller, callBack) },
				error: function(data) { callObj.handleError(data, fileName) },
		        handleAs: "text"
		    });         
		} else {
			// get file via AJAX
			var fileNameInURL = "";
			if (fileName) {
				// loads the component file as starter
				fileNameInURL = "fileName=" + fileName;
			}
	
			var callObj = this;
		    dojo.xhrGet({
		        url: this.loadURL + fileNameInURL,
		        content: this.requestArgs,
		        load: function(data) { callObj.handleFile(callObj, data, fileName, caller, callBack) },
				error: function(data) { callObj.handleError(data, fileName) },
		        handleAs: "xml"
		    });         
		}
		
		
	},

	sendJsonRequest: function(url, caller, callBack) {
		if (this.localFileSystem) {
		} else {
			this.openRequests++;
			var callObj = this;
		    dojo.xhrGet({
		        url: url,
		        content: this.requestArgs,
		        load: function(data) { callObj.handleResult(callObj, data, url, caller, callBack) },
				error: function(data) { callObj.handleError(data, url) },
		        handleAs: "json"
		    });         
		}
	},

	sendRequest: function(url, caller, callBack) {
		if (this.localFileSystem) {
		} else {
			this.openRequests++;
			var callObj = this;
			console.debug("sending: " + url);
		    dojo.xhrGet({
		        url: url,
		        content: this.requestArgs,
		        load: function(data) { callObj.handleResult(callObj, data, url, caller, callBack) },
				error: function(data) { callObj.handleError(data, url) },
		        handleAs: "xml"
		    });         
		}
		
		
	},

	store: function(url, content, caller, callBack) {
		if (this.localFileSystem) {
		} else {
			this.openRequests++;
			var callObj = this;
		    dojo.xhrGet({
		        url: url,
		        content: content,
		        load: function(data) { callObj.handleResult(callObj, data, url, caller, callBack) },
				error: function(data) { callObj.handleError(data, url) },
		        handleAs: "xml"
		    });        
		}
		
		
	},

	handleError: function(data, fileName, ioArgs) {
		this.openRequests--;
		var text = "Error in request for: " + fileName + " -> " + data;
		//alert(text);
	},
	
	handleFile: function(callObj, data, fileName, caller, callBack) {
		this.openRequests--;
        if (this.localFileSystem) data = dojox.data.dom.createDocument(data);
		console.debug("handle: " + fileName);
		callObj.resources.push({name: fileName, data: data});
		callBack(caller, fileName, data);
	},
	
	handleResult: function(callObj, data, url, caller, callBack) {
		this.openRequests--;
		console.debug("handle: " + url);
		callBack(caller, url, data);
	},
	
	waitForAllRequests: function(callback, caller, store) {
		if (!store) store = this;
		
		if (store.openRequests > 0) {
			console.debug("waiting for open requests: " + store.openRequests);
			window.setTimeout(function() { store.waitForAllRequests(callback, caller, store);}, 50);
		} else {
			console.debug("finished waiting");
			callback(caller);
		}
	}
});
