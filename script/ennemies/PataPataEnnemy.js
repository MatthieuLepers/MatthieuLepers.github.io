function PataPataEnnemy(game, id)
{
	this.listeners = new Array();
	this.id = id;
	this.speed = 1;
	this.top = 100 + (Math.random() * (parseInt(window.innerHeight) - 250));
	this.left = window.innerWidth + 50;
	this.isDead = false;
	this.game = game;
	this.registeredBullets = new Map();
	this.staticTop = this.top;
	this.staticDeg = 0.1;
	this.img = game.textures.patapata.getPath();
	this.width = game.textures.patapata.getWidth();
	this.height = game.textures.patapata.getHeight();
	this.lifePoints = 1;
	
	this.points = 100;
	
	this.launch(id);
	this.printEnnemy(id);
}

/* ----- Getters ----- */
PataPataEnnemy.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
PataPataEnnemy.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

PataPataEnnemy.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

PataPataEnnemy.prototype.fire = function(event)
{
	event.dispatchEvent();
}

PataPataEnnemy.prototype.onShoot = function()
{
	this.fire(new Event('onshoot', this));
}

PataPataEnnemy.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.game.stats.killedPataPata++;
}

PataPataEnnemy.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
}

/* ----- Actions ----- */
PataPataEnnemy.prototype.launch = function(id)
{
	this.onLaunch();
	this.game.scheduler.addTask(id, this.anim, new Array(this, id, this.game.scheduler));
}

PataPataEnnemy.prototype.shoot = function()
{
	var d = this.getHitbox().left - this.game.ship.left;
	var distance = this.top - this.game.ship.top;
	var p = Math.random() * 100;
	
	if (p > this.game.shootingProba && !this.game.ship.isDead && distance < 150 && distance > -150 && (d > 100 || d < -100))
	{
		this.onShoot();
		var projectile = new Shot(this, this.id + '_shot' + this.registeredBullets.size, this.game.scheduler);
		this.registeredBullets.set(projectile.id, projectile);
	}
}

PataPataEnnemy.prototype.damage = function(damage)
{
	this.lifePoints -= damage;
	if (this.lifePoints <= 0)
		this.destroy();
}

PataPataEnnemy.prototype.destroy = function()
{
	this.onDestroyed();
	this.game.scheduler.removeTask(this.id);
	this.game.addPoints(this.points);
	this.game.registeredEnnemies.set(this.id, null);
	
	var s = document.getElementById(this.id);
	
	this.img = this.game.textures.explosion.getPath();
	this.width = this.game.textures.explosion.getWidth();
	this.height = this.game.textures.explosion.getHeight();
	this.isDead = true;
	this.printEnnemy(this.id);
	
	var f = function(s)
	{
		window.clearTimeout(timerX);
		s.parentNode.removeChild(s);
	};
	
	var timerX = window.setTimeout(f, 1200, s);
}

/* ----- Animation ----- */
PataPataEnnemy.prototype.anim = function(params)
{
	var ennemy = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (ennemy.left < - 50)
	{
		scheduler.removeTask(id);
		ennemy.game.registeredEnnemies.set(id, null);
		var b = document.getElementById(id);
		b.parentNode.removeChild(b);
	}
	else
	{
		ennemy.top = ennemy.staticTop + Math.sin(ennemy.staticDeg) * 40;
		ennemy.staticDeg += 0.03;
		ennemy.left -= ennemy.speed;
		ennemy.printEnnemy(id);
		
		if (!ennemy.isDead)
		{
			ennemy.shoot();
		}
		
		if (!ennemy.isDead && !ennemy.game.ship.isDead && ennemy.getHitbox().isHovering(ennemy.game.ship.getHitbox()))
		{
			ennemy.destroy();
			ennemy.game.ship.destroy();
		}
		
		if (!ennemy.isDead && !ennemy.game.ship.isDead && ennemy.game.ship.module != null && ennemy.getHitbox().isHovering(ennemy.game.ship.module.getHitbox()))
		{
			ennemy.destroy();
		}
	}
}

/* ----- Printers ----- */
PataPataEnnemy.prototype.printEnnemy = function(id)
{
	var texloc = this.game.textures.texturesLocation;
	
	var theEnnemy = document.querySelectorAll('img[id="' + id + '"]');
	if (theEnnemy.length == 0)
	{
		var ennemy = document.createElement('img');
		ennemy.id = id;
		ennemy.className = 'ennemy';
		ennemy.src = texloc + this.img;
		ennemy.alt = 'patapata';
		ennemy.style.width = this.width + 'px';
		ennemy.style.height = this.height + 'px';
		ennemy.style.top = this.top + 'px';
		ennemy.style.left = this.left + 'px';
		
		document.getElementsByTagName('body')[0].appendChild(ennemy);
	}
	else
	{
		if (!theEnnemy[0].src.contains(texloc + this.img))
			theEnnemy[0].src = texloc + this.img;
		theEnnemy[0].style.width = this.width + 'px';
		theEnnemy[0].style.height = this.height + 'px';
		theEnnemy[0].style.top = this.top + 'px';
		theEnnemy[0].style.left = this.left + 'px';
	}
}