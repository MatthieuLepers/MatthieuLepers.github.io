function LaserUpgrade(powarmor)
{
	this.id = 'upgradelaser_' + powarmor.id;
	this.listeners = new Array();
	this.powarmor = powarmor;
	this.top = powarmor.getHitbox().boxOrigin.getY() + 7;
	this.left = powarmor.getHitbox().boxOrigin.getX() + 6;
	this.img = powarmor.game.textures.upgrade_laser.getPath();
	this.width = powarmor.game.textures.upgrade_laser.getPath();
	this.height = powarmor.game.textures.upgrade_laser.getPath();
	
	this.launch(this.id);
	this.printUpgrade(this.id);
}

/* ----- Getters ----- */
LaserUpgrade.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
LaserUpgrade.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

LaserUpgrade.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

LaserUpgrade.prototype.fire = function(event)
{
	event.dispatchEvent();
}

LaserUpgrade.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunch', this));
	this.powarmor.game.stats.spawnedUpgrade++;
}

LaserUpgrade.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
}

LaserUpgrade.prototype.onPickup = function()
{
	this.fire(new Event('onpickup', this));
	this.powarmor.game.stats.pickedLaserUpgrade++;
}

LaserUpgrade.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
LaserUpgrade.prototype.launch = function(id)
{
	this.onLaunch();
	this.powarmor.game.scheduler.addTask(id, this.anim, new Array(this, id, this.powarmor.game.scheduler));
}

LaserUpgrade.prototype.pickup = function()
{
	this.destroy();
	var ship = this.powarmor.game.ship;
	
	if (ship.module == null)
		ship.game.spawnModule();
	else if (ship.module != null)
	{
		ship.module.type = 'laser';
		ship.module.updateTier();
	}
}


LaserUpgrade.prototype.destroy = function()
{
	this.powarmor.game.scheduler.removeTask(this.id);
	
	this.onDestroyed();
	var s = document.getElementById(this.id);
	s.parentNode.removeChild(s);
}

/* ----- Animation ----- */
LaserUpgrade.prototype.anim = function(params)
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
LaserUpgrade.prototype.printUpgrade = function(id)
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