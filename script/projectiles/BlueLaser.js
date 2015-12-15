function BlueLaser(ship, id, angle, sign)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.speed = 6.5;
	this.angle = angle;
	this.sign = sign;
	this.hasHit = false;
	if (this.ship.module.tier == 1)
	{
		this.img = this.ship.game.textures.blue_laser_1.getPath();
		this.width = this.ship.game.textures.blue_laser_1.getWidth();
		this.height = this.ship.game.textures.blue_laser_1.getHeight();
	}
	else if (this.ship.module.tier == 2)
	{
		this.img = this.ship.game.textures.blue_laser_2.getPath();
		this.width = this.ship.game.textures.blue_laser_2.getWidth();
		this.height = this.ship.game.textures.blue_laser_2.getHeight();
	}
	if (this.sign < 0)
	{
		if (angle == -45)
		{
			this.top = ship.top - (this.width / 2) + 8;
			this.left = ship.left - (this.width / 2) + 34;
		}
		else if (angle == 45)
		{
			this.top = ship.top + (this.width / 2) + 8;
			this.left = ship.left - (this.width / 2) + 34;
		}
		else
		{
			this.top = ship.top + 8;
			this.left = ship.left - 4;
		}
		this.angle += 180;
	}
	else
	{
		if (angle == -45)
		{
			this.top = ship.top + 53;
			this.left = ship.left + ship.width - this.width + 34;
		}
		else if (angle == 45)
		{
			this.top = ship.top - 38;
			this.left = ship.left + ship.width - this.width  + 34;
		}
		else
		{
			this.top = ship.top + 8;
			this.left = ship.left + ship.width - this.width - 14;
		}
	}
	
	this.damages = 1;
	
	this.launch(this.id);
	this.printBullet(this.id);
	
	var f = function(laser)
	{
		window.clearTimeout(timerX);
		laser.img = laser.ship.game.textures.blue_laser_2_idle.getPath();
		laser.printBullet(laser.id);
	}
	
	var timerX = window.setTimeout(f, 355, this);
}

/* ----- Getters ----- */
BlueLaser.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
BlueLaser.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

BlueLaser.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

BlueLaser.prototype.fire = function(event)
{
	event.dispatchEvent();
}

BlueLaser.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.bluelaserShots++;
}

BlueLaser.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.ship.game.stats.bluelaserShotHits++;
}

/* ----- Actions ----- */
BlueLaser.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

BlueLaser.prototype.destroy = function()
{
	this.onDestroyed();
	this.ship.game.scheduler.removeTask(this.id);
	//this.ship.getRegisteredBullets().delete(this.id);
	
	var bulletNode = document.getElementById(this.id);
	if (bulletNode != null)
		bulletNode.parentNode.removeChild(bulletNode);
}

/* ----- Animation ----- */
BlueLaser.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.left > window.innerWidth + bullet.width + 10 || bullet.top < -10 || bullet.top > window.innerHeight + 10 || bullet.left < -bullet.width + 10)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
		if (!bullet.hasHit)
			this.ship.game.stats.bluelaserFails++;
	}
	else
	{
		bullet.top += parseFloat(bullet.speed) * Math.sin((Math.PI * bullet.angle) / 180);
		bullet.left += parseFloat(bullet.speed) * Math.cos((Math.PI * bullet.angle) / 180);
		bullet.printBullet(id);
		
		for (var i of bullet.ship.game.registeredEnnemies.keys())
		{
			var ennemy = bullet.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && bullet.getHitbox().isHovering(ennemy.getHitbox()))
			{
				ennemy.damage(bullet.damages);
			}
		}
	}
}

/* ----- Printers ----- */
BlueLaser.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theBullet = document.querySelectorAll('img[id="' + id + '"]');
	if (theBullet.length == 0)
	{
		var bullet = document.createElement('img');
		bullet.id = id;
		bullet.className = 'bullet laser';
		bullet.src = texloc + this.img
		bullet.alt = 'bullet';
		bullet.style.width = this.width + 'px';
		bullet.style.height = this.height + 'px';
		bullet.style.top = this.top + 'px';
		bullet.style.left = this.left + 'px';
		if (this.angle != 0)
			bullet.style.transform = 'rotate(' + this.angle + 'deg)';
		
		document.getElementsByTagName('body')[0].appendChild(bullet);
	}
	else
	{
		theBullet[0].style.width = this.width + 'px';
		theBullet[0].style.height = this.height + 'px';
		theBullet[0].style.top = this.top + 'px';
		theBullet[0].style.left = this.left + 'px';
		if (!theBullet[0].src.contains(texloc + this.img))
			theBullet[0].src = texloc + this.img;
	}
}