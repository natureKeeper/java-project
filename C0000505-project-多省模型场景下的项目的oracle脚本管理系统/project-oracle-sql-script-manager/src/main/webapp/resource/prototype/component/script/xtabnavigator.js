function XTabNavigator() {	
	this.container = null;
	this.contextContainer = null;
	this.tabs = [];
	this.tabIndex = 0;
	this.length = 0;
	this.sequence = 0;
	
	this.currentTab = null;
	
	this.tabChooser = null;
	this.tabBar = null;
	this.tabWidth = null;
	this.tabBegin = null;
	this.tabEnd = null;
	this.max = 0;
}

XTabNavigator.prototype.init = function(context) {
	this.container = $(context.container);
	this.contextContainer = $(context.contextContainer);
	
	this.max = (context.max!=undefined) ? context.max : 0;
};

XTabNavigator.prototype.find = function(id) {	
	if(null!=this.tabs) {	
		for(var i = 0; i < this.tabs.length; i++) {		
			if(this.tabs[i].id == id) {
				return this.tabs[i];
			}
		}
	}
	return null;
};

XTabNavigator.prototype.isExists = function(id) {
	return (null!=this.find(id));
};



XTabNavigator.prototype.isMax = function() {
	return (this.max<=this.tabs.length);
};


XTabNavigator.prototype.create = function(context, tabs) {
	var the = this;
	
	this.init(context);
	
//	var s = '<div id="tabChooser" class="m_tab_chooser" style="display:none;"></div>' //
	//	+ '<table style="width:100%;" border="1" cellspacing="0" cellpadding="0" align="center"><tr>' //		
	//	+ '<td nowrap="true" style="width:10;" valign="bottom"><span id="tabBegin" class="m_tab_first">&nbsp;</span></td>' //
	//	+ '<td nowrap="true" valign="bottom"><div id="tabBar" style="valign:bottom;"></div></td>' //
	//	+ '<td id="tabEnd" style="width:99%;" valign="bottom"><span class="m_tab_last">&nbsp;</span></td></tr><tr><td colspan="3" class="m_tab_cc"></td></tr></table>'; //
	var s = '<table class="x_tab_bar" style="width:100%;" border="0" cellspacing="0" cellpadding="0" align="center">' //
			+ '<tr>' //
			+ '<td class="x_tab_first">&nbsp;</td>' //
			+ '<td nowrap="true" valign="bottom" id="tabBar"></td>' //
			+ '<td class="x_tab_last">&nbsp;</td>' //
			+ '</tr>' //
			+ '<tr><td colspan="3" class="x_tab_separator"></td></tr>' //
			+ '</table>' //
	
		
	this.container.innerHTML = s;
		
	this.tabBar = this.container.all('tabBar');
	
	if (null!=tabs) {		
		for(var i = 0; i < tabs.length; i++) {
			this.add(tabs[i]);
		}
	}
};

XTabNavigator.prototype.add = function(o) {	
	
	var the = this;
	
	//alert(parseInt(this.tabEnd.offsetWidth));
	
	if(this.isExists(o.id)) {
		xTab($(o.id));
		return;
	}
	
	if(this.tabs.length==this.max) {
		alert('窗口过多(最多' + this.max + '个)!');
		return false;
	}

	o.id = (o.id && ''!=o.id) ?(o.id):('tabId_' + (++this.sequence));
	o.content = (o.content) ? (o.content) : ('tabContent' + o.id);
	var tab = this.find(o.id);

	this.tabs[this.tabs.length] = o;
	
	var tabTextNode = document.createElement('span');
	tabTextNode.id = o.id + '_text';
	tabTextNode.className = 'x_tab_text';
	tabTextNode.innerHTML = o.text;
	
	var tabNode = document.createElement('span');
	tabNode.id = o.id;
	tabNode.content = o.content;
	tabNode.xtabNavigator = 'xtabNavigator';
	tabNode.className = 'x_tab';
	tabNode.title = o.text
		
	tabNode.appendChild(tabTextNode);
	
	this.tabBar.appendChild(tabNode);
	
	tabNode.onclick = function() {
		xTab($(tabNode.id));
	};
	
	if(0!=this.findIndex(tabNode.id)) {
		tabNode.ondblclick = function() {		
			the.remove(tabNode.id);
		};
	
		//
		var content = document.createElement('div');
		content.id = o.content;
		content.name = content.id;
		content.style.display = 'none';
		
		var frameId = 'frame' + o.content;
		content.innerHTML = '<iframe id="' + frameId + '" height="100%" width="100%" frameborder="0"></iframe>';
		
		this.contextContainer.appendChild(content);
		eval('window.frames.' + frameId + '.location.href = \'' + o.url + '\';');
	}
	//
   	xTab($(o.id));
	
	return true;
};

XTabNavigator.prototype.findIndex = function(id) {	
	if(null!=this.tabs) {	
		for(var i=0;i<this.tabs.length;i++) {		
			if(this.tabs[i].id == id) {		
				return i;
			}
		}
	}
	return -1;
};

XTabNavigator.prototype.remove = function(id) {
	var index = this.findIndex(id);		
	var tab = this.container.all(id);
	//remove cache
	this.tabs.splice(index,1);
	//remove content
	var content = $(tab.content);
	content.innerHTML = '';
	content.style.display = 'none';
	content.parentNode.removeChild(content);
	//remove tab
	this.tabBar.removeChild(tab);
	//reset tab ctrl
	xTab($(this.tabs[index-1].id));
};	