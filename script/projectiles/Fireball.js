function Fireball(ship, id, direction)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.speed = 4;
	this.direction = direction;
	if (this.ship.module.tier >= 1)
	{
		this.img = this.ship.game.textures.fireball.getPath();
		this.width = this.ship.game.textures.fireball.getWidth();
		this.height = this.ship.game.textures.fireball.getHeight();
	}
	this.top = ship.top + (ship.height / 2) + (this.height / 2);
	
	if (ship.module.position == 'front')
	{
		this.left = ship.left + ship.width + (this.width / 2);
	}
	else if (ship.module.position == 'back')
	{
		this.left = ship.left - (this.width / 2);
	}
	
	this.damages = 3;
	
	this.launch(this.id);
	this.printBullet(this.id);
}

/* ----- Getters ----- */
Fireball.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
Fireball.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Fireball.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Fireball.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Fireball.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.fireballShots++;
}

Fireball.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.ship.game.stats.fireballShotHits++;
}

/* ----- Actions ----- */
Fireball.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

Fireball.prototype.destroy = function()
{
	this.onDestroyed();
	this.ship.game.scheduler.removeTask(this.id);
	//this.ship.getRegisteredBullets().delete(this.id);
	
	var s = document.getElementById(this.id);
	this.img = this.ship.game.textures.fireball_explosion.getPath();
	this.width = this.ship.game.textures.fireball_explosion.getWidth();
	this.height = this.ship.game.textures.fireball_explosion.getHeight();
	this.printBullet(this.id);
	
	var f = function(s)
	{
		window.clearTimeout(timerX);
		if (s != null)
			s.parentNode.removeChild(s);
	};
	
	var timerX = window.setTimeout(f, 600, s);
}

/* ----- Animation ----- */
Fireball.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.top < -32 || bullet.top > window.innerHeight + 32)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
		bullet.ship.game.stats.fireballShotFails++;
	}
	else
	{
		var sign = 0;
		
		if (bullet.direction == 'up')
			sign = -1;
		else
			sign = 1;
		
		bullet.top += sign * bullet.speed;
		bullet.printBullet(id);
		
		for (var i of bullet.ship.game.registeredEnnemies.keys())
		{
			var ennemy = bullet.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && bullet.getHitbox().isHovering(ennemy.getHitbox()))
			{
				bullet.destroy();
				ennemy.damage(bullet.damages);
			}
		}
	}
}

/* ----- Printers ----- */
Fireball.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theBullet = document.querySelectorAll('img[id="' + id + '"]');
	if (theBullet.length == 0)
	{
		var bullet = document.createElement('img');
		bullet.id = id;
		bullet.className = 'bullet fire';
		bullet.src = texloc + this.img
		bullet.alt = 'bullet';
		bullet.style.width = this.width + 'px';
		bullet.style.height = this.height + 'px';
		bullet.style.top = this.top + 'px';
		bullet.style.left = this.left + 'px';
		
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