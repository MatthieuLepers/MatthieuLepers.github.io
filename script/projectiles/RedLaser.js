function RedLaser(ship, id)
{
	this.listeners = new Array();
	this.ship = ship;
	this.id = id;
	this.speed = 6;
	this.shooter = new Point(ship.getHitbox().boxOrigin.getX(), ship.getHitbox().boxOrigin.getY() + (ship.getHitbox().getHeight() / 2));
	this.img = ship.game.textures.projectile_red_laser.getPath();
	this.width = ship.game.textures.projectile_red_laser.getWidth();
	this.height = ship.game.textures.projectile_red_laser.getHeight();
	this.top = this.shooter.getY();
	this.left = this.shooter.getX();
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
RedLaser.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
RedLaser.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

RedLaser.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

RedLaser.prototype.fire = function(event)
{
	event.dispatchEvent();
}

RedLaser.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
}

/* ----- Actions ----- */
RedLaser.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

RedLaser.prototype.destroy = function()
{
	this.ship.game.scheduler.removeTask(this.id);
	this.ship.registeredBullets.delete(this.id);
	
	var laserNode = document.getElementById(this.id);
	laserNode.parentNode.removeChild(LaserNode);
}

/* ----- Animation ----- */
RedLaser.prototype.anim = function(params)
{
	var laser = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (laser.left < -50)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
	}
	else
	{
		laser.left -= laser.speed;
		laser.printBullet(id);
		
		var gameShip = laser.ship.game.ship;
		
		if (!gameShip.isDead && laser.getHitbox().isHovering(gameShip.getHitbox()))
		{
			gameShip.destroy();
		}
	}
}

/* ----- Printers ----- */
RedLaser.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theLaser = document.querySelectorAll('img[id="' + id + '"]');
	if (theLaser.length == 0)
	{
		var laser = document.createElement('img');
		laser.id = id;
		laser.className = 'redlaser';
		laser.src = texloc + this.img;
		laser.alt = 'redlaser';
		laser.style.width = this.width + 'px';
		laser.style.height = this.height + 'px';
		laser.style.top = this.top + 'px';
		laser.style.left = this.left + 'px';
		
		document.getElementsByTagName('body')[0].appendChild(laser);
	}
	else
	{
		theLaser[0].style.width = this.width + 'px';
		theLaser[0].style.height = this.height + 'px';
		theLaser[0].style.top = this.top + 'px';
		theLaser[0].style.left = this.left + 'px';
	}
}