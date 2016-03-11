var XSuggest = {
	xsuggestPanel:null,
	init: function() {
		document.writeln('<div id="xsuggestPanel" name="xsuggestPanel" onkeyup="XSuggest.onPanelKeyup();" style="z-index:30;position:absolute;top:0;left:0;padding:3;display:none;border:1 solid #98C0F4;overflow:auto;background-color:#F2F7FC;filter:progid:DXImageTransform.Microsoft.Fade(duration=0.2)progid:DXImageTransform.Microsoft.Shadow(color=#777777,direction=135,strength=3);"></div>');		
		this.xsuggestPanel = document.all.xsuggestPanel;
	},
	on: function(target) {
		Position.clone(target, this.xsuggestPanel);
	    this.xsuggestPanel.style.top = parseInt(this.xsuggestPanel.style.top) + parseInt(target.offsetHeight) + 'px';
	    this.xsuggestPanel.style.height= '200px';
		this.xsuggestPanel.style.display = 'block';
	},
	off: function() {
		this.xsuggestPanel.style.display = 'none';
	},
	onPanelKeyup: function() {
		var selectedIndex = -1;
		if(this.xsuggestPanel.childNodes) {
			var l = this.xsuggestPanel.childNodes.length;
			for(var i=0; i<l; i++) {
				if(this.xsuggestPanel.childNodes[i].className=='x_suggest_option_over') {
					selectedIndex = i;
					break;
				}
			}
			switch(event.keyCode) {
				case 38: //up
					if(selectedIndex>0) {
						this.xsuggestPanel.childNodes[selectedIndex - 1].focus();					
					} else {
						//todo
					}
					break;
				case 40: //down
					if(selectedIndex>-1 && selectedIndex<l-1) {
						this.xsuggestPanel.childNodes[selectedIndex + 1].focus();
					}
					break;
			}
		}
	},
	focusFirst: function() {
		if(this.xsuggestPanel.childNodes) {
			this.xsuggestPanel.childNodes[0].focus();
		}
	},
	suggest: function(target, callback, onSelectName) {
		var options = (callback || Prototype.emptyFunction)(target.value);
		if(options) {
			var s = [];
			for(var i=0; i<options.length; i++) {
				s[s.length] = '<div value="' + options[i]._value + '" text="' + options[i]._text + '" class="x_suggest_option" onfocus="this.onmouseover();" onblur="this.onmouseout();" onmouseover="this.className=\'x_suggest_option_over\';" onmouseout="this.className=\'x_suggest_option\';" onclick="' + onSelectName + '(this);XSuggest.off();" onkeyup="if(event.keyCode==13){this.onclick(this);}">' + options[i]._text + '</div>';
			}
			s[s.length] = '<div value="" text="" class="x_suggest_option" onfocus="this.onmouseover();" onblur="this.onmouseout();" onmouseover="this.className=\'x_suggest_option_over\';" onmouseout="this.className=\'x_suggest_option\';" onclick="' + onSelectName + '(this);XSuggest.off();" onkeyup="if(event.keyCode==13){this.onclick(this);}"> [ <i>取消并置空</i> ]</div>';
			this.xsuggestPanel.innerHTML = s.join('');
		}
		XSuggest.on(target);
	}
};
XSuggest.init();
