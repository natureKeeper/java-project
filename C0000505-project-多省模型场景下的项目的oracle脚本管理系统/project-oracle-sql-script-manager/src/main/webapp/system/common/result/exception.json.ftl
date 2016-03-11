{
	$exception: {
		requestString:'${(Request["_reqeust_string_"])?if_exists?js_string}', 
		message:'${(Request["_exception_message_"])?if_exists?js_string}',
		stackTrace:'${(Request["_exception_stack_trace_"])?if_exists?js_string}'
	}
}