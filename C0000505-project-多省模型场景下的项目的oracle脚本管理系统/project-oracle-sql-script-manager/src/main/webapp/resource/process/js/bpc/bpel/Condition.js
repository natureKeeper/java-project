//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/Condition.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/11/10 07:01:03
// SCCS path, id: /family/botp/vc/13/6/9/1/s.76 1.6
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
dojo.provide("bpc.bpel.Condition");

dojo.require("bpc.bpel.ProcessElement");

dojo.declare("bpc.bpel.Condition", bpc.bpel.ProcessElement, {
	constructor: function(tempParent, tempName, tempValue){
	},

	SIMPLE: "SIMPLE",
	XPATH: "XPATH",
	JAVA: "JAVA",
	TRUE: "true",
	FALSE: "false",
	
	setExpressionLanguage: function(language) {
		if (language == this.SIMPLE) {
	        this.setAttribute("expressionLanguage", "http://www.ibm.com/xmlns/prod/websphere/business-process/expression-lang/built-in/6.0.0/");
		} else if (language == this.XPATH) {
			this.setAttribute("expressionLanguage", "http://www.w3.org/TR/1999/REC-xpath-19991116");
		} else if  (language == this.JAVA) {
			this.setAttribute("expressionLanguage", "http://www.ibm.com/xmlns/prod/websphere/business-process/expression-lang/java/6.0.0/");
		}
	},
	
	getExpressionLanguage: function() {
		var exLang = this.getAttribute("expressionLanguage");
		if (exLang) {
			if (exLang.indexOf("/java/") > -1) {
				return this.JAVA;
			} else if (exLang.indexOf("-xpath-") > -1) {
				return this.XPATH;
			} else if (exLang.indexOf("/built-in/") > -1) {
				return this.SIMPLE;
			}
		}
		return this.SIMPLE;
	},
	
	setConditionValue: function(cond) {
	    var simpleTrue = this.getNodesOfType("wpc:true")[0];
	    if (simpleTrue) this.removeChild(simpleTrue);
	    var simpleFalse = this.getNodesOfType("wpc:false")[0];
	    if (simpleFalse) this.removeChild(simpleFalse);
	    var cdata = this.getNodesOfClass(bpc.bpel.CDATA)[0];
	    if (cdata) this.removeChild(cdata);
	    
	    var exLang = this.getExpressionLanguage();
	    if (exLang == this.XPATH || exLang == this.JAVA) {
	        cdata = new bpc.bpel.CDATA(this.widget, this, "CDATASection", "");
	        this.addChild(cdata);
			cdata.value = cond;
	    } else if (exLang == this.SIMPLE) {
	        if (cond == this.TRUE) {
	            this.addChild(new bpc.bpel.ProcessElement(this.widget, this, "wpc:true", null));
	        } else if (cond == this.FALSE) {
	            this.addChild(new bpc.bpel.ProcessElement(this.widget, this, "wpc:false", null));
	        }
	    }
	    
	},
	
	getConditionValue: function() {
		var exLang = this.getExpressionLanguage();
		if (exLang) {
		    if (exLang == this.XPATH || exLang == this.JAVA) {
	    	    var cdata = this.getNodesOfClass(bpc.bpel.CDATA)[0];
			    if (cdata) return cdata.value;
		    } else if (exLang == this.SIMPLE) {
	            var simpleTrue = this.getNodesOfType("wpc:true")[0];
	            var simpleFalse = this.getNodesOfType("wpc:false")[0];
	            if (simpleTrue) {
	                return true;
	            } else if (simpleFalse) {
	                return false;
	            }
			}
		}
		return null;
	}
});
