function SpeedUpgrade(powarmor)
{
	this.id = 'upgradespeed_' + powarmor.id;
	this.listeners = new Array();
	this.powarmor = powarmor;
	this.top = powarmor.getHitbox().boxOrigin.getY();
	this.left = powarmor.getHitbox().boxOrigin.getX();
	this.img = powarmor.game.textures.upgrade_speed.getPath();
	this.width = powarmor.game.textures.upgrade_speed.getWidth();
	this.height = powarmor.game.textures.upgrade_speed.getHeight();
	
	this.launch(this.id);
	this.printUpgrade(this.id);
}

/* ----- Getters ----- */
SpeedUpgrade.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
SpeedUpgrade.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

SpeedUpgrade.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

SpeedUpgrade.prototype.fire = function(event)
{
	event.dispatchEvent();
}

SpeedUpgrade.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunch', this));
	this.powarmor.game.stats.spawnedUpgrade++;
}

SpeedUpgrade.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
}

SpeedUpgrade.prototype.onPickup = function()
{
	this.fire(new Event('onpickup', this));
	this.powarmor.game.stats.pickedSpeedUpgrade++;
}

SpeedUpgrade.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
SpeedUpgrade.prototype.launch = function(id)
{
	this.onLaunch();
	this.powarmor.game.scheduler.addTask(id, this.anim, new Array(this, id, this.powarmor.game.scheduler));
}

SpeedUpgrade.prototype.pickup = function()
{
	this.onPickup();
	this.destroy();
	var ship = this.powarmor.game.ship;
	if (ship.speed < 4)
		ship.speed = ship.speed + 0.5;
}

SpeedUpgrade.prototype.destroy = function()
{
	this.powarmor.game.scheduler.removeTask(this.id);
	
	this.onDestroyed();
	var s = document.getElementById(this.id);
	s.parentNode.removeChild(s);
}

/* ----- Animation ----- */
SpeedUpgrade.prototype.anim = function(params)
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
SpeedUpgrade.prototype.printUpgrade = function(id)
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