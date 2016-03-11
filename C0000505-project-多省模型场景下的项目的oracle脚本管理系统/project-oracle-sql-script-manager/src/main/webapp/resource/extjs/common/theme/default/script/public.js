/**
 *                           建议 
 * 1.写在此文件中的方法一定要有公用性。
 * 2.新增方法时考虑一下别人使用时可能会有什么不同需求，尽量支持多需求、可扩展。
 *   避免将来出现function1，function2的情况。
 * 3.方法名称要能表示该方法的用途，一目了然。
 * 4.参数名同上，且参数中禁止出现1个以上的obj，例如‘obj1，obj2，obj3’。
 * 5.在方法名不能明确表示意图的情况下，请增加注释，尽量使用多行注释，在引用的地方鼠标在
 *   方法名上悬停可以看到注释，单行注释则不能。
 * 6.新增加的方法请写上作者，以便使用者咨询。
 * 7.一旦方法增加了，并且提交到服务器上以后，不要轻易的修改删除。
 * 8.增加新的方法时尽量不要和已有的方法雷同、类似。
 * 9.代码书写注意美观，缩进用4个空格，在eclipse-JavaScript-Fomatter中设置Tab为SpaceOnly。
 * 10.有好的建议请在此增加。
 *                                                   樊勇
 *                                                   2011.2.17 
 */

/**
 * 
 * 处理grid只能选中不能复制问题(css在grid-row.css上)
 * 
 */
if  (!Ext.grid.GridView.prototype.templates) {    
    Ext.grid.GridView.prototype.templates = {};    
}    
Ext.grid.GridView.prototype.templates.cell =  new  Ext.Template(    
     '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>' ,    
     '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>' ,    
     '</td>'    
); 
var ext_noframe_bg = 'background-color: #DFE8F6;';
/**
 * 进度提示框
 * 
 */
var progressBar_dlg = function(){
    return {
		showDialog:function(){
		    Ext.MessageBox.show({
		       title: "信息",
		       msg: '<img src="./resource/extjs/component/resources/images/default/grid/loading.gif" style="width:16px;height:16px;" align="absmiddle">请稍候...',
		       width:240,
		       closable:false
		   });
	 	},
		showCustomMsgDialog:function(msg){
		    Ext.MessageBox.show({
		       title: "信息",
		       msg: '<img src="./resource/extjs/component/resources/images/default/grid/loading.gif" style="width:16px;height:16px;" align="absmiddle">'+msg+', 请稍候...',
		       width:240,
		       closable:false
		   });
	 	},
	 	hideDialog:function(){
			Ext.MessageBox.hide();
	 	},
		showAnimDialog:function(animId){
		    Ext.MessageBox.show({
		       title: "信息",
		       msg: '<img src="./resource/extjs/component/resources/images/default/grid/loading.gif" style="width:16px;height:16px;" align="absmiddle">提交中，请稍候...',
		       width:240,
		       animEl:animId,
		       closable:false
		   });
	 	}	 	
  }
}();

function fillString (str, fillStr, num, leftOrRight){
	if (str.length >= num){
		return str;
	}
	if (fillStr.length != 1){
		return str;
	}
	var oldNum = str.length;
	for(var i=0; i<num-oldNum; i++){
		if (leftOrRight == 'left'){
			str = fillStr + str;
		}else{
			str = str + fillStr;
		}
	}
	return str;
}
function utfEscape(obj){
	var text = escape(obj);
	text = replaceAll(text,"%","\\");
	return text;
}
function utfUnEscape(text){
	text = replaceAll(text,"\\","%");	
	return unescape(text);
}
function utfEncode(obj){
	var text = encodeURIComponent(obj);
	//text = replaceAll(text,"%","\\");
	return text;
}

/**
 *后台传过来带中文字符的字符串需要做2次解析
 * @param data
 * @return
 */
function utfDecodeAndDecode(data){
	var text = utfDecode(data);
	return Ext.util.JSON.decode(text);
}

function utfDecode(text){
	text = replaceAll(text,"\\","%");	
	return decodeURIComponent(text);
}
function replaceAll(streng, soeg, erstat){
    var st = streng;
    if (soeg.length == 0)
        return st;
    var idx = st.indexOf(soeg);
    while (idx >= 0){  
        st = st.substring(0,idx) + erstat + st.substr(idx+soeg.length);
        idx = st.indexOf(soeg);
    }
    return st;
}

function escapeXML(content) {
	if (content == undefined){
		return "";
	}

	if (!content.length || !content.charAt)
		content = new String(content);

	//var result = "";
	var length = content.length;
	var strbuff= new Array();
	for (var i = 0; i < length; i++) {
		var ch = content.charAt(i);
		switch (ch) {
			case '&':
				strbuff.push("&amp;");
				//result += "&amp;";
				break;
			case '<':
				strbuff.push("&lt;");
				//result += "&lt;";
				break;
			case '>':
				strbuff.push("&gt;");
				//result += "&gt;";
				break;
			case '"':
				strbuff.push("&quot;");
				//result += "&quot;";
				break;
			case '\'':
				strbuff.push("&apos;");
				//result += "&apos;";
				break;
			default:
				strbuff.push(ch);
				//result += ch;
        }
	}	
	//return result;
	return strbuff.join("");
}

function clearElementValue(objId){
	document.getElementById(objId).value = "";
}

function trim(str){
	if (str != null && str != "") {

		while (str.indexOf(' ') == 0 ){
			str = str.substring(1);
			if (str==null||str=="") {
				break;
			}
		}
		while (str.lastIndexOf(' ') == str.length-1) {
			str = str.substring(0,str.length-1);
			if (str==null||str=="") {
				break;
			}
		}
	}
	return str;
}

function trimAllText(){
    var i = document.forms.length;
	for (var j = 0 ; j < i ; j++) {
		var m = document.forms[j].elements.length;
		for (var n = 0 ; n < m ; n++) {
			if (document.forms[j].elements[n].type == 'text') {
				document.forms[j].elements[n].value = trim(document.forms[j].elements[n].value );
			}
		}
	}
}

function checkInteger(pageField, fieldCaption){	
	obj = document.getElementById(pageField);
	inputStr = obj.value;
	for (var i = 0; i < inputStr.length; i++) {
		var oneChar = inputStr.charAt(i);
		if (( oneChar < '0' || oneChar > '9')) {
			if (oneChar != '.') {
				if (fieldCaption != null && fieldCaption != "") {
					alert(fieldCaption + "\u5fc5\u987b\u662f\u6570\u5b57");
					obj.select();
					obj.focus();
					return false;
				} else {
					return false;
				}
			}
		}
	}
	return true;
}

function show_hideTable(id){
	var tableObj = document.getElementById(id);	
	if(tableObj.style.display==""){
		tableObj.style.display = "none";
	}else{
		tableObj.style.display = "";
	}	
}

/**
 * 打开一个模式窗口
 * @param {Object} URL
 * @param {Object} arguments
 * @param {Object} features
 * 
 */
function openModalDialogWindow(URL,winObj,features){
	if (Ext.isIE) {
		if (null == features){
			features = "dialogWidth:1050px;dialogHeight:530px;scrollbars:yes;status:no;help:no;resizable:1;";
		}
		return window.showModalDialog(URL,winObj,features);
	}else if(isMoz){
		if (null == features){
			features = "modal=yes,width=1050,height=530,scrollbars=yes,status=no,help=no,resizable=1";
		}else{
			var featureArray = features.split(";");
			var newFeature = new Array();
			var modalExist = false;
			for(var i = 0 ; i < featureArray.length; i ++){
				if ("" == featureArray[i]){
					continue;
				}
				var tmp = featureArray[i].split(":");
				if ("dialogWidth" == tmp[0]){
					newFeature.push("width");
				}else if ("dialogHeight" == tmp[0]){
					newFeature.push("height");
				}else if ("modal" == tmp[0]){
					modalExist = true;
				}else{
					newFeature.push(tmp[0]);
				}
				newFeature.push("=");
				newFeature.push(tmp[1]);
				newFeature.push(",");
			}
			if (!modalExist){
				newFeature.push("modal=yes")
			}
			features = newFeature.join("");
		}
		//alert(features);
		return window.open(URL,winObj,features);
	}
}

function OpenDialogWindow(href, winName){
	return openModalDialogWindow(href,winName);
}

function OpenWindow(href, winName){
    eval('winName = window.open(href, winName, "width=820, height=600, left=' + ( screen.width - 820 ) / 2 +
    ', top= ' + ( screen.height - 600 ) / 2 + ', scrollbars=yes, resizable=1"); winName.focus();');
}

function getAttributeByIndex(obj,index) { 
    var count = 0;
    for(var p in obj){
        if(typeof(obj[p])=="function"){
        }else{
			//alert("count="+count+",index="+index+",attr="+p);
			if (index == count){
				return p;
			}
        }
        count++;
    }
} 

function OpenQryWindow(href, obj){
	rtn = openModalDialogWindow(href);
	if (null != rtn){
		var viewName = document.getElementById(obj);
		var hiddenId = document.getElementById(obj+'$Id');			
		var idStr = "",displayName = "";
		var selectRows = eval("("+rtn+")");
		if (null == selectRows || undefined == selectRows){
			alert(rtn + "can't parse to javascript object!");
			return;
		}
		for(var i = 0 ; i < selectRows.length; i++ ){
			var record = selectRows[i];
			idStr += ","+record.id;
			//default the third
			//alert(record.length);
			var attribute = getAttributeByIndex(record,1);
			//alert(attribute);
			if (attribute != undefined){
				displayName += "," + record[attribute];
			}
		}
		if (idStr != ""){
			hiddenId.value = idStr.substring(1);
			viewName.value = displayName.substring(1);
		}
	}
}

//add by wuliujun on 2006/06/27 (end)
function OpenTreeWindow(href, objHiddenId,objId){
	rtn = openModalDialogWindow(href,'','dialogWidth:300px;dialogHeight:500px;scrollbars:yes;status:no;help:no;resizable:1;');
	if (null != rtn){
			var hiddenId = document.getElementById(objHiddenId);		
			var viewName = document.getElementById(objId);				
			hiddenId.value = rtn[0];
			viewName.value = rtn[1];
	}
}


function listEntityByOrder(ascOrder, descOrder) {
	document.listForm['pagination.ascOrder'].value = ascOrder;
	document.listForm['pagination.descOrder'].value = descOrder;
    document.listForm.submit();
	return false;
}

function listEntityByName() {
	if (document.queryfom.entryValue.value == '') {
		alert('Please input \'Keywords\' !');
		return false;
	}
    document.queryfom.submit();
	return false;
}
function listEntityPagination(index, size) {
	document.listForm['pagination.index'].value = index;
	document.listForm['pagination.size'].value = size;
	document.listForm.submit();
	return false;
}

function doQuery(the){
	xBtnDisabled(the);
	document.listForm.queryStyle.value="1";
	document.listForm.submit();
	return false;
}

function doQueryWithNotEmptyCondition(the,resourceBeanName){
	if (!isQryConditionEmpty(resourceBeanName)){
		return false;
	}
	xBtnDisabled(the);
	document.listForm.queryStyle.value="1";
	document.listForm.submit();
	return false;
}

function getExtGridSelectedRowIds(grid){
	var selectedRows = grid.getSelectionModel().getSelections();
	var idStr = "";
	for(var i = 0 ; i < selectedRows.length; i++){
		idStr += "," + selectedRows[i].id;
	}
	if ("" != idStr){
		idStr = idStr.substring(1);
	}
	return idStr;
}

function viewEntity(grid,rowIndex,e) {
	if (null == grid){
		return false;
	}	
	var record = grid.getSelectionModel().getSelected();
    document.fom.entityId.value = record.id;
    document.fom.submit();
    return false;
}

function printEntity(id) {
	document.fom.entityId.value = id;
	document.fom.target = '_blank';
	document.fom.submit();
	return false;
}
function printEntity(id,action) {
	document.fom.entityId.value = id;
	document.fom.action = action;
	document.fom.target = '_blank';
	document.fom.submit();
	return false;
}
function updateEntity(id) {
	document.fom.entityId.value = id;
	document.fom.submit();
	return false;
}
function updateEntity(id,action) {
	document.fom.entityId.value = id;
	document.fom.action = action;
	document.fom.submit();
	return false;
}
function deleteEntity(id) {
	document.fom.selectedIds.value = id;
	document.fom.submit();
	return false;
}
function deleteEntity(id,action) {
	var txt = "%u786e%u8ba4%u8981%u5220%u9664%u5417%uff1f";
	txt = unescape(txt) + "?";	
	if (!confirm(txt)){
		return false;
	}
	document.fom.selectedIds.value = id;
	document.fom.action = action;
	document.fom.submit();
	return false;
}

function deleteTicketEntity(id,action) {
	var txt = "%u786e%u8ba4%u8981%u5220%u9664%u5417%uff1f";
	txt = unescape(txt) + "?";	
	if (!confirm(txt)){
		return false;
	}
	document.fom.entityId.value = id;
	document.fom.action = action;
	document.fom.submit();
	return false;
}

function saveSpaceEntity(the,action){
	doSave(the,action);
	parent.frames(2).window.location = parent.frames(2).window.location;
	return false;
}
function deleteSpaceEntity(id,action){
	deleteEntity(id,action);
	parent.frames(2).window.location = parent.frames(2).window.location;
	return false;
}
function doSave(the,action){
	if(checkEntity()) {		
		xBtnDisabled(the);
		document.fom.action = action;
		document.fom.submit();
	}
	return false;
}
function doAdd(the,action){	
	xBtnDisabled(the);
	document.fom.action = action;
	document.fom.submit();
	return false;
}
function doList(the,action){	
	xBtnDisabled(the);
	document.fom.action = action;
	document.fom.submit();
	return false;
}
function doCreateEntity(the,action){	
	//if(checkuser()) {
		xBtnDisabled(the);
		document.fom.action = action;
		document.fom.submit();
	//}
	return false;
}
function doUpdateEntity(the,action){	
	//if(checkuser()) {
		//xBtnDisabled(the);
		document.fom.action = action;
		document.fom.submit();
	//}
	return false;
}



function confirmExtGridSelected(grid){
	var selectedRows = grid.getSelectionModel().getSelections();
	if (null == selectedRows){
		alert("\u8bf7\u9009\u62e9\u6570\u636e!");
		return;		
	}
	if (selectedRows.length < 1){
		alert("\u8bf7\u9009\u62e9\u6570\u636e!");
		return;	
	}
	var rtnArray = [];
	for(var i = 0 ; i < selectedRows.length; i++){
		var idObj = {};
		idObj.id = selectedRows[i].id;
		var p = Ext.apply(idObj,selectedRows[i].data);
		rtnArray[rtnArray.length] = p;
	}
  	window.returnValue = rtnArray;
  	window.close();
}

function selectConfirm(){
		var cnt = 0;
		var obj = document.getElementsByName("id_entitys");	
		var ids = "";
		var names = "";
		var rtnArray = new Array();
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked == true && obj[i] != "-1") {
				cnt++;
				ids += ","+obj[i].value;
				rtnArray[rtnArray.length] = entitysArrayRows[i];
			}
		}
		if (cnt == 0){
			var txt = "%u8bf7%u9009%u62e9!";
			alert(unescape(txt));
			return;
		}
		if (cnt > 0){
			ids = ids.substring(1);
		}
	  rtnArray[rtnArray.length] = ids;
  	window.returnValue = rtnArray;
  	window.close();
}

function QuickSort(arr) {
  if (arguments.length>1) {
   var low = arguments[1];
   var high = arguments[2];
  } else {
   var low = 0;
   var high = arr.length-1;
  }
  if(low < high){
   // function Partition
   var i = low;
   var j = high;
   var pivot = arr[i];
   while(i<j) {
    while(i<j && arr[j]>=pivot)
     j--;
    if(i<j)
     arr[i++] = arr[j];
    while(i<j && arr[i]<=pivot)
     i++;
    if(i<j)
     arr[j--] = arr[i];
   }//endwhile
   arr[i] = pivot;
   // end function
   var pivotpos = i; // Partition(arr??low??high);
   QuickSort(arr, low, pivotpos-1);
   QuickSort(arr, pivotpos+1, high);
  }else{
   	return;
  }
  return arr;
}

function getOptionAllIds(obj){
	if (null == obj)
		return;
	var idStr = "";
	for(var i=0;i<obj.length;i++){
		idStr += ","+obj.options[i].value;
	}
	if (idStr != "")
		idStr = idStr.substring(1);
	return idStr;
}
function getCheckBoxCheckedValue(objName){
	var obj = document.getElementsByName(objName);
	if (null == obj) return;
	if (null == obj.length){
		if (obj.checked){
			return obj.value;
		}
	}
	var idStr = "";
	for(var i=0;i<obj.length;i++){
		if (obj[i].checked){
			idStr += "," + obj[i].value;
		}
	}
	if (idStr != ""){
		idStr = idStr.substring(1);
	}
	return idStr;
}
function getCheckBoxCheckedFieldValue(objName, position){
	var obj = document.getElementsByName(objName);
	if (null == obj) return;
	var idStr = "";
	for(var i=0;i<obj.length;i++){
		if (obj[i].checked){
			idStr += "," + entitysArrayRows[i][position];
		}
	}
	if (idStr != ""){
		idStr = idStr.substring(1);
	}
	return idStr;
}
//JasonHee--get all not been checked checkBox value . 
function getCheckBoxUncheckedValue(objName){
	var obj = document.getElementsByName(objName);
	if (null == obj) return;
	if (null == obj.length){
		if (obj.checked != true){
			return obj.value;
		}
	}
	var idStr = "";
	for(var i=0;i<obj.length;i++){
		if (obj[i].checked!=true){
			idStr += "," + obj[i].value;
		}
	}
	if (idStr != ""){
		idStr = idStr.substring(1);
	}
	return idStr;
}
//JasonHee--get all checkBox value . 
function getCheckBoxValue(objName){
	var obj = document.getElementsByName(objName);
	if (null == obj) return;
	if (null == obj.length){
		return obj.value;
	}
	var idStr = "";
	for(var i=0;i<obj.length;i++){
		idStr += "," + obj[i].value;
	}
	if (idStr != ""){
		idStr = idStr.substring(1);
	}
	return idStr;
}
function getRaidioBoxCheckedValue(objName){
	var obj = document.getElementsByName(objName);

	//alert(obj.checked);
	if (null == obj.length){
		if (obj.checked){
			return obj.value;
		}
	}
	for(var i=0;i<obj.length;i++){
		if (obj[i].checked){
			return obj[i].value;
		}
	}
}

function delEntitys(action){
	var objValue = getCheckBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	document.listForm.selectedIds.value = objValue;
	document.listForm.action = action;
	document.listForm.submit();
}

function editEntity(action){
	var objValue = getCheckBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	if (objValue.indexOf(",") > 0){
			var txt = "%u53ea%u80fd%u9009%u62e9%u4e00%u6761";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	document.fom.entityId.value = objValue;
	document.fom.action = action;
	document.fom.submit();
}


function popwinEditEntity(action){
	var objValue = getCheckBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	if (objValue.indexOf(",") > 0){
			var txt = "%u53ea%u80fd%u9009%u62e9%u4e00%u6761";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	a=window.showModalDialog(action+'?entityId='+objValue,'','dialogWidth:850px;dialogHeight:500px;scrollbars:yes;status:no;help:no;resizable:1;');
}

function viewTopo(action){
		var objValue = getCheckBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	if (objValue.indexOf(",") > 0){
			var txt = "%u53ea%u80fd%u9009%u62e9%u4e00%u6761";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	document.fom.entityId.value = objValue;
	document.fom.action = action;
	document.fom.submit();
}

function optionSelected(objname) {
	var optionObj = document.getElementById(objname);
	if (null == optionObj)
		return;
	for(var i=0;i<optionObj.options.length;i++){		
		optionObj.options[i].selected = true;
	}
}
function removeAllOptions(objname) {
	var optionObj = document.getElementById(objname);
	if (null == optionObj)
		return;
	for(var i=optionObj.length - 1;i > -1;i--){
		optionObj.options[i] = null;
	}
}

function setOptionByXMLData(doc,objname){	
	var root = doc.documentElement;
	var cs = root.childNodes;
	var l = cs.length;
	removeAllOptions(objname);
	var obj = document.getElementById(objname);
	for (var i = 0; i < l; i++) {
		if (cs[i].tagName == "tree") {
			var value = cs[i].getAttribute("value");
			var text = cs[i].getAttribute("text");			
			obj.options[obj.length] = new Option(text,value);
		}
	}
}


function moveUpDn(selectName,direction) {
		var selectObj = document.getElementById(selectName);
		if (selectObj == null || selectObj.options.length == 0){
			return;
		}
		
		N = (document.all) ? 0 : 1;		
    index = selectObj.options.length;
    count = 0;
    var myindex = -1;
    for (i = selectObj.options.length - 1; i > myindex; i--) {
        var selectedValue ;
        if(N){
            selectedValue = selectObj.options[i].selected
        }else{
            selectedValue = selectObj.options(i).selected
        }
         
        if (selectedValue == true) {
			    count++;
			    index = i;
				}
    }
    
    if (count == 1) {	// Select One only
        if (direction < 0 && index > myindex + 1) {		// Up
            var newOpt;
            if(N){
                newOpt = document.createElement("OPTION");
                newOpt.text  = selectObj.item(index).text;
                newOpt.value = selectObj.item(index).value;
	        			newOpt.selected = true;
                selectObj.remove(index);
                selectObj.add(newOpt, myform.currentSelectedItem.item(index-1));
            }else{
	    					newOpt = new Option(selectObj.item(index).text, selectObj.item(index).value);
	        			newOpt.selected = true;
                selectObj.remove(index);
                selectObj.add(newOpt, index + direction);
            }
        }
        if (direction > 0 && index < selectObj.options.length - 1) { // Down
            if(N){
                var newOpt = document.createElement("OPTION");
                newOpt.text  = selectObj.item(index).text;
                newOpt.value = selectObj.item(index).value;
	        			newOpt.selected = true;
                selectObj.remove(index);
                selectObj.add(newOpt, myform.currentSelectedItem.item(index+1));
                
            }else{
	        			newOpt = new Option(selectObj.item(index).text, selectObj.item(index).value);
   	        		newOpt.selected = true;
                selectObj.remove(index);
                selectObj.add(newOpt, index + direction);
            }
        }
    }
}

//get ctp string by k,l,m,n. ----JasonHee 2006-07-26
function assembleCTPNumber(kNumber, lNumber, mNumber, nNumber)
{
    if ((kNumber == null || kNumber == "-" || kNumber == "0")        // k is invalid
        && (lNumber == null || lNumber == "-")     //l is invalid
        && (mNumber == null || mNumber == "-")     //m is invalid
        && (nNumber == null || nNumber == "-"))    //n is invalid
    {
            return "";
    }
    else
	{
	    return "/" + kNumber + "^" + lNumber + "^" + mNumber + "^" + nNumber;
	}
}


function preRuleCheck(the,ruleName){
	document.getElementById("actionURL").value = actionUrl;	
	var ticketTypeId = document.getElementById("flowParam.ticketTypeId").value;
	var tDDDDDicketId = document.getElementById("flowParam.ticketId").value;
	var flowId = document.getElementById("flowParam.flowId").value;
	var selectUser = document.getElementById("flowParam.selectUser").value;
	var taskId = document.getElementById("flowParam.taskId").value;
	var preLineId = document.getElementById("flowParam.lineId").value;

	document.getElementById("selectFlowLineName").value = the.value;
	loadXML_public("XMLHttpRequestCheckRule.html?lineId="+lineId+"&flowId="+flowId+"&ticketTypeId="+ticketTypeId+"&ticketId="+ticketId+"&taskId="+taskId+"&selectUser="+selectUser+"&preLineId="+preLineId+"&ruleName="+ruleName,checkRule);
}

function CHECK_APPROVE(){
	//if   xmlhttp   shows   "loaded"   
	//alert("CHECK_APPROVE");
	if(xmlhttp_public.readyState==4){
	    //if   "OK"
	    if (xmlhttp_public.status==200){
	    	//alert("XML   data   OK")
	    	var content = xmlhttp_public.responseText;
				var rtnArray = content.split("$");
		    if (rtnArray[0] == "0"){
					goFlow(rtnArray[5],rtnArray[2]+".html",rtnArray[3],"")
		  	}else if (rtnArray[0] == "1"){
					if (!confirm(rtnArray[1])){
						//no
						return false;
					}else{
						//yes
						goFlow(rtnArray[5],rtnArray[2]+".html",rtnArray[3],"")
					}
		  	}
	    }else{
	    	alert("Problem   retrieving   XML   data:"   +   xmlhttp_public.statusText);
	    }
   }
}


function goFlow(btnValue,actionUrl,lineId,ruleName){
	if(!checkEntity()) {
		return;
	}

	document.getElementById("actionURL").value = actionUrl;	
	var ticketTypeId = document.getElementById("flowParam.ticketTypeId").value;
	var ticketId = document.getElementById("flowParam.ticketId").value;
	var flowId = document.getElementById("flowParam.flowId").value;
	var selectUser = document.getElementById("flowParam.selectUser").value;
	var taskId = document.getElementById("flowParam.taskId").value;
	var preLineId = document.getElementById("flowParam.lineId").value;
	var currNodeId = document.getElementById("flowParam.currNodeId").value;

	document.getElementById("flowParam.preLineId").value = lineId;
	document.getElementById("selectFlowLineName").value = btnValue;
	//alert(document.getElementById("selectFlowLineName").value);
	if ("" == ruleName){
		loadXML_public("XMLHttpRequestIsDispatcherBased.html?lineId="+lineId+"&flowId="+flowId+"&ticketTypeId="+ticketTypeId+"&ticketId="+ticketId+"&taskId="+taskId+"&selectUser="+selectUser+"&preLineId="+preLineId,isDispatcherBased);
	}else{
		var todoTaskKey = ticketId+"$"+ticketTypeId+"$"+lineId+"$"+taskId+"$"+currNodeId+"$"+selectUser;
		var actionPre = actionUrl.substring(0,actionUrl.indexOf(".html"));
		//alert(actionPre);
		//alert("XMLHttpRequestCheckRule"+actionUrl);
		var url = "XMLHttpRequestCheckRule"+actionUrl+"?todoTaskKey="+todoTaskKey+"&ruleName="+ruleName+"&actionPre="+actionPre+"&btnValue="+utfEscape(btnValue);
		//alert(url);
		loadXML_public(url ,eval(ruleName));
	}
}

function isDispatcherBased(){
	//if   xmlhttp   shows   "loaded"   
	if(xmlhttp_public.readyState==4){
	    //if   "OK"
	    if (xmlhttp_public.status==200){
	    	//alert("XML   data   OK")
	    	var content = xmlhttp_public.responseText;
	    	//var optionObj = document.getElementById("_flowLineSelect");
	    	//optionObj.options[optionObj.selectedIndex].value;
	    	var lineId = document.getElementById("flowParam.preLineId").value;
	    	var actionURL = document.getElementById("actionURL").value;
				var actMsg = document.getElementById("selectFlowLineName").value;
				var rtnArray = content.split("$");
		    if (rtnArray[0] == "0"){
		    		if (rtnArray.length == 1){
							var winname = "%u9009%u62e9%u6d41%u7a0b%u64cd%u4f5c%u4eba%u5458";							
							//alert(unescape(winname));
							//window.open('popwinFlowOperatorSelect.html?lineId='+lineId,''+unescape(winname)+'','');
							a=window.showModalDialog('popwinFlowOperatorSelect.html?lineId='+lineId,''+unescape(winname)+'','dialogWidth:450px;dialogHeight:280px;status:no;help:no');
							if (null != a){
		    				if (!confirm(actMsg+","+unescape("%u8f6c%u4ea4%u7ed9") + "'" + a[1] + "'" + unescape("%u5904%u7406,%u786e%u5b9a%u5417?"))){
									return;
								}
								var lineIdObj = document.getElementById("flowParam.lineStr");
								var operatorObj = document.getElementById("flowParam.operatorStr");
								lineIdObj.value = lineId;
								operatorObj.value = a[0];
								document.fom.action = actionURL;
								document.fom.submit();
							}
		    		}else{
		    			//only one
		    				if (!confirm(actMsg+","+rtnArray[2])){
									return;
								}
		    				var lineIdObj = document.getElementById("flowParam.lineStr");
								var operatorObj = document.getElementById("flowParam.operatorStr");
								lineIdObj.value = lineId;
								operatorObj.value = rtnArray[1];
								document.fom.action = actionURL;
								document.fom.submit();
		    		}
		  	}else{
		  		//rtnArray[0] == "1"
		  			var confirmMsg = actMsg;
		  			if (rtnArray.length > 1){
		  				confirmMsg = confirmMsg + "," + rtnArray[1];
		  			}
    				if (!confirm(confirmMsg)){
							return;
						}
						var lineIdObj = document.getElementById("flowParam.lineStr");
						var operatorObj = document.getElementById("flowParam.operatorStr");
						lineIdObj.value = lineId;
						document.fom.action = actionURL;
						document.fom.submit();
		  	}
	    }else{
	    	alert("Problem   retrieving   XML   data:"   +   xmlhttp_public.statusText);
	    }
   }
}

function ticketPigeonhole(btnValue,actionUrl,lineId,ruleName){
	if ("" == ruleName){
		var txt = "%u786e%u8ba4%u5f52%u6863%u5417";
		txt = unescape(txt) + "?";	
		if (!confirm(txt)){
			return false;
		}
		var lineIdObj = document.getElementById("flowParam.lineStr");
		lineIdObj.value = lineId;
		document.fom.action = actionUrl;
		document.fom.submit();
	}else{
		var ticketTypeId = document.getElementById("flowParam.ticketTypeId").value;
		var ticketId = document.getElementById("flowParam.ticketId").value;
		var flowId = document.getElementById("flowParam.flowId").value;
		var selectUser = document.getElementById("flowParam.selectUser").value;
		var taskId = document.getElementById("flowParam.taskId").value;
		var preLineId = document.getElementById("flowParam.lineId").value;
		var currNodeId = document.getElementById("flowParam.currNodeId").value;
		var todoTaskKey = ticketId+"$"+ticketTypeId+"$"+lineId+"$"+taskId+"$"+currNodeId+"$"+selectUser;
		var actionPre = actionUrl.substring(0,actionUrl.indexOf(".html"));
		//alert(actionPre);
		//alert("XMLHttpRequestCheckRule"+actionUrl);
		loadXML_public("XMLHttpRequestCheckRule"+actionUrl+"?todoTaskKey="+todoTaskKey+"&ruleName="+ruleName+"&actionPre="+actionPre+"&btnValue="+utfEscape(btnValue),eval(ruleName));
	}		
}

function checkDelCircuit(){
	if(xmlhttp_public.readyState==4){
	    //if   "OK"
	    if (xmlhttp_public.status==200){
	    	//alert("XML   data   OK")
	    	var content = xmlhttp_public.responseText;
	    	//alert(content);
				var rtnArray = content.split("$");
				if (rtnArray[0] == "1"){
					if (!confirm(rtnArray[1])){
						document.getElementById("businessFlag").value = "";
					}else{
						document.getElementById("businessFlag").value = "WITH_ROUTE";
					}
		  	}
		  	ticketPigeonhole(rtnArray[5],rtnArray[2]+".html",rtnArray[3],"");
	    }else{
	    	alert("Problem   retrieving   XML   data:"   +   xmlhttp_public.statusText);
	    }
   }
}

function dealWithTicktet(the,action){
	var objValue = getCheckBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	if (objValue.indexOf(",") > 0){
			var txt = "%u53ea%u80fd%u9009%u62e9%u4e00%u6761";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	var txt = "\u5176\u4ed6\u7528\u6237\u5c06\u4e0d\u80fd\u518d\u5904\u7406\u8be5\u5355\u636e,\u8bf7\u786e\u8ba4";
	txt = unescape(txt) + "?";	
	if (!confirm(txt)){
		return false;
	}
	var paramArray = objValue.split("$");
	document.fom.entityId.value = paramArray[0];
	document.fom.todoTaskKey.value = objValue;
	document.fom.action = action;
	document.fom.submit();
}

var   xmlhttp_public
function  loadXML_public(urlStr,fucObj){
		//code   for   Mozilla,   etc. 
		if(window.XMLHttpRequest){
	    xmlhttp_public = new XMLHttpRequest();
	    xmlhttp_public.onreadystatechange=fucObj;
	    xmlhttp_public.open("GET",urlStr,true);
	    xmlhttp_public.send(null);
    }else if (window.ActiveXObject){
		//code   for   IE
    	xmlhttp_public = new ActiveXObject("Microsoft.XMLHTTP");
        if (xmlhttp_public){
	        xmlhttp_public.onreadystatechange=fucObj;
	        xmlhttp_public.open("GET",urlStr,true);
	        xmlhttp_public.send();
        }
    }
}

function delFlowTicket(action){
	var objValue = getRaidioBoxCheckedValue("id_entitys");
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	if (objValue.indexOf(",") > 0){
			var txt = "%u53ea%u80fd%u9009%u62e9%u4e00%u6761";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	var txt = "%u786e%u8ba4%u8981%u5220%u9664%u5417%uff1f";
	txt = unescape(txt) + "?";	
	if (!confirm(txt)){
		return false;
	}
	//alert(objValue);
	var paramArray = objValue.split("$");
	//key=TicketId$TicketTypeId$LineId$TaskId$currNodeID
	//alert(paramArray[0]);
	document.listForm.selectedIds.value = paramArray[0];
	document.listForm.todoTaskKey.value = objValue;
	document.listForm.action = action;
	document.listForm.submit();
}

function viewFlowTicket(id){
		if (id == "-1")
			return false;
		var paramArray = id.split("$");
    document.fom.entityId.value = paramArray[0];
    document.fom.submit();
    return false;
}

function viewAttach(fileURL){
	winStyle = "width=600,height=250,resizable=yes,scrollbars=yes,menubar=no,status=no,toolbar=no";
	window.open(fileURL, "\u9644\u4ef6\u67e5\u770b", winStyle);
	return false;
}

function getNextDate(n){
	var uom = new Date();
	uom.setDate(uom.getDate()+n);
	uom = uom.getFullYear() + "-" +  (uom.getMonth()+1) + "-" + uom.getDate();
	return uom;
}

function getDateLong(dateStr){
	return replaceAll(dateStr,"-","");
}

function excelExportList(urlStr,isAll){
	//form
	var formObj = document.listForm;
	if (null == formObj)
		return;
	var pars = Form.serialize(formObj);
	if ("all" == isAll){
		pars = "exportRegion=all&" + pars;
	}
	winStyle = "";//"location=no";
	window.open(urlStr+"?"+pars,"EXCEL\u5bfc\u51fa",winStyle);
}



function showResponse(originalRequest){
    //put returned XML in the textarea
    alert(originalRequest.responseText);
}

function encodeParaObj(obj){
	if (null == obj){
		return "";
	}
	var strbuff= new Array();
	for(var p in obj){
        if(typeof(obj[p])=="function"){
            //
        }else{
            //props+= p + "=" + obj[p] + "\t"; 
            strbuff.push("&");
            strbuff.push(p);
			strbuff.push("=");
			strbuff.push(utfEncode(obj[p]));
        }
    }
    var rtnStr = strbuff.join("");
    if ("" != rtnStr){
    	rtnStr = rtnStr.substring(1);
    }
	return rtnStr;
}


function setReadOnlyTrue(obj) { 
    var cnt = 0;
    for(var p in obj){  
        if(typeof(obj[p])!="function"){  
        	Ext.get(p).dom.readOnly = true;
        }
        cnt++;
    }
} 

function setReadOnlyFalse(obj) { 
    var cnt = 0;
    for(var p in obj){  
        if(typeof(obj[p])!="function"){  
        	Ext.get(p).dom.readOnly = false;
        }
        cnt++;
    }
}


function sortIndex(recordArray,store) {
	var resultStr = new String();
	var length = recordArray.length;
	if(length <= 0 ){
		return -1;
	}
	if(length == 1){
		return recordArray[0].get('id');
	}
	var arrayIndex = new Array();
	var arrayInstId = new Array(); 
	for (var i = 0; i < length; i++) {
		var index = store.find('id', recordArray[i].get('id'));
		arrayIndex[i] = index;
		arrayInstId[i] = recordArray[i].get('id');
	}
	for (var j = 1; j < length; j++) {
		var temp = arrayInstId[j];
		var key = arrayIndex[j];
		var i;
		for (i = j - 1; i >= 0; i--) {
			if (key < arrayIndex[i]) {
				arrayInstId[i + 1] = arrayInstId[i];
				arrayIndex[i + 1] = arrayIndex[i];
			} else {
				break;
			}
		}
		arrayInstId[i + 1] = temp;
		arrayIndex[i + 1] = key;
	}
	for (var i = 0; i < length - 1; i++) {
		resultStr = resultStr + arrayInstId[i] + ',';
	}
	resultStr = resultStr + arrayInstId[length - 1];
	return resultStr.trim();
}

function upRecord(Grid){
	var obj = eval("("+ Grid +")");
	var store = obj.getDataStore();
	if(store == null || store == "")
		return false;
	var grid = obj.getGrid();
	var record = grid.getSelectionModel().getSelected();
	if ( record == null || record == "")
		return false;
	var index = store.indexOf(record);

	//上移
	if (index > 0) {
		store.removeAt(index);
		store.insert(index - 1, record);
		grid.getSelectionModel().selectRow(index);
		
		record = grid.getSelectionModel().getSelected();
		store.removeAt(index);
		store.insert(index , record);
		grid.getSelectionModel().selectRow(index-1);
	}
}

function downRecord(Grid){
	var obj = eval("("+ Grid +")");
	var store = obj.getDataStore();
	if(store == null || store == "")
		return false;
	var grid = obj.getGrid();
	var record = grid.getSelectionModel().getSelected();
	if ( record == null || record == "")
		return false;
	var index = store.indexOf(record);
	
	//下移
	if (index < store.getCount() - 1) {
		store.removeAt(index);
		store.insert(index + 1, record);
		grid.getSelectionModel().selectRow(index);
		
		record = grid.getSelectionModel().getSelected();
		store.removeAt(index);
		store.insert(index , record);
		grid.getSelectionModel().selectRow(index + 1);
	
	}
	
}

//置顶
function up2topRecords(grid){
	if(grid == null || grid == "")
		return false;
	var store= grid.getStore();
	var records = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(records)||records.length==0)
		return false;
	var firstIndex = store.indexOf(records[0]);
	var lastIndex = store.indexOf(records[records.length-1]);
	if(firstIndex==0)
		return false;
	records = store.getRange(firstIndex,lastIndex);
	store.remove(records);
	grid.getSelectionModel().selectAll();
	var lastRecords = grid.getSelectionModel().getSelections();
	store.removeAll();
	store.insert(0, records);
	store.insert(records.length, lastRecords);
	grid.getSelectionModel().selectRange(0,records.length-1);
}

//置底
function down2lastRecords(grid){
	if(grid == null || grid == "")
		return false;
	var store = grid.getStore();
	var total = store.getCount();
	var records = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(records)||records.length==0)
		return false;
	var firstIndex = store.indexOf(records[0]);
	var lastIndex = store.indexOf(records[records.length-1]);
	if(lastIndex==(total-1))
		return false;
	records = store.getRange(firstIndex,lastIndex);
	store.remove(records);
	grid.getSelectionModel().selectAll();
	var lastRecords = grid.getSelectionModel().getSelections();
	store.removeAll();
	store.insert(0, lastRecords);
	store.insert(total-records.length, records);
	grid.getSelectionModel().selectRange(total-records.length,total-1);
}

//下移多条
function downRecords_dataStore(grid){
	if(grid == null || grid == "")
		return false;
	var store = grid.getStore();
	var records = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(records)||records.length==0)
		return false;
	var firstSelectedRow = null;
	for(var i=0;i<store.getCount();i++){
		if(grid.getSelectionModel().isSelected(store.getAt(i))){
			firstSelectedRow = store.getAt(i);
			break;
		}
	}
	var firstIndex = store.indexOf(firstSelectedRow);
	//var index = store.indexOf(records[records.length-1]);
	var index = firstIndex+records.length-1;
	records = store.getRange(firstIndex,index);
	//下移(移动的record注意都要重新插入)
	if (index < store.getCount() - 1) {
		grid.getSelectionModel().clearSelections();
		
		//先做移动下一条数据到第一条
		var nextRecordIndex = index+1;
		var nextRecord = store.getAt(nextRecordIndex);
		store.removeAt(nextRecordIndex);
		
		//移动records到指定位置
		store.remove(records);
		var newFirstIndex = nextRecordIndex-records.length;//先第一条数据
		store.insert(newFirstIndex, nextRecord);
		store.insert(newFirstIndex+1, records);
		grid.getSelectionModel().selectRange(newFirstIndex+1,newFirstIndex+records.length);
	}
}

//上移多条
function upRecords_dataStore(grid){
	if(grid == null || grid == "")
		return false;
	var store= grid.getStore();
	var records = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(records)||records.length==0)
		return false;
	var firstSelectedRow = null;
	for(var i=0;i<store.getCount();i++){
		if(grid.getSelectionModel().isSelected(store.getAt(i))){
			firstSelectedRow = store.getAt(i);
			break;
		}
	}
	var index = store.indexOf(firstSelectedRow);
	var lastIndex = index+records.length-1;
	records = store.getRange(index,lastIndex);
	//上移 (移动的record注意都要重新插入)
	if (index > 0) {
		var newMoveRecordIndex = index-1;
		var newMoveRecord = store.getAt(newMoveRecordIndex);
		store.remove(newMoveRecord);
		store.remove(records);
		
		store.insert(newMoveRecordIndex, records);
		store.insert(newMoveRecordIndex+records.length, newMoveRecord);
		grid.getSelectionModel().selectRange(newMoveRecordIndex,newMoveRecordIndex+records.length-1);
	}
}

function upRecord_dataStore(grid){
	if(grid == null || grid == "")
		return false;
	var store= grid.getStore();
	var record = grid.getSelectionModel().getSelected();
	if ( record == null || record == "")
		return false;
	var index = store.indexOf(record);

	//上移
	if (index > 0) {
		store.removeAt(index);
		store.insert(index - 1, record);
		grid.getSelectionModel().selectRow(index);
		
		record = grid.getSelectionModel().getSelected();
		store.removeAt(index);
		store.insert(index , record);
		grid.getSelectionModel().selectRow(index-1);
	}
}

function downRecord_dataStore(grid){
	if(grid == null || grid == "")
		return false;
	var store = grid.getStore();
	var record = grid.getSelectionModel().getSelected();
	if ( record == null || record == "")
		return false;
	var index = store.indexOf(record);
	
	//下移
	if (index < store.getCount() - 1) {
		store.removeAt(index);
		store.insert(index + 1, record);
		grid.getSelectionModel().selectRow(index);
		
		record = grid.getSelectionModel().getSelected();
		store.removeAt(index);
		store.insert(index , record);
		grid.getSelectionModel().selectRow(index + 1);
	
	}
}

function selectRecordsInstId(grid){
	var records = grid.getSelectionModel().getSelections();
	var allSelectId ='';
	for(var i=0; i<records.length-1; i++  ){
		allSelectId =allSelectId + records[i].get('instId')+',';
	}
	if(records.length>0){
		allSelectId = allSelectId + records[records.length-1].get('instId');
	}
   if(records.length <= 0){
	 alert("\u8bf7\u9009\u62e9\u6570\u636e!");
   }
   return allSelectId;
}

function selectRecordsidInhotu(grid){
	var records = grid.getSelectionModel().getSelections();
	var allSelectId ='';
	for(var i=0; i<records.length-1; i++  ){
		allSelectId =allSelectId + records[i].get('idInHotu')+',';
	}
	if(records.length>0){
		allSelectId = allSelectId + records[records.length-1].get('idInHotu');
	}
   if(records.length <= 0){
	 alert("\u8bf7\u9009\u62e9\u6570\u636e!");
   }
   return allSelectId;
}

function selectRecordsBack(grid){
	var records = grid.getSelectionModel().getSelections();
	var allSelectId ='';
	for(var i=0; i<records.length-1; i++  ){
		allSelectId =allSelectId + records[i].get('back')+',';
	}
	if(records.length>0){
		allSelectId = allSelectId + records[records.length-1].get('back');
	}
   if(records.length <= 0){
	 alert("\u8bf7\u9009\u62e9\u6570\u636e!");
   }
   return allSelectId;
}

function extTabSaveEvent(tabPanel,url,grid,property,readOnly){
    var record = grid.getSelectionModel().getSelected();
    if (record == undefined) {
        alert('\u8bf7\u9009\u62e9\u4e00\u6761\u8bb0\u5f55!');
        return;
    }
    if (undefined == property){
        property = "name";
    }
    var title = record.get(property);
    if(title==null){
        title = property;
    }
    var iconCls = '';
    if(readOnly){
        iconCls = 'fam_application_view_list';
    }else{
        iconCls = 'fam_modify';
    }
    tabPanel.add({
        title: title,
        iconCls: iconCls,
        html: '<IFRAME name="_editObjectPanel" id="_editObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'?entityId='+record.id+'&readOnly='+readOnly+'"></IFRAME>',
        closable:true
    }).show();
}
function extTabAddEvent(tabPanel,title,url,tabId){
	tabPanel.add({
		id: tabId,
        title: title,
        iconCls: 'fam_add',
        html : '<IFRAME name="_createObjectPanel" id="_createObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'"></IFRAME>',
        closable:true
    }).show();
}

//编辑Tab Jinhi添加
function extTabModifyEvent(tabPanel,title,url){
	tabPanel.add({
        title: title,
        iconCls: 'fam_modify',
        html : '<IFRAME name="_createObjectPanel" id="_createObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'"></IFRAME>',
        closable:true
    }).show();
}

//
function extTabViewEventByUrl(tabPanel,title,url){
	tabPanel.add({
        title: title,
        iconCls: 'fam_application_view_list',
        html : '<IFRAME name="_createObjectPanel" id="_createObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'"></IFRAME>',
        closable:true
    }).show();
}

function extTabEditEvent(tabPanel,url,grid,property){
	var record = grid.getSelectionModel().getSelected();
	if (record == undefined) {
		alert('\u8bf7\u9009\u62e9\u4e00\u6761\u8bb0\u5f55!');
		return;
	}
	if (undefined == property){
		property = "name";
	}
	var title = '';
	if(Ext.isEmpty(record.get(property))){
	    title = property;
	}else{
	    title = record.get(property);
	}
	if(url.indexOf('?')<0){
	    url += '?entityId='+record.id;
	}
	tabPanel.add({
        title: title,
        iconCls: 'fam_modify',
        html: '<IFRAME name="_editObjectPanel" id="_editObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'"></IFRAME>',
        closable:true
    }).show();
}
/**
 * 树节点右键菜单“增加”事件
 * @param tabPanel
 * @param title
 * @param url
 * @param node
 * @return
 */
function extTreeAddEvent(tabPanel,title,url,node){
    var nodeId = node.attributes.businessId;
    var nodeText = node.text;
    var regionId = node.attributes.regionId;
    var regionName = node.attributes.regionName;
    var desc = regionId+','+regionName;
    tabPanel.add({
        title: title,
        iconCls: 'fam_add',
        html : '<IFRAME name="_createObjectPanel" id="_createObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'?nodeId='+nodeId+'&nodeText='+utfEncode(nodeText)+'&desc='+utfEncode(desc)+'"></IFRAME>',
        closable:true
    }).show();
}
/**
 * 树节点右键菜单“编辑”事件
 * @param tabPanel
 * @param url
 * @param node
 * @param property
 * @return
 */
function extTreeEditEvent(tabPanel,url,node,property){
    var id = node.attributes.businessId;
    var nodeId = node.parentNode.attributes.businessId;
    var nodeText = node.parentNode.text;
    var regionId = node.attributes.regionId;
    var regionName = node.attributes.regionName;
    var desc = regionId+','+regionName;
    tabPanel.add({
        title: node.text,
        iconCls: 'fam_modify',
        html: '<IFRAME name="_editObjectPanel" id="_editObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'?entityId='+id+'&nodeId='+nodeId+'&nodeText='+utfEncode(nodeText)+'&desc='+utfEncode(desc)+'"></IFRAME>',
        closable:true
    }).show();
}
function extTabViewEvent(tabPanel,url,grid,property){
	var record = grid.getSelectionModel().getSelected();
	if (record == undefined) {
		alert('\u8bf7\u9009\u62e9\u4e00\u6761\u8bb0\u5f55!');
		return;
	}
	if (undefined == property){
		property = "name";
	}
	tabPanel.add({
		id:grid.getId()+record.id+'_view',
        title: record.get(property),
        iconCls: 'fam_application_view_list',
        html: '<IFRAME name="_viewObjectPanel" id="_viewObjectPanel" width="100%" height="100%" frameborder="0" scrolling="no" src="'+url+'?entityId='+record.id+'"></IFRAME>',
        closable:true
    }).show();
}

function extTabDelEvent(url,grid){
	var objValue = getExtGridSelectedRowIds(grid);
	if ("" == objValue){
			var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
			txt = unescape(txt) + "!";
			alert(txt);
			return;
	}
	var txt = "%u786e%u8ba4%u8981%u5220%u9664%u5417";
	txt = unescape(txt) + "？";	
	if (!confirm(txt)){
		return false;
	}
	var paramObj = {};
	progressBar_dlg.showDialog();
	paramObj["selectedIds"] = objValue;
   	var myAjax = new Ajax.Request(
        url,
        {method: 'post', parameters: paramObj, onComplete: afterDeleteRecord}
    );
}

function extTabDelCheckEvent(checkUrl, deleteUrl, grid){
	var objValue = getExtGridSelectedRowIds(grid);
	if ("" == objValue){
		var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
		txt = unescape(txt) + "!";
		alert(txt);
		return;
	}
	var paramObj = {};
	progressBar_dlg.showDialog();
	paramObj["selectedIds"] = objValue;
   	var myAjax = new Ajax.Request(
		checkUrl,
		{
			method: 'post', 
			parameters: paramObj, 
			onComplete: function(response) {
				progressBar_dlg.hideDialog();
				var parseResult = eval("("+response.responseText+")");
				if (null == parseResult || undefined == parseResult){
					alert("parse error !");
					return;
				}
				if (parseResult.resultCode==0) {
					if (!confirm(parseResult.resultText)){
						return false;
					}
					extTabDelEvent(deleteUrl, grid);
				}else{
					extTabDelEvent(deleteUrl, grid);
				}
			}
		}
	);
}

/**
 * 树节点右键菜单“删除”事件
 * @param url
 * @param node
 * @return
 */
function extTreeDelEvent(url,node){
    if (node == null){
        var txt = "%u8bf7%u52fe%u9009%u9700%u8981%u64cd%u4f5c%u7684%u8bb0%u5f55";
        txt = unescape(txt) + "!";
        alert(txt);
        return;
    }
    var id = node.attributes.businessId;
    var txt = "%u786e%u8ba4%u8981%u5220%u9664%u5417%uff1f";
    txt = unescape(txt) + "?";  
    if (!confirm(txt)){
        return false;
    }
    var paramObj = {};
    progressBar_dlg.showDialog();
    paramObj["selectedIds"] = id;
    var myAjax = new Ajax.Request(
        url,
        {method: 'post', parameters: paramObj, onComplete: afterDeleteRecord}
    );
}
function afterDeleteRecord(response){
	progressBar_dlg.hideDialog();	
	var parseObj = eval("("+response.responseText+")");
	if (null == parseObj || undefined == parseObj){
		alert("parse error !");
		return;
	}	
	if (parseObj.resultCode==0) {
		//failure
		alert(parseObj.resultText);
		return;
	}else{
		//success
		//eg:YUIGRID_GisPatrolCheck_Layout
		var listObj = eval(COMMON_QRYOBJ_PREFIX + parseObj.resourceBeanNameParam);
		if (listObj == null || undefined == listObj){
			alert(parseObj.resourceBeanNameParam + " has not Ext Grid Object!");
			return;
		}
		var paramObj = {};
		paramObj["start"] = listObj.getPageBar().cursor;
		paramObj["limit"] = listObj.getPageBar().pageSize;
		listObj.getDataStore().load({params:paramObj});
		alert(parseObj.resultText);
	}
}

function afterXmlRequestSyncResource(response){
	progressBar_dlg.hideDialog();	
	var parseObj = eval("("+response.responseText+")");
	if (null == parseObj || undefined == parseObj){
		alert("parse error !");
		return;
	}
	alert(parseObj.resultText);
	if (parseObj.resultCode==0) {
		//failure
		return;
	}else{
		//success
		//eg:YUIGRID_GisPatrolCheck_Layout
		var listObj = eval('ResourceSync_' + parseObj.resourceBeanNameParam + '_Layout');
		if (listObj == null || undefined == listObj){
			alert(parseObj.resourceBeanNameParam + " has not Ext Grid Object!");
			return;
		}
		var paramObj = {};
		paramObj["start"] = listObj.getPageBar().cursor;
		listObj.getDataStore().load({params:paramObj});
	}
}

function extTabQryEvent(qryCondionPanel,ds,formName){
	var listForm;
	//alert(formName);
	if (undefined != formName){
		listForm = eval("document."+formName);
		//alert(listForm.length);
	}else{
		listForm = document.listForm;
	}
	
	var baseParams = {};
	baseParams["queryStyle"] = 1;
	var inputFields;
	try{
		inputFields = Form.getElements(listForm);
	}catch(e){}
	if ( inputFields != undefined ){
		for(var i = 0 ; i < inputFields.length; i ++){
			if ("button" == inputFields[i].type) continue;
			if(inputFields[i].name == "") continue;
			var fieldValue = $F(inputFields[i]);
			if("" == fieldValue){
				if(ds.baseParams.hasOwnProperty(inputFields[i].name))
					delete ds.baseParams[inputFields[i].name];
			}else{
				baseParams[inputFields[i].name] = fieldValue;
			}
		}
	}
	var p = Ext.apply(ds.baseParams || {},baseParams);
	ds.baseParams = p;
	ds.load({params:{start:0, limit:20}});	
}

function extTabClrCond(formName){
	var listForm;
	if (undefined != formName){
		listForm = eval("document."+formName);
	}else{
		listForm = document.listForm;
	}
	listForm.reset();
}


function extCollapsedEvent(button,qryCondionPanel){	
	if (qryCondionPanel.collapsed){
		qryCondionPanel.expand();
		button.setIconClass("fam_desc");
		button.setText("\u6536 \u7f29");
		button.setTooltip("\u6536 \u7f29");
	}else{
		qryCondionPanel.collapse();
		button.setIconClass("fam_asc");
		button.setText("\u5c55 \u5f00");
		button.setTooltip("\u5c55 \u5f00");
	}
}



function failureRequest(response){
	progressBar_dlg.hideDialog();
	if(!Ext.isEmpty(response.responseText)){
	    alert(response.responseText);
	}
}

function xmlhttpSaveCommonObj(actionURL,formName){
	if(!checkEntity()) {
		return;
	}
	//assemble field
	if (undefined == formName){
		formName = "fom";
	}
	var fields = Form.getElements(formName);
	var paramObj = {};
	for(var i = 0 ; i < fields.length; i++){
		if ("button" != fields[i].type){
			paramObj[fields[i].name] = $F(fields[i].name)
		}
	}
	progressBar_dlg.showDialog();
	Ext.Ajax.request({
	   url: actionURL + '.' + URL_SUFFIX,
	   success: afterXMLHttpSaveCommonObj,
	   failure: failureRequest,
	   method: 'POST',
	   params: paramObj
	});	
}

function afterXMLHttpSaveCommonObj(response){
	progressBar_dlg.hideDialog();
	var parseObj = eval("("+response.responseText+")");
	if (null == parseObj || undefined == parseObj){
		alert("parse error !");
		return;
	}
	if (parseObj.resultCode==0) {
		//failure
		alert(parseObj.resultText);
	}else{
		//success
		$("entity.version").value = parseObj.version;
		$("entity.id").value = parseObj.id; 
		//alert($("entity.version").value);
		alert(parseObj.resultText);
	}
}



function selectRecordsinstId(grid){
	var records = grid.getSelectionModel().getSelections();
	var allSelectId ='';
	for(var i=0; i<records.length-1; i++  ){
		allSelectId =allSelectId + records[i].get('instId')+',';
	}
	if(records.length>0){
		allSelectId = allSelectId + records[records.length-1].get('instId');
	}
   if(records.length <= 0){
	 alert("\u8bf7\u9009\u62e9\u6570\u636e!");
   }
   return allSelectId;
}


function selectRecordsId(grid){
	var records = grid.getSelectionModel().getSelections();
	var allSelectId ='';
	for(var i=0; i<records.length-1; i++  ){
		allSelectId =allSelectId + records[i].get('id')+',';
	}
	if(records.length>0){
		allSelectId = allSelectId + records[records.length-1].get('id');
	}
   if(records.length <= 0){
	 alert("\u8bf7\u9009\u62e9\u6570\u636e!");
   }
   return allSelectId;
}


function OpenDownloadModel(filename){
	var filecatalog = "/pages/resourceconf/resourcemodelexcel/"+filename+".xls";
	var filename = filename+".xls";
	var url = "downloadModel." + URL_SUFFIX;
	var pars = "filecatalog="+filecatalog+"&filename="+filename;
	window.open(url + "?" + pars, "\u4e0b\u8f7d\u6a21\u578b","");
}


/**
 * 根据表名，列名生成下拉列表
 * @param id
 * @param label
 * @param tableName 表名
 * @param columnName 列名
 * @return
 */
function getExtTableComboBox(id, label, tableName, columnName) {
	var entity = Ext.data.Record.create( [ {
		name : 'displayField',
		type : 'string'
	}, {
		name : 'valueField',
		type : 'string'
	} ]);
	var dataList = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : 'XMLHttpRequestLoadTableDictionary.' + URL_SUFFIX + '?className=' + tableName + '&attributeName=' + columnName,
			method : 'POST'
		}),
		reader : new Ext.data.JsonReader( {
			totalProperty : "totalCount",
			root : "rows"
		}, entity)
	});
	var allowBlank = true;
	if (label.indexOf('*') >= 0)
		allowBlank = false;
	var select = new Ext.form.ComboBox({
		fieldLabel: label,
		id: id,
		name: id,
		triggerAction: 'all',
		store: dataList,
		allowBlank : allowBlank,
		selectOnFocus:true,
		displayField:'displayField',
		valueField:'valueField'
	});
	return select;
}

function createExtTextField(id, label, readOnly, regex) {
	var allowBlank = true;
	if (label.indexOf('*') >= 0)
		allowBlank = false;
	return {
		id : id,
		xtype : 'textfield',
		fieldLabel : label,
		name : id,
		allowBlank : allowBlank,
		readOnly : readOnly,
		regex : regex
	};
}
/**
 * 权限校验
 * @param component 被校验的控件
 * @param permission 所校验的权限字符串
 * @param callBack 回调函数
 * @return
 */
function checkPermission(component, permission,callBack){
    component.disable();
    
    Ext.Ajax.request({
        url: 'XMLHttpRequestChkPermission.'+ URL_SUFFIX,
        params: {
            permissionKey: permission
        },
        callback: function(options, success, response){
            var result = Ext.util.JSON.decode(response.responseText);
            if (success && result) {
                component.enable();
                if(callBack){
                        callBack(true);
                }
            }
            else {
                component.disable();
                if(callBack){
                        callBack(false);
                }
            }
        },
        failure: function(response, options){
            Ext.MessageBox.alert('错误', '用户权限校验失败');
        }
    });
    
    return true;
}
/**
 * Ajax提交
 * @param url 
 * @param param 参数
 * @param callBack 回调函数
 * @return
 */
function ajaxRequest(url,param,callBack,timeout){
	var t = 300000;
	if(!Ext.isEmpty(timeout)&&timeout>0)
		t= timeout;
     Ext.Ajax.request({
         url: url,
         params: param,
         timeout:t,
         callback: function(options, success, response){
             //alert(Ext.util.JSON.encode(response));
             var reqst=response.status;        // 根据返回的状态码值判断是否超时
             if(reqst=='-1'){
                 show(Ext.Msg.WARNING,'请求超时!');
                 return;
             }
             if(progressBar_dlg!=null){
                 progressBar_dlg.hideDialog();
             }
             var parseObj = Ext.util.JSON.decode(response.responseText);
             if (null == response.responseText || undefined == response.responseText){
                 Ext.Msg.alert("错误","返回对象有误!");
                 return;
             }
             if (parseObj!=null) {
                 if(parseObj.resultCode==0){
                     Ext.Msg.alert('错误',parseObj.resultText);
                     return;
                 }else{
                     callBack(parseObj);
                 }
             }
         },
         failure:failureRequest
     });
}
/**
 * 创建EXT窗口
 * @param title 标题
 * @param height 高度
 * @param width 宽度
 * @param form 表单
 * @param subFunc 提交函数
 * @return
 */
function createWindow(title,height,width,form,subFunc){
    var _win = new Ext.Window({
        title: title,
        height: height,
        width: width,
        autoScroll: false,
        modal: true,
        frame:true,
        maxWidth: 800,
        maxHeight: 500,
        layout: 'fit',
        plain: true,
        buttonAlign: 'center',
        items: [form],
        buttons: [{
            text: '确定',
            handler: function(){
                subFunc();
            }
        }, {
            text: '关闭',
            handler: function(){
                try{_win.close()}catch(e){};
            }
        }]
    });
    return _win;
}
/**
 * 创建没有按钮的窗口
 * @param title
 * @param height
 * @param width
 * @param form
 * @return
 */
function createNoButtonWindow(title,height,width,form){
    var _win = new Ext.Window({
        title: title,
        height: height,
        width: width,
        autoScroll: false,
        modal: true,
        frame:true,
        maxWidth: 800,
        maxHeight: 500,
        maximizable:true,
        layout: 'fit',
        plain: true,
        closeAction:'hide',
        buttonAlign: 'center',
        items: [form]
    });
    return _win;
}

/**
 *解析date对象为短字符 
 *使用时将store中的type设置为date或者timestamp 
 * @param val
 * @return
 */
function parseShortJavaDate(val){
    if(!Ext.isEmpty(val)){
        var year = val.year+1900;
        var month = val.month+1;
        var date = val.date;
        
        return year+'-'+(month<10?('0'+month):month)+'-'+(date<10?('0'+date):date);
    }else{
        return '';
    }
}

/**
*解析date对象为长字符 
*使用时将store中的type设置为date或者timestamp 
 * @param val
 * @return
 */
function parseLongJavaDate(val){
    if(!Ext.isEmpty(val)){
        var year = val.year+1900;
        var month = val.month+1;
        var date = val.date;
        var hour = val.hours;
        var min = val.minutes;
        var sec = val.seconds;
        return year+'-'+(month<10?('0'+month):month)+'-'+(date<10?('0'+date):date)+' '+(hour<10?('0'+hour):hour)+':'+(min<10?('0'+min):min)+':'+(sec<10?('0'+sec):sec);
    }else{
        return '';
    }
}
/**
 * 用于转换store中的Object对象，显示对象的名字
 */
function changeObjectToName(v){
    if(!Ext.isEmpty(v)){
        return v.name;
    }else{
        return '';
    }
}

/**
 * 解析boolean为字符
 * @param val
 * @return
 */
function changeYorN(val, metaData, record, rowIndex, colIndex, store){
    if(Ext.isEmpty(val)){
        return '';
    }
    if(val==true||val=='true'){
        return '是';
    }else{
        return '否';
    }
}
function addPanelToTab(tabPanel,panelTitle,url,closable,tabId){
    var frameId ='_Panel';
	if(!Ext.isEmpty(tabId)){
	    frameId = tabId;
		var items = tabPanel.items;
		if(!Ext.isEmpty(items)){
			var itemsLength = tabPanel.items.length;
			for(var a = 0;a<itemsLength;a++){
				var item  = tabPanel.items.item(a);
				if(item.getId()==tabId){
					tabPanel.setActiveTab(tabId);
					return;
				}
			}
		}
	}
	tabPanel.add({
		id:tabId,
		title:panelTitle,
		closable:closable==undefined?true:closable,
				bodyStyle: 'padding:0px',
				html : '<IFRAME name="'+frameId+'" id="'+frameId+'" width="100%" height="100%" frameborder="0" scrolling="yes" src="'+url+'"></IFRAME>'
	}).show();
}

function createTriggerByUrl(name,label,url,hiddenId,allowBlank,callback){
    var trigger = new Ext.form.TwinTriggerField({
        fieldLabel : label,
        name : name,
        allowBlank : allowBlank==undefined?true:false,
        editable : false,
        trigger1Class : 'x-form-clear-trigger',
        trigger2Class : 'x-form-search-trigger',
        onTrigger2Click : function () {
            if(!this.disabled){
                var features = "dialogWidth:900px;dialogHeight:570px;scrollbars:yes;status:no;help:no;resizable:1;";
                var rtn = openModalDialogWindow(url, window, features);
                if (null != rtn) {
                    trigger.setValue(rtn[0].name);
                    Ext.getCmp(hiddenId).setValue(rtn[0].id);
                    if(callback!=undefined){
                        callback(rtn);
                    }
                }
            }
        },
        onTrigger1Click : function() {
            if(!this.disabled){
                trigger.setValue('');
                Ext.getCmp(hiddenId).setValue('');
            }
        }
    });
    return trigger;
}

function downloadFile(url){
	progressBar_dlg.showDialog();
    var downloadIF = null;//document.getElementById("_downloadIFrame");
    if (null == downloadIF || undefined == downloadIF){
        downloadIF = document.createElement("IFRAME");
        downloadIF.setAttribute("id", "_downloadIFrame");
        downloadIF.style.display = "none";
        downloadIF.src = url;                                   
        document.body.appendChild(downloadIF);
    }else{
        downloadIF.src = url;
    }
    progressBar_dlg.hideDialog();
}

/**
 * Ext.MessageBox.INFO
 * Ext.MessageBox.WARNING
 * Ext.MessageBox.ERROR
 * @return
 */
function show(type,msg){
    var title = '';
    if(type==Ext.MessageBox.ERROR){
        title = '错误';
    }else if(type==Ext.MessageBox.INFO){
        title = '提示';
    }else if(type==Ext.MessageBox.WARNING){
        title = '警告';
    }
    Ext.MessageBox.show({
        msg: msg,
        title:title,
        buttons: Ext.MessageBox.OK,
        icon: type
    });    
}
/**
 * 根据gird获取选中的id字符串，以‘,’分隔
 * @param grid
 * @return
 */
function createSelectedIdsByGrid(grid){
    var selectedIds = '';    
    var selectedRows = grid.getSelectionModel().getSelections();
    if(selectedRows.length==0){
        return selectedIds;
    }else{
        for(var i=0;i<selectedRows.length;i++){
            if(selectedIds==''){
                selectedIds = selectedRows[i].get('id');
            }else{
                selectedIds += ','+selectedRows[i].get('id');
            }
        }
    }
    return selectedIds;
}

/**
 * 根据gird获取选中的Column属性字符串，以‘,’分隔
 * @param grid
 * @return
 */
function createSelectedColumnStrByGrid(grid,column){
	var atts = '';    
	var selectedRows = grid.getSelectionModel().getSelections();
	if(selectedRows.length==0){
		return atts;
	}else{
		for(var i=0;i<selectedRows.length;i++){
			if(atts==''){
				atts = selectedRows[i].get(column);
			}else{
				atts += ','+selectedRows[i].get(column);
			}
		}
	}
	return atts;
}
/**
 * 从数组[Object]中获取指定Column属性字符串，以‘,’分隔
 * @param grid
 * @return
 */
function createColumnStrFromArray(arr,column){
	var atts = '';
	if(arr.length==0){
		return atts;
	}else{
		for(var i=0;i<arr.length;i++){
			if(!Ext.isEmpty(arr[i][column])){
				if(atts==''){
					atts = arr[i][column];
				}else{
					atts += ','+arr[i][column];
				}
			}else{
				break;
			}
		}
	}
	return atts;
}

//Jinhi(2011-04-11) 当field组件值默认不为空时，自动在组件标签后加上星号(*)
Ext.form.Field.prototype.initComponent = function(){
	if(this.allowBlank == false){
		if(this.fieldLabel != undefined)
			this.fieldLabel = "<font color='red'>*</font>"+this.fieldLabel;
		else
			this.fieldLabel = "<font color='red'>*</font>";
		
		if(this.boxLabel != undefined)
			this.boxLabel = "<font color='red'>*</font>"+this.boxLabel;
		else
			this.boxLabel = "<font color='red'>*</font>";
	}
	Ext.form.Field.superclass.initComponent.call(this);
	this.addEvents('focus','blur','specialkey','change','invalid','valid');
}
/**
 * prefix表示action中定义的java变量名
 * object表示提交的参数对象
 * 例如prefix='rack',object={name:'aa',id:1}结果将是{'rack.name':'aa','rack.id':1}
 */
function replaceAttributeName(prefix,object){
    if(Ext.isEmpty(object)||Ext.isEmpty(prefix)){
        return object;
    }
    var obj ={};
    for(arr in object){
        if(!Ext.isEmpty(object[arr])){
            obj[prefix+'.'+arr]=object[arr];
        }
    }
    return obj;
}
function replaceAttributeFieldName(prefix,object){
    if(Ext.isEmpty(object)||Ext.isEmpty(prefix)){
        return object;
    }
    var obj ={};
    for(arr in object){
        if(!Ext.isEmpty(object[arr])&&!Ext.isEmpty(object[arr].trim())){
            obj[prefix+'.'+arr.substr(6,arr.length)]=object[arr];
        }
    }
    return obj;
}
Ext.util.Format.comboRenderer = function(combo){
    return function(value){
        var record = combo.findRecord(combo.valueField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
}

Ext.override(Ext.form.CheckboxGroup, {
	getValue : function() {
	var v = [];
	this.items.each(function(item) {
		if (item.getValue()) {
			v.push(item.getRawValue());
		} else {
			v.push('');
		}
	});
	return v;
    },
	setValue : function(vals) {
		var a = [];
		if (Ext.isArray(vals)) {
			a = vals;
		} else {
			a = [vals];
		}
		this.items.each(function(item) {
			item.setValue(false); // reset value
			for (var i = 0; i < a.length; i++) {
				var val = a[i];
				if (val == item.getRawValue()) {
					item.setValue(true);
				}
			};
		});
	}
});
//修改超时时间
Ext.tree.TreeLoader.override({
    requestData : function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            this.transId = Ext.Ajax.request({
                method:this.requestMethod,
                url: this.dataUrl||this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                timeout: this.timeout || 120000,
                scope: this,
                argument: {callback: callback, node: node},
                params: this.getParams(node)
            });
        }else{
            // if the load is cancelled, make sure we notify
            // the node that we are done
            if(typeof callback == "function"){
                callback();
            }
        }
    }
});
/**
 * 增加treeLoader默认load事件
 */
Ext.tree.TreePanel.override({
    initComponent : function(){
        Ext.tree.TreePanel.superclass.initComponent.call(this);
    
        if(!this.eventModel){
            this.eventModel = new Ext.tree.TreeEventModel(this);
        }
        
        var l = this.loader;
        if(!l){
            l = new Ext.tree.TreeLoader({
                dataUrl: this.dataUrl,
                requestMethod: this.requestMethod
            });
        }else if(Ext.isObject(l) && !l.load){
            l = new Ext.tree.TreeLoader(l);
        }
        this.loader = l;
    
        this.nodeHash = {};
    
        
        if(this.root){
            var r = this.root;
            delete this.root;
            this.setRootNode(r);
        }
    
        this.addEvents(
           'append',
           'remove',
           'movenode',
           'insert',
           'beforeappend',
           'beforeremove',
           'beforemovenode',
           'beforeinsert',
            'beforeload',
            'load',
            'textchange',
            'beforeexpandnode',
            'beforecollapsenode',
            'expandnode',
            'disabledchange',
            'collapsenode',
            'beforeclick',
            'click',
            'containerclick',
            'checkchange',
            'beforedblclick',
            'dblclick',
            'containerdblclick',
            'contextmenu',
            'containercontextmenu',
            'beforechildrenrendered',
            'startdrag',
            'enddrag',
            'dragdrop',
            'beforenodedrop',
            'nodedrop',
            'nodedragover'
        );
        if(this.singleExpand){
            this.on('beforeexpandnode', this.restrictExpand, this);
        }
        if(this.getLoader()){
            this.getLoader().on('load',treeLoadEvent); 
        }
    }
});

/**
 * 用于在GridPanel中鼠标滑过单元格时显示提示框
 * @param grid
 * @return
 */
function showGridToolTib(grid){
    Ext.ToolTip.prototype.onTargetOver = Ext.ToolTip.prototype.onTargetOver.createInterceptor(function(e) {
        this.baseTarget = e.getTarget();     
    });    
    Ext.ToolTip.prototype.onMouseMove = Ext.ToolTip.prototype.onMouseMove.createInterceptor(function(e) {
        if (!e.within(this.baseTarget)) {
            this.onTargetOver(e);
            return false;
        }     
    });
    grid.on('render', function(grid) {
        var store = grid.getStore();            
        var view = grid.getView();            
        grid.tip = new Ext.ToolTip({
            target: view.mainBody,
            delegate: '.x-grid3-row',                
            trackMouse: true,                
            renderTo: document.body,                
            listeners: {
                beforeshow: function(tip) {
                    tip.body.dom.innerHTML = '';
                    var cell = view.findCell(tip.baseTarget);
                    if(!Ext.isEmpty(cell)&&!Ext.isEmpty(cell['innerText'])){
                        tip.body.dom.innerHTML = cell['innerText'];
                    }
                }           
            }        
        });   
    }); 
}
function setFieldValue(form,fieldName,value){
    if(!Ext.isEmpty(form)&&!Ext.isEmpty(form.findField(fieldName))){
        form.findField(fieldName).setValue(value);
    }
}
/**
 * 窗口关闭事件
 * @return
 */
function checkClose(){   
    var n = window.event.screenX   -   window.screenLeft;   
    var b = n   >   document.documentElement.scrollWidth-20;
    window.onunload = null;
    if(b && window.event.clientY < 0 || window.event.altKey)   
    {   
        window.event.returnValue = "是否确认关闭？";
    }else{
        //alert("是刷新而非关闭");   
    }   
}
//Jinhi(2011-08-29) 为reader增加一个responseText属性，方便store加载后解析返回数据

IrmJsonReader = Ext.extend(Ext.data.JsonReader, {  
    read : function(response){  
        var json = response.responseText;  
        var o = Ext.decode(json);  
        this.responseText = json;  
        if(!o) {  
            throw {message: 'JsonReader.read: Json object not found'};  
        }  
        return this.readRecords(o);  
    }  
});
function treeLoadEvent(loader,node,response){
    try{
        var parseObj = Ext.util.JSON.decode(response.responseText);
        if (parseObj.resultCode==0) {
            Ext.Msg.alert('错误',Ext.isEmpty(parseObj.resultText)?'未知错误':parseObj.resultText);
            return;
        }
    }catch(e){
        //show(Ext.Msg.WARNING,'返回数据不是对象!');
    }
}
/**
 * 解决Grid中文排序
 */
Ext.data.Store.prototype.applySort = function(){
    if(this.sortInfo&&!this.remoteSort){
        var s = this.sortInfo,f = s.field;
        var st = this.fields.get(f).sortType;
        var fn = function(r1,r2){
            var v1 = st(r1.data[f]),v2 = st(r2.data[f])
            if(typeof(v1)=='string'){
                return v1.localeCompare(v2);
            }
            return v1>v2?1:(v1<v2?-1:0);
        }
        this.data.sort(s.direction,fn);
        if(this.snapshot&&this.snapshot!=this.data){
            this.snapshot.sort(s.direction,fn);
        }
    }
}
/**
 * 根据store某个字段的值查找当条record对象
 * @param store
 * @param fieldName
 * @param fieldValue
 * @return
 */
function getRecordByFieldValue(store,fieldName,fieldValue){
    var index = store.findExact(fieldName,fieldValue);
    var record = store.getAt(index);
    return record;
}
/**
 * 通用的查询回调事件，主要实现抛出后台异常信息
 * @param store
 * @param records
 * @param options
 * @return
 */
function gridOnLoad(store,records,options){
    var resultCode = store.reader.jsonData.resultCode;
    var resultText = store.reader.jsonData.resultText;
    if(resultCode=='0'){
        show(Ext.Msg.ERROR,resultText);
        return;
    }
}

function getSelected(gridPanel,exactAlert){
    var record = gridPanel.getSelectionModel().getSelected();
    if(record==null||(exactAlert==true&&gridPanel.getSelectionModel().getCount()>1)){
        show(Ext.Msg.WARNING,'请选择一条数据!');
        return null;
    }else{
        return record; 
    }
}
function getSelections(gridPanel){
    var records = gridPanel.getSelectionModel().getSelections();
    if(records.length==0){
        show(Ext.Msg.WARNING,'请选择一条数据!');
        return null;
    }else{
        return records; 
    }
}
function editRecord(store,record){
    var index = store.indexOf(record);
    store.remove(record);
    store.insert(index,record);
}

function getOpener(window){
	var openerWindow = window.dialogArguments;
	if(!Ext.isEmpty(openerWindow)&&!Ext.isEmpty(openerWindow.document)){
		return openerWindow;
	}
}

function getBottomOpener(window){
	var opener = getOpener(window);
	while(!Ext.isEmpty(opener)){
		var _opener = getOpener(opener);
		if(!Ext.isEmpty(_opener)){
			opener = _opener;
		}else{
			break;
		}
	}
	return opener;
}

function findParentByFunctionName(name,window){
	var parentWin=window.parent;
	while(!Ext.isEmpty(parentWin)){
		if(Ext.isEmpty(parentWin.name)){
			parentWin=parentWin.parent;
		}else{
			return parentWin;
		}
		
	}
	return null;
}
function createArrFromStore(store,fieldName){
	var arr = [];
	for(var i=0;i<store.getCount();i++){
		arr[i]=store.getAt(i).get(fieldName);
	}
	return arr;
}
/**
 * keydown事件判断是否为退格键，是的话取消页面后退。
 * 使用：onkeydown="cancelBackspace(event);"
 * @param e
 */
function cancelBackspace(e){
	var keynum;
	
	if(window.event) // IE
	{
		keynum = e.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}
	if(keynum==8){
		e.keyCode=0;
	}
}

function setIframeHeight(obj) { 
	var win=obj;
	if (document.getElementById) { 
		if (win && !window.opera){ 
			if (win.contentDocument && win.contentDocument.body.offsetHeight) 
				win.height = win.contentDocument.body.offsetHeight; 
			else if(win.Document && win.Document.body.scrollHeight) 
				win.height = win.Document.body.scrollHeight; 
		} 
	}
}
/**
 * 中文记2，英文记1
 * @param str
 * @returns {Number}
 */
function lengthOfString(str){
	var len;
	var i;
	var len = 0;
	for (i=0;i<str.length;i++)
	{
		if (str.charCodeAt(i)>255) len+=2; else len++;
	}
	return len;
}
/**
 * grid列宽自动适应单元格最长字符串，影响性能
 */
Ext.apply(Ext.grid.GridPanel.prototype, {
	autoSizeColumns: function() {
    	for (var i = 0; i < this.colModel.getColumnCount(); i++) {
        	this.autoSizeColumn(i);
		}
    },
    autoSizeColumn: function(c) {
    	var headerCell = this.view.getHeaderCell(c);
    	var w = headerCell.firstChild.scrollWidth;
    	if(w>70){
    		w=70;
    		this.colModel.setColumnWidth(c, w+2);
    	}
		for (var i = 0, l = this.store.getCount(); i < l; i++) {
			w = Math.max(w, this.view.getCell(i, c).firstChild.scrollWidth);
		}
		var minWidth = this.colModel.getColumnById(this.colModel.getColumnId(c)).minWidth;
		
        if ((minWidth) && (w < minWidth)) {
            w = minWidth;
        }
		this.colModel.setColumnWidth(c, w+2);
		return w;
    }
});
/**
 * 动态设置Field是否必填
 * @param field
 * @param allowBlank
 */
function setFieldAllowBlank(field,allowBlank){
    if(allowBlank){
        field.allowBlank=true;
        if(field.getXType()=='textfield'){
            field.getEl().dom.parentNode.parentNode.firstChild.innerHTML=field.fieldLabel;
        }else{
            field.getEl().dom.parentNode.parentNode.parentNode.firstChild.innerHTML=field.fieldLabel;
        }
        if(field.getXType()=='combo'){
            var record = field.getStore().getAt(0);
            if(!Ext.isEmpty(record.get('id'))){
                var entity = Ext.data.Record.create([{name: 'name', type: 'string'},{name: 'id', type: 'string'}]);    
                var emptyEntity= new entity({
                    name:'--请选择--',
                    id:'  '
                });
                field.getStore().insert(0,[emptyEntity]);
            }
        }
    }else{
        field.allowBlank=false;
        if(field.getXType()=='textfield'){
            field.getEl().dom.parentNode.parentNode.firstChild.innerHTML='<font color="red">*</font>'+field.fieldLabel;
        }else{
            field.getEl().dom.parentNode.parentNode.parentNode.firstChild.innerHTML='<font color="red">*</font>'+field.fieldLabel;
        }
        if(field.getXType()=='combo'){
            var record = field.getStore().getAt(0);
            if(Ext.isEmpty(record.get('id'))){
                field.getStore().remove(record);
                field.clearValue();
            }
        }
    }
}
/**
 * 判断数据内是否有重复数据
 * @param arr
 * @returns {Boolean}
 */
function arrayHasRepeatItem(arr){
    var nary=arr.sort();   
    
    for(var i=0;i<arr.length;i++){   
        if (nary[i]==nary[i+1]){   
            return true;  
        }   
    }
    return false;
}
function zeroToEmptyRender(v){
    if(v==0){
        return '';
    }else{
        return v;
    }
    
}
function getFieldValue(formPanel,fieldName){
    var value = null;
    if(!Ext.isEmpty(formPanel)&&!Ext.isEmpty(fieldName)&&!Ext.isEmpty(formPanel.getForm().findField(fieldName))){
        value = formPanel.getForm().findField(fieldName).getValue();
    }
    return value;
}
/**
 * 给html对象增加隐藏input
 * @param parent
 * @param name
 * @param value
 */
function createNewHidden(parent,name,value){
    parent.innerHTML+='<input name="'+name+'" value="'+value+'" type=hidden //>';
}
/**
 * 创建Boolean下拉列表
 * @param label
 * @param name
 * @param allowBlank
 * @returns {Ext.form.ComboBox}
 */
function createBooleanCombo(label,name,allowBlank){
    var dateStore = new Ext.data.SimpleStore({
        fields: ['value','name'],
        data  : [['true','是'], ['false','否']]
    });
    if(allowBlank){
        var empty = new Ext.data.Record({
            name:'--请选择--',
            value:''
        });
        dateStore.insert(0,empty);
    }
    return new Ext.form.ComboBox({
        fieldLabel: label,
        hiddenName:name,
        allowBlank:allowBlank==undefined?true:allowBlank,
        name:name,
        store: dateStore,
        valueField: 'value',
        displayField: 'name',
        editable: true,
        typeAhead: true,
        loadingText: 'Searching...',
        hideTrigger: false,
        mode: 'local',
        triggerAction: 'all'
    });
}