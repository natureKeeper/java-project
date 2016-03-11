//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/bpel/BpelDecorator.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 09/10/23 06:39:39
// SCCS path, id: /family/botp/vc/13/7/1/0/s.13 1.51
//
//*************************************************************************
//END CMVC
//BEGIN COPYRIGHT
//*************************************************************************
//
// Licensed Materials - Property of IBM
// 5655-FLW
// (C) Copyright IBM Corporation 2008, 2009. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
//
//*************************************************************************
//END COPYRIGHT
dojo.provide("bpc.bpel.BpelDecorator");

dojo.require("bpc.graph.DefaultDecorator");
dojo.require("dojo.i18n");
dojo.require("dojo.date.locale");


dojo.declare("bpc.bpel.BpelDecorator", bpc.graph.DefaultDecorator, {
    constructor: function(widget) {
        this.widget = widget;
        this.imagePath = "./bpel/images/";
		this.calculated = false;
        this.stateTranslationMap = this.fillStateTranslationMap();
        dojo.requireLocalization("bpc.bpel", "ProcessView");
        this._nlsResources = dojo.i18n.getLocalization("bpc.bpel", "ProcessView");
		this.colorMap = ["FFFFFF", "e6e6ff", "ccccff", "b3b3ff", "9999ff", "8080ff", "6666ff", "4c4cff"];
		this.enableMigration = true;
    },

	prepareDecorations: function(obj) {
		if (!this.widget.statusMapping) return;
		if (!this.calculated) {
			if (this.widget.detailLevel == 0 && this.widget.showMigration) {
				this.enableMigration = true;
			} else {
				this.enableMigration = false;
			}
			//this.pimpMyModel(this.widget.statusMapping);
			if (this.enableMigration) {
				this.prepareMigrationInfo(this.widget.statusMapping);
			} else {
				this.migrationFront = null;
			}
			this.mapStateToModel(obj.element, this.widget.statusMapping);
			if (this.migrationFront) {
				this.analyzeVersionInfo();
				this.mapVersionToNode(obj);
			}
			this.calculated = true;
		}
        if (!this.initialized) {
            this.initialize(obj);
            this.initialized = true;
        }
		var root = this.widget.layouts.layout.coordinator.root.element;
	},

	finishDecorations: function(obj, container) {
		if (!container) {
			container = this.widget.decorations;
		}
		if (!this.migrationFront) {
			return;
		}
		waveFrontPoints = this.calculateWaveFrontPoints(this.waveFront);
		
		for (var i = waveFrontPoints.length - 1; i >=0; i--) {
			var points = waveFrontPoints[i];
			
			for (var t = 0; t < points.length; t++) {
				var point = points[t];
				var skin = this.widget.zoomLevel + 5;
				var verticalOffset = this.widget.zoomLevel*3;
				
				var level = this.currentVersion - i;
				if (level > 7) {
					level = 7;
				}
				var offset = level*8;
				var top = verticalOffset + offset;
				var left = point.x;
				var width = point.w;
				var height = point.y - offset - verticalOffset;
				
				this.makeCorner(container, obj, level, "Center", top - skin, left, width, height + skin*2);

				var lastPoint = null;
				var nextPoint = null;
				
				if (t > 0) {
					lastPoint = points[t-1];
				}
				if (t < points.length - 1) {
					nextPoint = points[t+1];
				}

				// switch to enable/disable round corners
				if (true) {
					if (!lastPoint || lastPoint.y < point.y) {
						// left outer corner
						var cornerWidth = skin;
						if (lastPoint && lastPoint.w < skin) {
							cornerWidth = lastPoint.w;
						}
						this.makeCorner(container, obj, level, "BL", top + height, left - cornerWidth, cornerWidth, skin);
						
						// left side
						var sideHeight = height;
						if (lastPoint) {
							sideHeight = point.y - lastPoint.y - skin;
						} else {
							// most left bar -> draw upper left corner
							this.makeCorner(container, obj, level, "TL", top - skin, left - cornerWidth, cornerWidth, skin);
						}
						this.makeCorner(container, obj, level, "Center", top + height - sideHeight, left - cornerWidth, cornerWidth, sideHeight);
						
						// add left bumps
						if (sideHeight > skin) {
							var bumpWidth = sideHeight/skin <skin/3?sideHeight/skin:skin/3;
							if (cornerWidth < skin) bumpWidth = 2;
							this.makeCorner(container, obj, level, "BumpL", top + height - sideHeight, left - cornerWidth - bumpWidth, bumpWidth, sideHeight);
						}
					}
					
					if (!nextPoint || nextPoint.y < point.y) {
						// left outer corner
						var cornerWidth = skin;
						if (nextPoint && nextPoint.w < skin) {
							cornerWidth = nextPoint.w;
						}
						this.makeCorner(container, obj, level, "BR", top + height, left + width, cornerWidth, skin);

						// right side
						var sideHeight = height;
						if (nextPoint) {
							sideHeight = point.y - nextPoint.y - skin;
						} else {
							// most right bar -> draw upper right corner
							this.makeCorner(container, obj, level, "TR", top - skin, left + width, cornerWidth, skin);
						}
						this.makeCorner(container, obj, level, "Center", top + height - sideHeight, left + width, cornerWidth, sideHeight);

						// add right bumps
						if (sideHeight > 20) {
							var bumpWidth = sideHeight/skin <skin/3?sideHeight/skin:skin/3;
							if (cornerWidth < skin) bumpWidth = 2;
							this.makeCorner(container, obj, level, "BumpR", top + height - sideHeight, left + width + cornerWidth, bumpWidth, sideHeight);
						}
					}
					
					// add bottom bumps
					if (width > skin*2) {
						var bumpStart = left;
						var bumpEnd = left + width; 
						if (lastPoint && lastPoint.y > point.y) {
							bumpStart += skin;
						}
						if (nextPoint && nextPoint.y > point.y) {
							bumpEnd -= skin;
						}
						var bumpWidth = bumpEnd - bumpStart;
						var bumpHeight = bumpWidth/skin <skin/3?bumpWidth/skin:skin/3;
						this.makeCorner(container, obj, level, "BumpB", top + height + skin, bumpStart, bumpWidth, bumpHeight);
					}
				}
			}
		}
		
		this.showTemplateInfo(obj, container);
	},

	makeCorner: function(container, obj, level, type, top, left, width, height) {
        var imageName = this.imagePath + "cloudEmpty" + type + ".gif";
        var img = document.createElement("img");
        img.src = imageName;
        img.style.position = "absolute";
        img.style.opacity = "1";
		img.style.top = top + 'px';
		img.style.left = left + 'px';
		img.style.width = width + 'px';
		img.style.height = height + 'px';
		obj.visualization.decorations.push(img);
		container.appendChild(img);

        var imageName = this.imagePath + "cloud" + type + ".gif";
        var img = document.createElement("img");
        img.src = imageName;
        img.style.position = "absolute";
        img.style.opacity = 0.1 * level;
    	img.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 10 * level + ")";
		img.style.top = top + 'px';
		img.style.left = left + 'px';
		img.style.width = width + 'px';
		img.style.height = height + 'px';
		obj.visualization.decorations.push(img);
		container.appendChild(img);
	},
	
    initialize: function(obj) {
         // don't need special initialization now
    },

	drawDecoration: function(obj, container) {
		if (!this.widget.statusMapping) return;
		if (!container) {
			container = this.widget.decorations;
		}

		// reset decoration flags
		obj.decorationReceiver = undefined;
		obj.decorationOrigin = undefined;
		
		var element = obj.element;
		if (element) {
			var status = element.bpcStateString;
			var originalNode = obj;
	
			if (status) {
				// [NEW]
				if (status == "STOPPED" && element.bpcStopReason == "STOP_REASON_ACTIVATION_FAILED") {
					// move decoration if predecessor is a gateway, otherwise leave decoration on activity
					var alternateNode = obj;
					for (var i = 0; i < obj.inEdges.length; i++) {
						var edge = obj.inEdges[i];
						var source = edge.source;
						if (source instanceof bpc.wfg.Internal) {
							// successor is a label
							obj = source;
							i = -1;
						} else {
							if (!source.element) {
								// must be a gateway
								if (source.outEdges && source.outEdges.length > 1) {
									// gateway of outgoing links of previous activity
									// leave state stopped on activity
								} else {
									// gateway of incoming links
									alternateNode = source;
			        				// obj.decorationOrigin is a link to the original activity. You can find all state info etc. there.
									alternateNode.decorationOrigin = originalNode;
			        				// activity.decorationReceiver is a link from the activity to the gateway which receives the state information
									originalNode.decorationReceiver = alternateNode;
								}
							}
						}
					}
					obj = alternateNode;
				}

				if (status == "STOPPED" && element.bpcStopReason == "STOP_REASON_FOLLOW_ON_NAVIGATION_FAILED") {
					// move decoration if successor is a gateway, otherwise move decoration to link condition node
					var alternateNode = obj;

					// move decoration to link condition
					obj = originalNode;
					if (obj.outEdges.length > 0) {
						var edge = obj.outEdges[0];
						if (edge.condition) {
							alternateNode = edge;
							alternateNode.decorationOrigin = originalNode;
							originalNode.decorationReceiver = alternateNode;
						}
					}
					
					if (originalNode == alternateNode) {
						// move to gateway
						for (var i = 0; i < obj.outEdges.length; i++) {
							var edge = obj.outEdges[i];
							var target = edge.target;
							if (target instanceof bpc.wfg.Internal) {
								// successor is a label
								obj = target;
								i = -1;
							} else {
								if (!target.element) {
									// must be a gateway
									alternateNode = target;
									alternateNode.decorationOrigin = originalNode;
									originalNode.decorationReceiver = alternateNode;
								}
							}
						}
					}
					
					obj = alternateNode;
				}

				if (obj instanceof bpc.wfg.Edge) {
					var handle = obj.linkGeo.handle;

                    var image = null;
                    var auraImage = this.imagePath + "aura" + this.stateColorMap[status] + ".png";
                    if (dojo.isIE) {
                        img = document.createElement("div");
                        img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + auraImage + "', sizingMethod='scale')";
                        img.className = "aura";
                    } else {
                        img = document.createElement("img");
                        img.src = auraImage;
                        img.className = "aura";
                    }
					img.style.top = handle.y - 20 + 'px';
					img.style.left = handle.x - 20 + 'px';
					img.style.width = 40 + 'px';
					img.style.height = 40 + 'px';
					originalNode.visualization.decorations.push(img);
					container.appendChild(img);
					
					var div = document.createElement("div");
					div.className = "stateIcon icon" + status;
					div.title = this.stateTranslationMap[status];
					div.style.top = handle.y - 16 + 'px';
					div.style.left = handle.x + 8 + 'px';
					originalNode.visualization.decorations.push(div);
					container.appendChild(div);

				} else if (obj instanceof bpc.wfg.StructuredNode) {
					var geo = obj.geo.current;
					var size = geo.fontSize;
					var head = obj.visualization.head;
					if (head) {
                        var image = null;
                        var auraImage = this.imagePath + "aura" + this.stateColorMap[status] + ".png";
                        if (dojo.isIE) {
                            img = document.createElement("div");
                            img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + auraImage + "', sizingMethod='scale')";
                            img.className = "aura";
                        } else {
                            img = document.createElement("img");
                            img.src = auraImage;
                            img.className = "aura";
                        }
						img.style.top = geo.abs.top - geo.head.dim.height/2 - size + 'px';
						img.style.left = geo.abs.left + geo.dim.width/2 - geo.head.dim.width/2 - size + 'px';
						img.style.width = geo.head.dim.width + size * 2 + 'px';
						img.style.height = geo.head.dim.height + size * 2 + 'px';
						obj.visualization.decorations.push(img);
						container.appendChild(img);		
					
						var div = document.createElement("div");
						div.className = "stateIcon icon" + status;
                        div.title = this.stateTranslationMap[status];
						div.style.top = geo.abs.top - geo.head.dim.height/2 - 8 + 'px';
						div.style.left = geo.abs.left  + geo.dim.width/2 + geo.head.dim.width/2 - 8 + 'px';
//						div.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + element.bpcVersion + ")";//(" + element.bpcMigrationFront + ")";
						obj.visualization.decorations.push(div);
						container.appendChild(div);
					}			
				} else {
					var geo = obj.geo.current;
					var size = geo.fontSize;
                    var image = null;
                    var auraImage = this.imagePath + "aura" + this.stateColorMap[status] + ".png";
                    if (dojo.isIE) {
                        img = document.createElement("div");
                        img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + auraImage + "', sizingMethod='scale')";
                        img.className = "aura";
                    } else {
                        img = document.createElement("img");
                        img.src = auraImage;
                        img.className = "aura";
                    }
					img.style.top = geo.abs.top - size + 'px';
					img.style.left = geo.abs.left - size + 'px';
					img.style.width = geo.dim.width + size * 2 + 'px';
					img.style.height = geo.dim.height + size * 2 + 'px';
					obj.visualization.decorations.push(img);
					container.appendChild(img);

					var div = document.createElement("div");
					div.className = "stateIcon icon" + status;
					div.title = this.stateTranslationMap[status];
					div.style.top = geo.abs.top  - 8 + 'px';
					div.style.left = geo.abs.left  + geo.dim.width - 8 + 'px';
//					div.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + element.bpcVersion + ")";//(" + element.bpcMigrationFront + ")";
					obj.visualization.decorations.push(div);
					container.appendChild(div);

                    if (element.bpcSkipRequested) {
                        var div2 = document.createElement("div");
                        div2.className = "stateIcon iconSKIP_REQUESTED";
                        div2.title = labelActivityStateSkipRequested;
                        div2.style.top = geo.abs.top  - 8 + 'px';
                        div2.style.left = geo.abs.left  + geo.dim.width - 8 + 16 + 'px';
                        obj.visualization.decorations.push(div2);
                        container.appendChild(div2);
                    }
				}
			}

			// draw forEach
            if (obj instanceof bpc.wfg.StructuredNode && obj.element && obj.element instanceof bpc.bpel.ForEach && obj.element.bpcStateIterations >= 0  && obj.element.bpcStateIterationCount >= 0) {
				var geo = obj.geo.current;
				var div0 = document.createElement("div");
                div0.className = "frameTitleBpel";
                div0.style.left = geo.abs.left + geo.dim.width/2 + 10 + 'px';
                div0.style.top = geo.abs.top + geo.head.dim.height/2 + 3 + 'px';
                obj.visualization.decorations.push(div0);
                div0.innerHTML = "(" + (obj.element.bpcStateIterationCount + 1) + "/" + obj.element.bpcStateIterations + ")";
                container.appendChild(div0);

            }
            
            // draw migration front handle
            if (this.migrationFront && element.bpcMigrationFront) {
            	var mfInNode = [];
            	var mfAfterNode = [];
            	for (var i in element.bpcMigrationFront) {
            		var mf = element.bpcMigrationFront[i];
    				if (mf.migrationState == "STATE_CLAIMED" || mf.migrationState == "STATE_READY" || mf.migrationState == "STATE_RUNNING" || mf.migrationState == "STATE_WAITING") {
    					mfInNode.push(mf);
    				} else {
    					mfAfterNode.push(mf);
    				}
            	}
            	if (mfInNode.length > 0) this.drawMigrationFrontHandle(obj, container, mfInNode);
            	if (mfAfterNode.length > 0) this.drawMigrationFrontHandle(obj, container, mfAfterNode, true);
            }
            
            // handle special migration version situations in cycles
            if (this.migrationFront && element.bpcVersion) {
        		var special = false;
        		var lowestVersion = 99;
            	for (var version in element.bpcAllVersion) {
    				if (version != undefined) {
    					if (version < lowestVersion) {
    						lowestVersion = version;
    					}
    					if (version < element.bpcVersion) {
    						special = true;
    					}
    				}
            	}
            	if (special) {
                    var color1 = this.colorMap[this.currentVersion - element.bpcVersion];
                    var color2 = color1;
            		if (element.bpcMigrationFront) {
            			for (var i in element.bpcMigrationFront) {
            				var mf = element.bpcMigrationFront[i];
            				if (mf.targetPTID == this.versionTemplateMap[element.bpcVersion]) {
            					// we have a migration front embedded in a cloud
                                var color1 = this.colorMap[this.currentVersion - (element.bpcVersion -1)];
            				}
            			}
            		}
            		
            		// skip this if this is a valid migration front which is no embedded in a lower version
            		if (color1 == color2 || lowestVersion != element.bpcVersion-1) {
    					var geo = obj.geo.current;
    					var size = geo.fontSize * 2;
    					
    					// first part
                        div = document.createElement("div");
                        div.className = "migrationCloudHole migrationCloudHoleTop";
                        div.style.backgroundColor = color1;
                        div.style.top = geo.abs.top - size + 'px';
                        div.style.left = geo.abs.left - size + 'px';
                        div.style.width = geo.dim.width + 2*size + 'px';
                        div.style.height = (geo.dim.height + 2*size)/2 + 'px';

    					obj.visualization.decorations.push(div);
    					container.appendChild(div);

    					// second part
                        div = document.createElement("div");
                        div.className = "migrationCloudHole migrationCloudHoleBottom";
                        div.style.backgroundColor = color2;
                        div.style.top = geo.abs.top + geo.dim.height/2 + 'px';
                        div.style.left = geo.abs.left - size + 'px';
                        div.style.width = geo.dim.width + 2*size + 'px';
                        div.style.height = (geo.dim.height + 2*size)/2 + 'px';
    					obj.visualization.decorations.push(div);
    					container.appendChild(div);
            		}
            	}
            }
		}
	},
	
	drawMigrationFrontHandle: function(obj, container, mfs, after) {
		var element = obj.element;
		var geo = obj.geo.current;
		var size = geo.fontSize;
		
		var bar = document.createElement("div");
		bar.className = "migrationBar";
		if (after) {
			bar.style.top = geo.abs.top + geo.dim.height + size - 2 + 'px';
		} else {
			bar.style.top = geo.abs.top + geo.dim.height/2 - 2 + 'px';
		}
		bar.style.left = geo.abs.left - size*2 + 'px';
		bar.style.width = geo.dim.width + 3*size + 'px';
		obj.visualization.decorations.push(bar);
		container.appendChild(bar);

		var icon = document.createElement("div");
		icon.className = "migrationIconButton";
		if (after) {
			icon.style.top = geo.abs.top + geo.dim.height + size - 11 + 'px';
		} else {
			icon.style.top = geo.abs.top + geo.dim.height/2 - 11 + 'px';
		}
		icon.style.left = geo.abs.left + geo.dim.width + size - 1+ 'px';
		obj.visualization.decorations.push(icon);
		var self = this;
//		dojo.connect(icon, "onmouseover", function() {self.showMigrationInfo(obj, container, mfs)});
//		dojo.connect(icon, "onmouseout", function() {self.hideMigrationInfo()});
		dojo.connect(icon, "onclick", function(e) {e.stopPropagation();self.showMigrationInfo(obj, container, mfs, icon)});
		container.appendChild(icon);
	},
	
	showMigrationInfo: function(obj, container, mfs, icon) {
		if (this.migrationInfo) {
			var old = this.migrationInfo.object;
			this.hideMigrationInfo();
			if (old == obj) {
				return;
			}
		} 

		icon.style.zIndex = "233";
		var dialog = document.createElement("div");
		dialog.className = "migrationInfoDialog";
		var table = document.createElement("table");
		table.style.width = "100%";
		var tbody = document.createElement("tbody");
		dialog.appendChild(table);
		table.appendChild(tbody);
		
		for (var i = 0; i < mfs.length; i++) {
			var mf = mfs[i];
			var generalMf = this.migrationFront[mf.targetPTID];
			var row = document.createElement("tr");
			var cell = document.createElement("td");
			var version = this.templateVersionMap[mf.targetPTID];
			var level = this.currentVersion - version;
			if (level > 7) {
				level = 7;
			}
			cell.style.backgroundColor = this.colorMap[level];
			
			tbody.appendChild(row);
			
            var color1 = this.colorMap[this.currentVersion - (version-1)];
            var color2 = this.colorMap[this.currentVersion - version];

            var html = '<table class="migrationInnerTable"><tbody>' +
			   		   '<tr><td rowspan="5" class="migrationVersionNumber">' + version + '</td><td rowspan="7"><div class="migrationIcon"></div></td><td rowspan="7" class="migrationVersionNumber">' + (version + 1) + '</td><td><b>' + this.widget._nlsResources["KEY_MigrationTime"] + '</b></td><td>' + this.formatDate(generalMf.migrationTime) + '</td></tr>' +
					   '<tr><td><b>' + this.widget._nlsResources["KEY_MigrationState"] + '</b></td><td><div class="stateIcon icon' + mf.migrationState.substring(6) +'"></div>' + this.stateTranslationMap[mf.migrationState.substring(6)] + '</td></tr>' +
					   '<tr><td style="background-color: ' + color1 +'"><b>' + this.widget._nlsResources["KEY_SourceTemplate"] + '</b></td><td style="background-color: ' + color1 +'">' + generalMf.sourceTemplateName + '</td></tr>' +
					   //'<tr><td style="background-color: ' + color1 +'"></td><td style="background-color: ' + color1 +'">' + generalMf.sourcePTID + '</td></tr>' +
					   '<tr><td style="background-color: ' + color2 +'"><b>' + this.widget._nlsResources["KEY_TargetTemplate"] + '</b></td><td style="background-color: ' + color2 +'">' + generalMf.targetTemplateName + '</td></tr>' +
					   //'<tr><td style="background-color: ' + color2 +'"><b></td><td style="background-color: ' + color2 +'">' + generalMf.targetPTID + '</td></tr>' +
					   '<tr><td><b>' + this.widget._nlsResources["KEY_ValidFrom"] + '</b></td><td>' + this.formatDate(generalMf.targetValidFrom) + '</td></tr>' +
					   '</tbody></table>';
			cell.innerHTML = html;
			row.appendChild(cell);
		}
		var geo = obj.geo.current;
		var size = geo.fontSize;

		dialog.style.top = "-1000px";
		dialog.style.left = "-1000px";


		container.appendChild(dialog);
		dialog.style.opacity = "0";
    	dialog.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
		
		if (dialog.offsetHeight > 400) {
			dialog.style.height = 400 + 'px';
			dialog.style.overflowY = "auto";
			dialog.style.width = dialog.offsetWidth + 25 + 'px';
		}

		dialog.style.top = geo.abs.top + geo.dim.height/2 - dialog.offsetHeight/2 + 'px';
		dialog.style.left = geo.abs.left + geo.dim.width + 2*size + 'px';
		
		dojo.fadeIn({
            node: dialog,
            duration: 500
        }).play();
        			
		this.migrationInfo = dialog;
		this.migrationInfo.icon = icon;
		dialog.object = obj;
		
		var self = this;
		
		this.closeDialogEvent = dojo.connect(document.body, "onclick", function() {self.hideMigrationInfo()});
	},
	
	showTemplateInfo: function(obj, container) {
		var dialog = document.createElement("div");
		dialog.className = "migrationInfoDialog";
		dialog.style.border = "0px solid white";
		var table = document.createElement("table");
		table.style.width = "100%";
		var tbody = document.createElement("tbody");
		dialog.appendChild(table);
		table.appendChild(tbody);
		
		for (var version = 0; version < this.versionTemplateMap.length; version++) {
			var ptid = null;
			var name = null;
			var validFrom = null;
			if (version == this.currentVersion) {
				var mf = this.migrationFront[this.versionTemplateMap[version]];
				ptid = mf.targetPTID;
				name = mf.targetTemplateName;
				validFrom = mf.targetValidFrom;
			} else {
				var mf = this.migrationFront[this.versionTemplateMap[version+1]];
				ptid = mf.sourcePTID;
				name = mf.sourceTemplateName;
				validFrom = mf.sourceValidFrom;
			}
			
			var row = document.createElement("tr");
			var cell = document.createElement("td");
			var level = this.currentVersion - version;
			if (level > 7) {
				level = 7;
			}
			cell.style.backgroundColor = this.colorMap[level];
			
			tbody.appendChild(row);
			row.appendChild(cell);
			
            var color1 = this.colorMap[this.currentVersion - (version-1)];
            var color2 = this.colorMap[this.currentVersion - version];

            var html = '<table class="migrationInnerTable"><tbody>' +
					   '<tr><td rowspan="3" class="migrationVersionNumber">' + (version + 1) + '</td><td><b>' + this.widget._nlsResources["KEY_Template"] + '</b></td><td>' + name + '</td></tr>' +
					   '<tr><td></td><td>' + ptid + '</td></tr>' +
					   '<tr><td><b>' + this.widget._nlsResources["KEY_ValidFrom"] + '</b></td><td>' + this.formatDate(validFrom) + '</td></tr>' +
					   '</tbody></table>';
			cell.innerHTML = html;
		}
		var geo = obj.geo.current;
		var size = geo.fontSize;
		dialog.style.top = geo.abs.top + 50 + 'px';
		dialog.style.left = geo.abs.left + geo.dim.width + 50 + 'px';
		dialog.style.opacity = "0";
    	dialog.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";

		container.appendChild(dialog);

		this.templateInfo = dialog;
		
		dojo.fadeIn({
            node: dialog,
            duration: 2000
        }).play();
        			
		obj.visualization.decorations.push(dialog);
	},
	
	getOptimizedCanvasSize: function(obj) {
		var w = obj.geo.work.outerDim.width;
		var h = obj.geo.work.outerDim.height;
		if (this.templateInfo) {
			w = obj.geo.work.outerDim.width + this.templateInfo.offsetWidth;
		}
		return {width:  w, height: h};
	},
	
	formatDate: function(text){
        var d = dojo.date.stamp.fromISOString(text);
	    var loc = dojo.locale;
	    if (loc.indexOf("ar") == 0 ) {
	    	if (dojo.isIE) {
	    		propertyValue = dojo.date.locale.format(d, { formatLength: 'medium', datePattern: "dd/MM/yyyy" });
	    	} else {
		        propertyValue = dojo.date.locale.format(d, { formatLength: 'medium', datePattern: "yyyy/MM/dd" });
	    	}				    
	    } else  {
        	propertyValue = dojo.date.locale.format(d, { formatLength: 'medium' });								
        }
        return propertyValue;
	},
	
	hideMigrationInfo: function() {
		if (this.migrationInfo) {
			this.migrationInfo.icon.style.zIndex = "231";
			this.migrationInfo.parentNode.removeChild(this.migrationInfo);
			this.migrationInfo = null;
		}
		if (this.closeDialogEvent) {
			dojo.disconnect(this.closeDialogEvent);
			this.closeDialogEvent = null;
		}
	},

	stateColorMap: {
		"INACTIVE": 	"Grey",        	
		"READY": 		"Green",		
		"RUNNING": 		"Green",		
		"SKIPPED": 		"Grey",		  	
		"FINISHED": 	"Blue",		
		"FAILED": 		"Red",			
		"TERMINATED": 	"Red",	
		"CLAIMED": 		"Green",
		"TERMINATING": 	"Red",	
		"FAILING": 		"Red",	
		"WAITING": 		"Green",
		"EXPIRED": 		"Red",	
		"FORWARDED": 	"Green",	
		"STOPPED": 		"Red",	
		"PROCESSING_UNDO": "Red"
	},
	
    fillStateTranslationMap: function() {
         if (window.labelActivityStateInactive) {
             return {
                 "INACTIVE": labelActivityStateInactive,
                 "READY": labelActivityStateReady,
                 "RUNNING": labelActivityStateRunning,
                 "SKIPPED": labelActivityStateSkipped,
                 "FINISHED": labelActivityStateFinished,
                 "FAILED": labelActivityStateFailed,
                 "TERMINATED": labelActivityStateTerminated,
                 "CLAIMED": labelActivityStateClaimed,
                 "TERMINATING": labelActivityStateTerminated,
                 "FAILING": labelActivityStateFailing,
                 "WAITING": labelActivityStateWaiting,
                 "EXPIRED": labelActivityStateExpired,
                 "STOPPED": labelActivityStateStopped,
                 "PROCESSING_UNDO": labelActivityStateProcessingUndo
             }
         } else {
             // no stateTranslationMap for structure view
             return null;
         }
    },
	
	stateStatusMap: {
		"INACTIVE": 	"NonActive",        	
		"READY": 		"InAction",		
		"RUNNING": 		"InAction",		
		"FINISHED": 	"Successful",		
		"FAILED": 		"Error",			
		"TERMINATED": 	"Error",	
		"CLAIMED": 		"Claimed",
		"TERMINATING": 	"Error",	
		"FAILING": 		"Error",	
		"WAITING": 		"Waiting",
		"EXPIRED": 		"Error",	
		"FORWARDED": 	"Successful",	
		"SKIPPED": 		"NonActive",		  	
		"STOPPED": 		"Error",	
		"PROCESSING_UNDO": "Error"
	},
	
	
	stateMap: {
		"INACTIVE": 1,        	// grey
		"READY": 2,			  	// yellow
		"RUNNING": 3,			// yellow
		"SKIPPED": 4,		  	// grey
		"FINISHED": 5,		  	// green
		"FAILED": 6,			// red
		"TERMINATED": 7,		// red
		"CLAIMED": 8,			// yellow
		"TERMINATING": 9,		// red
		"FAILING": 10,			// red
		"WAITING": 11,			// yellow
		"EXPIRED": 12,			// red
		"STOPPED": 13,			// red
		"PROCESSING_UNDO": 14,
		"FORWARDED": 15	
		
	},

	calculateWaveFrontPoints: function(waveFronts) {
		var result = [];
		var members = [];
		var skin = this.widget.zoomLevel + 5;
		
		for (var t in waveFronts) {
			members = waveFronts[t].members;
			if (t != this.currentVersion) {
				var points = [{x: 0, y: 0, w: 99999}];
				result[t] = points;
				for (var s in members) {
					var node = members[s];
					
					var point = this.getPointFromNode(node, t);
					
					if (point) {
						var newPoint = null;
						for (var i = 0; i < points.length; i++) {
							var temp = points[i];
							if (newPoint) {
								// use the rest of the last iteration
								point = newPoint;
								newPoint = null;
							}
							// new point hits existing bar
							if (point.x >= temp.x && point.x <= temp.x + temp.w) {
								if (point.x + point.w > temp.x + temp.w) {
									// new bar is wider than existing bar -> cut it and create new point
									newPoint = {x: temp.x + temp.w, y: point.y, w: point.x + point.w - (temp.x + temp.w)};
									point.w = temp.x + temp.w - point.x;
								} else {
									// new bar is smaller than existing bar
									if (point.y <= temp.y) {
										// new bar is not needed -> remove it
									} else {
										// cut existing bar
										var newTemp = {x: point.x + point.w, y: temp.y, w: temp.x + temp.w - (point.x + point.w)};
										temp.w = point.x + point.w - temp.x;
										points.splice(i + 1, 0, newTemp);
									}
								}
								
								// now the new and the temp bar are aligned on the right side
								if (point.y <= temp.y) {
									// new bar is not needed
								} else {
									temp.w = point.x - temp.x;
									if (temp.w == 0) {
										// new bar replaces existing bar
										points[i] = point;
									} else {
										// new  bar cuts existing bar
										points.splice(i + 1, 0, point);
										i++;
									}
									if (!newPoint) {
										break;
									}
								}
							} else if (point.x < temp.x){
								break;
							}
						}
					}
				}

				// cleanup points
				for (var i = 0; i < points.length; i++) {
					var point = points[i];
					// remove unnecessary bars at beginning and end
					if (point.y == 0 && (i == 0 || i == points.length -1)) {
						points.splice(i,1);
						i--;
					} else {
						var lastPoint = i > 0?points[i-1]:null;
						var nextPoint = i < points.length - 1?points[i+1]:null;
						
						// remove small bars
						if (point.w < 5 && (lastPoint || nextPoint)) {
							if (!nextPoint || (lastPoint && nextPoint && lastPoint.y > nextPoint.y)) {
								lastPoint.w = lastPoint.w + point.w;
							} else if (!lastPoint ||(lastPoint && nextPoint && lastPoint.y <= nextPoint.y)) {
								nextPoint.w = nextPoint.w + point.w;
								nextPoint.x = point.x;
							}
							points.splice(i,1);
							i--;
							point = null;
						}

						if (point && lastPoint && point.y == lastPoint.y) {
							// two bars have same height -> combine
							lastPoint.w = point.w + lastPoint.w; 
							points.splice(i, 1);
							i--;
							point = null
						}
						// remove small sinks
						if (point && lastPoint && nextPoint && point.y <= lastPoint.y && point.y <= nextPoint.y && (point.y == 0 || point.w < 2*skin) ) {
							if (nextPoint.y < lastPoint.y) {
								nextPoint.x = point.x;
								nextPoint.w = nextPoint.w + point.w;
							} else {
								lastPoint.w = lastPoint.w + point.w;
							}
							points.splice(i, 1);
							i--;
						}
					}
				}
			}
		}
		return result;
	},
	
	getPointFromNode: function(node, depth) {
		var point = null;
		var skin = this.widget.zoomLevel + 5;
		var isWaveFront = (dojo.indexOf(this.waveFront[depth].front, node) > -1);
		var overscan = this.widget.zoomLevel*2;
		
		
		if (node instanceof bpc.wfg.StructuredNode && (!node.geo.current.head || node.geo.current.head.dim.width == 0)) {
			return null;
		}

		// correct the border of the cloud to cut the migration front node
		if (node instanceof bpc.wfg.StructuredNode && (!node.element.bpcAllPseudoVersion || node.element.bpcAllPseudoVersion[depth] != true)) {
			point = {x: node.geo.current.abs.left + node.geo.current.dim.width/2 - node.geo.current.head.dim.width/2 - overscan, y: node.geo.current.abs.top + node.geo.current.head.dim.height/2 + 15, w: node.geo.current.head.dim.width + overscan*2};
			if (isWaveFront) {
				point.y = node.geo.current.abs.top - skin;
			}
		} else {
			point = {x: node.geo.current.abs.left - overscan, y: node.geo.current.abs.top + node.geo.current.dim.height + overscan, w: node.geo.current.dim.width + overscan*2};
			if (isWaveFront) {
				point.y = point.y - node.geo.current.dim.height/2 - overscan - skin;
			}
		}

		// handle  multiple migrations
		
		var level = this.currentVersion - depth;
		if (level > 7) {
			level = 7;
		}
		
		var offset = level*8;
		point.x = point.x + offset;
		point.w = point.w - 2*offset;
		if (!isWaveFront) {
			// no indent if we have a migration front
			point.y = point.y - offset;
		}
		
		return point;
	},

	mapVersionToNode: function(obj) {
		var element = obj.element;
		if (element) {
			for (var version in element.bpcAllVersion) {
				if (version != undefined) {
					this.waveFront[version].members.push(obj);
				}
			}
			for (var i in element.bpcMigrationFront) {
				var mf = element.bpcMigrationFront[i];
				if (mf.migrationState == "STATE_CLAIMED" || mf.migrationState == "STATE_READY" || mf.migrationState == "STATE_RUNNING" || mf.migrationState == "STATE_WAITING") {
					this.waveFront[this.templateVersionMap[mf.targetPTID]-1].front.push(obj);
				}
			}
			if (obj instanceof bpc.wfg.StructuredNode) {
				for (var i = 0; i < obj.nodes.length; i++) {
					var node = obj.nodes[i];
					this.mapVersionToNode(node);
				}
			}
		}
	},

	/**
	 * Algorithm to find all migration versions in the tree:
	 * 
	 *  - Start algorithm with all nodes of all migration fronts starting with the latest one. The active wave front is also considered here.
	 *  - Travers the list of predecessors.
	 *  - Inherit a list of all versions we found on our way in the allVersions array.
	 *  - If a node has no version assign the current version.
	 *  - Stop if we find a matching migration front (target is the same as the current source PTID).
	 *  - If we find a higher version make this version the current version and go on.
	 *  - If we find a lower version without having seen a matching migration front stop traversal and clear all changes since the last join.
	 *    This is necessary to handle cycles.
	 *  - (If we find a migration front node but we have more versions in the allVersions array, continue traversal and adapt the allVersions array.)
	 */
	analyzeVersionInfo: function() {
		// trigger current front
		if (this.migrationFront.currentFront) {
			var members = this.migrationFront.currentFront.members;
			for (var t = 0; t < members.length; t++) {
				var member = members[t];
				this.fillVersionInfo(member, member.bpcVersion);
			}
		}
		
		// trigger migration
		for (var i = this.versionTemplateMap.length-1; i > 0; i--) {
			var ptid = this.versionTemplateMap[i];
			var members = this.migrationFront[ptid].members;
			if (members) {
				for (var t = 0; t < members.length; t++) {
					var member = members[t];
					this.fillVersionInfo(member, i - 1);
				}
			}
		}
	},
	
	fillVersionInfo: function(obj, version, referenceNode, foundNodes) {
		if (!foundNodes) {
			foundNodes = [];
		}

		var debugName = obj.getAttribute("wpc:displayName");
		var debugVersion = obj.bpcVersion;
		//console.debug(debugName + " - " + debugVersion);
		
		// process and return if we are caught in a valid cycle without MFs
		if (obj == referenceNode || dojo.indexOf(foundNodes, obj) > -1) {
//			this.processNodesInQueue(referenceNode, version, foundNodes);
			return;
		}
		
		if (obj.bpcVersion == null || obj.bpcVersion == undefined) {
			foundNodes.push(obj);
		} else {
			if (!referenceNode) {
				referenceNode = obj;
				obj.bpcAllVersion[version] = true;
			} else {
				if (obj.bpcVersion > version) {
					// we have a later version in a cloud
					// this can only happen if a cycle is navigated with migrations in the cycle
					// just go on since we must have processed this node before
					foundNodes.push(obj);
//					this.processNodesInQueue(referenceNode, version, foundNodes);
//					foundNodes = [];
					// version = obj.bpcVersion;
//					referenceNode = obj;
				} else if (obj.bpcVersion == version) {
					if (obj.bpcMigrationFront) {
						var currentPTID = this.versionTemplateMap[version];
						for (var i in obj.bpcMigrationFront) {
							if (currentPTID == obj.bpcMigrationFront[i].targetPTID) {
								foundNodes.push(obj);
								this.processNodesInQueue(referenceNode, version, foundNodes);
								// break if we have a valid MF
								// this node will be triggered later in a new run
								return;
							}
						}
					}

					// node might have MFs but not for the current version
					// or it is just the standard case: a node with the same version
					foundNodes.push(obj);
				} else if (obj.bpcVersion < version) {
					return;
					// this is not valid: we have a version reduction without valid mf -> can happen in cycles
					// return to the last join without processing the found nodes
				}
			}
		}

		if (obj.predecessors.length > 0) {
			var predecessors = [];
			for (var i = 0; i < obj.predecessors.length; i++) {
				var predecessor = obj.predecessors[i];
		        if (predecessor instanceof bpc.bpel.Container) {
		        	predecessors = predecessors.concat(this.findNextPredecessorsInContainer(predecessor));
		        } else {
		        	predecessors.push(predecessor);
		        }
			}

			for (var i = 0; i < predecessors.length; i++) {
				var predecessor = predecessors[i];
		        this.fillVersionInfo(predecessor, version, referenceNode, foundNodes.slice(0)); // clone the foundNodes array
			}
		} else {
			// we are at the beginning of the container
			var parent = obj.parent;
			if (parent) {
		        this.fillVersionInfo(parent, version, referenceNode, foundNodes.slice(0)); // clone the foundNodes array
			} else {
				// we are at the very beginning
				this.processNodesInQueue(referenceNode, version, foundNodes);
			}
		}
	},	
	
	/**
	 * Find all nodes in the container without successors. These are the nodes to continue the 
	 * algrorithm from.
	 * This works since we continue with the parent container after reaching the first node of a container.
	 */
	findNextPredecessorsInContainer: function(obj, predecessors) {
		if (!predecessors) {
			predecessors = [];
		}
		
		if (obj instanceof bpc.bpel.Container) {
        	for (var t = 0; t < obj.children.length; t++) {
        		var child = obj.children[t];
        		if (child instanceof bpc.bpel.ProcessNode) {
        			if (child.successors.length == 0) {
	        			this.findNextPredecessorsInContainer(child, predecessors);
        			}
        		}
        	}
			
		} else {
			predecessors.push(obj);
		}
		
		return predecessors;
	},

	/**
	 * process all nodes in the queue
	 */
	processNodesInQueue: function(referenceNode, version, foundNodes) {
		var allVersions = referenceNode.bpcAllVersion;
		
		for (var i = 0; i < foundNodes.length; i++) {
			var node = foundNodes[i];
			for (var t in allVersions) {
				if (!node.bpcAllVersion) {
					node.bpcAllVersion = [];
				}
				node.bpcAllVersion[t] = true;
			}
			allVersions = node.bpcAllVersion;
			
			if (node.bpcVersion == null) {
				node.bpcVersion = version;
		        if (node instanceof bpc.bpel.Container) {
		        	
		        	// check if the complete container belongs to a cloud or only the head
		        	// take full container for all versions of the successor
		        	for (var s = 0; s < node.successors.length; s++) {
		        		var successor = node.successors[s];
		    			for (var r in successor.bpcAllVersion) {
		    				var debugR = r; // don't remove this line, necessary due to bug in Firebug
		    				if (!node.bpcAllPseudoVersion) {
		    					node.bpcAllPseudoVersion = [];
		    				}
		    				node.bpcAllPseudoVersion[r] = true;
		    			}
		        	}
		        	node.bpcPseudoVersion = true;
		        }
			}
		}
		return [];
	},
	
	prepareMigrationInfo: function(map) {
		migrationFronts = dojo.clone(this.widget.statusMapping.migrationFront);
		
		// create mapping tables template <-> version
		this.versionTemplateMap = [];
		this.templateVersionMap = {};
		if (migrationFronts) {
			var mfsInArray = [];
			// order the migration fronts
			for (var i in migrationFronts) {
				mfsInArray.push(migrationFronts[i]);
			}
			for (var i in mfsInArray) {
				migration = mfsInArray[i];
				if (this.versionTemplateMap.length == 0) {
					this.versionTemplateMap.push(migration.sourcePTID);
					this.versionTemplateMap.push(migration.targetPTID);
				} else {
					var found = false;
					if (migration.sourcePTID == this.versionTemplateMap[this.versionTemplateMap.length - 1]) {
						this.versionTemplateMap.push(migration.targetPTID);
						found = true;
					} else if (migration.targetPTID == this.versionTemplateMap[0]) {
						this.versionTemplateMap.unshift(migration.sourcePTID);
						found = true;
					}
					if (!found) {
						// not enough elements in the array, try later
						mfsInArray.push(migration);
					}
				}
			}
			
			for (var i = 0; i < this.versionTemplateMap.length; i++) {
				this.templateVersionMap[this.versionTemplateMap[i]] = i;
			}
			this.currentVersion = this.versionTemplateMap.length - 1;
			this.migrationFront = migrationFronts;
		}
		
		// prepare node arrays
		this.waveFront = [];
		for (var i = 0; i <= this.currentVersion; i++) {
			this.waveFront[i] = {front: [], members: []};
		}
	},
	
	pimpMyModel: function(map) {

		var pimp = {
					"0": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:1",
						"isWaitingForSubtask":false},
					"7": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:1",
						"isWaitingForSubtask":false},	
					"9": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:1",
						"isWaitingForSubtask":false},	
					"26": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:1",
						"isWaitingForSubtask":false},	
					"22": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:2",
						"isWaitingForSubtask":false},	
					"24": {
						"migrationStates":
							[{
								"targetPTID":"_PT:3",
								"migrationState":"STATE_READY"
							}],						
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:3",
						"isWaitingForSubtask":false},	
					"23": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:3",
						"isWaitingForSubtask":false},	
					"25": {
						"migrationStates":
							[{
								"targetPTID":"_PT:2",
								"migrationState":"STATE_READY"
							}],						
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:2",
						"isWaitingForSubtask":false},	
					"28": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_FINISHED",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:2",
						"isWaitingForSubtask":false},	
					"27": {
						"migrationStates":null,
						"activated":"2009-09-22T13:35:58Z",
						"aiid":"_AI:90040123.e1f73688.18046df6.6500e6",
						"stopReason":"STOP_REASON_UNSPECIFIED",
						"executionState":"STATE_READY",
						"tkiid":null,
						"atid":"_AT:90020123.e63218ff.733367f6.64e30070",
						"ptid":"_PT:3",
						"isWaitingForSubtask":false},	

						
					"migrationFront":{
						"_PT:2":{
							"targetPTID":"_PT:2",
							"sourceTemplateName":"CaseHandling_Migration1",
							"targetValidFrom":"2009-03-13T13:13:13Z",
							"targetTemplateName":"CaseHandling_Migration2",
							"sourcePTID":"_PT:1",
							"migrationTime":"2009-09-23T09:20:37Z",
							"sourceValidFrom":"2009-02-12T12:12:12Z"},
						"_PT:3":{
							"targetPTID":"_PT:3",
							"sourceTemplateName":"CaseHandling_Migration2",
							"targetValidFrom":"2009-02-12T12:12:12Z",
							"targetTemplateName":"CaseHandling_Migration3",
							"sourcePTID":"_PT:2",
							"migrationTime":"2009-09-23T08:14:20Z",
							"sourceValidFrom":"2009-01-11T11:11:11Z"}
					}
				};
		for (var i in pimp) {
			map[i] = pimp[i];
		}
		return map;
	},
	
	mapStateToModel: function(obj, map) {
		if (obj instanceof bpc.bpel.ProcessNode) {
			obj.bpcMigrationFront = undefined;
			
            var id = obj.getAttribute("wpc:id");
			if (id) {
				var info = map[id];
				if (info) {
					// delete state if we have just migration information without state
					obj.bpcStateString = null;
					obj.bpcState = null;
					obj.bpcStatus = null;
					
                    var state = info.executionState;
                    if (state) {
                        state = state.substring(6);
                        if (!(obj instanceof bpc.bpel.Container) || state == "STOPPED") {
                            // only stopped state for structured activities
                            obj.bpcStateString = state;
                            obj.bpcState = this.stateMap[state];
                            obj.bpcStatus = this.stateStatusMap[state];
						}
                    }
                    var oid = info.aiid;
                    obj.bpcOID = oid;
                    obj.bpcOwner = info.owner;
                    obj.bpcSkipRequested = info.skipRequested;
                    obj.bpcIsWaitingForSubtask = info.isWaitingForSubtask;
                	obj.bpcStopReason = info.stopReason;
                    obj.tkiid = info.tkiid;
                    obj.bpcAllPseudoVersion = null;

                    if (!(obj instanceof bpc.bpel.Container)) {
                    	// migration handling only for non containers
                    	if (this.migrationFront) {
                            obj.bpcVersion = this.templateVersionMap[info.ptid];
                            obj.bpcMigrationFront = info.migrationStates;
                            obj.bpcAllVersion = [];
                            if (obj.bpcVersion != null) {
                            	obj.bpcAllVersion[obj.bpcVersion] = true;
                            }
                        }
                        
                        // collect all nodes of a migration front in the migrationfront object
                        if (this.migrationFront && obj.bpcMigrationFront) {
                        	for (var i in info.migrationStates) {
                        		var migration = info.migrationStates[i];
                        		if (!this.migrationFront[migration.targetPTID].members) {
                        			this.migrationFront[migration.targetPTID].members = [];
                        		}
                        		this.migrationFront[migration.targetPTID].members.push(obj);
                        	}
                        }
                        
                        // collect nodes for a fake front of currently active nodes
                        if (this.migrationFront) {
                            if (state == "READY" || state == "RUNNING" || state == "CLAIMED" || state == "WAITING") {
                        		if (!this.migrationFront.currentFront) {
                        			this.migrationFront.currentFront = {members: []};
                        		}
                        		this.migrationFront.currentFront.members.push(obj);
        					}
                        }
                    }
                    	
                    if (obj instanceof bpc.bpel.Container) {
						if (obj instanceof bpc.bpel.ForEach) {
							if (info.forEach) {
								obj.bpcStateIterations = info.forEach.length;
								if (!obj.bpcStateIterationCount) {
									obj.bpcStateIterationCount = 0;
								}
                                if (info.defaultIteration) {
                                    obj.bpcStateIterationCount = info.defaultIteration;
                                    info.defaultIteration = undefined;
                                }
								map = info.forEach[obj.bpcStateIterationCount];
							}
						}
						if (obj.name == "bpws:eventHandlers") {
							if (info.eventHandler) {
								obj.bpcStateIterations = info.eventHandler.length;
								if (!obj.bpcStateIterationCount) {
									obj.bpcStateIterationCount = 0;
								}
                                if (info.defaultIteration) {
                                    obj.bpcStateIterationCount = info.defaultIteration;
                                    info.defaultIteration = undefined;
                                }
								map = info.eventHandler[obj.bpcStateIterationCount];
							}
						}
					} 
 				} else {
                    obj.bpcOID = null;
                    obj.bpcOwner = null;
                    obj.bpcSkipRequested = null;
                    obj.tkiid = null;
                    obj.bpcStateString = null;
                    obj.bpcState = null;
                    obj.bpcIsWaitingForSubtask = null;
                    obj.bpcStatus = null;
                    obj.bpcStopReason = null;
                    obj.bpcVersion = null;
                    obj.bpcAllVersion = null;
                    obj.bpcAllPseudoVersion = null;
                    obj.bpcMigrationFront = null;
                }
			}
		}
		for (var i in obj.children) {
			needsRepaint = this.mapStateToModel(obj.children[i], map);
		}
	}

});