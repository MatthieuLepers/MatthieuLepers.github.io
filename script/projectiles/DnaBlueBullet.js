function DnaBlueBullet(ship, id, sign)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.sign = sign;
	this.speed = sign * 8;
	this.damages = 3;
	this.lifePoints = 3;
	
	this.img = ship.game.textures.projectile_blue_dna_bullet.getPath();
	this.width = ship.game.textures.projectile_blue_dna_bullet.getWidth();
	this.height = ship.game.textures.projectile_blue_dna_bullet.getHeight();
	
	if (sign > 0)
	{
		if (this.id.contains('bitmoduleblueshot'))
		{
			this.top = ship.top + 16 + 28;
			this.left = ship.left + 14;
		}
		else
		{
			this.top = ship.top + 16;
			this.left = ship.left + ship.width + 5;
		}
		this.className = '';
	}
	else
	{
		if (this.id.contains('bitmoduleblueshot'))
		{
			this.top = ship.top + 16 + 28;
			this.left = ship.left + 14 - this.width;
		}
		else
		{
			this.top = ship.top + 16;
			this.left = ship.left - ship.width;
		}
		this.className = 'flip';
	}
	
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
DnaBlueBullet.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
DnaBlueBullet.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

DnaBlueBullet.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

DnaBlueBullet.prototype.fire = function(event)
{
	event.dispatchEvent();
}

DnaBlueBullet.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.dnaShots++;
}

/* ----- Actions ----- */
DnaBlueBullet.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

DnaBlueBullet.prototype.damage = function(damage)
{
	this.lifePoints -= damage;
	if (this.lifePoints <= 0)
		this.destroy();
}

DnaBlueBullet.prototype.destroy = function()
{
	this.ship.game.scheduler.removeTask(this.id);
	
	var bulletNode = document.getElementById(this.id);
	if (bulletNode != null)
		bulletNode.parentNode.removeChild(bulletNode);
}

/* ----- Animation ----- */
DnaBlueBullet.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (this.sign > 0)
	{
		if (bullet.left > window.innerWidth + 10)
		{
			scheduler.removeTask(id);
			var b = document.getElementById(""+id);
			b.parentNode.removeChild(b);
			this.ship.game.stats.dnaShotFails++;
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
					bullet.damage(ennemy.lifePoints);
					ennemy.damage(bullet.damages);
					this.ship.game.stats.dnaShotHits++;
				}
			}
		}
	}
	else
	{
		if (bullet.left < -50)
		{
			scheduler.removeTask(id);
			var b = document.getElementById(""+id);
			b.parentNode.removeChild(b);
			this.ship.game.stats.dnaShotFails++;
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
					bullet.damage(ennemy.lifePoints);
					ennemy.damage(bullet.damages);
					this.ship.game.stats.dnaShotHits++;
				}
			}
		}
	}
}

/* ----- Printers ----- */
DnaBlueBullet.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theBullet = document.querySelectorAll('img[id="' + id + '"]');
	if (theBullet.length == 0)
	{
		var bullet = document.createElement('img');
		bullet.id = id;
		bullet.className = 'bullet' + ' ' + this.className;
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
	}
}