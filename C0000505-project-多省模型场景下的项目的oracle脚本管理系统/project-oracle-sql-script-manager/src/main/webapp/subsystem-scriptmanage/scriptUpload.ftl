<script type="text/JavaScript" src="${base}/resource/prototype/common/script/prototype.js"></script>
<link rel="stylesheet" type="text/css" href="${base}/business/fulfillment/order.css" />
<body scroll="no" style="border:0" id="b1">
<iframe name="script_uploadForm2" id="script_uploadFrame2" style="display:none"></iframe>
<table class="orderTB" cellspacing=0 cellpadding=0 id="t1">
<tr>
	<td class="field" id="ATTACHMENT_URL" style="border: 0px; display: none"></td>
</tr>
<tr>
	<td class="field" style="border: 0px;">
		<form id="script_uploadForm" enctype="multipart/form-data" method="post" target="script_uploadForm2" action="scriptCreateAction!submitForm.html" onSubmit="return checkFile();">
		<table id="table1" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td colspan="2">脚本${(scriptSeq)}<input type="hidden" name="scripts[0].sequence" id="scripts[0].sequence" value="${(scriptSeq)}"></td>
		</tr>
		<tr>
			<td>名称</td>
			<td><input type="text" name="scripts[0].name" id="scripts[0].name" readonly="true" value="${taskName}-script-${(scriptSeq)}.sql" size="100"/></td>
		</tr>
		<tr>
			<td>脚本类别</td>
			<td>
			<#if dictScriptTypes?exists>
			<#list dictScriptTypes as t>
				<input type="radio" name="scripts[0].scriptType" value="${t.id}" id="scripts[0].scriptType" />${t.name}
			</#list>
			</#if>
			</td>
		</tr>
		<tr>
			<td>文件</td>
			<td><input type="file" name="files" id="files" /><input type="submit" name="submit" value="上传"></td>
		</tr>
	</table>
		
			<input type="hidden" name="taskName" value="${(taskName)}">
			<input type="hidden" name="issueId" value="${(issueId)}">
			<input type="hidden" name="taskMemo" value="${(taskMemo)}">
			<input type="hidden" name="taskDestination" value="${(taskDestination)}">
			<input type="hidden" name="taskEnvironment" value="${(taskEnvironment)}">
			<input type="hidden" name="taskEnvironmentExecutePoint" value="${(taskEnvironmentExecutePoint)}">
			<input type="hidden" name="containerFrame" value="scriptIframe">
			<input type="hidden" id="errorMessage" value="${(errorMessage)?default("")}">
		</form>
	</td>
</tr>
</table>
</body>

<script type="text/javascript">

function checkFile() {
	
	parent.validateInput();
	if(parent.validateInput()){
	var result = false;
	var scriptTypes = document.getElementsByName("scripts[0].scriptType");
	if (null != scriptTypes) {
		for(var j=0; j<scriptTypes.length; j++) {
			var scriptType = scriptTypes[j];
			if (scriptType.type == "radio") {
				result = result || scriptType.checked;
			}
		}
		if (!result) {
			alert('至少选择一个脚本类别');
			return false;
		}
	}
	
	if(!$('files').value) {
		alert("\u8bf7\u9009\u62e9\u8981\u4e0a\u4f20\u7684\u6587\u4ef6\uff01");
		return false;
	}
/*	
	alert("111");
	var if = document.getElementById("script_uploadForm2");
    if.parentNode.removeChild(if);
    var b = document.getElementById("b1");
    var t = document.getElementById("t1");
    var iframe = document.createElement("iframe");
	iframe.setAttribute("id","script_uploadForm2");
	iframe.setAttribute("style","display:none");
    b.insertBefore(iframe,t);
    alert("222");
*/    
    
	return true;
	} 
	
}

/*
function insertAfter( newElement, targetElement ){  
var parent = targetElement.parentNode; 
if( parent.lastChild == targetElement ){  
parent.appendChild( newElement, targetElement );
}else{
parent.insertBefore( newElement, targetElement.nextSibling );
};
}; 
*/

function resizeParentFrame() {
<#if containerFrame ?? && containerFrame != "" >
	if(parent != window && parent.ATTACHMENT_URL) { //内层iframe
		parent.parent.document.all.${containerFrame}.style.height = parent.document.body.scrollHeight;
	} else  { //当前页面
		if(document.body.scrollHeight==0){
			parent.document.all.${containerFrame}.style.height = 75;
		}else{
			parent.document.all.${containerFrame}.style.height = document.body.scrollHeight;
		}
		
	}
</#if>
}

var start;
window.onload = function () {
        start = setInterval('generateAttachmentURL()', 1000);
}


function generateAttachmentURL() {
    var attachmentDIV;
	if (parent != window && parent.submitResut){
	   attachmentDIV = parent.submitResut;
    }else{
	  attachmentDIV = $("submitResut");
	}
    var errMsg = document.getElementById("errorMessage").value;
    attachmentDIV.style.display = 'block';
	attachmentDIV.innerHTML = " "+errMsg;
	//attachmentDIV.value = "hhh  "+errMsg;
    clearInterval(start);
}

function func() {
  
}

function getMsg() {
  var msg = document.getElementById('errorMessage').value;
  if(msg!=""){
    msg="<font color='red'>"+msg+"</font>";
  }else{
    msg="提交成功，请耐心等待3分钟左右系统会自动执行脚本的，执行结果会通过qq通知，请在脚本执行成功后把MR转给相关QA验证";
  }
  return msg;
}

</script>