function XPagination() {
	this.container = null;
	
	this.width = '100%';	
	this.count = 0; // record total count
	this.index = 1; // page index
	this.size = 10; // record count per page
	this.length = 0;// current page record count
	this.onPaginationHandler = null;
	
	this.first = null;
	this.back = null;
	this.next = null;
	this.last = null;
	this.info = null;
	
	this.jump = null;
	this.resize = null;
	this.jumper = null;
	this.resizer = null;
}
XPagination.prototype.init = function(context) {
	this.context = context;
	
	this.container = $(context.container);
	this.width = (this.context.width) ? this.context.width : '100%';
	this.count = (this.context.count) ? this.context.count : 0;	
	this.index = (this.context.index) ? this.context.index : 1;	
	this.size = (this.context.size) ? this.context.size : 10;
	this.length = (this.context.length) ? this.context.length : 0;	
	this.onPaginationHandler = (this.context.onPaginationHandler) ? this.context.onPaginationHandler : null;
};

XPagination.prototype.create = function(context) {
	
	this.init(context);
	
	var s = [];
	s[s.length] = '<table style="width:' + this.width + ';" class="x_pagination_bar2" border="0" cellspacing="0" cellpadding="0" align="center"><tr>';
	s[s.length] = '<td width="20" height="20"><input id="first" type="button" class="x_pagination_first" value="" title="first" /></td>';
	s[s.length] = '<td width="20"><input id="back" type="button" class="x_pagination_back" value="" title="back" /></td>';
	s[s.length] = '<td width="20"><input id="next" type="button" class="x_pagination_next" value="" title="next" /></td>';
	s[s.length] = '<td width="20"><input id="last" type="button" class="x_pagination_last" value="" title="last" /></td>';
	s[s.length] = '<td class="x_pagination_font">&nbsp;第<span id="jumper">loading...</span>页 ';
	
	s[s.length] = '(<span id="resizer">loading...</span>行/页)';
	
	s[s.length] = '<font id="info">loading...</font>';
	s[s.length] = '</td><td>&nbsp;</td></tr></table>';
	
	this.container.innerHTML = s.join('');
	s = null;
	this.first = this.container.all('first');
	this.back = this.container.all('back');
	this.next = this.container.all('next');
	this.last = this.container.all('last');
	this.jump = this.container.all('jump');
	this.jumper = this.container.all('jumper');
	this.resizer = this.container.all('resizer');
	this.info = this.container.all('info');
	
	this.set(context);
};



XPagination.prototype.set = function(context) {
	var the = this;

	this.width = (context.width) ? context.width : this.width;
	this.count = (undefined != context.count) ? context.count : this.count;		
	this.index = (undefined != context.index) ? context.index : this.index;	
	this.size = (undefined != context.size) ? context.size : this.size;
	this.length = (undefined != context.length) ? context.length : this.length;
	
	this.context.count = this.count;
	
	var pages = 0;
	//alert(this.count);
	if(this.count>0 && this.size!=0) {
		var pages = Math.ceil(this.count / this.size);
	}

	//alert(this.resize.value);
	if(this.count>0) {
		this.info.innerHTML = ' &nbsp; (共<strong>' + this.count + '</strong>行/共<strong>' + pages + '</strong>页)';
		if(pages>1) {
			var o = new Array();	
			for(var i = 1; i<=pages; i++) {		
				o[o.length] = '\n<option value="' + i + '"' + ((i==this.index) ? ' selected' : '') + '>&nbsp;' + i + '&nbsp;</option>';;
			}
			//alert(o.join(''));
			this.jumper.innerHTML = '&nbsp;<select id="jump" style="font-size:10;width:60px;" class="x_select" title="jump to">' + o.join('') + '</select>&nbsp;';
		
			this.jump = this.jumper.all('jump');		
		} else {
			this.jumper.innerHTML = '<strong>1</strong>';
		}
	} else {
		this.info.innerHTML = '';
		this.jumper.innerHTML = '<strong>' + this.index + '</strong>';
	}	
	
	
		
	
	//(the.onRowClickHandler || Prototype.emptyFunction)({rowId:tInput.value, checked:tInput.checked});
	if(context.onPaginationHandler) {
		this.onPaginationHandler = context.onPaginationHandler;
	}
	
	
	o = [];
	
	/*
	if(this.size>=this.count) {
		o[o.length] = '<strong>' + this.size + '</strong>';
	} else {
	}*/
		o[o.length] = '<select id="resize" name="resize" style="font-size:10;width:60px;" class="x_select" >';
		var stepLength = 5;
		var tCount = this.count;
		if(tCount<0) {
			tCount = 101;
		}
		for(var t = 5; t<=100 && t<=(tCount + this.size); t = t + stepLength) {
			o[o.length] = '<option value="' + t + '"' + ((t==this.size)? ' selected': '') + '>' + t + '</option>';			
		}
		o[o.length] = '</select>';
	
	this.resizer.innerHTML = o.join('');
	
	this.resize = this.container.all('resize');
	if(this.resize) {
		this.resize.value = this.size;
	}
	
	if(1 != this.index) {
		this.enable(this.first);
		this.first.onclick = function() {
			(the.onPaginationHandler || Prototype.emptyFunction)({index:1, size:the.size, count:the.count, length:the.length});
		};
	} else {
		this.disable(this.first);			
	}
	
	if(this.index > 1) {
		this.enable(this.back);
		this.back.onclick = function() {
			(the.onPaginationHandler || Prototype.emptyFunction)({index:the.index - 1, size:the.size, count:the.count, length:the.length});
		};
	} else {
		this.disable(this.back);
	}
	
	if((this.index < pages) || (this.count<=0 && this.length==this.size)) {
		this.enable(this.next);
		this.next.onclick = function() {
			(the.onPaginationHandler || Prototype.emptyFunction)({index:the.index + 1, size:the.size, count:the.count, length:the.length});
		};
	} else {
		this.disable(this.next);
	}
	
	if(this.index < pages) {// || (this.count<=0 && this.length==this.size))
		this.enable(this.last);
		this.last.onclick = function() {
			(the.onPaginationHandler || Prototype.emptyFunction)({index:pages, size:the.size, count:the.count, length:the.length});
		};
	} else {
		this.disable(this.last);
	}
	
	if(this.jump) {	
		this.jump.onchange = function() {
			(the.onPaginationHandler || Prototype.emptyFunction)({index:the.jump.selectedIndex + 1, size:the.size, count:the.count, length:the.length});
		};
	}
	
	if(this.resize) {
		this.resize.onchange = function() {
			the.size = the.resize.value;
			(the.onPaginationHandler || Prototype.emptyFunction)({index:1, size:the.size, count:the.count, length:the.length});
		};
	}
};

XPagination.prototype.serialize = function(alias) {
	if(null==alias) {
		alias = "pagination";
	}
	var p = [];
	p[p.length] = alias+".index="+this.index;
	p[p.length] = alias+".size="+this.size;
	p[p.length] = alias+".count="+this.count;
	//p[p.length] = alias+".counted="+this.counted;
	return p.join("&");
}

XPagination.prototype.disable = function(btn) {
	btn.disabled = true;
	btn.className = 'x_pagination_' + btn.id + '_disabled';
};

XPagination.prototype.enable = function(btn) {
	btn.disabled = false;
	btn.className = 'x_pagination_' + btn.id;
};