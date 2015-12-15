function Shot(ship, id)
{
	this.listeners = new Array();
	this.ship = ship;
	this.id = id;
	this.shooter = new Point(ship.left, ship.top + (ship.height / 2));
	this.target = new Point(ship.game.ship.left + (ship.width / 2), ship.game.ship.top + (ship.height / 2));
	this.img = ship.game.textures.projectile_shot.getPath();
	this.width = ship.game.textures.projectile_shot.getWidth();
	this.height = ship.game.textures.projectile_shot.getHeight();
	this.top = this.shooter.getY();
	if (ship.game.ship.left - ship.left > 0)
	{
		this.sign = -1;
		this.left = this.shooter.getX();
	}
	else
	{
		this.sign = 1;
		this.left = this.shooter.getX() + this.width;
	}
	this.coef = (this.shooter.getY() - this.target.getY()) / (this.shooter.getX() - this.target.getX());
	this.staticTop = this.shooter.getY();
	this.launch(id);
	this.printBullet(id);
}

/* ----- Getters ----- */
Shot.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
Shot.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Shot.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Shot.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Shot.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
}

Shot.prototype.onAbsorbed = function()
{
	this.fire(new Event('onabsorbed', this));
	this.ship.game.stats.moduleAbsorbedShot++;
}

/* ----- Actions ----- */
Shot.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

Shot.prototype.destroy = function()
{
	this.ship.game.scheduler.removeTask(this.id);
	this.ship.registeredBullets.delete(this.id);
	
	var projectileNode = document.getElementById(this.id);
	projectileNode.parentNode.removeChild(projectileNode);
}

/* ----- Animation ----- */
Shot.prototype.anim = function(params)
{
	var projectile = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (projectile.left < -projectile.width || projectile.left > window.innerWidth + projectile.width)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
	}
	else
	{
		projectile.left -= projectile.sign * 3;
		projectile.top = (projectile.staticTop - 2 * projectile.coef) - (projectile.ship.game.ship.getHitbox().getHeight() / 2);
		projectile.staticTop -= 2 * projectile.coef;
		projectile.printBullet(id);
		
		var gameShip = projectile.ship.game.ship;
		var module = gameShip.module;
		
		if (module != null && !gameShip.isDead && projectile.getHitbox().isHovering(module.getHitbox()))
		{
			projectile.onAbsorbed();
			projectile.destroy();
		}
		else if (!gameShip.isDead && projectile.getHitbox().isHovering(gameShip.getHitbox()))
		{
			projectile.destroy();
			gameShip.destroy();
		}
	}
}

/* ----- Printers ----- */
Shot.prototype.printBullet = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theProjectile = document.querySelectorAll('img[id="' + id + '"]');
	if (theProjectile.length == 0)
	{
		var projectile = document.createElement('img');
		projectile.id = id;
		projectile.className = 'ennemyShot';
		projectile.src = texloc + this.img;
		projectile.alt = 'ennemyShot';
		projectile.style.width = this.width + 'px';
		projectile.style.height = this.height + 'px';
		projectile.style.top = this.top + 'px';
		projectile.style.left = this.left + 'px';
		
		document.getElementsByTagName('body')[0].appendChild(projectile);
	}
	else
	{
		theProjectile[0].style.width = this.width + 'px';
		theProjectile[0].style.height = this.height + 'px';
		theProjectile[0].style.top = this.top + 'px';
		theProjectile[0].style.left = this.left + 'px';
	}
}