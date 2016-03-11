<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
</head>
<body>
<a href="scriptManualExecuteAction.html" target="_top">返回管理页面</a><p>
<xmp>
<#if errorMessage?exists>
执行结果: 
${errorMessage}
<#elseif successMessage?exists>
操作成功，成功信息：
${successMessage}
<#else>
操作成功
</#if>
</xmp>
</body>
</html>