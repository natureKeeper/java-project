<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>数据库脚本管理系统</title>
</head>

<body>
<a href="main.html" target="_top">返回目录页面</a>
<a href="logout.html" target="_self">退出</a>
<p>回放脚本</p>

<form action="scriptPlaybackAction!submitForm.html" method="post" enctype="multipart/form-data" name="form1" id="form1">
	<table id="taskInfo" width="100%" cellpadding="0" cellspacing="0" border="1">
		<tr>
			<td>要回放脚本的环境</td>
			<td>
				<tr>
				<td width="150">
					<select name="taskEnvironment" id="taskEnvironment">
						<option value=""></option>
					<#if environments?exists>
					<#list environments as e>
						<option value="${e.id}">${e.name}</option>
					</#list>
					</#if>
					</select>
				</td>
				</tr>
			</td>
		</tr>
		
		<tr>
			<td>在此环境上最后执行成功的脚本名称</td>
			<td><input type="text" name="lastScriptName" id="lastScriptName" value="" size="200"/></td>
		</tr>
	</table>
	
    <input type="submit" name="button" id="playbackScript" value="执行" onclick="return validateInput();"/>
</form>
</body>

<script language="javascript">
function validateInput() {
	var result = false;
	
	var lastScriptName = document.getElementById('lastScriptName');
	if ('' == lastScriptName.value) {
		alert('请填写最后执行成功的脚本名称');
		lastScriptName.focus();
		return false;
	}
	
	result = false;
	var taskEnvironment = document.getElementsByName("taskEnvironment");
	if ('' == taskEnvironment.value) {
		alert('必须选择要回放脚本的环境');
		return false;
	}
	
	return true;
}
</script>
</html>