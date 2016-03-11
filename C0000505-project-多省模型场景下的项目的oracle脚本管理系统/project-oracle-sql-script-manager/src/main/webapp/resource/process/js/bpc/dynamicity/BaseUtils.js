//BEGIN CMVC 
//*************************************************************************
//
// Workfile: BPCSRVR/ws/code/processwidget/src/WebContent/bpc/dynamicity/BaseUtils.js, BPC.client, WBIX.BPCSRVR, of0947.12
// Last update: 08/07/22 11:45:20
// SCCS path, id: /family/botp/vc/14/2/2/2/s.55 1.1
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
dojo.provide("bpc.dynamicity.BaseUtils");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dojo.cookie");

dojo.declare("bpc.dynamicity.BaseUtils",[dijit._Widget, dijit._Templated],{
	widgetsInTemplate: true,
	templateString: "<div dojoAttachPoint='canvas' class='shooterCanvas'><div dojoAttachPoint='scoreFrame' class='shooterScore'></div><div dojoAttachPoint='healthFrame' class='shooterHealth'></div></div>",

	constructor: function(args, div){
		this.mousePos = {x: 0, y: 0};
		this.eyePos = {x: 0, y: 0, z: 100, w: 40, h:44};
		this.ship = null;
		this.health = null;
		this.stones = [];
		this.speed = 100;
		this.offset = {x: 0, y: 0};
		this.imagePath = "images/";
		this.score = 0;
		this.counter = 0;
		this.lives = 4;
	},
	
	postMixInProperties: function() {	
	},

	postCreate: function() {
	},
		
	startup: function() {
		this.width = this.canvas.offsetWidth;
		this.height = this.canvas.offsetHeight;
		this.mouseMove = dojo.connect(this.root, 'onmousemove', this, "_onMove");
		this.createBackground();
		this.createStones(20);
		this.createPlanets();
		this.setLives();
		this.iterate();
	},
	
	createBackground: function() {
		var img = document.createElement("img");
		img.className = "shooterBackground";
		img.src = this.imagePath + "graph/images/" + "actionBackground.gif";
		img.style.width = this.width + 'px';
		img.style.height = this.height + 'px';
		this.canvas.appendChild(img);
		
		var div = document.createElement("div");
		div.className = "shooterFog";
		div.style.width = this.width + 'px';
		div.style.height = this.height + 'px';
		this.canvas.appendChild(div);
	},
	
	setLives: function() {
		this.healthFrame.style.top = (this.height - 48)+ 'px';
		var displayedLives = this.healthFrame.childNodes.length;
		if (displayedLives < this.lives) {
			for (var i = displayedLives; i < this.lives; i++) {
				var img = document.createElement("img");
				img.className = "shooterLife";
				img.src = this.imagePath + "bpel/images/" + "htask_default.gif";
				this.healthFrame.appendChild(img);				
			}
		}
		if (displayedLives > this.lives) {
			for (var i = displayedLives; i > this.lives; i--) {
				this.healthFrame.removeChild(this.healthFrame.firstChild);
			}
		}
		
		if (this.lives == 0) {
			var div = document.createElement("div");
			div.className = "shooterGameOver";
			div.style.width = this.width + 'px';
			div.style.height = this.height + 'px';
			div.innerHTML = "Game<br>over";
			this.canvas.appendChild(div);
		}
	},
	
	createPlanets: function() {
		for (var i in this.planets) {
			var planet = this.planets[i];
			var image = document.createElement("img");
			image.className = "shooterPlanets";
			image.src = this.imagePath + "bpel/images/" + this.imageMap[planet.kind];
			this.canvas.appendChild(image);
			planet.base = image;
			this.stones.push(planet);
		}
	},
	
	createStones: function(number) {
		for (var i = 0; i < number; i++) {
			this.stones.push(this.getNewStone(10000 - Math.random()*800 - 200 - 1000*i));
		}
	},
	
	getNewStone: function(z) {
		var image = document.createElement("img");
		var kind = Math.floor(Math.random() * 7);
		image.src = this.imagePath + "bpel/images/" + this.imageMap[kind];
		image.className = "shooterStone";
		this.canvas.appendChild(image);
		
		var stone = {
			base: image,
			x: (kind < 5)?Math.random()*1000 - 500:-1000,
			y: Math.random()*1000 - 500,
			z: z,
			width: (kind < 5)?200:2000,
			height: 200,
			x1: 0,
			y1: 0,
			kind: kind,
			width1: 10,
			height1: 10,
			animation: 0
		};
		
		return stone;		
	},
	
	iterate: function() {
		this.moveStones();
		this.showStones();

		this.counter++;
		if (this.counter % 10 == 0) {
			this.score += 5;
			this.scoreFrame.innerHTML = this.score;
		}
		var self = this;
		if (this.lives > 0) {
			this.iterator = window.setTimeout(function(){self.iterate();}, 100);
		}
		
	},
	
	moveStones: function() {
		for (var i in this.stones) {
			var stone = this.stones[i];
			if (stone && stone.z<100) {
				this.canvas.removeChild(stone.base);	
				this.stones[i] = null;
				stone = null;			
			}
			if (!stone) {
				stone = this.getNewStone(10000 - Math.random()*800 - 200);
				this.stones[i] = stone;
			}
			if (stone.z < 12000) stone.z -= this.speed;
			
			if (!stone.animation) stone.animation = 0;
			if (stone.animation > 0) {
				stone.animation++;
			}
			if (this.lives > 0 && stone.z < 500) {
				if (stone.animation == 0 &&
					this.eyePos.x + this.eyePos.w > stone.x &&
					this.eyePos.x - this.eyePos.w < stone.x + stone.width &&
					this.eyePos.y + this.eyePos.h > stone.y &&
					this.eyePos.y - this.eyePos.h < stone.y + stone.height) {

					if (stone.kind == 3 || stone.kind == 4) {
						stone.base.src = this.imagePath + "bpel/images/" + this.imageMap[8];
						stone.kind = 8;
						this.score += 50;	
					} else {
						stone.base.src = this.imagePath + "bpel/images/" + this.imageMap[7];
						stone.kind = 7;	
						this.lives--;
						this.setLives();
					}					
					stone.animation = 1;
					
				}
			}
			if (stone.animation > 0) {
				stone.width += stone.width * stone.animation;
				stone.height += stone.height * stone.animation;
			}
			var zs = this.eyePos.z/(stone.z - this.eyePos.z);
			stone.x1 = (stone.x - this.eyePos.x) * zs;
			stone.y1 = (stone.y - this.eyePos.y) * zs;
			stone.width1 = stone.width * zs;
			stone.height1 = stone.height * zs;
		}
	},
	
	showStones: function() {
		for (var i in this.stones) {
			var stone = this.stones[i];
			stone.base.style.left = stone.x1 + this.width/2 + 'px';
			stone.base.style.top = stone.y1 + this.height/2 + 'px';
			stone.base.style.width = stone.width1 + 'px';
			stone.base.style.height = stone.height1 + 'px';
			if (stone.z < 12000) stone.base.style.zIndex = Math.floor((10000 - stone.z)/10);
		}
	},

	_onMove: function(e) {
		this.mousePos = {
			x: e.clientX - this.offset.x,
			y: e.clientY - this.offset.y
		};
		if (this.mousePos.x > this.width) this.mousePos.x = this.width;
		if (this.mousePos.y > this.height) this.mousePos.y = this.height;
		this.eyePos.x = (this.mousePos.x - this.width/2)/this.width * 1000;
		this.eyePos.y = (this.mousePos.y - this.height/2)/this.height * 1000;

		this.showShip();
	},
	
	showShip: function(pos) {
		if (!this.ship) {
			this.ship = {
				base: document.createElement("div")
			}
			this.ship.base.className = "shooterStarshipBase";
			this.canvas.appendChild(this.ship.base);
		}
		this.ship.base.style.left = this.mousePos.x + - this.eyePos.w + 'px';
		this.ship.base.style.top = this.mousePos.y + - this.eyePos.h + 'px';
	},
	
	imageMap: ["circle.gif","base.gif", "plus.gif", "endnode.gif", "endnode.gif", "nodeBackgroundSel.gif", "nodeBackgroundSel.gif", "auraRed.png", "auraYellow.png", "startnode.gif"],
	planets: [{x: -60000, y: -40000, z: 20000, width: 50000, height: 50000, kind: 9},
			  {x: -23000, y: -23000, z: 16000, width: 6000, height: 6000, kind: 9},
			  {x: -24500, y: -3500, z: 15000, width: 5000, height: 5000, kind: 9},
			  {x: -3200, y: -11500, z: 13000, width: 3000, height: 3000, kind: 9},
			  {x: 18000, y: 4000, z: 12000, width: 4000, height: 4000, kind: 9}]
	
});
