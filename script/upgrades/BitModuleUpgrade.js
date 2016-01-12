function BitModuleUpgrade(powarmor)
{
	this.id = 'upgradebitmodule_' + powarmor.id;
	this.listeners = new Array();
	this.powarmor = powarmor;
	this.img = powarmor.game.textures.upgrade_bit_module_top.getPath();
	this.width = powarmor.game.textures.upgrade_bit_module_top.getWidth();
	this.height = powarmor.game.textures.upgrade_bit_module_top.getHeight();
	this.top = powarmor.top + (powarmor.height / 2) - ((this.height / 2));
	this.left = powarmor.left + (powarmor.width / 2) - ((this.width / 2));
	
	this.launch(this.id);
	this.printUpgrade(this.id);
}

/* ----- Getters ----- */
BitModuleUpgrade.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
BitModuleUpgrade.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

BitModuleUpgrade.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

BitModuleUpgrade.prototype.fire = function(event)
{
	event.dispatchEvent();
}

BitModuleUpgrade.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunch', this));
	this.powarmor.game.stats.spawnedUpgrade++;
}

BitModuleUpgrade.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
}

BitModuleUpgrade.prototype.onPickup = function()
{
	this.fire(new Event('onpickup', this));
	this.powarmor.game.stats.pickedBitModuleUpgrade++;
}

BitModuleUpgrade.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
BitModuleUpgrade.prototype.launch = function(id)
{
	this.onLaunch();
	this.powarmor.game.scheduler.addTask(id, this.anim, new Array(this, id, this.powarmor.game.scheduler));
}

BitModuleUpgrade.prototype.pickup = function()
{
	this.onPickup();
	this.destroy();
	var ship = this.powarmor.game.ship;
	if (ship.bitModule == 0)
	{
		ship.bitModule = 1;
		ship.bitModules.set('top', new BitModule(ship, 'top'));
	}
	else if (ship.bitModule == 1)
	{
		ship.bitModule = 2;
		ship.bitModules.set('bottom', new BitModule(ship, 'bottom'));
	}
}

BitModuleUpgrade.prototype.destroy = function()
{
	this.powarmor.game.scheduler.removeTask(this.id);
	
	this.onDestroyed();
	var s = document.getElementById(this.id);
	s.parentNode.removeChild(s);
}

/* ----- Animation ----- */
BitModuleUpgrade.prototype.anim = function(params)
{
	var upgrade = params[0];
	var id = params[1];
	var scheduler = params[2];
	if (upgrade.left < -10)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
	}
	else
	{
		upgrade.left -= 0.75;
		upgrade.printUpgrade(upgrade.id);
		
		if (!upgrade.powarmor.game.ship.isDead && upgrade.getHitbox().isHovering(upgrade.powarmor.game.ship.getHitbox()))
		{
			upgrade.pickup();
		}
	}
}

/* ----- Printers ----- */
BitModuleUpgrade.prototype.printUpgrade = function(id)
{
	var texloc = this.powarmor.game.textures.texturesLocation;
	
	var theUpgrade = document.querySelectorAll('img[id="' + id + '"]');
	if (theUpgrade.length == 0)
	{
		var upgrade = document.createElement('img');
		upgrade.id = id;
		upgrade.className = 'upgrade';
		upgrade.src = texloc + this.img;
		upgrade.alt = 'upgrade';
		upgrade.style.width = this.width + 'px';
		upgrade.style.height = this.height + 'px';
		upgrade.style.top = this.top + 'px';
		upgrade.style.left = this.left + 'px';

		document.getElementsByTagName('body')[0].appendChild(upgrade);
	}
	else
	{
		theUpgrade[0].style.left = this.left + 'px';
	}
}