<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>

<link rel="stylesheet" type="text/css" href="${base}/resource/common/theme/default/style/index.css"></link>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/common/script/prototype.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/common/script/commons.js"></script>
	<script language="JavaScript" type="text/JavaScript" src="${base}/resource/common/script/support.js"></script>


<script>
Load.off();
Msg.exception({
	requestString:'${(Request["_reqeust_string_"])?if_exists?js_string}', 
	message:'${(Request["_exception_message_"])?if_exists?js_string}',
	stackTrace:'${(Request["_exception_stack_trace_"])?if_exists?js_string}'
});
</script>