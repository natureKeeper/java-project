//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/ActionMenu.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/05/31 08:35:03
// SCCS path, id: /family/botp/vc/13/6/9/2/s.69 1.6
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.dynamicity.ActionMenu");
dojo.require("dijit.Menu");

dojo.declare("bpc.dynamicity.ActionMenu", null, {
	constructor: function(widget, eventHandler){
	this.widget = widget;
	this.eventHandler = eventHandler;
	this.menu = null;
	this.menuStruct = 
		[
		    {   caption: "Basic",
		        submenu:
		        [
		            { id: "empty" },
		            { id: "invoke" },
		            { id: "receive" },
		            { id: "reply" },
		            { id: "assign" },
		            { id: "staff" },
		            { id: "snippet" }
		        ]
		    },
		
		    {
		        caption: "Structured",
		        submenu:
		        [
		            { id: "switch" },
		            { id: "pick" },
		            { id: "while" },
		            { id: "wait" },
		            { id: "sequence" },
		            { id: "scope" },
		            { id: "flow" },
		            { id: "stg" },
		            { id: "foreach" }
		        ]
		    },
		
		    {
		        caption: "Faults",
		        submenu:
		        [
		            { id: "terminate" },
		            { id: "throw" },
		            { id: "rethrow" },
		            { id: "compensate" }
		        ]
		    }
		];
	
	this.availableActions =
		[
		    { id: "empty",      icon: "empty",      caption: "Empty",      isStructured: false },
		    { id: "invoke",     icon: "invoke",     caption: "Invoke",     isStructured: false },
		    { id: "receive",    icon: "receive",    caption: "Receive",    isStructured: false },
		    { id: "reply",      icon: "reply",      caption: "Reply",      isStructured: false },
		    { id: "assign",     icon: "assign",     caption: "Assign",     isStructured: false },
		    { id: "staff",      icon: "staff",      caption: "Human Task", isStructured: false },
		    { id: "snippet",    icon: "snippet",    caption: "Snippet",    isStructured: false },
		
		    { id: "switch",     icon: "switch",     caption: "Choice",     isStructured: true },
		    { id: "pick",       icon: "pick",       caption: "Receive Choice", isStructured: true },
		    { id: "while",      icon: "while",      caption: "While", isStructured: true },
		    { id: "wait",       icon: "wait",       caption: "Wait",       isStructured: true },
		    { id: "sequence",   icon: "sequence",   caption: "Sequence",   isStructured: true },
		    { id: "scope",      icon: "scope",      caption: "Scope",      isStructured: true },
		    { id: "flow",       icon: "flow",       caption: "Parallel Activities", isStructured: true },
		    { id: "stg",        icon: "stg",        caption: "Cyclic Flow",isStructured: true },
		    { id: "foreach",    icon: "foreach",    caption: "ForEach",    isStructured: true },
		
		    { id: "terminate",  icon: "terminate",  caption: "Terminate",  isStructured: false },
		    { id: "throw",      icon: "throw",      caption: "Throw",      isStructured: false },
		    { id: "rethrow",    icon: "rethrow",    caption: "Rethrow",    isStructured: false },
		    { id: "compensate", icon: "compensate", caption: "Compensate", isStructured: false }
		];
		
		this.menu = this.makeMenu(this.menuStruct, true);

	},


	getMenuItem: function(id) {
	    var menuItem = null;
		var actionMenu = this;
	    dojo.forEach(this.availableActions, function(itemJson){
	        if(itemJson.id == id){
	            menuItem = { internalName: itemJson.id, label: itemJson.caption, iconClass: "icon" + itemJson.icon, onClick: function(){ actionMenu.selectMenuItem(itemJson.id) }};
	        }
	    });
	    return menuItem;
	},
	
	selectMenuItem: function(id) {
	    // store last action in menu
	
		var menu = this.menu;
	    var children = menu.getDescendants();
	
	    if (children.length == 3) {
	        // add separator
	        var separator = new dijit.MenuSeparator(null);
	        menu.addChild(separator);
	    }
	
	    var removeCandidate = null;
	    for (var i = children.length -1; i > 0; i--) {
	        if (children[i].internalName == id) {
	            removeCandidate = children[i];
	            break;
	        }
	    }
	    if (removeCandidate == null && children.length > 6) {
	        removeCandidate = children[4];
	    }
	    if (removeCandidate != null) {
	        menu.removeChild(removeCandidate);
	    }
	    
	    menuItem = this.getMenuItem(id);
	    var item = new dijit.MenuItem(menuItem);
	    item.internalName = id;
	    menu.addChild(item);
	    this.eventHandler.startInsertFromMenu(id);
	},
	
	makeMenu: function(items, isTop){
	    var menu2 = new dijit.Menu({ contextMenuForWindow: isTop }, null);
		for (var i = 0; i < items.length; i++) {
			var itemJson = items[i];
	        if(itemJson.submenu){
	            var submenu = this.makeMenu(itemJson.submenu, false);
	            var popupMenuItem = new dijit.PopupMenuItem({ label: itemJson.caption, popup: submenu });
	            menu2.addChild(popupMenuItem);
	        } else {
	            var itemParms = this.getMenuItem(itemJson.id);
	            var item = new dijit.MenuItem(itemParms);
	            menu2.addChild(item);
	            item.internalName = itemJson.id; 
	        }
		}
	    return menu2;
	}
});
