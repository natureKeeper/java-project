<html>
<head>
<#include "/resource/prototype/include.ftl" />

</head>
<body style="margin:0;overflow-x:hidden;" scroll="no">
	<br>
	<img src="${base}/resource/extjs/common/theme/default/image/error.jpg">
	<br>
	<font style="size:20;color:red;padding:30px 30px 30px 30px;">
		<#if Request["_exception_message_"]?exists>
			${(Request["_exception_message_"])?if_exists?js_string}
		<#else>
			未知错误
		</#if>
	</font>
<script language="JavaScript" type="text/JavaScript">
Load.off();
/**
Msg.exception({
	requestString:'${(Request["_reqeust_string_"])?if_exists?js_string}', 
	message:'${(Request["_exception_message_"])?if_exists?js_string}', 
	stackTrace:'${(Request["_exception_stack_trace_"])?if_exists?js_string}'
});
**/
</script>

</body>
</html>
