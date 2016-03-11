/*in prototype.js
Array.prototype.indexOf = function(o) {
	for(var i=0;i<this.length;i++){
		if(this[i]==o)
			return i;
	}
	return -1;
}
*/
if(!String.prototype.escapeUrl) {
	String.prototype.escapeUrl = function(){
		var str = this;
			
		str = str.replace(/%/g, '%25');
		str = str.replace(/ /g, '%20');
		str = str.replace(/\!/g,'%21');
		str = str.replace(/"/g, '%22');
		str = str.replace(/#/g, '%23');
		str = str.replace(/\$/g,'%24');
		str = str.replace(/&/g, '%26');
		str = str.replace(/'/g, '%27');
		str = str.replace(/\(/g,'%28');
		str = str.replace(/\)/g,'%29');
		str = str.replace(/=/g, '%3D');
			
		return str;
	};
}


if(!String.prototype.trim) {
	String.prototype.trim = function(s) {
		s = this != window? this : s;
		return s.replace(/^\s+/g, '').replace(/\s+$/g, '');
	}
}



var XCheck = {
	checkAll: function(name) {
		var o = document.getElementsByName(name);
		var l = o.length;
		for (var i = 0; i < l; i++)
	  		o[i].checked = window.event.srcElement.checked;
	},
	checkItem: function(name) {
		var e = window.event.srcElement;
	  	var o = $(name);
	  	if (e.checked) {
			var items = document.getElementsByName(e.name);
			o.checked = true;
			var l = items.length;
	    	for (var i = 0; i < l; i++) {
				if (!items[i].checked) {
					o.checked = false; 
					break;
				}
	    	}
	  	} else {
			o.checked = false;
		}
	},
	uncheckAll: function (name) {
		var o = document.getElementsByName(name);
		var l = o.length;
		for (var i=0; i < l; i++)
	  		o[i].checked = false;
	}
};


var ArrayUtil = {
	indexOf: function(value, list) {
		for(var i = 0; i < list.length; i++) {
			if(value==list[i]) {
				return i;
			}
		}
		return -1;
	}
};

var XOption = {
	selectAll: function(name) {
		var o = document.getElementsByName(name);
		var l = o.length;
		for (var i = 0; i < l; i++)
	  		o[i].checked = window.event.srcElement.checked;
	},
	unSelectAll: function(name) {
		var e = window.event.srcElement;
	  	var o = document.getElementById(name);
	  	if (e.checked) {
			var items = document.getElementsByName(e.name);
			o.checked = true;
			var l = items.length;
	    	for (var i = 0; i < l; i++) {
				if (!items[i].checked) {
					o.checked = false; 
					break;
				}
	    	}
	  	} else {
			o.checked = false;
		}
	},
	append: function (name) {
		var o = document.getElementsByName(name);
		var l = o.length;
		for (var i=0; i < l; i++)
	  		o[i].checked = false;
	},
	remove: function (name) {
		var o = document.getElementsByName(name);
		var l = o.length;
		for (var i=0; i < l; i++)
	  		o[i].checked = false;
	}
};





var XObject = {
	serialize: function(o) {
		return $H(o).toQueryString();
	}
};

//<input onbeforepaste="XNumberOnly.onBeforePaste(this);" onkeyup="XNumberOnly.onKeyUp(this);" />
var XNumberOnly = {
	onBeforePaste: function(the) {
		clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''));
	},
	onKeyUp: function(the) {
		var v = the.value;
		v = v.replace(/[^\d]/g,'');
		v = ( v == '' || v == 0 ) ? '' : v;
		the.value = v;
	}
};

/**
	var returnValue = window.showModalDialog(sURL [, vArguments] [, sFeatures])
	var returnValue = window.showModelessDialog(sURL [, vArguments] [, sFeatures])
	参数说明：
	sURL
	必选参数，类型：字符串.用来指定对话框要显示的文档的URL.
	vArguments
	可选参数，类型：变体.用来向对话框传递参数.传递的参数类型不限，包括数组等.对话框通过window.dialogArguments来取得传递进来的参数.
	sFeatures
	可选参数，类型：字符串.用来描述对话框的外观等信息，可以使用以下的一个或几个，用分号";"隔开.
	dialogHeight 对话框高度，不小于１００px，IE4 dialogHeight 和 dialogWidth 默认的单位是em，而IE5中是px，为方便其见，在定义modal方式的对话框时，用px做单位.
	dialogWidth: 对话框宽度.
	dialogLeft: 距离桌面左的距离.
	dialogTop: 离桌面上的距离.
	center: {yes | no | 1 | 0 }：窗口是否居中，默认yes，但仍可以指定高度和宽度.
	help: {yes | no | 1 | 0 }：是否显示帮助按钮，默认yes.
	resizable: {yes | no | 1 | 0 } ［IE5+］：是否可被改变大小.默认no.
	status: {yes | no | 1 | 0 } ［IE5+］：是否显示状态栏.默认为yes[ Modeless]或no[Modal].
	scroll:{ yes | no | 1 | 0 | on | off }：指明对话框是否显示滚动条.默认为yes.	
*/
//status=no;要在XP SP2和2k3 SP1以后的IE6中隐藏模态窗口的status bar，居然需要把你访问的那个站点加入local intranet sites中才可以
function dialog(url, width, height) {
	return window.showModalDialog(url + '&$token=' + Math.random() , '', 'dialogWidth=' + ((width)?width:'800') + 'px;dialogHeight=' + ((height)?height:'600') + 'px;help=0;scroll=0;status=no;');
}


