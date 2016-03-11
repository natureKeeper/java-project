<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据库脚本管理系统</title>
</head>

<body>
<a href="main.html" target="_top">返回目录页面</a>
<a href="logout.html" target="_self">退出</a><br/>
<#assign dictHelper=dictionaryViewHelper>

<#if userContext.user.memo?exists && ('admin'=userContext.user.memo || 'qa'=userContext.user.memo)>
<table width="1024" height="155" border="1" style="font-size:20px;font-weight:lighter;">
	<tr>
		<td><font color="red">
发布指南<br/>
先在MR系统中下载当前状态为Ready的MR列表excel文档<br/>
打开excel，把MR号那列拷贝到记事本，整理头尾多余的字符，只留下MR号<br/>
把MR号列表贴到下面的mr列表框中，点击“设置任务为验证成功”<br/>
这样就把MR系统中验证通过的MR相关的脚本设为待发布状态了<br/>
<br/>
对于一些MR，已经执行过脚本，但QA没来得及测试，MR系统中未置为Ready状态，需要人工确认是否要置为待发布状态，因为有些脚本虽然没验证，但不发布的话可能会导致现场出错<br/>
请点击“查询待确认成功的任务，以便手工确认成功”按钮查询这些脚本，并手工勾选要置为待发布的，点击“设置脚本为验证成功”按钮<br/>
<br/>
以上2步做好后就可以点击“查询确认成功或部分发布的任务，以便发布”，把要发布的勾中，点击“发布脚本”按钮，下载脚本包<br/></font>
		</td>
	</tr>
</table>

<table width="1024" height="155" border="1" style="font-size:20px;font-weight:lighter;">
	<tr>
		<td><font color="blue">
开新分支指南<br/>
先在查询框中查询分支未执行的脚本，然后在下面选择：把主干环境上执行成功的脚本同步到分支环境，点同步脚本按钮<br/>
再在查询框中查询上海分支未执行的脚本，然后在下面选择：把上海主干环境上执行成功的脚本同步到上海分支环境，点同步脚本按钮<br/>
如果还有其他主干和对应分支的环境如此类推<br/></font>
		</td>
	</tr>
</table>
</#if>
<p>查看脚本</p>
最近一次执行脚本的信息：${latestExecutionStatus}<p>
<form action="scriptManualExecuteAction.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	<p>
	  <!--input type="submit" name="query" id="query" value="查询所有脚本" onclick="formRedirectSubmit('scriptManualExecuteAction!queryAllScripts.html')"/><p-->
		查询任一环境执行失败的脚本，以便修正再执行<input type="submit" name="query" id="query" value="查询" onclick="formRedirectSubmit('scriptManualExecuteAction!queryScriptsAnyEnvExecFail.html');"/><p>
		 查询任一环境未执行的脚本，以便手工执行<input type="submit" name="query" id="query" value="查询" onclick="formRedirectSubmit('scriptManualExecuteAction!queryScriptsAnyEnvWaitingExec.html');"/><p>
		查询待确认成功的任务，以便手工确认成功<input type="submit" name="query" id="query" value="查询" onclick="formRedirectSubmit('scriptManualExecuteAction!queryScriptsAllEnvExecSuccess.html');"/><p>
		查询确认成功或部分发布的任务，以便发布<input type="submit" name="query" id="query" value="查询" onclick="formRedirectSubmit('scriptManualExecuteAction!queryScriptsConfirmSuccessOrPartiallyRelease.html');"/><p>
	</p>
	<p><font color="red">脚本在状态为执行成功的环境上是不会再执行的，脚本执行成功后发现有问题必须重新提交新脚本，而不要用重新上传脚本然后手工执行方式</font></p>
	<p>
		<table width="1024" height="155" border="1" style="font-size:12px;font-weight:lighter;">
			<tr>
				<td>MR编号(末尾加$为精确查询)</td>
				<td>任务状态</td>
				<td>脚本状态</td>
				<td>环境名称,环境状态</td>
				<td></td>
			</tr>
			<tr>
				<td>
					<input type="text" name="issueIdToQuery" id="issueIdToQuery" style="width:100px;" />
				</td>
				<td>
					<select name="taskStatusToQuery" id="taskStatusToQuery">
						<option value="-1"></option>
						<#list taskStatuses as e>
						<option value="${e.id}">${e.name}</option>
						</#list>
					</select>
				</td>
				<td>
					<select name="scriptStatusToQuery" id="scriptStatusToQuery">
						<option value="-1"></option>
						<#list scriptStatuses as e>
						<option value="${e.id}">${e.name}</option>
						</#list>
					</select>
				</td>
				<td>
					<select name="environmentCodeToQuery" id="environmentCodeToQuery">
						<option value=""></option>
						<#list environments as e>
						<option value="${e.code}">${e.name}</option>
						</#list>
					</select>
					<select name="environmentStatusToQuery" id="environmentStatusToQuery">
						<option value="-1"></option>
						<#list environmentStatuses as e>
						<option value="${e.id}">${e.name}</option>
						</#list>
					</select>
				</td>
				<td><input type="submit" name="query" id="query" value="查询" onclick="formRedirectSubmit('scriptManualExecuteAction!queryScriptsByConditions.html');"/><p></td>
			</tr>
		</table>
		
	</p>
	<p>
	<p>查询结果的脚本列表的相关MR编号列表，共<#if resultIssueIds?exists>${resultIssueIds?size}<#else>0</#if>条记录，供QA人员在MR系统查询用</p>
	<#if resultIssueIds?exists>	
	<#list resultIssueIds as e>
	${e}<p>
	</#list>
	</#if>
	</p>
	<p>${reportTitle} (按脚本创建时间排序) 共<#if scripts?exists>${scripts?size}<#else>0</#if>条记录</p>
	<table width="1024" height="155" border="1" style="font-size:12px;font-weight:lighter;">
	  <tr>
	  	<th width="50" scope="col"><nobr>全选<input type="checkbox" name="allCheck" id="allCheck" onclick="alternateSelectedScriptIdsStatus();" /></nobr></th>
	  	<th width="30" scope="col"><nobr>序号</nobr></th>
	  	<th width="30" scope="col"><nobr>MR编号</nobr></th>
	  	<th width="50" scope="col"><nobr>脚本（点击查看内容）</nobr></th>
	  	<th width="50" scope="col"><nobr>脚本状态</nobr></th>
	  	<th width="120" scope="col"><nobr>各环境执行状态及耗时</nobr></th>
	    <th width="30" scope="col"><nobr>任务信息</nobr></th>
	    <th width="30" scope="col"><nobr>提交人和时间</nobr></th>	    
	    <th width="20" scope="col"><nobr>发布目的地</nobr></th>	    
	    <th width="50" scope="col"><nobr>脚本备注</nobr></th>
	  </tr>
	  
	  
	  <#if scripts?exists>
	  <#list scripts as script>
	  <tr>
	  	<td><input type="checkbox" name="selectedScriptIds" id="selectedScriptIds" value="${script.id}" /></td>
	  	<td>${script_index+1}</td>
	  	<td><nobr>${script.task.issueId!''}</nobr></td>
	    <td><nobr><a href="scriptManualExecuteAction!queryScriptDetail.html?scriptId=${script.id}" target="_blank">${script.name!''}</a></nobr></td>
	    <td><nobr>${dictHelper.getScriptStatusName(script.status)}</nobr></td>
	    <td>
	    <#list script.environmentRelations as envRela>
	    	<nobr>名: <strong>${envRela.environment.name!''}</strong>,
	    	点: <strong>${dictHelper.getExecutePointName(envRela.executePoint)}</strong>,
	    	状: <a href="scriptManualExecuteAction!queryScriptEnvironmentDetail.html?scriptEnvironmentId=${envRela.id}" target="_blank"><strong>${dictHelper.getEnvironmentStatusName(envRela.status)}</strong></a></nobr><p>
	    </#list>	    
	    </td>
	    <td><nobr>${script.task.name!''}</nobr><p><nobr>${dictHelper.getTaskStatusName(script.task.status)}</nobr></td>
	    <td><nobr>${script.task.user.name!''}</nobr><p><nobr>${script.task.createTime?string('yyyy-MM-dd HH:mm:ss')}</nobr></td>
	    <td>
	    <#list script.destinations as d>
	    	${d.name!''},
	    </#list>
	    </td>
	    <td><pre>${script.memo!''}</pre></td>
	  </tr>
	  </#list>
	  </#if>
	</table>
	  <p>

	<table width="1024" height="155" border="1" style="font-size:12px;font-weight:lighter;">
		<tr>
			<td>
			把<font color="red">选中的</font>环境未执行或执行失败的脚本执行，执行顺序为按脚本id排序，比如<p>
			主干执行，把选中的主干未执行或执行失败的脚本执行，执行顺序为按脚本id排序<p>
			分支执行，把选中的分支未执行或执行失败的脚本执行，执行顺序为按脚本id排序<p>
			<font color="red">脚本在状态为执行成功的环境上是不会再执行的，脚本执行成功后发现有问题必须重新提交新脚本，而不要用重新上传脚本方式</font><p>
			</td>
			<td>
				 要执行的环境名称: <p>
				<select name="toBeExecEnvironmentCode" id="toBeExecEnvironmentCode">
					<#list environments as e>
					<option value="${e.code}">${e.name}</option>
					</#list>		  	
				</select><p>
				<input type="button" name="execute" id="execute" value="执行脚本" onclick="formRedirectSubmit('scriptManualExecuteAction!executeScriptOnEnvironment.html');"/>
			</td>
		</tr>
		<#if userContext.user.memo?exists && ('admin'=userContext.user.memo || 'qa'=userContext.user.memo)>
		<tr>
			<td>
			把<font color="red">选中的</font>整体执行成功的脚本设置为验证成功状态（仅在要执行的分支都执行成功或不需要执行时）
			</td>
			<td>
			<input type="button" name="execute" id="execute" value="设置脚本为验证成功" onclick="formRedirectSubmit('scriptManualExecuteAction!updateScriptStatusToConfirmSuccess.html');"/><p>
			</td>
		</tr>
		
		<tr>
			<td>
			把<font color="red">用户输入的MR列表</font>对应的任务设置为验证成功状态<font color="red">（不需要在上面选中执行成功的任务）</font>
			</td>
			<td>mr列表<p><textarea id="issueIds" name="issueIds" cols="50" rows="5" wrap="virtual" ></textarea><p>
			<input type="button" name="execute" id="execute" value="设置任务为验证成功" onclick="formRedirectSubmit('scriptManualExecuteAction!confirmSuccessTasksByIssuesIds.html');"/><p>
			</td>
		</tr>
		
		<tr>
			<td>
			把<font color="red">选中的</font>确认成功或部分发布的脚本发布，按分支上执行时间排序
			</td>
			<td>
			<input type="button" name="execute" id="execute" value="发布脚本" onclick="formRedirectSubmit('scriptManualExecuteAction!releaseScripts.html');"/><p>
			</td>
		</tr>
		<tr>
			<td>
			把<font color="red">选中的</font>脚本设置为部分发布状态，同时要求更新备注（仅在脚本状态为已发布时）
			</td>
			<td>
			备注: <input type="text" name="memo" id="memo" style="width:600px;" /><p>
			<input type="button" name="execute" id="execute" value="设置脚本为部分发布" onclick="checkMemoBeforeSubmit('scriptManualExecuteAction!updateScriptStatusToPartialRelease.html');"/><p>
			</td>
		</tr>
		<tr>
			<td>
			把<font color="red">选中的</font>脚本同步源环境到目的环境，按源环境的执行顺序在目的环境上执行<p>
			先查询目的环境上未执行的脚本，然后按需同步<p>
			比如在开新分支情况下或要先在主干验证再在分支执行情况下使用，把主干执行成功，分支未执行的同步
			</td>
			<td>
			把环境
			  <select name="srcEnvironmentCode" id="srcEnvironmentCode">
			  <#list environments as e>
			  	<option value="${e.code}">${e.name}</option>
			  </#list>
			  </select>
			上执行成功的脚本同步到环境
			  <select name="destEnvironmentCode" id="destEnvironmentCode">
			  <#list environments as e>
			  	<option value="${e.code}">${e.name}</option>
			  </#list>
			  </select><p>
			  <input type="button" name="execute" id="execute" value="同步脚本" onclick="formRedirectSubmit('scriptManualExecuteAction!synchronizeSrcEnvToDectEnv.html');"/><p>
			</td>
		</tr>
		
		<tr>
			<td>
			把<font color="red">选中的</font>任务的所有脚本设置为废弃状态
			</td>
			<td>
			<input type="button" name="execute" id="execute" value="设置任务脚本为废弃" onclick="formRedirectSubmit('scriptManualExecuteAction!updateScriptStatusToDeprecated.html');"/><p>
			</td>
		</tr>
		
		<tr>
			<td>
			把<font color="red">选中的</font>任务的脚本环境状态强制更改
			</td>
			<td>
				<select name="environmentCodeForceToUpdate" id="environmentCodeForceToUpdate">
					<option value=""></option>
					<#list environments as e>
					<option value="${e.code}">${e.name}</option>
					</#list>
				</select>
				<select name="environmentStatusForceToUpdate" id="environmentStatusForceToUpdate">
					<option value="-1"></option>
					<#list environmentStatuses as e>
					<option value="${e.id}">${e.name}</option>
					</#list>
				</select>
				<input type="button" name="execute" id="execute" value="强制更改环境状态" onclick="checkForceEnvironmentAndStatusBeforeSubmit('scriptManualExecuteAction!forceUpdateEnvironmentStatus.html');"/><p>
			</td>
		</tr>
		</#if>
	</table>		  		 
		  		 
</form>
</body>

<script>
function formRedirectSubmit(url) {
	document.form1.action = url;
	document.form1.submit();
}

function alternateSelectedScriptIdsStatus() {
	var allCheckCb = document.getElementById('allCheck');
	var idCheckBoxs = document.getElementsByName('selectedScriptIds');
	for (var i=0; i<idCheckBoxs.length; i++) {
		idCheckBoxs[i].checked = allCheckCb.checked;
	}
}

function checkMemoBeforeSubmit(url) {
	var memo = document.getElementById('memo');
	if ('' == memo.value) {
		alert('请填写备注');
		memo.focus();
		return false;
	}
	formRedirectSubmit(url);
}

function checkForceEnvironmentAndStatusBeforeSubmit(url) {
	var environmentCodeForceToUpdate = document.getElementById('environmentCodeForceToUpdate');
	if ('' == environmentCodeForceToUpdate.value) {
		alert('请选择目标环境');
		environmentCodeForceToUpdate.focus();
		return false;
	}
	var environmentStatusForceToUpdate = document.getElementById('environmentStatusForceToUpdate');
	if (0 >= environmentStatusForceToUpdate.value) {
		alert('请选择目标环境状态');
		environmentStatusForceToUpdate.focus();
		return false;
	}
	formRedirectSubmit(url);
}

<!--
/需要测试通过后才能打开注释
function document.onkeydown(){                //网页内按下回车触发
    if(event.keyCode==13)
    {
        document.getElementById("query5").click();   //query5--99行
        return false;                               
    }
}
-->

</script>
</html>
