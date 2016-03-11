
<style type="text/css">
#userMsg{
	vertical-align:bottom;
}
#sidebar a:link{
	color:#FFFFFF;
 	text-decoration:underline;
},
#sidebar a:visited   {
    color:yellow;
    text-decoration:underline;
}
#sidebar a:hover{
 	color:#7CFC00;
},
#sidebar a:active   {
	color:#FF0000;
    text-decoration:underline;
}
 
</style>
 
<table style="width:100%;height:100%;" border="0" cellspacing="0" cellpadding="0" >
<tr align="right">
	<td class="font_navigate" style="text-align:right">欢迎:<span class="span_anchor"><a onclick="update_UserInfo();">admin管理员</a></span> 登录 | 在线人数:<span class="span_anchor" id="useronline">...</span>人 |  <a href="" class="span_anchor">帮助</a> | 
	<a href="#" style="text-decoration:none;" onclick="checkLogout();"><span class="span_anchor"><img src="resource/system/theme/default/image/logout.jpg" align="absmiddle"/>&nbsp;退出</span></a></td>
</tr>
</table>

<script language="JavaScript" type="text/Javascript">


function checkLogout(){
	if (!confirm("确认退出系统吗?")){
		return;
	}
	location="logout.html?random="+Math.random();
}
function getExttheme(){
	var t = Ext.get('exttheme');
	return t;
}
function testCssClass(){
	var headers = $('Layer1').getElementsByClassName('head');
	Ext.each(headers, function(header, index){
        if(header==location.href){
        	//Ext.Msg.alert('Alert',header);
        	//header.className = 'headbarvisited';
        	header.style.color = 'red';
        }
    });
}

function openNoticeMsgWindow(id){
     var url = "noMenuViewNotice." + URL_SUFFIX+"?entityId="+id;
	 var features = "dialogWidth:800px;dialogHeight:530px;scrollbars:yes;status:no;help:no;resizable:1;";
     openModalDialogWindow(url,window,features)
}
//滚动公告使用
function getNotice(){
	var paramObj = {};
	paramObj['start'] = 0;
	paramObj['limit'] = 10;
	Ext.Ajax.request({
	   url: 'XMLHttpRequestNoticeQryForYUI.'+URL_SUFFIX,
	   success: afterGetNotice,
	   failure: failureRequest,
	   method: 'POST',
	   params: paramObj
	});
	 
}
function afterGetNotice(response){
	var parseObj = eval("("+response.responseText+")");	
	var notices = "<table width='400' border='0' cellspacing='0' cellpadding='0' style='font-size:12px'>";
	notices += "<tr>";
	notices += " <td>";
	if(parseObj.rows&&parseObj.rows.length>0){
		for(var i=0;i<parseObj.rows.length;i++){
			var notice = parseObj.rows[i];
			notices += "<font color='white' class='head'><span style='cursor:hand;'  onClick='openNoticeMsgWindow("+notice.id+")'>."+notice.name+"</span></font>";
		}
	}
	notices += "</td>";
	notices += "</tr>";
	notices += "</table>";
	demo1q.innerHTML = notices;
	//滚动公告
	var speed=30
	var MyMarq=setInterval(Marqueeq,speed)
	demo2q.innerHTML=demo1q.innerHTML
	demoq.onmouseover=function() {clearInterval(MyMarq)}
	demoq.onmouseout=function() {MyMarq=setInterval(Marqueeq,speed)}
}
function failureRequest(response){
}
function Marqueeq(){
	if(demo2q.offsetWidth-demoq.scrollLeft<=0)
		demoq.scrollLeft-=demo1q.offsetWidth
	else{
		demoq.scrollLeft++
	}
}
window.onbeforeunload = onbeforeunload_handler;  
function onbeforeunload_handler(){
	var n = window.event.screenX - window.screenLeft;   
    var b = n > document.documentElement.scrollWidth-20;   
    if(b && window.event.clientY < 0 || window.event.altKey)   
    {   
         window.onunload = onunload_handler;  
         var warning="确认退出系统吗?";          
         window.event.returnValue = warning; //这里可以放置你想做的操作代码   
    }else{
    	window.onunload = null;
    }    
}  
  
function onunload_handler(){ 
    window.location = './logout.html';
}  
</script>
 