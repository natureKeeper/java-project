//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelAPIStore.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/09 09:49:19
// SCCS path, id: /family/botp/vc/14/0/1/0/s.14 1.19.1.3
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.bpel.BpelAPIStore");
dojo.require("bpc.graph.GraphStore");

dojo.require("dojox.data.dom");
dojo.declare("bpc.bpel.BpelAPIStore", bpc.graph.GraphStore,{
    // overwrite these settings in your application!
    
	restPrefix: "/bfm",
    restHTMPrefix: "/htm",
	
    version: "v1",

    threshold: 100,

	getProcessState: function(id, caller, callBack) {
		this.openRequests++;
		var callObj = this;
		if (this.restPrefix.charAt(this.restPrefix.length - 1) != "/") {
			this.restPrefix += "/";
		}
        var url = this.restPrefix + "v1/process/" + id + "/status";

	    dojo.xhrGet({
	        url: url,
	        load: function(data) { callObj.handleResult(callObj, data, url, caller, callBack) },
			error: function(data, ioArgs) { callObj.handleError(data, url, ioArgs); caller.widget.block = false; },
	        preventCache: true,
	        handleAs: "json"
	    });         
	},

	getProcessModel: function(id, caller, callBack) {
		
        if (id && id.substr(0,3) == "_PI") {
        	// load template id
            var pi = null;
            var myself = this;
            this.queryProcess(
                id,
                function(responseObject, ioArgs){
                    if (responseObject && responseObject.items && responseObject.items.length > 0) {
                        pi = responseObject.items[0];
                    }
                },
                function(responseObject, ioArgs) {
                     myself.handleError(responseObject, piid, ioArgs);
                }
            );

            if (pi) {
                id = pi.processTemplateID;
            }
        }
		
		this.openRequests++;
		var callObj = this;
		if (this.restPrefix.charAt(this.restPrefix.length - 1) != "/") {
			this.restPrefix += "/";
		}
        var url = this.restPrefix + "v1/processTemplate/" + id + "/processModel";
	    
        dojo.xhrGet({
	        url: url,
	        load: function(data) { callObj.handleResult(callObj, data, url, caller, callBack) },
			error: function(data, ioArgs) { 
                      callObj.handleError(data, url, ioArgs); 
                      caller.widget.block = false;
            },
	        handleAs: "text"
	    });         
	},

    skip: function(piid, name, aiid, load, error){
         var url = null; 
         if (aiid) {
             url = "/activity/" + aiid + "?action=skip";
         } else {
             url = "/process/" + piid + "?action=skip&activityName=" + window.encodeURIComponent(name);
         }
    
        this.performBFMRequest("put", {
            url: url,
            sync: true,
            load: load,
            error: error,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"    
        });
    },

    cancelSkip: function(aiid, load, error){
        var url = "/activity/" + aiid + "?action=cancelSkip";
    
        this.performBFMRequest("put", {
            url: url,
            sync: true,
            load: load,
            error: error
        });
    },

    redoSkip: function(aiid, name, load, error){
        var url = "/activity/" + aiid + "?action=skipAndJump&targetActivityName=" + window.encodeURIComponent(name);
    
        this.performBFMRequest("put", {
            url: url,
            sync: true,
            load: load,
            error: error,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"    
        });
    },

    redoComplete: function(aiid, name, load, error){
        var url = "/activity/" + aiid + "?action=completeAndJump&targetActivityName=" + window.encodeURIComponent(name);
    
        this.performBFMRequest("put", {
            url: url,
            sync: true,
            load: load,
            error: error,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"    
        });
    },

    getTask: function(id, load, error){
        var url = "/task";
        url += "/" + id;
        
        this.performHTMRequest("get", {
            url: url,
            sync: true,
            load: load,
            error: error
        });

    },

    queryProcess: function(id, load, error){
         var url = "/processes/filter?whereClause=PROCESS_INSTANCE.PIID=ID('" + id + "')";
         
         this.performBFMRequest("get", {
             url: url,
             sync: true,
             load: load,
             error: error
         });
    },
    
    getActivity: function(id, load, error){
        var url = "/activity";
        url += "/" + id;
        
        this.performBFMRequest("get", {
            url: url,
            sync: true,
            load: load,
            error: error
        });

    },

    getProcess: function(id, load, error){
        var url = "/process";
        url += "/" + id;
        
        this.performBFMRequest("get", {
            url: url,
            sync: true,
            load: load,
            error: error
        });

    },

    querySubTasks: function(parentId, load, error){
        var url = '/task/' + parentId + '/subtasks';
        this.performHTMRequest("get", {
            url: url,
            sync: true,
            load: load,
            error: error
        });
    },

    performBFMRequest: function(kind, request) {
         this.performRequest(kind, request, true);
    },

    performHTMRequest: function(kind, request) {
         this.performRequest(kind, request, false);
    },

    performRequest: function(kind, request, bfm){
        if (request) {
            if (bfm) {
                request.url = this.restPrefix + this.version + request.url;
            } else {
                request.url = this.restHTMPrefix + this.version + request.url;
            }

            if (!request.handleAs) {
                request.handleAs = "json";
            }
            if (!request.timeout) {
                request.timeout = 5000;
            }
            if (kind == "get") {
                request.preventCache = true;
            }
            if (!request.error) {
                var self = this;
                request.error = function(data, ioArgs){
                    self.handleError(data, ioArgs);
                };
            }
        }
        if (kind == "get") {
            dojo.xhrGet(request);
        }
        else if (kind == "post") {
			dojo.xhrPost(request);
		}
		else if (kind == "rawPut") {
			dojo.rawXhrPut(request);
		}
		else if (kind == "put") {
			dojo.xhrPut(request);
		}
		else if (kind == "delete") {
			dojo.xhrDelete(request);
		}
        
    },

    handleError: function(data, ioArgs) {
    }


});
