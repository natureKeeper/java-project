
//----------------------------------------------------------------------------
//  这是我做的一个日历 Javascript 页面脚本控件，适用于微软的 IE （5.0以上）浏览器
//  主调用函数是 setday(this,[object])和setday(this)，[object]是控件输出的控件名，举两个例子：
//  一、<input name=txt><input type=button value=setday onclick="setday(this,document.all.txt)">
//  二、<input onfocus="setday(this)">
//  若有什么不足的地方，或者您有更好的建议，请与我联系：mail: meizz@hzcnc.com
//  本日历的年份限制是（1753 - 9999）
//  按ESC键关闭该控件
//  在年和月的显示地方点击时会分别出年与月的下拉框
//  控件外任意点击一点即可关闭该控件
/* 以下为walkingpoison的修改说明
walkingpoison联系方式：wayx@kali.com.cn

Ver	2.0
修改日期：2002-12-13
修改内容：
1.*全新修改使用iframe作为日历的载体，不再被select和flash等控件挡住。
2.修正了移植到iframe后移动日历控件的问题。

Ver	1.5
修改日期：2002-12-4
修改内容：
1.选中的日期显示为凹下去的样式
2.修改了关闭层的方法，使得失去焦点的时候能够关闭日历。
3.修改按键处理，使得Tab切换焦点的时候可以关闭控件
4.*可以自定义日历是否可以拖动

Ver 1.4
修改日期：2002-12-3
修改内容：
1.修正选中年/月份下拉框后按Esc键导致年/月份不显示的问题
2.修正使用下拉框选择月份造成的日期错误（字符串转化为数字的问题）
3.*外观样式的改进，使得控件从丑小鸭变成了美丽的天鹅，从灰姑娘变成了高贵的公主，从……（读者可以自己进行恰当的比喻）
4.再次增大年/月份的点击空间，并对下拉框的位置稍作调整

Ver 1.3
修改日期：2002-11-29
修改内容：
1.*空白部分用灰色显示上个月的最后几天和下个月的前几天
2.*每个日期上面加上鼠标提示
3.修改使得当前日期和当前选择的日期的背景色在灰色日期部分也能正常显示

Ver 1.2
修改日期：2002-11-28
修改内容：
1.*修改年和月的点击都把中文包含在内，增大点击的空间
2.当前选择的日期在列表中显示不同的背景色
3.修正了点击单元格之间的分隔线导致控件关闭的问题

Ver 1.1
修改日期：2002-11-15
修改内容：
1.修正了方法二按Esc键关闭以后再次点击不会显示日历的问题
2.点击today直接选中当前的日期并关闭控件
3.*如果调用控件的输入框含有合法日期，则自动显示输入框的日期部分。
4.修改程序统一使用关闭的函数closeLayer()来关闭日历控件，这样可以通过自定义关闭函数来完成用户自定义的功能。

注：*号表示比较关键的改动

本控件还需要改进的部分：
1.受到iframe的限制，如果拖动出日历窗口，则日历会停止移动。
*/

//==================================================== 参数设定部分 =======================================================
var bMoveable=false;		//设置日历是否可以拖动
var _VersionInfo="Version:2.0&#13;2.0作者:walkingpoison&#13;1.0作者: F.R.Huang(meizz)&#13;MAIL: meizz@hzcnc.com"	//版本信息

//==================================================== WEB 页面显示部分 =====================================================
var strFrame;		//存放日历层的HTML代码
document.writeln('<iframe id=meizzDateLayer author=wayx frameborder=0 style="position: absolute; width: 170; height: 176; z-index: 9998; display: none"></iframe>');
strFrame='<style>';
strFrame+='		.c_text_normal { font-size:12px; cursor: hand; font-family:宋体; color:#000000; font-weight:normal; }';
strFrame+='		.c_text_over { font-size:12px; cursor: hand; font-family:宋体; color:#000000; font-weight:bolder;}'; 
strFrame+='</style>';
strFrame+='';
strFrame+='<scr' + 'ipt>';
strFrame+='		var datelayerx,datelayery;	/*存放日历控件的鼠标位置*/';
strFrame+='		var bDrag;	/*标记是否开始拖动*/';
strFrame+='		function document.onmousemove() {	/*在鼠标移动事件中，如果开始拖动日历，则移动日历*/';
strFrame+='			if(bDrag && window.event.button==1) {';
strFrame+='				var DateLayer=parent.document.all.meizzDateLayer.style;';
strFrame+='				DateLayer.posLeft += window.event.clientX-datelayerx;/*由于每次移动以后鼠标位置都恢复为初始的位置，因此写法与div中不同*/';
strFrame+='				DateLayer.posTop += window.event.clientY-datelayery;}}';
strFrame+='		function DragStart() {		/*开始日历拖动*/';
strFrame+='			var DateLayer=parent.document.all.meizzDateLayer.style;';
strFrame+='			datelayerx=window.event.clientX;';
strFrame+='			datelayery=window.event.clientY;';
strFrame+='			bDrag=true;}';
strFrame+='		function DragEnd() {		/*结束日历拖动*/';
strFrame+='			bDrag=false;}';
// vigor add begin
strFrame+='		function text_over(the) { the.className = "c_text_over";}';
strFrame+='		function text_out(the) { the.className = "c_text_normal";}';
// vigor add end
strFrame+='</scr' + 'ipt>';
strFrame+='';
strFrame+='<div style="z-index:9999;position: absolute; left:0; top:0; " onselectstart="return false"> ';
strFrame+='<span id=tmpSelectYearLayer author=wayx style="z-index: 9999;position: absolute;top: 2; left: 15;display: none"></span>';
strFrame+='<span id=tmpSelectMonthLayer author=wayx style="z-index: 9999;position: absolute;top: 2; left: 107;display: none"></span>';
strFrame+='<span id=tmpSelectTimeLayer author=wayx style="z-index: 9999;position: absolute;top: 153; left: 3;display: none"></span>';
strFrame+='<table border=0 cellspacing=0 cellpadding=0 width=170 height=176 style="border:1px solid #000000" bgcolor=#FFFFFF>';
strFrame+='<tr><td>';
strFrame+='';
strFrame+='<table border=0 cellspacing=0 cellpadding=0 width=100% author="wayx" height=23 bgcolor="#DDDDDD"><tr align=center author="wayx">';
strFrame+='		<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='   	 	width=16 onclick="parent.meizzPrevY()" title="向前翻 1 年">&lt;</td>';
strFrame+='     <td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='			width=60 onclick="parent.tmpSelectYearInnerHTML(this.innerText.substring(0,4))" ';
strFrame+='			title="点击这里选择年份"><span id=meizzYearHead></span></td>';
strFrame+='  	<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='   		width=16 onclick="parent.meizzNextY()" title="向后翻 1 年">&gt;</td>';
strFrame+='		<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='     	width=16 onclick="parent.meizzPrevM()" title="向前翻 1 月">&lt;</td>';
strFrame+='		<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='  		width=43 onclick="parent.tmpSelectMonthInnerHTML(this.innerText.length==3?this.innerText.substring(0,1):this.innerText.substring(0,2))"';
strFrame+='        	title="点击这里选择月份"><span id=meizzMonthHead></span></td>';
strFrame+='     <td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='         width=16 onclick="parent.meizzNextM()" title="向后翻 1 月">&gt;</td>';
strFrame+='</tr></table>';
strFrame+='';
strFrame+='</td></tr><tr><td>';
strFrame+='';
strFrame+='<table border=0 cellspacing=0 cellpadding=0 ' + (bMoveable? 'onmousedown="DragStart()" onmouseup="DragEnd()"':'');
strFrame+='  width=98% height=20 author="wayx" style="border-bottom:1px solid #000000;cursor:' + (bMoveable ? 'move':'default') + '" align="center">';
strFrame+='<tr author="wayx" style="font-size:12px;" align=center valign=bottom>';
strFrame+='		<td author=meizz>日</td>';
strFrame+='		<td author=meizz>一</td>';
strFrame+='		<td author=meizz>二</td>';
strFrame+='		<td author=meizz>三</td>';
strFrame+='		<td author=meizz>四</td>';
strFrame+='		<td author=meizz>五</td>';
strFrame+='		<td author=meizz>六</td>';
strFrame+='</tr></table>';
strFrame+='';
strFrame+='</td></tr><!-- author:F.R.Huang(meizz) http://www.meizz.com/ mail: meizz@hzcnc.com 2002-10-8 -->';
strFrame+='<tr><td>';
strFrame+='';
strFrame+='<table border=0 cellspacing=0 cellpadding=0 width=100% height=108>';
	var n=0; 
	for (j=0;j<6;j++) { 
		strFrame+= ' <tr align=center>'; 
		for (i=0;i<7;i++){
			strFrame+='<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
			strFrame+='		width=24 height=18 id=meizzDay'+n+' onclick=parent.meizzDayClick(this.innerText,0)></td>';
			n++;
		}
		strFrame+='</tr>';
	}
//	strFrame+='<tr align=center>';
//	for (i=35;i<39;i++)  {
//		strFrame+='<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
//		strFrame+='		width=24 height=18 id=meizzDay'+i+' onclick="parent.meizzDayClick(this.innerText,0)"></td>';
//	}
//strFrame+='<td colspan=3>&nbsp;</td></tr>'; //' + _VersionInfo + '
strFrame+='</table>';
strFrame+='';
strFrame+='</td></tr><tr><td>';
strFrame+='';
strFrame+='<table border=0 cellspacing=0 cellpadding=0 width=100% height="23" bgcolor=#DDDDDD><tr>';
strFrame+='		<td align=center width="70" class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" '; 
//strFrame+='			onclick="parent.tmpSelectTimeInnerHTML()"><span id=meizzTime>18:00</span></td>'; //' + _VersionInfo + '
strFrame+='			onclick="parent.tmpSelectTimeInnerHTML()"><span id=meizzTime>18:00</span></td>'; //' + _VersionInfo + '
strFrame+='		<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" '; 
strFrame+='			width="49" onclick=parent.setnull() title="置空">置空</td>'; //' + _VersionInfo + '
strFrame+='  	<td align=center class="c_text_normal" onmouseover="text_over(this);" onmouseout="text_out(this);" ';
strFrame+='   		width="49" onclick="parent.meizzToday()" title="今天">今天</td>';
strFrame+='</tr></table>';
strFrame+='';
strFrame+='</td></tr></table></div>';



window.frames.meizzDateLayer.document.writeln(strFrame);
window.frames.meizzDateLayer.document.close();		//解决ie进度条不结束的问题

//==================================================== WEB 页面显示部分 ======================================================
var outObject;
var outButton;		//点击的按钮
var outDate="";		//存放对象的日期
var odatelayer=window.frames.meizzDateLayer.document.all;		//存放日历对象
var oInitHour='18';
function setday(tt, obj, initHour) //主调函数
{
	if (arguments.length >  3){alert("对不起！传入本控件的参数太多！");return;}
	if (arguments.length == 0){alert("对不起！您没有传回本控件任何参数！");return;}
	var dads  = document.all.meizzDateLayer.style;
	var th = tt;
	//var ttop  = tt.offsetTop;     //TT控件的定位点高
	//var thei  = tt.clientHeight;  //TT控件本身的高
	//var tleft = tt.offsetLeft;    //TT控件的定位点宽
	var ttyp  = tt.type;          //TT控件的类型
	var ttop  = obj.offsetTop;
	var thei  = obj.clientHeight;
	var tleft = obj.offsetLeft;  	
	
	while (tt = tt.offsetParent){ttop+=tt.offsetTop; tleft+=tt.offsetLeft;}
	
	ttop = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop))-10;
	
	dads.top  = (ttyp=="image")? ttop+thei : ttop+thei+2;
//	dads.left = tleft - obj.clientWidth - 2;
	dads.left = tleft;
	 //document.documentElement.scrollTop （滚动条离页面最上方的距离） 

    // document.documentElement.scrollLeft   （滚动条离页面最左方的距离）

	//document.body.scrollTop （滚动条离页面最上方的距离）

   // document.body.scrollLeft   （滚动条离页面最左方的距离）
	

 
	 
	
	outObject = (arguments.length == 1) ? th : obj;
	outButton = (arguments.length == 1) ? null : th;	//设定外部点击的按钮
	//根据当前输入框的日期显示日历的年月
	var reg = /^(\d+)-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/; 
	var r = outObject.value.match(reg); 
	if(r!=null){
		r[2]=r[2]-1; 
		var d= new Date(r[1], r[2],r[3]); 
		if(d.getFullYear()==r[1] && d.getMonth()==r[2] && d.getDate()==r[3]){
			outDate=d;		//保存外部传入的日期
		}
		else outDate="";
			meizzSetDay(r[1],r[2]+1);
	}
	else{
		outDate="";
		meizzSetDay(new Date().getFullYear(), new Date().getMonth() + 1);
	}
	dads.display = '';
	
	//initHour
	//var varInitHour = '';
	if(String(initHour)=='undefined') {
		oInitHour = '18';
	} else {
		oInitHour = initHour;
	}
	odatelayer.meizzTime.innerHTML = oInitHour + ':00';
	event.returnValue=false;
}

var MonHead = new Array(12);    		   //定义阳历中每个月的最大天数
    MonHead[0] = 31; MonHead[1] = 28; MonHead[2] = 31; MonHead[3] = 30; MonHead[4]  = 31; MonHead[5]  = 30;
    MonHead[6] = 31; MonHead[7] = 31; MonHead[8] = 30; MonHead[9] = 31; MonHead[10] = 30; MonHead[11] = 31;

var meizzTheYear=new Date().getFullYear(); //定义年的变量的初始值
var meizzTheMonth=new Date().getMonth()+1; //定义月的变量的初始值
var meizzWDay=new Array(42);               //定义写日期的数组
/*
// merger into common.js
function document.onclick() //任意点击时关闭该控件	//ie6的情况可以由下面的切换焦点处理代替
{ 
  with(window.event)
  { if (srcElement.getAttribute("author")==null && srcElement != outObject && srcElement != outButton)
    closeLayer();
  }
}
*/

document.onkeyup(){
    if (window.event.keyCode==27){
		if(outObject)outObject.blur();
		closeLayer();
	}
	else if(document.activeElement)
		if(document.activeElement.getAttribute("author")==null && document.activeElement != outObject && document.activeElement != outButton)
		{
			closeLayer();
		}
}

function meizzWriteHead(yy,mm)  //往 head 中写入当前的年与月
  {
	odatelayer.meizzYearHead.innerText  = yy + " 年";
    odatelayer.meizzMonthHead.innerText = mm + " 月";
  }

function tmpSelectYearInnerHTML(strYear) //年份的下拉框
{
  if (strYear.match(/\D/)!=null){alert("年份输入参数不是数字！");return;}
  var m = (strYear) ? strYear : new Date().getFullYear();
  if (m < 1753 || m > 9999) {alert("年份值不在 1753 到 9999 之间！");return;}
  var n = m - 10;
  if (n < 1753) n = 1753;
  if (n + 26 > 9999) n = 9974;
  var s = "<select author=meizz name=tmpSelectYear style='font-size: 12px' "
     s += "onblur='document.all.tmpSelectYearLayer.style.display=\"none\"' "
     s += "onchange='document.all.tmpSelectYearLayer.style.display=\"none\";"
     s += "parent.meizzTheYear = this.value; parent.meizzSetDay(parent.meizzTheYear,parent.meizzTheMonth)'>\r\n";
  var selectInnerHTML = s;
  for (var i = n; i < n + 26; i++)
  {
    if (i == m)
       {selectInnerHTML += "<option author=wayx value='" + i + "' selected>" + i + "年" + "</option>\r\n";}
    else {selectInnerHTML += "<option author=wayx value='" + i + "'>" + i + "年" + "</option>\r\n";}
  }
  selectInnerHTML += "</select>";
  odatelayer.tmpSelectYearLayer.style.display="";
  odatelayer.tmpSelectYearLayer.innerHTML = selectInnerHTML;
  odatelayer.tmpSelectYear.focus();
}

function tmpSelectMonthInnerHTML(strMonth) //月份的下拉框
{
  if (strMonth.match(/\D/)!=null){alert("月份输入参数不是数字！");return;}
  var m = (strMonth) ? strMonth : new Date().getMonth() + 1;
  var s = "<select author=meizz name=tmpSelectMonth style='font-size: 12px' "
     s += "onblur='document.all.tmpSelectMonthLayer.style.display=\"none\"' "
     s += "onchange='document.all.tmpSelectMonthLayer.style.display=\"none\";"
     s += "parent.meizzTheMonth = this.value; parent.meizzSetDay(parent.meizzTheYear,parent.meizzTheMonth)'>\r\n";
  var selectInnerHTML = s;
  for (var i = 1; i < 13; i++)
  {
    if (i == m)
       {selectInnerHTML += "<option author=wayx value='"+i+"' selected>"+i+"月"+"</option>\r\n";}
    else {selectInnerHTML += "<option author=wayx value='"+i+"'>"+i+"月"+"</option>\r\n";}
  }
  selectInnerHTML += "</select>";
  odatelayer.tmpSelectMonthLayer.style.display="";
  odatelayer.tmpSelectMonthLayer.innerHTML = selectInnerHTML;
  odatelayer.tmpSelectMonth.focus();
}


function tmpSelectTimeInnerHTML() {
	/*var	clockSelect = '';
	clockSelect += '<select name=c_Time style="width:68;">';
	for (var i = 1; i<=24;i++) { 
		if(i==12) {
			clockSelect += '<option value='12:00' selected>&nbsp;12:00</option>';
		} else {
			var t = (i<10) ? "0" + i + ":00" : i + ":00" ;
			clockSelect += '<option value=' + t + '>&nbsp;' + t + '</option>';
		}
		
	}
	clockSelect += '</select>';
	//odatelayer.tmpSelectTimeLayer.style.display="";
	odatelayer.tmpSelectTimeLayer.innerHTML = clockSelect;
	//odatelayer.c_Time.focus();
	*/
	var	clockSelect = "";
	clockSelect += "<select name=c_Time style='width:68;'"
	clockSelect += " onblur='document.all.tmpSelectTimeLayer.style.display=\"none\"'" 
	clockSelect += " onchange='document.all.tmpSelectTimeLayer.style.display=\"none\"; document.all.meizzTime.innerHTML= this.value;'"
//	var da = eval("odatelayer.meizzDay"+i) >';
	//odatelayer.meizzTime
	clockSelect += ">"
	for (var i = 0; i<=24;i++) {		
		var t = (i<10) ? "0" + i + ":00" : i + ":00" ;
		
		clockSelect += "<option value='"+t+"'";
				
		if(String(i)==oInitHour) {
		  clockSelect += " selected";
		}
		clockSelect += ">&nbsp;" + t + "</option>"		
		
	}
	clockSelect += "</select>";
	odatelayer.tmpSelectTimeLayer.style.display="";
  	odatelayer.tmpSelectTimeLayer.innerHTML = clockSelect;
  	odatelayer.c_Time.focus();
}

function closeLayer()               //这个层的关闭
  {
    document.all.meizzDateLayer.style.display="none";
  }

function IsPinYear(year)            //判断是否闰平年
  {
    if (0==year%4&&((year%100!=0)||(year%400==0))) return true;else return false;
  }

function GetMonthCount(year,month)  //闰年二月为29天
  {
    var c=MonHead[month-1];if((month==2)&&IsPinYear(year)) c++;return c;
  }

function GetDOW(day,month,year)     //求某天的星期几
  {
    var dt=new Date(year,month-1,day).getDay()/7; return dt;
  }

function meizzPrevY()  //往前翻 Year
  {
    if(meizzTheYear > 1753 && meizzTheYear <10000){meizzTheYear--;}
    else{alert("年份超出范围（1753-9999）！");}
    meizzSetDay(meizzTheYear,meizzTheMonth);
  }
function meizzNextY()  //往后翻 Year
  {
    if(meizzTheYear > 1752 && meizzTheYear <9998){meizzTheYear++;}
    else{alert("年份超出范围（1753-9999）！");}
    meizzSetDay(meizzTheYear,meizzTheMonth);
  }
function meizzToday()  //Today Button
  {
	var today;
    meizzTheYear = new Date().getFullYear();
    meizzTheMonth = new Date().getMonth()+1;
	
    today=new Date().getDate();
    //meizzSetDay(meizzTheYear,meizzTheMonth);
    if(outObject){		
		var pm = (meizzTheMonth<10) ? "0" :"";
		var pd = (today<10) ? "0" :"";
		var t = eval("odatelayer.meizzTime");
		outObject.value=meizzTheYear + "-" + pm + meizzTheMonth + "-"+ pd + today + " " + t.innerHTML + ":00";
		outObject.title = outObject.value;
    }
    closeLayer();
  }
function meizzPrevM()  //往前翻月份
  {
    if(meizzTheMonth>1){meizzTheMonth--}else{if (meizzTheYear>1753) {meizzTheYear--;meizzTheMonth=12;}}
    meizzSetDay(meizzTheYear,meizzTheMonth);
  }
function meizzNextM()  //往后翻月份
  {
    if(meizzTheMonth==12){if (meizzTheYear<10000) {meizzTheYear++;meizzTheMonth=1}}else{meizzTheMonth++}
    meizzSetDay(meizzTheYear,meizzTheMonth);
  }

function meizzSetDay(yy,mm)   //主要的写程序**********
{
  meizzWriteHead(yy,mm);
  //设置当前年月的公共变量为传入值
  meizzTheYear=yy;
  meizzTheMonth=mm;

  for (var i = 0; i < 42; i++){meizzWDay[i]=""};  //将显示框的内容全部清空
  var day1 = 1,day2=1,firstday = new Date(yy,mm-1,1).getDay();  //某月第一天的星期几
  for (i=0;i<firstday;i++)meizzWDay[i]=GetMonthCount(mm==1?yy-1:yy,mm==1?12:mm-1)-firstday+i+1	//上个月的最后几天
  for (i = firstday; day1 < GetMonthCount(yy,mm)+1; i++){meizzWDay[i]=day1;day1++;}
  for (i=firstday+GetMonthCount(yy,mm);i<42;i++){meizzWDay[i]=day2;day2++}
  for (i = 0; i < 42; i++)
  { var da = eval("odatelayer.meizzDay"+i)     //书写新的一个月的日期星期排列
    if (meizzWDay[i]!="")
      { 
		//初始化边框
		//da.borderColorLight="#FF9900";
		//da.borderColorDark="#FFFFFF";
		if(i<firstday)		//上个月的部分
		{
			da.innerHTML="<font color=gray>" + meizzWDay[i] + "</font>";
			da.title=(mm==1?12:mm-1) +"月" + meizzWDay[i] + "日";
			da.onclick=Function("meizzDayClick(this.innerText,-1)");
			/*if(!outDate)
				da.style.backgroundColor = ((mm==1?yy-1:yy) == new Date().getFullYear() && 
					(mm==1?12:mm-1) == new Date().getMonth()+1 && meizzWDay[i] == new Date().getDate()) ?
					 "#FFD700":"#FFFFFF";
			else
			{
				da.style.backgroundColor =((mm==1?yy-1:yy)==outDate.getFullYear() && (mm==1?12:mm-1)== outDate.getMonth() + 1 && 
				meizzWDay[i]==outDate.getDate())? "#00ffff" :
				(((mm==1?yy-1:yy) == new Date().getFullYear() && (mm==1?12:mm-1) == new Date().getMonth()+1 && 
				meizzWDay[i] == new Date().getDate()) ? "#FFD700":"#FFFFFF");
				//将选中的日期显示为凹下去
				if((mm==1?yy-1:yy)==outDate.getFullYear() && (mm==1?12:mm-1)== outDate.getMonth() + 1 && 
				meizzWDay[i]==outDate.getDate())
				{
					da.borderColorLight="#FFFFFF";
					da.borderColorDark="#FF9900";
				}
			}*/
		}
		else if (i>=firstday+GetMonthCount(yy,mm))		//下个月的部分
		{
			da.innerHTML="<font color=gray>" + meizzWDay[i] + "</font>";
			da.title=(mm==12?1:mm+1) +"月" + meizzWDay[i] + "日";
			da.onclick=Function("meizzDayClick(this.innerText,1)");
			/*if(!outDate)
				da.style.backgroundColor = ((mm==12?yy+1:yy) == new Date().getFullYear() && 
					(mm==12?1:mm+1) == new Date().getMonth()+1 && meizzWDay[i] == new Date().getDate()) ?
					 "#FFD700":"#FFFFFF";
			else
			{
				da.style.backgroundColor =((mm==12?yy+1:yy)==outDate.getFullYear() && (mm==12?1:mm+1)== outDate.getMonth() + 1 && 
				meizzWDay[i]==outDate.getDate())? "#00ffff" :
				(((mm==12?yy+1:yy) == new Date().getFullYear() && (mm==12?1:mm+1) == new Date().getMonth()+1 && 
				meizzWDay[i] == new Date().getDate()) ? "#FFD700":"#FFFFFF");
				//将选中的日期显示为凹下去
				if((mm==12?yy+1:yy)==outDate.getFullYear() && (mm==12?1:mm+1)== outDate.getMonth() + 1 && 
				meizzWDay[i]==outDate.getDate())
				{
					da.borderColorLight="#FFFFFF";
					da.borderColorDark="#FF9900";
				}
			}*/
		}
		else		//本月的部分
		{
			da.innerHTML="" + meizzWDay[i] + "";
			da.title=mm +"月" + meizzWDay[i] + "日";
			da.onclick=Function("meizzDayClick(this.innerText,0)");		//给td赋予onclick事件的处理
			//如果是当前选择的日期，则显示亮蓝色的背景；如果是当前日期，则显示暗黄色背景
			if(!outDate)
				da.style.backgroundColor = (yy == new Date().getFullYear() && mm == new Date().getMonth()+1 && meizzWDay[i] == new Date().getDate())?
					"#FFD700":"#FFFFFF";
			else
			{
				da.style.backgroundColor =(yy==outDate.getFullYear() && mm== outDate.getMonth() + 1 && meizzWDay[i]==outDate.getDate())?
					"#00ffff":((yy == new Date().getFullYear() && mm == new Date().getMonth()+1 && meizzWDay[i] == new Date().getDate())?
					"#FFD700":"#FFFFFF");
				//将选中的日期显示为凹下去
				if(yy==outDate.getFullYear() && mm== outDate.getMonth() + 1 && meizzWDay[i]==outDate.getDate())
				{
					da.borderColorLight="#FFFFFF";
					da.borderColorDark="#FF9900";
				}
			}
		}
        da.style.cursor="hand"
      }
    else{da.innerHTML="";da.style.backgroundColor="";da.style.cursor="default"}
	
  }
}


function meizzDayClick(n,ex)  //点击显示框选取日期，主输入函数*************
{
  var yy=meizzTheYear;
  var mm = parseInt(meizzTheMonth)+ex;	//ex表示偏移量，用于选择上个月份和下个月份的日期
	//判断月份，并进行对应的处理
	if(mm<1){
		if (yy>1753){
			yy--;
			mm=12+mm;
		}else{
			mm=mm+ex;
		}
		
	}
	else if(mm>12){
		if (yy<9999){
			yy++;
			mm=mm-12;
		}else{
			mm=mm-ex;
		}
	
	}
	
  if (mm < 10){mm = "0" + mm;}
  if (outObject)
  {
    if (!n) {//outObject.value=""; 
      return;}
    if ( n < 10){n = "0" + n;}
	var t = eval("odatelayer.meizzTime");
    outObject.value= yy + "-" + mm + "-" + n + " " + t.innerHTML + ":00" ; //注：在这里你可以输出改成你想要的格式
    outObject.title = outObject.value;
    closeLayer(); 
  }
  else {closeLayer(); alert("您所要输出的控件对象并不存在！");}
}

function setnull()               //这个层的关闭
  {
    if (outObject)
	{
		outObject.value= "" ;
	}
	closeLayer();
  }

// -->
