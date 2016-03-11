var Cover = {
	coverLayer:null,
	init: function() {
		document.writeln('<iframe id="coverLayer" name="coverLayer" frameborder="no" style="position:absolute;width:100%;height:100%;top:0;left:0;z-index:100;display:none;margin:0;padding:0;filter:alpha(opacity=10);"></iframe>');
		window.frames.coverLayer.document.close();
		this.coverLayer = document.all.coverLayer;
	},
	on: function() {
		this.coverLayer.style.display = 'block';
	},
	off: function() {
		this.coverLayer.style.display = 'none';
	}
};
Cover.init();

var Load = {
	loadLayer: null,
	init: function() {
		document.writeln('<div id="loadLayer" name="loadLayer" style="position:absolute;z-index:101;display:none;width:150;height:22;right:10;top:10;font-size:12px;font-family:Verdana,Simsun;background-color:#FF0;border:1px solid red;padding:2;cursor:hand;filter:progid:DXImageTransform.Microsoft.Fade(duration=0.2)progid:DXImageTransform.Microsoft.Shadow(color=#777777,direction=135,strength=3);" onclick="Load.off();" title="close"><span class="loader">&nbsp;</span>&nbsp;加载中,点击我取消...</div>');
		this.loadLayer = document.all.loadLayer;
	},
	on: function() {
		Cover.on();
		this.loadLayer.style.display = 'block';
		window.status = 'loading...';
	},
	off: function() {
		Cover.off();
		this.loadLayer.style.display = 'none';
		window.status = 'loaded!';
	},
	updater: function(container) {
		$(container).innerHTML = '<font class="x_font_loading">loading...</font>';//'<div style="width:100%;height:18;font-size:12;font-family:Verdana,Simsun;background-color:#FF0;border:1px solid red;" onclick=""><span class="loader">&nbsp;</span>&nbsp;加载中...</div>';//right:10;top:10;
	}
};
Load.init();

var handle = {
	onCreate: function() {
		Load.on();
	},
	onComplete: function() {
		if (Ajax.activeRequestCount == 0) {
			Load.off();
		}		
	}	
};
Ajax.Responders.register(handle);


//ajax support
//var J_debugEnabled = true;
var J = {
	/**
	 * 参数是否改为扩展? onException loadingMessage 等等
	 */
	request: function(url, param, onComplete) {
		/*if(J_debugEnabled) {
			alert('url: ' + url + '\nparam: ' + param);
		}*/
		// call in new thread to allow ui to update
		window.setTimeout(function() {
			new Ajax.Request(
	        	url,
		        {
		        	method: 'post', 
		        	parameters: param + '&$token='+ Math.random(), //token:避免浏览器从cache中返回相应
		        	onComplete: function(request) {
		        		try {
			        		(onComplete || Prototype.emptyFunction)(request.responseText);
			        	} catch (e) {
		        			o = {$exception: {message:e.name, stackTrace:e.message + '\n---- Ajax onComplete function ----\n' + onComplete}};		        		
							Msg.exception(o.$exception);
							o = null;
		        		}
		        		//Load.off();//ensure load.off
					},
		        	onLoading: function(request) {
						//Load.on();
					},
					onLoaded: function(request) {
						//Load.off();
					}
		        }
	   		);
   		}, 10);
  	},
	json: function(url, param, onComplete) {
		/*if(J_debugEnabled) {
			alert('url: ' + url + '\nparam: ' + param);
		}*/
		// call in new thread to allow ui to update
		window.setTimeout(function () {
			new Ajax.Request(
	        	url,
		        {
		        	method: 'post', 
		        	parameters: param + '&$token='+ Math.random(), //token:避免浏览器从cache中返回相应
		        	onComplete: function(request) {
		        		var o = null;
		        		try {
		        			/*if(J_debugEnabled) {
								alert('request.responseText\n:' + request.responseText);
							}*/
		        			//alert(request.responseText);
		        			if('null'==request.responseText) {
		        				o = null;		        				
		        			} else {
		        				o = eval('(' + request.responseText + ')');
		        			}
		        		} catch (e) {
		        			o = {$exception: {message: e.name, stackTrace:e.message + '\n---- Ajax request.responseText ----\n' + request.responseText}};
		        		}
						if(null !=o && null != o.$exception) {
							Msg.exception(o.$exception);
						} else {
							try {
				        		(onComplete || Prototype.emptyFunction)(o);
				        	} catch (e) {
			        			o = {$exception: {message:e.name, stackTrace:e.message + '\n---- Ajax onComplete function ----\n' + onComplete}};		        		
								Msg.exception(o.$exception);
								o = null;
			        		}
			        	}
			        	o = null;
			        	//Load.off();//ensure load.off
					},
		        	onLoading: function(request) {
						//Load.on();
					},
					onLoaded: function(request) {
						//Load.off();
					}
		        }
	   		);
   		}, 10);
  	},
  	updater: function(url, param, container) {  	
  		/*if(J_debugEnabled) {
			alert('url: ' + url + '\nparam: ' + param);
		}*/
		// call in new thread to allow ui to update
  		
  		Load.updater(container);
  		
		window.setTimeout(function () {		
	  		new Ajax.Updater(
			 	container, 
			 	url, 
			 	{
			 		method: 'post',
				 	asynchronous: true, 
				 	evalScripts: true,
					parameters: param + '&$token='+ Math.random(),
					onLoading: function(request) {
						//
					},
					onLoaded: function(request) {
						//Load.off();
					}
				}
			);
		}, 10);
  	}  
};


var Msg = {
	exceptionLayer:null,
	exceptionMessage:null,
	exceptionStackTraceContainer:null,
	exceptionStackTrace:null,
	init: function() {
		var s = [];
		s[s.length] = '<div id="exceptionLayer" name="exceptionLayer" style="position:absolute;z-index:101;display:none;width:100%;height:100%;text-align:center;top:0;left:0;padding-top:60;">';
		s[s.length] = '<div class="exception_container">';
		s[s.length] = '		<table style="width:650;table-layout:fixed;" cellpadding="0" cellspacing="0" border="0">';
		s[s.length] = '		<tr><td style="height:100;padding-left:50;">';
		s[s.length] = '			<div id="exceptionMessage" name="exceptionMessage" style="font-weight:bold;width:100%;height:100%;overflow:auto;">&nbsp;</div>';
		s[s.length] = '		</td><tr>';
		s[s.length] = '		<tr><td style="height:24;" align="right">';
		s[s.length] = '			<input type="button" style="width:120;" value="Close" class="font_exception" style="border:1px solid red;" onclick="Msg.exceptionOff();" />';
		s[s.length] = '			<input type="button" style="width:120;" value="Detail >>" class="font_exception" style="border:1px solid red;" onclick="Msg.switchExceptionLayerStackTrace();" />&nbsp;';
		s[s.length] = '		</td><tr>';
		s[s.length] = '		<tr id="exceptionStackTraceContainer" style="display:none;"><td style="height:300;">';
		s[s.length] = '			<div id="exceptionStackTrace" name="exceptionStackTrace" style="width:650;height:300;overflow:auto;">&nbsp;</div>';
		s[s.length] = '		</td><tr>';
		s[s.length] = '		</table>';
		s[s.length] = '</div>';
		s[s.length] = '</div>';
		document.writeln(s.join(''));
		s = null;
		this.exceptionLayer = document.all.exceptionLayer;			
		this.exceptionMessage = $('exceptionMessage');
		this.exceptionStackTraceContainer = $('exceptionStackTraceContainer');
		this.exceptionStackTrace = $('exceptionStackTrace');
	},
	exception: function(e) {  		
  		this.exceptionStackTraceContainer.style.display = 'none';
  		this.exceptionLayer.style.display = 'block';  		
  		this.exceptionMessage.innerHTML = '<xmp class="font_exception">' + e.message + '</xmp>';
  		var s = '<xmp class="font_exception">' + decodeURIComponent(e.requestString) + '</xmp>';//e.requestString;
  		if(s && ''!=s) {
  			s = '<strong class="font_exception">' + s + '</strong><br />';
  		} else {
  			s = '';
  		}
  		this.exceptionStackTrace.innerHTML = s + '<xmp class="font_exception">' + e.stackTrace + '</xmp>';
  		s = null;
  		
  		window.setTimeout(function() {
			Cover.on();
   		}, 10);
  	},
  	switchExceptionLayerStackTrace: function() {  	
  		event.srcElement.value = ('Detail >>'==event.srcElement.value) ? 'Detail <<' : 'Detail >>';
  		this.exceptionStackTraceContainer.style.display = ('none'==this.exceptionStackTraceContainer.style.display) ? 'block' : 'none';
  	},  	
  	exceptionOff: function() {
  		window.setTimeout(function() {
			Cover.off();
   		}, 10);
  		this.exceptionLayer.style.display = 'none';
  	},  	
  	info: function (container, message) {
	  	Msg.flush(container);
  		Msg.msg(container, message, 'info_msg');
 	},  	
  	warn: function (container, message) {
	  	Msg.flush(container);
  		Msg.msg(container, message, 'warn_msg');
  	},  	
  	msg: function (container, message, className) {
	  	$(container).className = className;
  		$(container).innerHTML = message;
  		$(container).parentElement.parentElement.style.display = 'block';
  	},
  	hide: function(the) {
  		the.style.display = 'none';
  	},
  	flush: function(container) {
	  	$(container).innerHTML = '&nbsp;';
  		$(container).className = 'flush_msg';  		
  	}
};
Msg.init();


var Assert = {
	notNull: function(id, message) {
		if('' == $(id).value) {
			alert(message);
			$(id).focus();
			return;
		}
	}
};



