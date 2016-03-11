<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
</head>
<body>
<a href="scriptCreateAction.html?issueId=${(issueId)?default("")}&taskMemo=${(taskMemo)?default("")}&taskDestination=${(taskDestination)?default("")}&taskEnvironment=${(taskEnvironment)?default("")}&taskEnvironmentExecutePoint=${(taskEnvironmentExecutePoint)?default("")}&filesFileName=${(filesFileName)?default("")}" target="_top">返回提交页面</a>
<a href="main.html" target="_top">返回目录页面</a><p>
<xmp>
<#if errorMessage?exists>
提交失败，错误信息: 
${errorMessage}
<#else>
提交成功，请耐心等待3分钟左右系统会自动执行脚本的，执行结果会通过qq通知，请在脚本执行成功后把MR转给相关QA验证
</#if>
</xmp>
</body>
</html>