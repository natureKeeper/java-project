<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ page isErrorPage="true" %>
<html>
<head>
<title>Exception</title>

<style>
BODY {
	font-size:12px;
	font-family:Verdana,STXinwei,Simsun;	
}
.x_form_label {
	border-top:1px solid #EEE;
	border-right:1px solid #EEE;
	height:18px;
	padding:1px;
	font-size:12px;
}
.x_form_field {
	border-top:1px solid #EEE;
	padding:1px;
	font-size:12px;
}
</style>

</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">

<table style="width:100%;height:100%;border:5 red solid;" cellpadding="0" cellspacing="0" border="0">

<tr>
<td style="height:30;color:#F00;font-size:18px;font-weight:bold;white-space:nowrap;"> &nbsp; Exception occurs</td>
</tr>

<tr>
<td valign="top">

	

<%
Object exceptionType = request.getAttribute("javax.servlet.error.exception_type");
Object message = request.getAttribute("javax.servlet.error.message");
//java.io.StringWriter writer = null;
String fullStackTrace = null;
String rootCauseStackTrace = null;
Throwable rootCause = null;

Throwable throwable = (Throwable)request.getAttribute("javax.servlet.error.exception");
if(null==throwable)  {
	throwable = (Throwable)request.getAttribute("javax.servlet.jsp.jspException");
}
if(null!=throwable) {
	rootCause = org.apache.commons.lang.exception.ExceptionUtils.getRootCause(throwable);
	if(null!=rootCause) {
		rootCauseStackTrace=  org.apache.commons.lang.exception.ExceptionUtils.getFullStackTrace(rootCause);
	}
	if(throwable!=rootCause) {
		fullStackTrace = org.apache.commons.lang.exception.ExceptionUtils.getFullStackTrace(throwable);
	}
	//exceptionType = throwable.getClass();
	//message = throwable.getMessage();	
	//writer = new java.io.StringWriter();
	//throwable.printStackTrace(new java.io.PrintWriter(writer));
}
%>
	<table style="width:100%;height:100%;" cellpadding="0" cellspacing="0" border="0">
	<!--    style="background-color:#EAF3FE;"-->
	<tr>
	<td class="x_form_label" style="width:120;">status code</td>
	<td class="x_form_field"><%=request.getAttribute("javax.servlet.error.status_code")%></td>
	</tr>
	<tr>
	<td class="x_form_label" onclick="switchEncoding();">request uri</td>
	<td class="x_form_field" id="requestUri" encoded="true"><%=request.getAttribute("javax.servlet.error.request_uri")%></td>
	</tr>
    <tr>
	<td class="x_form_label">servlet name</td>
	<td class="x_form_field"><%=request.getAttribute("javax.servlet.error.servlet_name")%></td>
	</tr>
    <tr>
	<td class="x_form_label">message</td>
	<td class="x_form_field"><%=message%></td>
	</tr>
	
	<% if(null!=exceptionType) { %>
    <tr style="background-color:#EAF3FE;">
	<td class="x_form_label" nowrap="no">exception type</td>
	<td class="x_form_field"><%=exceptionType%></td>
	</tr>
	<% } %>
	
	<% if(null!=rootCause) { %>
    <tr>
	<td class="x_form_label" style="height:<% if(null!=fullStackTrace) { %>60%<% }else { %>99%<% } %>;">root cause</td>
	<td class="x_form_field">
		<table style="width:100%;height:100%;table-layout:fixed;" cellpadding="0" cellspacing="0" border="0">
    	<tr>
		<td>	
	    	<div style="width:100%;height:100%;overflow:auto;"><strong><pre style="font-size:12;font-family:Verdana,Simsun;"><%=rootCauseStackTrace%></pre></strong></div></td>
		</tr>
		</table>
	</tr>
	<% } %>
	
	<% if(null!=fullStackTrace) { %>
	<tr>
	<td class="x_form_label" style="height:30%;">stack trace</td>
	<td class="x_form_field">
		<table style="width:100%;height:100%;table-layout:fixed;" cellpadding="0" cellspacing="0" border="0">
    	<tr>
		<td>	
	    	<div style="width:100%;height:100%;overflow:auto;"><pre style="font-size:12;font-family:Verdana,Simsun;"><%=fullStackTrace%></pre></div></td>
		</tr>
		</table>
	</tr>
	<% } %>	
	</table>
	
</td>
</tr>
</table>

<script>
function switchEncoding() {
	var o = document.getElementById('requestUri');
	if('true'==o.encoded) {
		o.innerHTML = decodeURIComponent(o.innerHTML);
		o.encoded = 'false';
	} else {
		o.innerHTML = encodeURIComponent(o.innerHTML);
		o.encoded = 'true';
	}
}
</script>

</body>
<script>
function onLoad() {
	switchEncoding();
	window.status = 'onLoad';
}

function onUnload() {
	window.status = 'onUnload';	
}
</script>
</html>
