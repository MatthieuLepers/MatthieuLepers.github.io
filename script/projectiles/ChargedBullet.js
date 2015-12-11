function ChargedBullet(ship, id, scheduler, img, width, height, speed)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.speed = speed;
	this.img = img;
	this.width = width;
	this.height = height;
	this.top = ship.getHitbox().boxOrigin.getY() + 6;
	this.left = ship.getHitbox().boxOrigin.getX() + ship.getHitbox().getWidth() + 5;
	this.hasHit = false;
	
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
ChargedBullet.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
ChargedBullet.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

ChargedBullet.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

ChargedBullet.prototype.fire = function(event)
{
	event.dispatchEvent();
}

ChargedBullet.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.chargedShots++;
}

/* ----- Actions ----- */
ChargedBullet.prototype.launch = function(id)
{
	this.onLaunch();
	var percent = parseInt(this.img.substr(13));
	this.ship.game.removePoints(20 + percent);
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

/* ----- Animation ----- */
ChargedBullet.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.left >= window.innerWidth + 100)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
		if (!this.hasHit)
			this.ship.game.stats.chargedShotFails++;
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
				ennemy.destroy();
				this.ship.game.stats.chargedShotHits++;
				this.hasHit = true;
			}
		}
	}
}

/* ----- Printers ----- */
ChargedBullet.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theBullet = document.querySelectorAll('img[id="' + id + '"]');
	if (theBullet.length == 0)
	{
		var bullet = document.createElement('img');
		bullet.id = id;
		bullet.className = 'chargedbullet';
		bullet.src = texloc + this.img;
		bullet.alt = 'chargedbullet';
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
	}
}