<html>
<head>
<title>数据库脚本管理系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>

<script>
function detectBrowser() {
	var browser=navigator.userAgent;
	var b_version=navigator.appVersion;

	if (0 > browser.indexOf('Chrome') && 0 > browser.indexOf('Firefox')) {
		alert('暂时不支持ie');
		window.location.href="kickout.html"
	}
}

/**  
* 设置Cookie  
*   
* @param {} name  
* @param {} value  
*/  
function setCookie(name, value) {  
var argv = setCookie.arguments;  
var argc = setCookie.arguments.length;  
var expires = (argc > 2) ? argv[2] : null;  
if (expires != null) {  
var LargeExpDate = new Date();  
LargeExpDate.setTime(LargeExpDate.getTime()  
+ (expires * 1000 * 3600 * 24));  
}  
document.cookie = name  
+ "="  
+ escape(value)  
+ ((expires == null) ? "" : ("; expires=" + LargeExpDate  
.toGMTString()));  
}  
  
/**  
* 获取Cookie  
*   
* @param {} Name  
* @return {}  
*/  
function getCookie(Name) {  
var search = Name + "="  
if (document.cookie.length > 0) {  
offset = document.cookie.indexOf(search)  
if (offset != -1) {  
offset += search.length  
end = document.cookie.indexOf(";", offset)  
if (end == -1)  
end = document.cookie.length  
return unescape(document.cookie.substring(offset, end))  
} else  
return ""  
}  
}  
  
/**  
* 从缓存中清除Cookie  
*   
* @param {} name  
*/  
function clearCookie(name) {  
var expdate = new Date();  
expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));  
setCookie(name, "", expdate);  
}  

function setFocus() {
	var userInput = document.forms[0].username;
	userInput.select();
	userInput.focus();
}
function resetInput(){
    document.forms[0].username.value='';
    document.forms[0].password.value='';
    return false;
}
function xButtonOver(o) {		
	o.className = 'x_button_over';
}
function xButtonOut(o) {		
	o.className = 'x_button_out';
}

function onLoginFormSubmit() {
	if(''==document.forms[0].username.value) {
		alert('\"用户名\"不能为空');
	} else if(''==document.forms[0].password.value) {
		alert('\"密码\"不能为空');
	} else {
		document.forms[0].submit();
	}
}
</script>

<style>	
BODY {
	/*margin:0px auto;
	padding:0;*/		
	font-size:12px;		
	text-align:center;
	font-family:Verdana,Simsun;
	background-color:#F3F4F6;
}
.label {		
	color:#0E0C53;				
	font-size:12px;
	text-align:right;
	/* font-weight:bold; */
}
.x_input {		
	width:200px;
	height:20px;
	color:#000;		
	font-size:12px;
	background-color:#FBFBFC;
	border:#A7BAC3 1px solid;
	font-family:Verdana,Simsun;
}
.x_button_over ,
.x_button_out  {	 
	width:80px;
	height:28px;
	font-size:12px;
	color:#080870;
	overflow:visible;
	padding-top:2px;
	padding-left:3px;
	padding-right:3px;
	vertical-align:middle;
	font-weight:bold;
	cursor:pointer;
	border:0;/*border:1 #E7E7F4 solid;#A7B8D4*/
	border-color:#C3DAF9 #4F7EBE #4F7EBE #C3DAF9;
	font-family:Verdana,Simsun;
}
.x_button_over { 
	background:url(${base}/resource/system/theme/default/image/x_btn_login_over.gif    ) #F9F9FF;
}
.x_button_out { 
	background:url(${base}/resource/system/theme/default/image/x_btn_login_out.gif    ) #F9F9FF;
}	
</style>

</head>

<body style="margin:0;overflow-x:hidden;" scroll="no" onload="onLoad();" onunload="onUnload();">
	
	<table style="width:100%;height:100%;" border="0" align="center" cellpadding="0" cellspacing="0">
	<tr>
	<td  valign="middle" align="middle" style="height:20;padding-left:5px;font-size:30;color:#757575;background-color:#D8F0F6;" colspan="2">数据库脚本管理系统</td>
	</tr>
	<tr>
	<td style="vertical-align:middle;">
		
		<table style="width:656px;height:525px;border:1px solid #B2B2E0;background-color:#F3F4F6;background:url(${base}/resource/system/theme/default/image/login_background.jpg) no-repeat 0 0 #FFF;" align="center" border="0" cellpadding="0" cellspacing="0">
			
		<tr>
		<td style="height:128;padding-left:20px;" colspan="2"><!-- img src="${base}/resource/system/theme/default/image/logo_chinamobile.gif" /> &nbsp; <img src="${base}/resource/system/theme/default/image/logo_seperator.jpg" / --> <!-- img src="./resource/component/image/logo_irm.jpg" / --> &nbsp; </td>
		</tr>
		
		<!--tr>
		<td valign="top" style="padding-top:40px;padding-left:40px;height:165;font-weight:bold;color:#FFF;font-size:40px;background:url(${base}/resource/system/theme/default/image/login_splash.png) no-repeat 0 0;" colspan="2">&nbsp;</td>
		</tr-->
		
		<tr>
		<td style="width:378;">&nbsp;</td>
		<td valign="top">
			<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">
	        <form name="fom" id="fom" action="login!doLogin.html" method="POST" onsubmit="onLoginFormSubmit();">
	        	        
	        <tr>
	        <td class="label" style="width:50px;height:32px;">登录名: &nbsp; </td>
	        <td><input id="username" name="username" type="text" class="x_input" size="15" value=""/></td>
	        </tr>
	         
	        <tr>
	        <td class="label" style="height:28px;">密码: &nbsp; </td>
	        <td><input id="password" name="password" type="password" class="x_input" size="15" onkeydown="if(13==event.keyCode) {document.forms[0].submit();}" value="aaaaaa"/></td>
	        </tr>
	         
	        <tr>
	        <td style="height:24px;">&nbsp;</td>
	        <td class="label" style="text-align:left;color:#7193B5;"></td>	        
	        </tr>

	        <!-- input type="checkbox" name="remember" checked style="border-style:none;width:15px; ">
	    	<font color="black" size="2"></font -->
	    	
	        <tr>
	        <td style="height:40px;">&nbsp;</td>
	        <td style="font-size:12px;">
	        <input id="submitBtn" name="submitBtn" type="button" class="x_button_out" onclick="onLoginFormSubmit();" onmouseover="xButtonOver(this);" onmouseout="xButtonOut(this);" value="登 录">
	         &nbsp; 
	        <input id="resetBtn" name="resetBtn" type="button" class="x_button_out" onclick="//document.forms[0].submit();" onmouseover="xButtonOver(this);" onmouseout="xButtonOut(this);" value="重 置">
	        
	        <input type="hidden" id="forceLogin" name="forceLogin" value="false" />
	        </td>
	        </tr>
	        
	        <#if failureMessage ??>
	        <tr>
	        <td style="height:30px;"><input type="hidden" id="remember" name="remember" checked="false" /></td>
	        <td valign="bottom"><div id="errorTip" name="errorTip" style="color:#FE2020;font-size:12px;font-weight:bold;border:1px solid #FF7342;width:200;background-color:#FFE4B9;"> &nbsp; ${(failureMessage)?if_exists} </div>&nbsp;</td>	        	        
	        </tr>
	        </#if>
	        
	        </form>
	        </table>
		</td>
		</tr>
		
		<tr>
		<td valign="middle" style="height:20;padding-left:5px;font-size:30;color:red;background-color:#D8F0F6;" colspan="2">本系统暂时不支持ie，推荐用原生chrome</td>
		</tr>
		
		<tr>
		<td valign="middle" style="height:20;padding-left:5px;font-size:12;color:#757575;background-color:#FFF0BB;" colspan="2">Powered by wusuirong, qq:49132515</td>
		</tr>
			
		</table>
	</td>
	</tr>		
	</table>

	
	
</body>

<script>
function onLoad() {
	setFocus();
	//getCookieValueForLogin();
	window.status = 'onLoad';
	detectBrowser();
}

function onUnload() {
	window.status = 'onUnload';
}
function test123() {
	alert(getCookie('checked'));
}
//if (!confirm('{sessionScope.errorMessage}')){return;}else{$('forceLogin').value = 1;setCookieValueForLogin();document.loginForm.submit();}

<#if alreadyLogin ??>
<#if true = alreadyLogin>
if (window.confirm('系统发现此账号已经登录了，是否要尝试强制登录并让当前活动用户下线？')) {
	document.forms[0].username.value = '${username}';
	document.forms[0].password.value = '${password}';
	document.forms[0].forceLogin.value = 'true';
	document.forms[0].submit();
}
</#if>
</#if>
</script>

</html>


<!-- irm team qq group:47438541 -->