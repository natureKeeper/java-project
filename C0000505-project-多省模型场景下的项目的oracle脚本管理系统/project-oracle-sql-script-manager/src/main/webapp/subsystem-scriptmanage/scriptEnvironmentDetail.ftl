<html>
<body>
<#assign dictHelper=dictionaryViewHelper>
环境名称: <strong>${scriptEnvironmentRelation.environment.name!''}</strong>,
执行时间点: <strong>${dictHelper.getExecutePointName(scriptEnvironmentRelation.executePoint)}</strong>,
当前状态: <strong>${dictHelper.getEnvironmentStatusName(scriptEnvironmentRelation.status)}</strong>,
最后一次执行时间: <#if scriptEnvironmentRelation.latestExecuteTime?exists>${scriptEnvironmentRelation.latestExecuteTime?string('yyyy-MM-dd HH:mm:ss')}</#if>,
最后一次执行耗时: ${scriptEnvironmentRelation.latestElapsedTime!''}

<textarea name="contents" cols="100" rows="20" wrap="off">
<#if scriptEnvironmentRelation?exists>
<#if scriptEnvironmentRelation.lastLog?exists>
${scriptEnvironmentRelation.lastLog.message!""}
</#if>
</#if>
</textarea><br>
程序根据执行结果中是否包含这些关键字判断是否执行失败的<br>
ERROR at<br>
ORA-<br>
PLS-<br>
SP2-<br>
</body>
</html>