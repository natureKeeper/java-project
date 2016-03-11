<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
<p>提交任务</p>
<p>
  <label>
    <input type="submit" name="button2" id="button2" value="新增脚本" onclick="createScriptTable();" />
  </label>
</p>
<form action="scriptCreateAction!submitForm.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	<table id="taskInfo" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td>任务名称</td>
			<td><input type="text" name="taskName" id="taskName" readonly="true" value="${taskName?if_exists}"/></td>
		</tr>
		<tr>
			<td>任务描述</td>
			<td><textarea name="taskMemo" cols="50" rows="5" wrap="virtual" ></textarea></td>
		</tr>
		<tr>
			<td>最终发布省份</td>
			<td>
				<label><input type="checkbox" name="taskDestinationAll" id="taskDestinationAll" />全部</label>
				<#if destinations?exists>
				<#list destinations as d>
					<label><input type="checkbox" name="taskDestination" id="taskDestination" value="${d.id}"/>${d.name}</label>
				</#list>
				</#if>
			</td>
		</tr>
		<tr>
			<td>执行环境与时间</td>
			<td>
				  <table width="294" border="1">
				  	<tr>
				      <td width="70"><input type="checkbox" name="taskEnvironmentAll" id="taskEnvironmentAll" />全选</td>
				    </tr>
				    <#if environments?exists>
				    <#list environments as e>
				    <tr>
				      <td width="26"><input type="checkbox" name="taskEnvironment" id="taskEnvironment" value="${e.id}"/>${e.name}</td>
				      <td width="156"><label>
				        <select name="taskEnvironmentExecutePoint" id="taskEnvironmentExecutePoint">
				        <#if dictExecutePoints?exists>
				        <#list dictExecutePoints as p>
				        	<option value="${p.id}">${p.name}</option>
				        </#list>
				        </#if>
				        </select>
				      </label></td>
				    </tr>
				    </#list>
				    </#if>
				  </table>
			</td>
		</tr>
	</table>
	<p>
	<table id="table1" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td colspan="2">脚本1</td>
		</tr>
		<tr>
			<td>名称</td>
			<td><input type="text" name="scripts[0].name" id="scripts[0].name"  value="1根据用户选择下面的属性和脚本本地文件名自动生成唯一值"/></td>
		</tr>
		
		
		<tr>
			<td>脚本类别</td>
			<td>
			<#if dictScriptTypes?exists>
			<#list dictScriptTypes as t>
				<label><input type="radio" name="scripts[0].scriptType" value="${t.id}" id="scripts[0].scriptType" />${t.name}</label>
			</#list>
			</#if>
			</td>
		</tr>
		
		<tr>
			<td>最终发布省份<p>（不选则以任务为准）</td>
			<td>
				<label><input type="checkbox" name="scriptDestinationAll1" id="scriptDestinationAll1" />全部</label>
				<#if destinations?exists>
				<#list destinations as d>
					<label><input type="checkbox" name="scripts[0].scriptDestination" id="scripts[0].scriptDestination" value="${d.id}"/>${d.name}</label>
				</#list>
				</#if>
			</td>
		</tr>
		<tr>
			<td>执行环境与时间<p>（不选则以任务为准）</td>
			<td>
				  <table width="294" border="1">
				  	<tr>
				      <td width="70"><input type="checkbox" name="scriptEnvironmentAll1" id="scriptEnvironmentAll1" />全选</td>
				    </tr>
				    <#if environments?exists>
				    <#list environments as e>
				    <tr>
				      <td width="26"><input type="checkbox" name="scripts[0].scriptEnvironment" id="scripts[0].scriptEnvironment" ${e.id}"/>${e.name}</td>
				      <td width="156"><label>
				        <select name="scripts[0].scriptEnvironmentExecutePoint" id="scripts[0].scriptEnvironmentExecutePoint">
				        <#if dictExecutePoints?exists>
				        <#list dictExecutePoints as p>
				        	<option value="${p.id}">${p.name}</option>
				        </#list>
				        </#if>
				        </select>
				      </label></td>
				    </tr>
				    </#list>
				    </#if>
				  </table>
			</td>
		</tr>
			
		<tr>
			<td>文件</td>
			<td><input type="file" name="files" id="files" /></td>
		</tr>
		</tr>
	</table>
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	<table id="table1" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td colspan="2">脚本2</td>
		</tr>
		<tr>
			<td>名称</td>
			<td><input type="text" name="scripts[1].name" id="scripts[1].name"  value="2根据用户选择下面的属性和脚本本地文件名自动生成唯一值"/></td>
		</tr>
		
		
		<tr>
			<td>脚本类别</td>
			<td>
			<#if dictScriptTypes?exists>
			<#list dictScriptTypes as t>
				<label><input type="radio" name="scripts[1].scriptType" value="${t.id}" id="scripts[1].scriptType" />${t.name}</label>
			</#list>
			</#if>
			</td>
		</tr>
		
		<tr>
			<td>最终发布省份<p>（不选则以任务为准）</td>
			<td>
				<label><input type="checkbox" name="scriptDestinationAll1" id="scriptDestinationAll1" />全部</label>
				<#if destinations?exists>
				<#list destinations as d>
					<label><input type="checkbox" name="scripts[1].scriptDestination" id="scripts[1].scriptDestination" value="${d.id}"/>${d.name}</label>
				</#list>
				</#if>
			</td>
		</tr>
		<tr>
			<td>执行环境与时间<p>（不选则以任务为准）</td>
			<td>
				  <table width="294" border="1">
				  	<tr>
				      <td width="70"><input type="checkbox" name="scriptEnvironmentAll1" id="scriptEnvironmentAll1" />全选</td>
				    </tr>
				    <#if environments?exists>
				    <#list environments as e>
				    <tr>
				      <td width="26"><input type="checkbox" name="scripts[1].scriptEnvironment" id="scripts[1].scriptEnvironment" ${e.id}"/>${e.name}</td>
				      <td width="156"><label>
				        <select name="scripts[1].scriptEnvironmentExecutePoint" id="scripts[1].scriptEnvironmentExecutePoint">
				        <#if dictExecutePoints?exists>
				        <#list dictExecutePoints as p>
				        	<option value="${p.id}">${p.name}</option>
				        </#list>
				        </#if>
				        </select>
				      </label></td>
				    </tr>
				    </#list>
				    </#if>
				  </table>
			</td>
		</tr>
			
		<tr>
			<td>文件</td>
			<td><input type="file" name="files" id="files" /></td>
		</tr>
		</tr>
	</table>
    <input type="submit" name="button" id="submit" value="提交" />
</form>
</body>

<script language="javascript">
function AttachEvent(target, eventName, handler, argsObject) {
	var eventHander = handler;
	if (argsObject) {
		eventHander = function(e) {
			handler.call(argsObject, e);
		}
	}
	if (window.attachEvent)// IE
		target.attachEvent("on" + eventName, eventHander);
	else
		// FF
		target.addEventListener(eventName, eventHander, false);
}

function test(){
	alert("my name is button");
}
function test1(){
	alert("my name is  text");
}
function test2(obj){
	alert(this.value);
}

function createScriptTable() {
	var form = document.getElementById("table1");

	var tb = document.createElement("table");
	tb.setAttribute("id","New_table");
	tb.setAttribute("border",1);
	var tr = document.createElement("tr");
	var td1 = document.createElement("td");

	var input1 = document.createElement("input");
	input1.setAttribute("type","button");
	input1.setAttribute("value","button");
	input1.attachEvent("onclick", test);

	td1.appendChild(input1);
	tr.appendChild(td1);
	tb.appendChild(tr);

	form.appendChild(tb);

}
</script>
</html>