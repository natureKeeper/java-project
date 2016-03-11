//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT

//**************************************
//
// Version: 1.14 09/10/23 09:02:15
//
//**************************************

/**
 * The Explorer Logger
 *
 * - provide a global wrapper object to log messages
 * - accessible via global object logger (window.logger)
 * - interface to either the dojo included firebug lite or an own popup window
 * - allows client side tracing
 *
 * Use the public methods below to log to the console
 *   log(severity, messgage)
 *   trace(messgage)
 *   enable() and disable()
 *   
 *   To enable your file for the logger, use the following script tag:
 *   
 *   <script type="text/javascript" 
 *     src="<%= request.getContextPath()%>/js/logger.js"
 *     id="logger_script" 
 *     enable="<%= UserBean.getInstance().getDebug()%>"
 *     rootContext="<%= request.getContextPath()%>"
 *   >
 *     
 * @author schuetza
 */


function debug(msg){
	var mylog = document.getElementById("_debug_div");
	if (mylog != null) {
		mylog.innerHTML += msg + "<br>";
	}
}
			
			
			
/** 
 * enable logger if requested, but only the first time we get loaded... 
 */ 
if (window["logger"] == null) {

	
	/** 
	 * provide logger instance
	 */
	window.logger = {
	
		////////////////////
		// public properties
		////////////////////
		
		ERROR: 1,
		WARNING: 2,
		INFO: 3,
		
		logModes: {
			OWN_POPUP: 1,
			FIREBUG: 2
		},
		logMode: null,
		
		log: this._log_stub, // public function holders to store either 
		trace: this._trace_stub, // refernce to functions _log/_write or to stubs 
		////////////////////
		// private properties
		////////////////////
		
		_popupWin: null, // refercne to the popup window
		_logContent: [], // String, storage for logger content if logger win is closed
		_targetDiv: null,
		
		_enabled: false,
		_initialized: false,
		_loadFailed: false,
		_popupReady: false,
		_popupPostion: null,
		_popupName: "_bpc_explorer_logger",
		_loggerDivId: "_bpc_logger_div",
		_popupJSP: "Logger.jsp",
		_popupUrl: "",
		_rootContext: null,
		
		
		
		////////////////////
		// public functions
		////////////////////
		
		/**
		 * enable logger
		 */
		enable: function enable(rootContext){
			if (this._initialized == false) {
				this._init(rootContext);
			}
			// replace references to stubs with real functions 
			this.log = this._log;
			this.trace = this._trace;
			this._enabled = true;
			window.onerror = this.onError;
			this._log(this.INFO, "Displaying view " + window.location.pathname );
		},
		
		/**
		 * disable logger
		 */
		disable: function disable(){
			// replace references to functions with stubs 
			this.log = this._log_stub;
			this.trace = this._trace_stub;
			this._enabled = false;
		},
		
		/** 
		 * save the content of a previous logger window
		 */
		setLogContent: function setLogContent(){
			debug("setlogContent called");
			this._logContent = [];
			var logDiv = document.getElementById(this._loggerDivId);
			if (logDiv != null && logDiv.childNodes) {
				for (var i = 0; i < logDiv.childNodes.length; i++) {
					var node = logDiv.childNodes[i];
					if (node != null && node.nodeType && node.nodeType == 3) {
						// text node
						this._logContent.push(node.nodeValue);
					}
				}
			}
		},
		
		/**
		 * callback if load of popup win succeeds
		 */
		onPopupLoaded: function onPopupLoaded(){
			this._popupReady = true;
			this._targetDiv = this._popupWin.document.getElementById(this._loggerDivId);
			debug("Loaded!");
			
			// flush the cache if there are entries
			if (this._logContent.length > 0) {
				// if we queued log entries, get them
				for (var i = 0; i < this._logContent.length; i++) {
					this._write(this._logContent[i]);
				}
				// reset cache
				this._logContent = [];
			}
			
			window.focus();
		},
		
		/**
		 * onError Handler to log all javascript errors ...
		 * runs in window scope, not logger scope
		 */
		onError: function onError(errorMsg, url, lineNo){
			debug("onError");
			if (window["logger"]!=null) {
				window.logger.log(window.logger.ERROR, errorMsg + ", File: " + url + "(" + lineNo + ")");
			}
		},
		
		////////////////////
		// functions called 
		// by the logWindow 
		////////////////////
		
		/** 
		 * Save content to a file
		 * Note: This funtion runs in the popup window only
		 */
		onLogWindowSave: function onLogWindowSave(){
			if (document.execCommand) {
				document.execCommand("SaveAs", false, "ExplorerLog.txt");
			}
			else {
				alert('Feature available only in Internet Exlorer 4.0 and later.');
			}
			// need to rturn false, else JSF will do a reload
			return false;
		},
		
		
		/**
		 * Clear the logger window
		 * Note: This funtion runs in the popup window only
		 */
		onClearDiv: function onClearDiv(){
			var logger = document.getElementById(this._loggerDivId);
			if (logger != null) {
				logger.innerHTML = "";
			}
			// need to rturn false, else JSF will do a reload
			return false;
		},
		
		
		/** 
		 * Save the log to the opener to persist user window close
		 * Note: This funtion runs in the popup window only
		 */
		onLogWindowClose: function onLogWindowClose(){
			if (window.opener != null && window.opener.closed == false && window.opener.logger != null) {
				window.opener.logger.setLogContent();
			}
		},
		
		
		/** 
		 * notify caller that we got loaded
		 * Note: This funtion runs in the popup window only
		 */
		onLogWindowLoad: function onLogWindowLoad(){
			if (window.opener != null && window.opener.closed == false && window.opener.logger != null) {
				window.opener.logger.onPopupLoaded();
			}
		},
		
		////////////////////
		// privtae functions
		////////////////////
		
		/**
		 * initial setup
		 */
		_init: function _init(rootContext){
			// check if there is a firebug console where we should log to
			if (window["console"] && ("firebug" in window["console"])) {
				// firebug mode
				this.logMode = this.logModes.FIREBUG;
			}
			else {
				// log to own popup
				this.logMode = this.logModes.OWN_POPUP;
			}
			if (rootContext != null) {
				this._rootContext = rootContext;
			}
			else {
				var scriptTag = document.getElementById("logger_script");
				var rootC = scriptTag.getAttribute("rootContext");
				if ((rootC != null) || (rootC != "")) {
					this._rootContext = rootC;
				}
			}
			if (this._rootContext != null) {
				this._popupUrl = this._rootContext + "/faces/pages/" + this._popupJSP;
			}
			else {
				// try default 
				this._popupUrl = "faces/pages/" + "/" + this._popupJSP;
			}
			this._initialized = true;
		},
		
		
		/** 
		 * Check if we have an open popup window
		 * @return {boolean}
		 */
		_isPopupOpen: function _isPopupOpen(){
			var mode = (this.logMode == this.logModes.OWN_POPUP);
			var windowOpen = ((this._popupWin != null) && (!this._popupWin.closed));
			var isOpen = mode && windowOpen && !this._loadFailed;
			return isOpen;
		},
		
		
		/**
		 * callback if load of popup win fails in time
		 * runs in the global scope, thus use global reference
		 */
		_onLoadFailed: function _onLoadFailed(){
			if (window.logger._popupReady != true) {
				window.logger._loadFailed = true;
				alert("Timeout loading content into logger window.");
			}
		},
		
		/**
		 * open or reopen popup window providing a div were the messages go to
		 */
		_openPopup: function _openPopup(){
			if ((this._enabled) && (!this._isPopupOpen())) {
				this._popupReady = false;
				
				// check if we are on the logon page. If yes, defer the open command, since we have no
				// session
				if (window.location.pathname.match(/Login/) == null) {
					var options = "menubar=1,scrollbars=1,resizable,top=2,left=2,width=800,height=400";
					// check if there is already a popup 
					this._popupWin = window.open("", this._popupName, options);
					if (this._popupWin != null)  {
						if (this._popupWin.location.href == "about:blank") {
							this._popupWin.location.replace(this._popupUrl);
						}
						else {
							// window was already loaded, inform us self
							// and update opener property of popup win
							this._popupWin.opener = window;
							this.onPopupLoaded();
						}
					}
					if (this._popupWin == null) {
						alert("Failed to open logger window. Please check your popup blocker settings.");
					}
				}
			}
		},
		
		/**
		 * write to the console/window
		 */
		_write: function _write(outstring){
			if (this._enabled) {
				// write message
				debug(outstring);
				switch (this.logMode) {
					case this.logModes.FIREBUG:
						console.log(outstring);
						break;
					case this.logModes.OWN_POPUP:
						this._openPopup();
						if ((this._popupReady == false) || (this._targetDiv == null)) {
							// until the popup win is ready, cache messages
							this._logContent.push(outstring);
						}
						else {
							// append to log
                            var txtNode = this._popupWin.document.createTextNode(outstring);
							var br = this._popupWin.document.createElement("br");
   		 			        this._targetDiv.appendChild(txtNode); 
    						this._targetDiv.appendChild(br); 
						}
						break;
				}
			}
		},
		
		/** 
		 * trace stub, active if logger is disabled
		 */
		_trace_stub: function _trace_stub(){
			debug("log is disbaled");
		},
		
		/**
		 * Write the given  message to the logger div
		 * -> this might be the Firebug console, or our own log window
		 *
		 * @param {String} msg : String to put on console
		 */
		_trace: function _trace(msg){
		
			var logPrefix = "";
			// generate ts
			logPrefix += this._getTimestamp() + " ";
			
			// get View name
			var view = window.location.pathname;
			var last = view.lastIndexOf("/");
			if ((last != -1) && (view.length - last + 1 > -1)) {
				view = view.substr(last + 1).split(".")[0];
			}
			else {
				view = null;
			}
			if (view) {
				logPrefix += view + ":";
			}
			
			// get calling function names
			logPrefix += this._getCallStack();
			
			this._write(logPrefix + " " + msg);
			
		},

		_getCallStack: function _getCallStack(){
			 var callStackString = "";
			 var callStack=[];
			 try {
				 if (arguments.callee) {
					 var nextFunc = arguments.callee;
					 while (nextFunc) {
						 callStack.push(nextFunc);
						 if (nextFunc.caller) {
							 nextFunc = nextFunc.caller;
						 } else {
							 nextFunc = null;
						 }
					 }
				 }
			 }
			 catch (e) {
				 if (callStack.length == 0) {
					 window.logger.log(window.logger.ERROR, "Error during retrieval of call stack for trace." + "\n" + getErrorDetails(e));
				 }
			 }

			 try {
				 if (callStack.length > 0) {
    				 for(var i=callStack.length-1; i>1; i--) {
						 var func = callStack[i];
						 var funcName = func.name ? func.name : func.toString();
						 if (funcName.indexOf("function ") == 0) {
							 // IE
							 var posArgs = funcName.indexOf("(");
							 funcName = funcName.substr(9, posArgs-9);
						 }
						 if (callStackString.length>0) {
							 callStackString += ":";
						 }
						 callStackString += funcName;
    				 }
				 }
				 callStackString = callStackString + "()";
			 } 
			 catch (e) {
				 window.logger.log(window.logger.ERROR, "Error during retrieval of call stack names for trace." + "\n" + getErrorDetails(e));
			 }
			 return callStackString;
		},
		
		/** 
		 * log function stub, active if logger is disabled
		 */
		_log_stub: function _log_stub(){
			debug("log is disbaled");
		},
		
		
		/**
		 * Write the given  message to the logger div
		 *
		 * @param {logger.ERROR | logger.WARNING | logger.INFO} sev : level of message
		 * @param {String} msg : Message to display
		 */
		_log: function _log(sev, msg){
		
			// generate ts
			var logPrefix = this._getTimestamp() + " ";
			var logSuffix = "";
			
			switch (sev) {
				case this.ERROR:
					logPrefix = '<span style="color:#FF0000">' + logPrefix;
					logPrefix += "Error:";
					logSuffix = '</span>';
					break;
				case this.WARNING:
					logPrefix += "Warning:";
					break;
				case this.INFO:
					logPrefix += "Info:";
					break;
				default:
					if (msg == null) {
						// no sev, but a message
						logPrefix += sev;
						msg = "";
					}
			}
			this._write(logPrefix + " " + msg + logSuffix);
		},
		
		
		/**
		 * provide a timestamp string
		 * @return {String}
		 */
		_getTimestamp: function _getTimestamp(){
			var d = new Date();
			var m = 0;
			var ds = d.getFullYear() + "-" +
			(((m = d.getMonth()) < 9) ? ("0" + (m + 1)) : (m + 1)) +
			"-" +
			(((m = d.getDate()) < 10) ? ("0" + (m)) : (m)) +
			" " +
			d.toLocaleTimeString();
			return ds;
		}
		
	}
	
	
	////////////////////
	// now start logging
	// if requested
	////////////////////
	var scriptTag=document.getElementById("logger_script");
	if ((scriptTag!=null) && (scriptTag.getAttribute("enable")=="true")) {
		window.logger.enable();
	} else {
		window.logger.disable();
	}
}
