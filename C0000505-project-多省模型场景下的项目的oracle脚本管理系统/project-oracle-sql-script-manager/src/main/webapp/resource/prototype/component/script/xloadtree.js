/*----------------------------------------------------------------------------\
|                               XLoadTree 1.11                                |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
| An extension to xTree that allows sub trees to be loaded at runtime by      |
| reading XML files from the server. Works with IE5+ and Mozilla 1.0+         |
|-----------------------------------------------------------------------------|
|             Copyright (c) 2001, 2002, 2003, 2006 Erik Arvidsson             |
|-----------------------------------------------------------------------------|
| Licensed under the Apache License, Version 2.0 (the "License"); you may not |
| use this file except in compliance with the License.  You may obtain a copy |
| of the License at http://www.apache.org/licenses/LICENSE-2.0                |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| Unless  required  by  applicable law or  agreed  to  in  writing,  software |
| distributed under the License is distributed on an  "AS IS" BASIS,  WITHOUT |
| WARRANTIES OR  CONDITIONS OF ANY KIND,  either express or implied.  See the |
| License  for the  specific language  governing permissions  and limitations |
| under the License.                                                          |
|-----------------------------------------------------------------------------|
| Dependencies: xtree.js     - original xtree library                         |
|               xtree.css    - simple css styling of xtree                    |
|               xmlextras.js - provides xml http objects and xml document     |
|                              objects                                        |
|-----------------------------------------------------------------------------|
| 2001-09-27 | Original Version Posted.                                       |
| 2002-01-19 | Added some simple error handling and string templates for      |
|            | reporting the errors.                                          |
| 2002-01-28 | Fixed loading issues in IE50 and IE55 that made the tree load  |
|            | twice.                                                         |
| 2002-10-10 | (1.1) Added reload method that reloads the XML file from the   |
|            | server.                                                        |
| 2003-05-06 | Added support for target attribute                             |
| 2006-05-28 | Changed license to Apache Software License 2.0.                |
|-----------------------------------------------------------------------------|
| Created 2001-09-27 | All changes are in the log above. | Updated 2006-05-28 |
\----------------------------------------------------------------------------*/


webFXTreeConfig.loadingText = "加载中...";
webFXTreeConfig.loadingIcon = 'xtree/loader.gif';
webFXTreeConfig.loadErrorTextTemplate = "Error loading \"%1%\"";
webFXTreeConfig.emptyErrorTextTemplate = "Error \"%1%\" does not contain any tree items";

/*
 * WebFXLoadTree class
 */

function WebFXLoadTree(text, src, action, behavior, icon, openIcon) {
	// call super
	this.WebFXTree = WebFXTree;
	this.WebFXTree(text, action, behavior, icon, openIcon);

	// setup default property values
	this.src = src;
	this.loading = false;
	this.loaded = false;
	this.errorText = "";
	this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText, null, null, webFXTreeConfig.loadingIcon);
	this.add(this._loadingItem);
	
	// check start state and load if open
	if (this.open)
		_onLoad(this.src, this);
	else {
		// and create loading item if not
//		this.add(this._loadingItem);
	}
}

WebFXLoadTree.prototype = new WebFXTree;


/* WebFXLoadTreeItem class */
function WebFXLoadTreeItem(sText, src, sAction, eParent, sIcon, sOpenIcon) {

	this.WebFXTreeItem = WebFXTreeItem;
	this.WebFXTreeItem(sText, sAction, eParent, sIcon, sOpenIcon);

	// setup default property values
	this.src = src;
	this.loading = false;
	this.loaded = false;
	this.errorText = "";
	this.open = false;
	
	// check start state and load if open

	this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText, null, null, webFXTreeConfig.loadingIcon);
	this.add(this._loadingItem);
	/*
	if (this.open)
		_onLoad(this.src, this);
	else {
		// and create loading item if not
		
	}
	*/
}

WebFXLoadTreeItem.prototype = new WebFXTreeItem;

WebFXLoadTree.prototype._load_expand =
WebFXLoadTreeItem.prototype._load_expand = WebFXTreeItem.prototype.expand;

WebFXLoadTree.prototype.expand =
WebFXLoadTreeItem.prototype.expand = function() {	
	this.reload();
};

WebFXLoadTreeItem.prototype._onclick = WebFXLoadTreeItem.prototype.onclick;

WebFXTreeItem.prototype.onclick = function() {	
	if (webFXTreeConfig.defaultAction==this.action) {
		this.reload();
	} else {
		this._onclick();
	}
};

// reloads the src file if already loaded
WebFXLoadTree.prototype.reload =
WebFXLoadTreeItem.prototype.reload = function (newSrc) {
	if (!this.loading) {		
		var originalSrc = this.src;
		if(newSrc) {
			this.src = newSrc;
		}		
		var srcUrl = this.src;
		if(null!=srcUrl && ''!=srcUrl && 'javascript:'==(srcUrl.substr(0,11).toLowerCase()) ) {			
			eval('srcUrl=' + srcUrl.substr(11));
		}
		if(null==srcUrl || '' == srcUrl) {
			return false;
		} else {		
			while (this.childNodes.length > 0) {
				this.childNodes[this.childNodes.length - 1].remove();
			}
			
			this.loaded = false;			
			this.open = true;
			this.folder = true;		
			this._loadingItem = new WebFXTreeItem(webFXTreeConfig.loadingText, null, null, webFXTreeConfig.loadingIcon);
			this.add(this._loadingItem);
			
			this._load_expand();
			
			_onLoad(srcUrl, this); 
		}		
		this.src = originalSrc;		
	} else {
		return false;
	}
};

/* Helper functions */
function _onLoad(src, jsNode) {
	if (jsNode.loading || jsNode.loaded) {
		return;
	}		
	jsNode.loading = true;	
	J.json(
        src,
        '', 
        function(o) {
        	_onLoaded(o, jsNode); 
        	return false;
        }
   	);
}

function _jsonTreeToJsTree(oNode) {
	var text = oNode.text;
	var action = oNode.action;
	var parent = null;
	var icon = oNode.icon;
	var openIcon = oNode.openIcon;
	var src = oNode.src;
	var target = oNode.target;

	var jsNode;
	
	if (src != null && src != '') {		
		jsNode = new WebFXLoadTreeItem(text, src, action, parent, icon, openIcon);
	} else {
		jsNode = new WebFXTreeItem(text, action, parent, icon, openIcon);
	}
	if (target != '') {
		jsNode.target = target;
	}
	var cs = oNode.xtree;
	if(cs) {
		var l = cs.length;
		for (var i = 0; i < l; i++) {
			jsNode.add( _jsonTreeToJsTree(cs[i]), true );
		}
	}
	return jsNode;
}
function _jsonTreeToJsTreePagination(oNode, jsParentNode) {
	var text = oNode.text;
	var action = 'javascript:_onLoadPagination(\'' + jsParentNode.id +'\', \'' + oNode.src + '\');';
	var parent = null;
	var icon = oNode.icon;
	var openIcon = oNode.openIcon;
	var target = oNode.target;
	var jsNode = new WebFXTreeItem(text, action, parent, icon, openIcon);

	if (target != '') {	
		jsNode.target = target;
	}	
	return jsNode;
}
function _onLoadPagination(jsParentNodeId, src) {
	webFXTreeHandler.all[jsParentNodeId].reload(src);	
}
function _onLoaded(o, jsParentNode) {	
	if (jsParentNode.loaded) {
		return;
	}
	jsParentNode.loaded = true;
	jsParentNode.loading = false;	
	
	var bIndent = false;
	var hasChildren = false;	
	
	if(null==o) {
		jsParentNode.errorText = parseTemplateString(webFXTreeConfig.loadErrorTextTemplate, jsParentNode.src);
	} else {		
		var cs = o.xtree;
		if(cs) {
			var l = cs.length;
			for (var i = 0; i < l; i++) {
				hasChildren = true;
				bIndent = true;
				if('pagination' == cs[i].type) {
					jsParentNode.add( _jsonTreeToJsTreePagination(cs[i], jsParentNode), true);
				} else if('callback' == cs[i].type) {
					window.setTimeout(function () {
						(cs[i].name || Prototype.emptyFunction)(o);
						return false;
					}, 10);
				} else {
					jsParentNode.add( _jsonTreeToJsTree(cs[i]), true);
				}
			}
		}
	}

	if (null!=jsParentNode._loadingItem) {
		jsParentNode._loadingItem.remove();	
	}

	//if (bIndent) {
		jsParentNode.indent(); // indent now that all items are added
	//}

	if (''!=jsParentNode.errorText) {
		window.status = jsParentNode.errorText;
	}
	
	return false;		
}

// parses a string and replaces %n% with argument nr n
function parseTemplateString(sTemplate) {
	var args = arguments;
	var s = sTemplate;

	s = s.replace(/\%\%/g, "%");

	for (var i = 1; i < args.length; i++)
		s = s.replace( new RegExp("\%" + i + "\%", "g"), args[i] )

	return s;
}

