function BitModule(ship, position)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = 'module' + position;
	this.left = ship.left + 6;
	if (position == 'top')
	{
		this.top = ship.top - 36;
		this.img = ship.game.textures.upgrade_bit_module_top.getPath();
		this.width = ship.game.textures.upgrade_bit_module_top.getWidth();
		this.height = ship.game.textures.upgrade_bit_module_top.getHeight();
	}
	else
	{
		this.top = ship.top + 36;
		this.img = ship.game.textures.upgrade_bit_module_bottom.getPath();
		this.width = ship.game.textures.upgrade_bit_module_bottom.getWidth();
		this.height = ship.game.textures.upgrade_bit_module_bottom.getHeight();
	}
	this.position = position;
	this.registeredBullets = new Map();
	
	this.launch(this.id);
	this.printBitModule(this.id);
}

/* ----- Getters ----- */
BitModule.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
BitModule.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

BitModule.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

BitModule.prototype.fire = function(event)
{
	event.dispatchEvent();
}

BitModule.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunch', this));
}

BitModule.prototype.onShoot = function()
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	this.fire(new Event('onshoot', this));
	this.ship.game.stats.bitModuleShots++;
	
	var anim = document.createElement('img');
	anim.src = texloc + this.ship.game.textures.bit_module_shoot_bullet.getPath();
	anim.style.width = this.ship.game.textures.bit_module_shoot_bullet.getWidth() + 'px';
	anim.style.height = this.ship.game.textures.bit_module_shoot_bullet.getHeight() + 'px';
	anim.alt = 'bitmoduleanim';
	anim.className = 'bitmoduleanim';
	if (this.ship.module != null && this.ship.module.position == 'front')
	{
		anim.style.left = '8px';
	}
	else if (this.ship.module != null && this.ship.module.position == 'back')
	{
		anim.style.left = '-8px';
	}
	
	document.getElementById(this.id).parentNode.appendChild(anim);
	
	var f = function()
	{
		window.clearTimeout(timerX);
		var tab = document.getElementsByClassName('bitmoduleanim');
		for (var i = 0; i < tab.length; i++)
		{
			tab[i].parentNode.removeChild(tab[i]);
		}
	};
	
	var timerX = window.setTimeout(f, 900);
}

BitModule.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
BitModule.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

BitModule.prototype.shoot = function()
{
	if (this.ship.module != null)
	{
		if (this.ship.module.position == 'front' && this.ship.module.tier >= 1 && this.ship.module.type == 'dna')
		{
			this.onShoot();
			if (this.position == 'top')
			{
				var DANRed = new DnaRedBullet(this.ship, 'bitmoduleredshot' + this.registeredBullets.size, 1);
				this.registeredBullets.set(DANRed.id, DANRed);
			}
			else
			{
				var DANblue = new DnaBlueBullet(this.ship, 'bitmoduleblueshot' + this.registeredBullets.size, 1);
				this.registeredBullets.set(DANblue.id, DANblue);
			}
		}
		else if (this.ship.module.position == 'back' && this.ship.module.tier >= 1 && this.ship.module.type == 'dna')
		{
			this.onShoot();
			if (this.position == 'top')
			{
				var DANRed = new DnaRedBullet(this.ship, 'bitmoduleredshot' + this.registeredBullets.size, -1);
				this.registeredBullets.set(DANRed.id, DANRed);
			}
			else
			{
				var DANblue = new DnaBlueBullet(this.ship, 'bitmoduleblueshot' + this.registeredBullets.size, -1);
				this.registeredBullets.set(DANblue.id, DANblue);
			}
		}
	}
}

/* ----- Animation ----- */
BitModule.prototype.anim = function(params)
{
	var bitmodule = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bitmodule.position == 'top')
	{
		bitmodule.top = bitmodule.ship.top - 36;
	}
	else
	{
		bitmodule.top = bitmodule.ship.top + 36;
	}
	bitmodule.left = bitmodule.ship.left + 6;
	
	for (var i of bitmodule.ship.game.registeredEnnemies.keys())
	{
		var ennemy = bitmodule.ship.game.registeredEnnemies.get(i);
		if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && bitmodule.getHitbox().isHovering(ennemy.getHitbox()))
		{
			ennemy.destroy();
		}
	}
	
	bitmodule.printBitModule(bitmodule.id);
}

/* ----- Printers ----- */
BitModule.prototype.printBitModule = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theBitModule = document.querySelectorAll('img[id="' + id + '"]');
	if (theBitModule.length == 0)
	{
		var bitmodule = document.createElement('img');
		bitmodule.id = id;
		bitmodule.src = texloc + this.img;
		bitmodule.alt = 'bitmodule';
		bitmodule.style.width = this.width + 'px';
		bitmodule.style.height = this.height + 'px';
		bitmodule.style.top = this.top + 'px';
		bitmodule.style.left = this.left + 'px';
		if (!this.ship.isDead)
			document.querySelectorAll('div.bitmodule.' + this.position.toLowerCase())[0].appendChild(bitmodule);
	}
	else
	{
		theBitModule[0].style.top = this.top + 'px';
		theBitModule[0].style.left = this.left + 'px';
	}
}