
var XForm = {



	
	enable: function(fom) {
		var elements = Form.getElements($(fom));	   
	    for (var i = 0; i < elements.length; i++) {	  
	    	var element = elements[i];
	    	switch (element.type.toLowerCase()) {	    		
				case 'radio':
			    case 'textarea':
			    	element.className = 'x_textarea';
			    	break;
			    default:
			    	element.className = 'x_text';
	    	}
	    }
	},
	
	disable: function(fom) {
		var elements = Form.getElements($(fom));
	    for (var i = 0; i < elements.length; i++) {	  
	    	var element = elements[i];
	    	switch (element.type.toLowerCase()) {	    		
				case 'radio':
			    case 'textarea':
			    	element.className = 'x_textarea_readonly';
			    	break;
			    default:
			    	element.className = 'x_text_readonly';
	    	}
	    }
	},
	
	readonly: function(fom) {
		var elements = Form.getElements($(fom));
	    for (var i = 0; i < elements.length; i++) {	  
	    	var element = elements[i];
	    	switch (element.type.toLowerCase()) {	    		
				case 'radio':
			    case 'textarea':
			    	element.className = 'x_textarea_readonly';
			    	break;
			    default:
			    	element.className = 'x_text_readonly';
	    	}
	    }
	},
	
	validate: function(fom) {
		
	}
	
};


var XTextarea = {
	enlarge: function(name) {
		var o = $(name);
		if(true != o.readOnly) {
			o.style.height = parseInt(o.offsetHeight) + 30;
		}
	}
};

