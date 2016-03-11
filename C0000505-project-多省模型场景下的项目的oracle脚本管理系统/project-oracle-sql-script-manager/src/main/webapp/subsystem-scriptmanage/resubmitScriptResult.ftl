<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
</head>
<body>
<a href="scriptManualExecuteAction.html" target="_top">返回脚本管理页面</a><p>
<xmp>
<#if errorMessage?exists>
提交失败，错误信息: 
${errorMessage}
<#else>
提交成功
</#if>
</xmp>
</body>
</html>