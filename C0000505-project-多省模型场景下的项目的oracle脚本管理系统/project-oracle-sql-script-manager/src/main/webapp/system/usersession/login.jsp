<%@page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>

<html>
<head>
<title>中国移动网络资源管理系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
<script type="text/JavaScript" language="JavaScript" src="common/script/prototype/prototype.js"></script>
<script type="text/javascript" language="JavaScript" src="scripts/cookies.js"></script>
<script>
	//checkAndGetSVGViewer();
	function setFocus() {
		var userInput = document.forms[0].j_username;
		userInput.select();
		userInput.focus();
	}
	function resetInput(){
	    document.forms(0).j_username.value='';
	    document.forms(0).j_password.value='';
	    return false;
	}
	function xButtonOver(o) {
		//var o = $(x);
		//o.disabled = true;
		//o.style.backgroundColor = '#ECE9D8';
		o.className = 'x_button_over';
	}
	function xButtonOut(o) {
		//var o = $(x);
		//o.disabled = true;
		//o.style.backgroundColor = '#ECE9D8';
		o.className = 'x_button_out';
	}
</script>
<style>
	
	body {
		/*margin:0px auto;
		padding:0;*/		
		font-size:12px;		
		text-align:center;
		font-family:Verdana,Simsun;
		background-color:#F3F4F6;
	}
	.label {		
		color:#080870;				
		font-size:12px;
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
		background:url(./resource/component/image/x_btn_login_over.gif    ) #F9F9FF;
	}
	.x_button_out { 
		background:url(./resource/component/image/x_btn_login_out.gif    ) #F9F9FF;
	}	
</style>

</head>

<!-- title><fmt:message key="login.title"/></title --> 
<body onload="setFocus();">
	
	<table style="width:100%;height:100%;" border="0" align="center" cellpadding="0" cellspacing="0">
	<tr>
	<td style="vertical-align:middle;">
		
		<table style="width:800px;height:480px;border:1px solid #B2B2E0;background-color:#F3F4F6;background:url(./resource/component/image/login_background23.jpg) no-repeat 0 0 #FFF;" align="center" border="0" cellpadding="0" cellspacing="0">
			
		<tr>
		<td style="height:132;padding-left:20px;" colspan="2"><img src="./resource/component/image/logo_chinamobile.gif" /> &nbsp; <img src="./resource/component/image/logo_seperator.jpg" /> <!-- img src="./resource/component/image/logo_irm.jpg" / --></td>
		</tr>
		
		<tr>
		<td valign="top" style="padding-top:40px;padding-left:40px;height:165;font-weight:bold;color:#FFF;font-size:40px;background:url(./resource/component/image/login_frontground.jpg) no-repeat 0 0;" colspan="2">&nbsp;</td>
		</tr>
		
		<tr>
		<td style="width:378;">&nbsp;</td>
		<td valign="top">
			<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">
	        <form name="fom" id="loginForm" action="<c:url value="/authorize"/>" method="POST">
	        
	        <tr>
	        <td class="label" style="width:50px;height:32px;font-weight:bold;">登录名:</td>
	        <td><input name="j_username" id="j_username" type="text" class="x_input" size="15" value="${sessionScope.j_username}"/></td>
	        </tr>
	         
	        <tr>
	        <td class="label" style="height:28px;font-weight:bold;">密 码:</td>
	        <td><input name="j_password" id="j_password" type="password" class="x_input" size="15" value="${sessionScope.j_password}" onkeydown="if(13==event.keyCode) {document.forms[0].submit();}"/></td>
	        </tr>
	         
	        <tr>
	        <td style="height:24px;">&nbsp;</td>
	        <td class="label" style="color:#7193B5;"><a class="label" style="color:#7193B5;" href="#">常见问题</a> <!-- | 客户热线 013905710571－4670  --></td>	        
	        </tr>

	        <!-- input type="checkbox" name="j_remember" checked style="border-style:none;width:15px; ">
	    	<font color="black" size="2"><fmt:message key="login.rememberMe"/></font -->
	    	
	        <tr>
	        <td style="height:40px;">&nbsp;</td>
	        <td><input id="submitBtn" name="submitBtn" type="button" class="x_button_out" onclick="setCookieValueForLogin();document.forms[0].submit();" onmouseover="xButtonOver(this);" onmouseout="xButtonOut(this);" value="登 录">
	        <!-- input type="image" name="submitBtn" id="submitBtn" onClick="setCookieValueForLogin();" src="images/index/OK.jpg"  style="width:74px; height:25px;" value="" --> 
	        </td>
	        <!-- input type="image" src="images/index/NO.jpg"  style="width:74px; height:25px;" onclick="return resetInput();" -->	        
	        </tr>
	        
	        <tr>
	        <td style="height:30px;"><input type="hidden" id="j_remember" name="j_remember" checked="false">
	        	<input type="hidden" name="forceLogin" value=""/>
	          	<input type="hidden" name="redirect" value="<c:out value="${param.redirect}"/>"/></td>
	        <td valign="bottom"><div id="errorTip" name="errorTip" style="color:#FE2020;font-size:12px;font-weight:bold;border:1px solid #FF7342;width:200;background-color:#FFE4B9;display:none;"> &nbsp; 用户/ 密码错误 </div>&nbsp;</td>	        	        
	        </tr>
	        
	        </form>
	        </table>
		</td>
		</tr>
		
		<tr>
		<td valign="middle" style="height:20;padding-left:5px;font-size:12;color:#757575;background-color:#D8F0F6;" colspan="2">版本信息v1.0<!-- &nbsp; &nbsp; &nbsp;  font style="color:#7193B5;"><a style="color:#7193B5;" href="${base}/zjmobile/webstart/granite/jnlp/granite-core-client.jnlp">Granite Client</a> | <a style="color:#7193B5;" href="${base}/zjmobile/webstart/hotu/jnlp/hotu.jnlp">Hotu Client</a>| JDK1.5 | Arcgis Runtime</font --></td>
		</tr>
			
		</table>
	</td>
	</tr>		
	</table>

	
	
</body>


<script>
	getCookieValueForLogin();
	function test123(){
		alert(getCookie('j_checked'));
	}
	//if (!confirm('${sessionScope.errorMessage}')){return;}else{$('forceLogin').value = 1;setCookieValueForLogin();document.loginForm.submit();}
</script>



<c:if test="${sessionScope.errorMessage != null}">
<c:out value="<script>if (!confirm('${sessionScope.errorMessage}')){}else{document.getElementById('forceLogin').value = '1';document.loginForm.submit();}</script>" escapeXml="false" />
<script>
document.getElementById('errorTip').style.display='block';
</script>
<%session.removeAttribute("errorMessage");%>
</c:if>

</html>


<!-- table width="800"  border="0" align="center" cellpadding="0" cellspacing="0">
	  <tr>
	    <td width="116"><img src="images/index/lg_logo.jpg" width="116" height="121"></td>
	  <td width="884" valign="bottom"><img src="images/index/lg_name.jpg" width="475" height="49"></td>
	  </tr>
	</table>

	<table width="1000"  border="0" align="center" cellpadding="0" cellspacing="0">
	
	  <tr>
	    <td width="632" rowspan="2"><table id="__01" width="643" height="291" border="0" cellpadding="0" cellspacing="0">
	      <tr>
	        <td><img src="images/index/lg_left_01.jpg" width="320" height="155" alt=""></td>
	        <td><img src="images/index/lg_left_02.jpg" width="323" height="155" alt=""></td>
	      </tr>
	      <tr>
	        <td><img src="images/index/lg_left_03.jpg" width="320" height="136" alt=""></td>
	        <td><img src="images/index/lg_left_04.jpg" width="323" height="136" alt=""></td>
	      </tr>
	    </table></td>
	    <td colspan="2"><img src="images/index/lg_index_03.jpg" width="357" height="125" alt=""></td>
	  </tr>
	  <tr>
	    <td width="229" background="images/index/lg_index_04.jpg" valign="top"> 
	   
	        
	   </td>
	  <td width="128" align="right"><img src="images/index/lg_index_05.jpg" width="128" height="166" alt=""></td>
	  </tr>
	
	
	</table>
		<table width="1000"  border="0" align="center" cellpadding="0" cellspacing="0">
		  <tr>
		    <td><img src="images/index/lg_index_06.jpg" width="645" height="25" alt=""></td>
		    <td><img src="images/index/lg_index_07.jpg" width="227" height="25" alt=""></td>
		    <td><img src="images/index/lg_index_08.jpg" width="128" height="25" alt=""></td>
		  </tr>
		  <tr>
		    <td colspan="3" align="center"> <br>
			<font color="" size="2"><fmt:message key="main.chinamobile.name"/> &nbsp; <fmt:message key="main.copyright"/> &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;<fmt:message key="main.maintenance.phone"/></font><br>
			</td>
		    </tr>
		    <tr bgcolor=""> 
			    <td align="right"><br><font color="blue" size="2"><a href="${base}/zjmobile/webstart/granite/jnlp/granite-core-client.jnlp">Granite Client</a> | <a href="${base}/zjmobile/webstart/hotu/jnlp/hotu.jnlp">Hotu Client</a>| JDK1.5 | Arcgis Runtime</font></td>
			</tr>
		</table> 
		
	</form -->
<!-- irm team qq group:47438541 -->