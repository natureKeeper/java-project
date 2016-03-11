<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据库脚本管理系统</title>
</head>

<body>
<a href="main.html" target="_top">返回目录页面</a>
<a href="logout.html" target="_self">退出</a>
<p>提交任务</p>
注意MR系统中如果是自己创建的MR，<font color="red">要把MR的报告人改为QA人员</font>，否则QA人员不会发布这个MR的相关脚本<p>
<form action="scriptCreateAction!submitForm.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	<table id="taskInfo" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td>任务名称</td>
			<td><input type="text" name="taskName" id="taskName" readonly="true" value="${taskName}" size="57"/></td>
		</tr>
		<tr>
			<td>所属MR编号，给QA人员收集要发布的脚本用的</td>
			<td><input type="text" name="issueId" id="issueId" value="" size="57"/></td>
		</tr>
		<tr>
			<td>任务描述，给现场工程看的</td>
			<td><textarea id="taskMemo" name="taskMemo" cols="50" rows="5" wrap="virtual" ></textarea></td>
		</tr>
		<tr>
			<td>最终发布省份</td>
			<td>
				全选<input type="checkbox" name="allDestinationsCheck" id="allDestinationsCheck" onclick="alternateSelectedDestinationIdsStatus();" />
				<#if destinations?exists>
				<#list destinations as d>
				<input type="checkbox" name="taskDestination" id="taskDestination" value="${d.id}" />${d.name}
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
				<table width="294" border="1">
					<#if environments?exists>
					<#list environments as e>
					<tr>
					<td width="100"><input type="checkbox" name="taskEnvironment" id="taskEnvironment" value="${e.id}" <#if e.name?contains("分支")>checked="true"</#if>/>${e.name}</td>
					<td width="150"><label>
						<select name="taskEnvironmentExecutePoint" id="taskEnvironmentExecutePoint">
							<option value=""></option>
						<#if dictExecutePoints?exists>
						<#list dictExecutePoints as p>
							<option value="${e.id}-${p.id}">${p.name}</option>
						</#list>
						</#if>
						</select>
					</label></td>
					</tr>
					</#list>
					</#if>
				</table>
				全选<input type="checkbox" name="allEnvironmentsCheck" id="allEnvironmentsCheck" onclick="alternateSelectedEnvironmentIdsStatus();" />
			</td>
		</tr>
	</table>
	<p>
	<input type="button" name="addNewScriptBtn" id="addNewScriptBtn" value="追加脚本" onclick="createScriptTable();" /> bug:这个按钮在ie下不起作用，谁帮忙看看
	<br><font color="red">脚本类别很重要</font>，选错了会导致脚本执行结果与实际不一致，如果是修改表结构等不能回滚的操作必须选择DDL，更新数据选DML，编译存储过程选PROC，3种类型不要混在一起，分为多个脚本提交。因为查了资料发现分号和斜杠混用有可能导致sqlplus重复执行sql
	<br>
	<br><font color="red">目前发生的一些问题，请提交时注意，以后解决</font><p>
	1 每条sql语句必须有分号结束，分号后必须换行，不能再添加注释，否则sql执行没效果。<br/>
	2 每条sql语句中不能有空行，否则sql执行报错。<br/>
	3 存储过程和批量语句最后必须加单独一行的/指示sqlplus去编译或执行，否则会把系统挂起。<br/>
	4 脚本应该在plsql的command窗口中运行过才提交，在sql窗口中运行不可靠，因为语句中如果出现oracle的&符号，sqlplus会等待输入<br/>
	</p>
	
	<table id="table1" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td colspan="2">脚本1<input type="hidden" name="scripts[0].sequence" id="scripts[0].sequence" value="1"></td>
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
			<td><input type="file" name="files" id="files" /></td>
		</tr>
	</table>
	
    <input type="submit" name="button" id="commitScript" value="提交" onclick="return validateInput();"/>
</form>
</body>

<script language="javascript">
var scriptSeq = 2;//全局使用的脚本seq

function createScriptTable() {
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
	
	var td11 = document.createElement("td");
	td11.setAttribute("colspan",2);
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
	td42.appendChild(input42);
	tr4.appendChild(td42);

	form.insertBefore(tb,commitScriptBtn);

	scriptSeq++;
}

function createScriptTableInIE() {
	var form = document.getElementById("form1");
	var commitScriptBtn = document.getElementById("commitScript");

	var div = document.getElementById("appendDiv");
	if(div==undefined||div==null){
		div = document.createElement("appendDiv");
		form.insertBefore(div,commitScriptBtn);
	}

	div.innerHTML = div.innerHTML + '<TABLE id="table' 
					+ scriptSeq 
					+ '" width="100%" border="1" cellpadding="0" cellspacing="0">'
					+ '<TR><TD colspan="2">脚本' + scriptSeq + '<INPUT id="scripts[' + (scriptSeq-1) + '].sequence" name="scripts[' + (scriptSeq-1) + '].sequence" type="hidden" value="' + scriptSeq + '"></TD></TR><TR>'
					+ '<TD>名称</TD><TD><INPUT id="scripts[' + (scriptSeq-1) + '].name" name="scripts[' + (scriptSeq-1) + '].name" value="${taskName}-' + scriptSeq + '.sql" readonly="true"></TD></TR>'
					+ '<TR><TD>脚本类别</TD><TD>'
					+ '<#if dictScriptTypes?exists><#list dictScriptTypes as t><INPUT id="scripts[' + (scriptSeq-1) + '].scriptType" name="scripts[' + (scriptSeq-1) + '].scriptType" type="radio" value="${t.id}" <#if 1==t_index>checked="true"</#if> >${t.name}</#list></#if>'
					+ '</TD></TR><TR><TD>文件</TD><TD><INPUT id="files" type="file"></TD></TR></TABLE>';
	
	var textarea = document.getElementById("taskMemo");
	textarea.value = div.innerHTML;
	alert(scriptSeq);
	scriptSeq++;
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

	result = false;
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
	
	return result;
}

function alternateSelectedDestinationIdsStatus() {
	var allCheckCb = document.getElementById('allDestinationsCheck');
	var idCheckBoxs = document.getElementsByName('taskDestination');
	for (var i=0; i<idCheckBoxs.length; i++) {
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
</script>
</html>