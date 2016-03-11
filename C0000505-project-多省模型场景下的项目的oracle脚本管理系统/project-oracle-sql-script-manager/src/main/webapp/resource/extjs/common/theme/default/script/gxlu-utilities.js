var sUserAgent = navigator.userAgent;
var fAppVersion = parseFloat(navigator.appVersion);

function compareVersions(sVersion1, sVersion2) {

    var arrVersion1 = sVersion1.split(".");
    var arrVersion2 = sVersion2.split(".");
    
    if (arrVersion1.length > arrVersion2.length) {
        for (var i=0; i < arrVersion1.length - arrVersion2.length; i++) {
            arrVersion2.push("0");
        }
    } else if (arrVersion1.length < arrVersion2.length) {
        for (var i=0; i < arrVersion2.length - arrVersion1.length; i++) {
            arrVersion1.push("0");
        }    
    }
    
    for (var i=0; i < arrVersion1.length; i++) {
 
        if (arrVersion1[i] < arrVersion2[i]) {
            return -1;
        } else if (arrVersion1[i] > arrVersion2[i]) {
            return 1;
        }    
    }
    
    return 0;

}

var isOpera = sUserAgent.indexOf("Opera") > -1;
var isMinOpera4 = isMinOpera5 = isMinOpera6 = isMinOpera7 = isMinOpera7_5 = false;

if (isOpera) {
    var fOperaVersion;
    if(navigator.appName == "Opera") {
        fOperaVersion = fAppVersion;
    } else {
        var reOperaVersion = new RegExp("Opera (\\d+\\.\\d+)");
        reOperaVersion.test(sUserAgent);
        fOperaVersion = parseFloat(RegExp["$1"]);
    }

    isMinOpera4 = fOperaVersion >= 4;
    isMinOpera5 = fOperaVersion >= 5;
    isMinOpera6 = fOperaVersion >= 6;
    isMinOpera7 = fOperaVersion >= 7;
    isMinOpera7_5 = fOperaVersion >= 7.5;
}

var isKHTML = sUserAgent.indexOf("KHTML") > -1 
              || sUserAgent.indexOf("Konqueror") > -1 
              || sUserAgent.indexOf("AppleWebKit") > -1; 
              
var isMinSafari1 = isMinSafari1_2 = false;
var isMinKonq2_2 = isMinKonq3 = isMinKonq3_1 = isMinKonq3_2 = false;

if (isKHTML) {
    isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
    isKonq = sUserAgent.indexOf("Konqueror") > -1;

    if (isSafari) {
        var reAppleWebKit = new RegExp("AppleWebKit\\/(\\d+(?:\\.\\d*)?)");
        reAppleWebKit.test(sUserAgent);
        var fAppleWebKitVersion = parseFloat(RegExp["$1"]);

        isMinSafari1 = fAppleWebKitVersion >= 85;
        isMinSafari1_2 = fAppleWebKitVersion >= 124;
    } else if (isKonq) {

        var reKonq = new RegExp("Konqueror\\/(\\d+(?:\\.\\d+(?:\\.\\d)?)?)");
        reKonq.test(sUserAgent);
        isMinKonq2_2 = compareVersions(RegExp["$1"], "2.2") >= 0;
        isMinKonq3 = compareVersions(RegExp["$1"], "3.0") >= 0;
        isMinKonq3_1 = compareVersions(RegExp["$1"], "3.1") >= 0;
        isMinKonq3_2 = compareVersions(RegExp["$1"], "3.2") >= 0;
    } 
    
}

var isIE = sUserAgent.indexOf("compatible") > -1 
           && sUserAgent.indexOf("MSIE") > -1
           && !isOpera;
           
var isMinIE4 = isMinIE5 = isMinIE5_5 = isMinIE6 = false;

if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(sUserAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);

    isMinIE4 = fIEVersion >= 4;
    isMinIE5 = fIEVersion >= 5;
    isMinIE5_5 = fIEVersion >= 5.5;
    isMinIE6 = fIEVersion >= 6.0;
}

var isMoz = sUserAgent.indexOf("Gecko") > -1
            && !isKHTML;
            
var isMinMoz1 = sMinMoz1_4 = isMinMoz1_5 = false;

if (isMoz) {
    var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
    reMoz.test(sUserAgent);
    isMinMoz1 = compareVersions(RegExp["$1"], "1.0") >= 0;
    isMinMoz1_4 = compareVersions(RegExp["$1"], "1.4") >= 0;
    isMinMoz1_5 = compareVersions(RegExp["$1"], "1.5") >= 0;
}

var isChrome = sUserAgent.indexOf("Chrome") > -1;

var isNS4 = !isIE && !isOpera && !isMoz && !isKHTML 
            && (sUserAgent.indexOf("Mozilla") == 0) 
            && (navigator.appName == "Netscape") 
            && (fAppVersion >= 4.0 && fAppVersion < 5.0);

var isMinNS4 = isMinNS4_5 = isMinNS4_7 = isMinNS4_8 = false;

if (isNS4) {
    isMinNS4 = true;
    isMinNS4_5 = fAppVersion >= 4.5;
    isMinNS4_7 = fAppVersion >= 4.7;
    isMinNS4_8 = fAppVersion >= 4.8;
}

var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") 
            || (navigator.platform == "Macintosh");

var isUnix = (navigator.platform == "X11") && !isWin && !isMac;

var isWin95 = isWin98 = isWinNT4 = isWin2K = isWinME = isWinXP = false;
var isMac68K = isMacPPC = false;
var isSunOS = isMinSunOS4 = isMinSunOS5 = isMinSunOS5_5 = false;

if (isWin) {
    isWin95 = sUserAgent.indexOf("Win95") > -1 
              || sUserAgent.indexOf("Windows 95") > -1;
    isWin98 = sUserAgent.indexOf("Win98") > -1 
              || sUserAgent.indexOf("Windows 98") > -1;
    isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1 
              || sUserAgent.indexOf("Windows ME") > -1;
    isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 
              || sUserAgent.indexOf("Windows 2000") > -1;
    isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 
              || sUserAgent.indexOf("Windows XP") > -1;
    isWinNT4 = sUserAgent.indexOf("WinNT") > -1 
              || sUserAgent.indexOf("Windows NT") > -1 
              || sUserAgent.indexOf("WinNT4.0") > -1 
              || sUserAgent.indexOf("Windows NT 4.0") > -1 
              && (!isWinME && !isWin2K && !isWinXP);
} 

if (isMac) {
    isMac68K = sUserAgent.indexOf("Mac_68000") > -1 
               || sUserAgent.indexOf("68K") > -1;
    isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1 
               || sUserAgent.indexOf("PPC") > -1;  
}

if (isUnix) {
    isSunOS = sUserAgent.indexOf("SunOS") > -1;

    if (isSunOS) {
        var reSunOS = new RegExp("SunOS (\\d+\\.\\d+(?:\\.\\d+)?)");
        reSunOS.test(sUserAgent);
        isMinSunOS4 = compareVersions(RegExp["$1"], "4.0") >= 0;
        isMinSunOS5 = compareVersions(RegExp["$1"], "5.0") >= 0;
        isMinSunOS5_5 = compareVersions(RegExp["$1"], "5.5") >= 0;
    }
}

function XmlDom() {
    if (window.ActiveXObject) {
        var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0",
                             "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument",
                             "Microsoft.XmlDom"];
                         
        for (var i=0; i < arrSignatures.length; i++) {
            try {
        
                var oXmlDom = new ActiveXObject(arrSignatures[i]);
            
                return oXmlDom;
        
            } catch (oError) {
                //ignore
            }
        }          

        throw new Error("MSXML is not installed on your system."); 
              
    } else if (document.implementation && document.implementation.createDocument) {
        
        var oXmlDom = document.implementation.createDocument("","",null);
        oXmlDom.parseError = {
            valueOf: function () { return this.errorCode; },
            toString: function () { return this.errorCode.toString() }
        };
        //oXmlDom.__initError__();
        /*
        oXmlDom.addEventListener("load", function () {
            this.__checkForErrors__();
            this.__changeReadyState__(4);
        }, false);
        */
        //alert(oXmlDom);
        return oXmlDom;        
    } else {
        throw new Error("Your browser doesn't support an XML DOM object.");
    }
}

if (isMoz || isChrome) {

    Document.prototype.readyState = 0;
    Document.prototype.onreadystatechange = null;

    Document.prototype.__changeReadyState__ = function (iReadyState) {
        this.readyState = iReadyState;

        if (typeof this.onreadystatechange == "function") {
            this.onreadystatechange();
        }
    };

    Document.prototype.__initError__ = function () {
        this.parseError.errorCode = 0;
        this.parseError.filepos = -1;
        this.parseError.line = -1;
        this.parseError.linepos = -1;
        this.parseError.reason = null;
        this.parseError.srcText = null;
        this.parseError.url = null;
    };
    
    Document.prototype.__checkForErrors__ = function () {

        if (this.documentElement.tagName == "parsererror") {

            var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number (\d+), Column (\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;

            reError.test(this.xml);
            
            this.parseError.errorCode = -999999;
            this.parseError.reason = RegExp.$1;
            this.parseError.url = RegExp.$2;
            this.parseError.line = parseInt(RegExp.$3);
            this.parseError.linepos = parseInt(RegExp.$4);
            this.parseError.srcText = RegExp.$5;
        }
    };    
        
    Document.prototype.loadXML = function (sXml) {    	
    	//this.__initError__();
        //this.__changeReadyState__(1);
        var oParser = new DOMParser();
        var oXmlDom = oParser.parseFromString(sXml, "text/xml");
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        
        for (var i=0; i < oXmlDom.childNodes.length; i++) {
            var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
            this.appendChild(oNewNode);
        }        
        //this.__checkForErrors__();        
        //this.__changeReadyState__(4);
    };
    
    Document.prototype.__load__ = Document.prototype.load;

    Document.prototype.load = function (sURL) {
        this.__initError__();
        this.__changeReadyState__(1);
        this.__load__(sURL);
    };
    
    Node.prototype.__defineGetter__("xml", function () {
        var oSerializer = new XMLSerializer();
        return oSerializer.serializeToString(this, "text/xml");
    });
}

/**
 * 遍历JS对象属性和方法
 */
function testAllPrpos(obj) { 
    var props = [];
    var cnt = 0;
    for(var p in obj){  
        if(typeof(obj[p])=="function"){  
            props.push("function");
            props.push("=");
            props.push(p);
        }else{
        	props.push("attribute");
        	props.push("=");
        	props.push(p);
        }
        props.push(" ;");
        cnt++;
        if (cnt == 15){
        	props.push("\r\n");
        }
    }
    alert(props.join("")); 
} 