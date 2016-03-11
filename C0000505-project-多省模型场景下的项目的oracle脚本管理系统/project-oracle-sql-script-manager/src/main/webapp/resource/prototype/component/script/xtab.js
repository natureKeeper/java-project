
function xTab(o) {
    var tabs = o.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=o && tab.className == 'x_tab_on') {
			tab.className = 'x_tab';
			tab.childNodes[0].className = 'x_tab_text';
			$(tab.content).style.display = 'none';
		}
	}    
    if(o.content && $(o.content)) {
    	o.className = 'x_tab_on';
		o.childNodes[0].className = 'x_tab_text_on';
		$(o.content).style.display = 'block';
	}    
}

function vTab(o) {
    var tabs = o.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=o && tab.className == 'v_tab_on') {
			tab.className = 'v_tab';
			tab.childNodes[0].className = 'v_tab_text';
			$(tab.content).style.display = 'none';
		}
	}    
    if(o.content && $(o.content)) {
    	o.className = 'v_tab_on';
		o.childNodes[0].className = 'v_tab_text_on';
		$(o.content).style.display = 'block';
	}    
}

/*
function xTabOn(obj) {  
    var tabs = obj.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=obj && tab.className == 'x_tab_on') {
			tab.className = 'x_tab';
			$(tab.content).style.display = 'none';
		}
	}    
    if(obj.content && $(obj.content)) {
    	obj.className = 'x_tab_on';
		$(obj.content).style.display = 'block';    
	}    
}

function xTab2On(obj) {  
    var tabs = obj.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=obj && tab.className == 'x_tab2_on') {
			tab.className = 'x_tab2';
			$(tab.content).style.display = 'none';
		}
	}    
    if(obj.content && $(obj.content)) {
    	obj.className = 'x_tab2_on';
		$(obj.content).style.display = 'block';    
	}    
}

function xTabBottomOn(obj) {  
    var tabs = obj.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=obj && tab.className == 'x_tab_bottom_on') {
			tab.className = 'x_tab_bottom';
			$(tab.content).style.display = 'none';
		}
	}    
    if(obj.content && $(obj.content)) {
    	obj.className = 'x_tab_bottom_on';
		$(obj.content).style.display = 'block';    
	}    
}


function xTabLeftOn(obj) {  
    var tabs = obj.parentNode.childNodes;
	for(var i = 0; i < tabs.length; i++)	{
		var tab = tabs[i];
		if(tab!=obj && tab.className == 'x_tab_left_on') {
			tab.className = 'x_tab_left';
			$(tab.content).style.display = 'none';
		}
	}    
    if(obj.content && $(obj.content)) {
    	obj.className = 'x_tab_left_on';
		$(obj.content).style.display = 'block';    
	}    
}
*/
/*function tTabOn(the, tabClassName, onTabClassName) {
	var tabs = the.parentNode.childNodes;	
	var tab = null;
	for(var i=0; i<tabs.length; i++) {		
		tab = tabs[i];
		tab.className = tabClassName;
		$(tab.content).style.display = 'none';
	}
	tab = null;
	
	the.className = onTabClassName;
	$(the.content).style.display = 'block';
}

function xTabOn(the) {
	tTabOn(the, 't_tab', 't_tab_on');
}

function xTabInit(the) {
	if('false' == the.inited) {
		if(the.init) {
			eval(the.init);
		}
		the.inited = 'true';
	}
}
*/