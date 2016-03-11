<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<!--<#include "/resource/extjs/include.ftl" />-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据库脚本管理系统</title>
</head>

<body>
<iframe name="script_uploadForm" id="script_uploadFrame"  style="display:none"></iframe>
<a href="main.html" target="_top">返回目录页面</a>&nbsp&nbsp&nbsp~~~~~~&nbsp&nbsp&nbsp
<a href="logout.html" target="_self">退出</a>
<p>提交任务</p>
注意MR系统中如果是自己创建的MR，<font color="red">要把MR的报告人改为QA人员</font>，否则QA人员不会发布这个MR的相关脚本<p>
<form action="scriptCreateAction2!submitForm.html" method="post"  target="script_uploadForm" enctype="multipart/form-data" name="form1" id="form1">
	<table id="taskInfo" width="100%" cellpadding="0" cellspacing="0" border="1">
	<tr>
	<td class="field" id="ATTACHMENT_URL" style="border: 0px; display: none"></td>
	<td></td>
    </tr>
		<tr>
			<td>任务名称</td>
			<td><input type="text" name="taskName" id="taskName" readonly="true" value="${taskName}" size="57"/></td>
		</tr>
		<tr>
			<td>所属MR编号，给QA人员收集要发布的脚本用的</td>
			<td><input type="text" name="issueId" id="issueId" value="${(issueId)?default("")}" size="57"/></td>
		</tr>
		<tr>
			<td>任务描述，给现场工程看的</td>
			<td><textarea id="taskMemo" name="taskMemo" cols="50" rows="5" wrap="virtual" >${(taskMemo)?default("")}</textarea></td>
		</tr>
		<tr>
			<td>最终发布省份</td>
			<td>
				全选<input type="checkbox" name="allDestinationsCheck" id="allDestinationsCheck" onclick="alternateSelectedDestinationIdsStatus();" />
				<#if destinations?exists>
				<#list destinations as d>
				<input type="checkbox" name="taskDestination" id="taskDestination" value="${d.id}" onclick="changeTaskEnvironment();"  <#if ((taskDestination)?default(""))?contains("${d.id}")>checked="true"</#if> />${d.name}
				</#list>
				</#if>
			</td>
		</tr>
		<tr>
			<td>执行环境与时间</td>
			<td>
				<font color="red">如果在主干开发，开新分支时才需要在分支执行，请在分支上选手工执行</font>，以便开新分支时由QA人员统一同步<p>
				因为功能不上分支又在分支上执行脚本的话会导致发布出去的软件版本脚本升级了，但功能却没提交的问题<p>
				发布上海的在上海的主干和分支执行，发布其他省的在主干和分支执行<p>
				<table width="320" border="1">
					<#if environments?exists>
					<#list environments as e>
					<tr>
					<td width="160"><input type="checkbox" name="taskEnvironment" id="taskEnvironment" value="${e.id}" <#if ((taskEnvironment)?default(""))?contains("${e.id}")>checked="true"<#else><#if e.name?contains("分支")>checked="true"</#if></#if>/>${e.name}</td>
					<td width="160"><label>
						<select name="taskEnvironmentExecutePoint" id="taskEnvironmentExecutePoint">
							<option value=""></option>
						<#if dictExecutePoints?exists>
						<#list dictExecutePoints as p>
							<option value="${e.id}-${p.id}" <#if ((taskEnvironmentExecutePoint)?default(""))?contains("${e.id}-${p.id}")>selected="selected"</#if> >${p.name}</option>
						</#list>
						</#if>
						</select>
					</label></td>
					</tr>
					</#list>
					</#if>
					 <tr>
					    <!--<td width="160">全选<input type="checkbox" name="allEnvironmentsCheck" id="allEnvironmentsCheck" onclick="alternateSelectedEnvironmentIdsStatus();" />
					    &nbsp 主干<input type="checkbox" name="ZGEnvironmentsCheck" id="ZGEnvironmentsCheck" onclick="alternateSelectedEnvironmentIdsStatusForZG();" />
					    &nbsp 分支<input type="checkbox" name="FZEnvironmentsCheck" id="FZEnvironmentsCheck" onclick="alternateSelectedEnvironmentIdsStatusForFZ();" /> 
					    </td>-->
					    <td width="160"></td>
					    <td width="160"><label>
					  <select name="allTaskEnvironmentExecutePoint" id="allTaskEnvironmentExecutePoint" onChange="alternateSelectedExecutePointStatus();" >
							  <option value=""></option>
						  <#if dictExecutePoints?exists>
						  <#list dictExecutePoints as p>
							  <option value="${p.name}">${p.name}</option>
						  </#list>
						  </#if>
                      </select>
					    </label></td>
				    </tr>
				</table>
			</td>
		</tr>
	</table>
	<p>
	<input type="button" name="addNewScriptBtn" id="addNewScriptBtn" value="追加脚本" onclick="createNewScriptTable();" /> bug:这个按钮在ie下不起作用，谁帮忙看看<input type="button" name="removeScriptBtn" id="removeScriptBtn" value="删除脚本" onclick="removeLastScriptTable();" />
	<br><font color="red">脚本类别很重要</font>，选错了会导致脚本执行结果与实际不一致，如果是修改表结构等不能回滚的操作必须选择DDL，更新数据选DML，编译存储过程选PROC，3种类型不要混在一起，分为多个脚本提交。因为查了资料发现分号和斜杠混用有可能导致sqlplus重复执行sql
	<br>
	<br><font color="red">目前发生的一些问题，请提交时注意，以后解决</font><p>
	1 每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果。<br/>
	2 每条sql语句中不能有空行，否则sql执行报错。<br/>
	3 存储过程和批量语句最后必须加单独一行的/指示sqlplus去编译或执行，否则会把系统挂起。<br/>
	4 脚本应该在plsql的command窗口中运行过才提交，在sql窗口中运行不可靠，因为语句中如果出现oracle的&符号，sqlplus会等待输入<br/>
	5 校验之前请确保脚本类别已经，否则校验结果为<font color="red">'null'</font>，<font color="red">需选好后再点校验</font><br/>
	</p>
	</br>
	
	<table id="table1" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td colspan="2" style="background-color: #ECECFF;">脚本1<input type="hidden" name="scripts[0].sequence" id="scripts[0].sequence" value="1"></td>
		</tr>
		<tr>
			<td>名称</td>
			<td><input type="text" name="scripts[0].name" id="scripts[0].name" readonly="true" value="${taskName}-script-1.sql" size="100"/></td>
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
			<td><input type="file" name="files" id="files" onchange="ReSetFileId('1');firstCheck()" />
			    <input type="button" name="checkButton" id="fileCheckButton1" style="display:none;" value="重新提交后点击此处完成校验" onclick="ReSetFileId("+scriptSeq+");firstCheck()" />
			</td>
		</tr>
		<tr>
			<td style="background-color: gray;">校验结果</td>
			<td id='result1'></td>
		</tr>
	</table>
	
     <input type="button" name="button" id="commitScript" value="提交" onclick="validateInput();"/>(提交结果1-2秒后显示在下一行：)</br>
     <input type="hidden" name="fileId" id="fileId" value="${(fileId)?default('0')}"/>
     <div id="submitResut" name="submitResut" style="border: 0px;background:#F75000; color:#FFF;display: none"></div>
     </br></br>
     <font color="#484891">注意：</font><font color="red">提交结果提示失败信息时，点击下面的重新提交按钮，使得上面的提交按钮再次可用~</font>（否则就重复提交了）~~~</br>
     <input type="button" name="button2" id="commitScript2" value="重新提交" disabled='true' onclick="reInput();"/>&nbsp&nbsp&nbsp~~~~~~~~~~~~&nbsp&nbsp
     <a href="main.html" target="_top">返回目录页面</a>
</form>

</body>

<script language="javascript">
var scriptSeq = 2; //全局使用的脚本seq
  
function removeLastScriptTable(){
   var tb = document.getElementById("table"+ (scriptSeq-1));
   tb.remove();
   if(scriptSeq>1){
   scriptSeq--;
   }
}  
  
function createNewScriptTable(){

    var form = document.getElementById("form1");
	var commitScriptBtn = document.getElementById("commitScript");

	var tb = document.createElement("table");
	tb.setAttribute("id","table" + scriptSeq);
	tb.setAttribute("width","100%");
	tb.setAttribute("cellpadding",0);
	tb.setAttribute("cellspacing",0);
	tb.setAttribute("border",1);
	
	var tr1 = document.createElement("tr");
	tb.appendChild(tr1);
	var tr2 = document.createElement("tr");
	tb.appendChild(tr2);
	var tr3 = document.createElement("tr");
	tb.appendChild(tr3);
	var tr4 = document.createElement("tr");
	tb.appendChild(tr4);
	var tr5 = document.createElement("tr");
	tb.appendChild(tr5);
	
	var td51 = document.createElement("td");
	td51.setAttribute("style","background-color: gray;");
	var text51 = document.createTextNode("校验结果");
	td51.appendChild(text51);
	tr5.appendChild(td51);
	var td52 = document.createElement("td");
	td52.setAttribute("id","result"+scriptSeq);
	tr5.appendChild(td52);
	
	
	var td11 = document.createElement("td");
	td11.setAttribute("colspan",2);
	td11.setAttribute("style","background-color: #ECECFF;");
	var text11 = document.createTextNode("脚本" + scriptSeq);
	td11.appendChild(text11);
	var input12 = document.createElement("input");
	input12.setAttribute("type","hidden");
	input12.setAttribute("name","scripts[" + (scriptSeq-1) + "].sequence");
	input12.setAttribute("id","scripts[" + (scriptSeq-1) + "].sequence");
	input12.setAttribute("value",scriptSeq);	
	td11.appendChild(input12);

	tr1.appendChild(td11);
	
	var td21 = document.createElement("td");
	var text21 = document.createTextNode("名称");
	td21.appendChild(text21);
	tr2.appendChild(td21);
	
	var td22 = document.createElement("td");
	var input22 = document.createElement("input");
	input22.setAttribute("type","text");
	input22.setAttribute("name","scripts[" + (scriptSeq-1) + "].name");
	input22.setAttribute("id","scripts[" + (scriptSeq-1) + "].name");
	input22.setAttribute("readonly","true");
	input22.setAttribute("size","100");
	input22.setAttribute("value","${taskName}-script-" + scriptSeq + ".sql");
	td22.appendChild(input22);
	tr2.appendChild(td22);
	
	var td31 = document.createElement("td");
	var text31 = document.createTextNode("脚本类别");
	td31.appendChild(text31);
	tr3.appendChild(td31);
	
	var td32 = document.createElement("td");
	<#if dictScriptTypes?exists>
	<#list dictScriptTypes as t>
	var input32${t_index+1} = document.createElement("input");
	input32${t_index+1}.setAttribute("type","radio");
	input32${t_index+1}.setAttribute("name","scripts[" + (scriptSeq-1) + "].scriptType");
	input32${t_index+1}.setAttribute("id","scripts[" + (scriptSeq-1) + "].scriptType");
	input32${t_index+1}.setAttribute("value","${t.id}");

	td32.appendChild(input32${t_index+1});
	
	var text32 = document.createTextNode("${t.name}");
	td32.appendChild(text32);
	</#list>
	</#if>
	tr3.appendChild(td32);
	
	var td41 = document.createElement("td");
	var text41 = document.createTextNode("文件");
	td41.appendChild(text41);
	tr4.appendChild(td41);
	var td42 = document.createElement("td");
	var input42 = document.createElement("input");
	input42.setAttribute("type","file");
	input42.setAttribute("name","files");
	input42.setAttribute("id","files");
	input42.setAttribute("onchange","ReSetFileId("+scriptSeq+");firstCheck()");
	td42.appendChild(input42);
	var input422 = document.createElement("input");
	input422.setAttribute("type","button");
	input422.setAttribute("name","checkButton");
	input422.setAttribute("id","fileCheckButton"+scriptSeq);
	input422.setAttribute("value","重新提交后点击此处完成校验");
	input422.setAttribute("onclick","ReSetFileId("+scriptSeq+");firstCheck()");
	input422.setAttribute("style","display:none;");
	td42.appendChild(input422);  
	tr4.appendChild(td42);

	form.insertBefore(tb,commitScriptBtn);

	scriptSeq++;
}  
  
function removeScriptIframe(){
   var tb = document.getElementById("scriptIframe"+(scriptSeq-1));
   //tb.remove();
   tb.parentNode.removeChild(tb);
   if(scriptSeq>1){
   scriptSeq--;
   }
}
 
function validateInput() {
	var result = false;
	
	var issueId = document.getElementById('issueId');
	if ('' == issueId.value) {
		alert('请填写mr编号描述');
		issueId.focus();
		return false;
	}
	
	var memo = document.getElementById('taskMemo');
	if ('' == memo.value) {
		alert('请填写任务描述');
		memo.focus();
		return false;
	}
	
	var taskDestinations = document.getElementsByName("taskDestination");
	for(var i=0; i<taskDestinations.length; i++) {
		var dest = taskDestinations[i];
		if (dest.type == "checkbox") {
			result = result || dest.checked;
		}
	}
	if (!result) {
		alert('至少选择一个发布目的地');
		return false;
	}

	//result = false;
	var taskEnvironments = document.getElementsByName("taskEnvironment");
	var taskEnvironmentExecutePoints = document.getElementsByName("taskEnvironmentExecutePoint");
	for(var i=0; i<taskEnvironments.length; i++) {
		var env = taskEnvironments[i];
		var point = taskEnvironmentExecutePoints[i];
		if (env.type == "checkbox") {
			result = result || env.checked;
		}
		if (env.checked) {
			if ('' == point.value) {
				alert('勾选某个执行环境后必须选择执行时间点');
				return false;
			}
		}
	}
	if (!result) {
		alert('至少选择一个执行环境');
		return false;
	}
	
	//alert("注释部分");
	for (var i=0; i<scriptSeq-1; i++) {
		result = false;
		var scriptTypes = document.getElementsByName("scripts[" + i + "].scriptType");
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
	}
	
	var files = document.getElementsByName("files");
	for(var i=0; i<files.length; i++) {
		var file = files[i];
		if (file.type == "file") {
			if ('' == file.value) {
				alert('请选择文件上传');
				return false;
			}
		}
	}
	
	
	for(var a=1;a<scriptSeq;a++){
	  //alert("result"+a);
	  var resultString = document.getElementById("result"+a).innerHTML;
	  //alert(resultString);
	  //alert(resultString=="验证通过！");
	  if(!(resultString=="验证通过！")){
	    alert("请确认所有文件校验通过！");
	    return false;
	  }
	}
	
	scriptFileSubmit();
	document.getElementById("commitScript").disabled=true;
	document.getElementById("commitScript2").disabled=false;
	document.getElementById("addNewScriptBtn").disabled=true;
	document.getElementById("removeScriptBtn").disabled=true;
	//return result;
	return true;
}

function alternateSelectedDestinationIdsStatus() {
	var allCheckCb = document.getElementById('allDestinationsCheck');
	var idCheckBoxs = document.getElementsByName('taskDestination');
	for (var i=0; i<idCheckBoxs.length-1; i++) {
		idCheckBoxs[i].checked = allCheckCb.checked;
	}
	//关联
	var idCheckBoxs = document.getElementsByName('taskEnvironment');
	for (var i=0; i<idCheckBoxs.length-1; i++) {
		idCheckBoxs[i].checked = allCheckCb.checked;
	}
}

function alternateSelectedEnvironmentIdsStatus() {
	var allCheckCb = document.getElementById('allEnvironmentsCheck');
	var idCheckBoxs = document.getElementsByName('taskEnvironment');
	for (var i=0; i<idCheckBoxs.length; i++) {
		idCheckBoxs[i].checked = allCheckCb.checked;
	}
}

function alternateSelectedExecutePointStatus() {
	var allSelectEP = document.getElementById('allTaskEnvironmentExecutePoint').value;
	var idSelects = document.getElementsByName('taskEnvironmentExecutePoint');
	var idCheckBoxs = document.getElementsByName('taskEnvironment');
	for(var i=0;i<idSelects.length; i++){
	  if(idCheckBoxs[i].checked==true){
	    var idSelect = idSelects[i].options;
	    for (var j=0; j<idSelect.length; j++) {
	       if(idSelect[j].text==allSelectEP){
	       idSelect[j].selected =true;
	      }
        }
	  }else{
	    var idSelect = idSelects[i].options;
	    idSelect[0].selected =true;
	  }
  }
}

function alternateSelectedEnvironmentIdsStatusForZG() {
	var ZGCheckCb = document.getElementById('ZGEnvironmentsCheck');
	var idCheckBoxs = document.getElementsByName('taskEnvironment');
	for (var i=0; i<idCheckBoxs.length; i++) {
	  if(idCheckBoxs[i].nextSibling.nodeValue.indexOf("主干")!=-1){
		idCheckBoxs[i].checked = ZGCheckCb.checked;
	   }
	}
}

function alternateSelectedEnvironmentIdsStatusForFZ() {
	var FZCheckCb = document.getElementById('FZEnvironmentsCheck');
	var idCheckBoxs = document.getElementsByName('taskEnvironment');
	for (var i=0; i<idCheckBoxs.length; i++) {
	  if(idCheckBoxs[i].nextSibling.nodeValue.indexOf("分支")!=-1){
		idCheckBoxs[i].checked = FZCheckCb.checked;
	   } 
	}
}

function changeTaskEnvironment(){
//关联
   var destinationCbs = document.getElementsByName('taskDestination');
   var environmentCbs = document.getElementsByName('taskEnvironment');
   //var ds = '';
   //确保上下两组checkboxs的顺序一致，否则关联出错.
   for (var i=0; i<destinationCbs.length; i++) {
	  environmentCbs[2*i].checked=destinationCbs[i].checked;
	  environmentCbs[2*i+1].checked=destinationCbs[i].checked;
    }
   
/*if(destinationCbs[i].checked){
	     //ds = destinationCbs[i].nextSibling.nodeValue;
		 for (var j=0; j<environmentCbs.length; j++) {
	        if(environmentCbs[j].nextSibling.nodeValue.indexOf("上海")!=-1){
		       environmentCbs[j].checked = destinationCbs[i].checked;
	        } 
	     }
	 }*/

}

function ReSetFileId(id){
  //alert("ReSetFileId "+id);
  document.getElementById("fileId").value = id;
}

var start;
window.onload = function () {
  var id = document.getElementById("fileId").value;
  //alert(id);
  start = setInterval("filesCheck("+id+")", 1000);
}


/*
//本代码可用
window.onload = function (){
  var id = document.getElementById("fileId").value;
  window.setTimeout("filesCheck("+id+")", 1000); 
  return true;
}
*/


function filesCheck(id) {
//alert("filesCheck "+id);
  if(typeof(id) == "undefined"){
    clearInterval(start);
    return true;
  }
  if (document.readyState == "complete") {
     try{
            var htmlStr = "${action.submitFormCheck()}";
            if (htmlStr){
				var resultDIV;
				resultDIV = parent.document.getElementById("result"+id);
				resultDIV.style.display = 'block';
				resultDIV.innerHTML = htmlStr;
				if(htmlStr.indexOf("验证通过") < 0){
				  parent.document.getElementById("fileCheckButton"+id).style.display='block'; 
				}else{
				  parent.document.getElementById("fileCheckButton"+id).style.display='none';
				}
			}
			clearInterval(start);
		}catch(err){
            return true;
        }
	}
}

for(var i=0;i<document.getElementsByName("choseRows").length;i++){ 
if(document.getElementsByName[i].checked==true){//得到选中的单选按钮如果要得到值 那么可以：

alert(document.getElementsByName[i].value);//弹出选中单选按钮的值
} 
}

function checkScriptType(){
  for(var i=0;i<document.getElementsByName("choseRows").length;i++){ 
    if(document.getElementsByName[i].checked==true){ 
       return true;
     } 
  } 
  return false;
}

function firstCheck(){
   var form = document.getElementById("form1");
   form.action="scriptCreateAction2!submitFormCheck2.html";
   form.submit();
   return true;
}

function reInput(){
   document.getElementById("commitScript").disabled=false;
   document.getElementById("addNewScriptBtn").disabled=false;
   document.getElementById("removeScriptBtn").disabled=false;
   document.getElementById("commitScript2").disabled=true;
   
   document.getElementById("submitResut").innerHTML='';
}
 
function scriptFileSubmit(){
   var form = document.getElementById("form1");
   form.action="scriptCreateAction2!submitForm.html"
   form.submit();
}

</script>
</html>