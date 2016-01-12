function DnaBeam(ship, id)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = id;
	this.damages = 5;
	this.hasHit = false;
	
	this.img = ship.game.textures.dna_bullet_part1.getPath();
	this.width = ship.game.textures.dna_bullet_part1.getWidth();
	this.height = ship.game.textures.dna_bullet_part1.getHeight();
	this.top = ship.top - 18;
	
	this.cpt = 0;
	
	if (ship.module.position == 'front')
	{
		this.className = '';
		this.sign = 1;
		this.left = ship.left + 36;
	}
	else if (ship.module.position == 'back')
	{
		this.className = 'flip';
		this.sign = -1;
		this.left = ship.left - 128;
	}
	
	this.speed = 0;
	
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
DnaBeam.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
DnaBeam.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

DnaBeam.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

DnaBeam.prototype.fire = function(event)
{
	event.dispatchEvent();
}

DnaBeam.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.dnaBeamShot++;
}

/* ----- Actions ----- */
DnaBeam.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.start, new Array(this, id, this.ship.game.scheduler));
}

DnaBeam.prototype.damage = function(damage)
{
	this.lifePoints -= damage;
	if (this.lifePoints <= 0)
		this.destroy();
}

DnaBeam.prototype.destroy = function()
{
	this.ship.game.scheduler.removeTask(this.id);
	
	var bulletNode = document.getElementById(this.id);
	if (bulletNode != null)
		bulletNode.parentNode.removeChild(bulletNode);
}

/* ----- Animation ----- */
DnaBeam.prototype.start = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.cpt == 37)
	{
		bullet.speed = bullet.sign * 8;
		bullet.cpt = 0;
		bullet.top = bullet.ship.top - 6;
		if (bullet.sign > 0)
			bullet.left = bullet.ship.left + 101.5;
		else
			bullet.left = bullet.ship.left - 135.5;
		bullet.img = bullet.ship.game.textures.dna_bullet_part2.getPath();
		bullet.width = bullet.ship.game.textures.dna_bullet_part2.getWidth();
		bullet.height = bullet.ship.game.textures.dna_bullet_part2.getHeight();
		scheduler.removeTask(id);
		scheduler.addTask(id, bullet.anim, new Array(bullet, id, scheduler))
	}
	else
	{
		bullet.top = bullet.ship.top - 18;
		bullet.cpt++;
		
		for (var i of bullet.ship.game.registeredEnnemies.keys())
		{
			var ennemy = bullet.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && bullet.getHitbox().isHovering(ennemy.getHitbox()))
			{
				ennemy.damage(bullet.damages);
				this.ship.game.stats.dnaBeamHits++;
			}
		}
	}
	
	bullet.printBullet(id);
}

DnaBeam.prototype.anim = function(params)
{
	var bullet = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (bullet.sign < 0)
	{
		if (bullet.left < -bullet.width || bullet.left > window.innerWidth + bullet.width)
		{
			scheduler.removeTask(id);
			var b = document.getElementById(""+id);
			b.parentNode.removeChild(b);
			if (!this.hasHit)
				this.ship.game.stats.dnaBeamShotFails++;
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
					ennemy.damage(bullet.damages);
					this.ship.game.stats.dnaBeamShotHits++;
					this.hasHit = true;
				}
			}
		}
	}
	else
	{
		if (bullet.left > window.innerWidth + 10)
		{
			scheduler.removeTask(id);
			var b = document.getElementById(""+id);
			b.parentNode.removeChild(b);
			if (!this.hasHit)
				this.ship.game.stats.dnaBeamShotFails++;
		}
		else
		{
			bullet.left += bullet.speed;
			bullet.printBullet(id);
			
			for (var i of bullet.ship.game.registeredEnnemies.keys())
			{
				var ennemy = bullet.ship.game.registeredEnnemies.get(i);
				if (ennemy != null && !ennemy.isDead && bullet.getHitbox().isHovering(ennemy.getHitbox()))
				{
					bullet.damage(ennemy.lifePoints);
					ennemy.damage(bullet.damages);
					this.ship.game.stats.dnaBeamShotHits++;
					this.hasHit = true;
				}
			}
		}
	}
}

/* ----- Printers ----- */
DnaBeam.prototype.printBullet = function(id)
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
		if (!theBullet[0].src.contains(texloc + this.img))
			theBullet[0].src = texloc + this.img;
		theBullet[0].style.width = this.width + 'px';
		theBullet[0].style.height = this.height + 'px';
		theBullet[0].style.top = this.top + 'px';
		theBullet[0].style.left = this.left + 'px';
	}
}