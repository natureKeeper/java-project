<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据库脚本管理系统</title>
</head>

<body>
<a href="main.html" target="_top">返回目录页面</a>
<p>控制面板</p>
<form action="dashboardAction.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	后台自动执行脚本线程状态：${autoExecThreadStatus}<p>
	最近一次执行脚本的信息：${latestExecutionStatus}<p>
	<#if userContext.user.memo?exists && ('admin'=userContext.user.memo || 'qa'=userContext.user.memo)>
	<input type="submit" name="manualExecBtn" id="manualExecBtn" value="手工执行" onclick="changeFormAction('dashboardAction!manualExec.html');"/>
	<input type="submit" name="switchExecThreadStatus" id="switchExecThreadStatus" value="暂停/恢复后台自动执行脚本的线程" onclick="changeFormAction('dashboardAction!switchExecThreadStatus.html');"/>
	<input type="submit" name="reflashThreadStatus" id="reflashThreadStatus" value="刷新后台自动执行脚本线程状态" onclick="changeFormAction('dashboardAction!reflashThreadStatus.html');"/>
	<input type="submit" name="testQqMsg" id="testQqMsg" value="测试qq消息功能" onclick="changeFormAction('dashboardAction!testQqMsg.html');"/>
	<p>当前状态: <#if taskScriptManagementService.isAllowSubmitScript()>允许<#else>禁止</#if>脚本提交
	<input type="submit" name="query" id="query" value="改变脚本提交权限" onclick="changeFormAction('dashboardAction!alterSubmitScriptAuthority.html')"/>bug: 这个按钮在ie下会发2次请求<p>
	</#if>	
	</form>
</body>

<script language="javascript">
function changeFormAction(url) {
	document.form1.action = url;
}
</script>
</html>