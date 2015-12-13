function Bullet(ship, id)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.speed = 6.5;
	this.img = ship.game.textures.ship_bullet.getPath();
	this.width = ship.game.textures.ship_bullet.getWidth();
	this.height = ship.game.textures.ship_bullet.getHeight();
	this.top = ship.getHitbox().boxOrigin.getY() + 6;
	this.left = ship.getHitbox().boxOrigin.getX() + ship.getHitbox().getWidth() + 5;
	this.damages = 1;
	
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
Bullet.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
Bullet.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Bullet.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Bullet.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Bullet.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.shipShots++;
}

Bullet.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.ship.game.stats.shipShotHits++;
}

/* ----- Actions ----- */
Bullet.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.removePoints(20);
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

Bullet.prototype.destroy = function()
{
	this.onDestroyed();
	this.ship.game.scheduler.removeTask(this.id);
	//this.ship.getRegisteredBullets().delete(this.id);
	
	var bulletNode = document.getElementById(this.id);
	if (bulletNode != null)
		bulletNode.parentNode.removeChild(bulletNode);
}

/* ----- Animation ----- */
Bullet.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.left > window.innerWidth + 10)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
		this.ship.game.stats.shipShotFails++;
	}
	else
	{
		bullet.left += bullet.speed;
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
Bullet.prototype.printBullet = function(id)
{
	var texloc = ship.game.textures.texturesLocation;
	
	var theBullet = document.querySelectorAll('img[id="' + id + '"]');
	if (theBullet.length == 0)
	{
		var bullet = document.createElement('img');
		bullet.id = id;
		bullet.className = 'bullet';
		bullet.src = texloc + this.img;
		bullet.alt = 'bullet';
		bullet.style.width = this.width + 'px';
		bullet.style.height = this.height + 'px';
		bullet.style.top = this.top + 'px';
		bullet.style.left = this.left + 'px';
		
		document.getElementsByTagName('body')[0].appendChild(bullet);
	}
	else
	{
		if (!theBullet[0].src.contains(texloc + this.img))
			theBullet[0].src = texloc + this.img;
		theBullet[0].style.width = this.width + 'px';
		theBullet[0].style.height = this.height + 'px';
		theBullet[0].style.top = this.top + 'px';
		theBullet[0].style.left = this.left + 'px';
	}
}