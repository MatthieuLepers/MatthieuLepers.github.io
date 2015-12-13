function MidEnnemy(game, id)
{
	this.listeners = new Array();
	this.id = id;
	this.speed = 1.1;
	this.top =  120 + (Math.random() * (parseInt(window.innerHeight) - 240));
	this.left = parseInt(window.innerWidth) + 50;
	this.isDead = false;
	this.game = game;
	this.registeredBullets = new Map();
	this.img = game.textures.mid.getPath();
	this.width = game.textures.mid.getWidth();
	this.height = game.textures.mid.getHeight();
	this.lifePoints = 1;
	
	this.points = 50;
	
	this.launch(id);
	this.printEnnemy(id);
}

/* ----- Getters ----- */
MidEnnemy.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
MidEnnemy.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

MidEnnemy.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

MidEnnemy.prototype.fire = function(event)
{
	event.dispatchEvent();
}

MidEnnemy.prototype.onMove = function()
{
	this.fire(new Event('onmove', this));
}

MidEnnemy.prototype.onShoot = function()
{
	this.fire(new Event('onshoot', this));
}

MidEnnemy.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.game.stats.killedMid++;
}

MidEnnemy.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
}

/* ----- Actions ----- */
MidEnnemy.prototype.launch = function(id)
{
	this.onLaunch();
	this.game.scheduler.addTask(id, this.anim, new Array(this, id, this.game.scheduler));
}

MidEnnemy.prototype.shoot = function()
{
	var distance = window.innerWidth - this.getHitbox().getOrigin().getX();
	var p = Math.random() * 100;
	
	if (p > this.game.shootingProba - 0.5 && !this.game.ship.isDead && distance >= 120)
	{
		this.onShoot();
		var laser = new RedLaser(this, this.id + '_shot' + this.registeredBullets.size, this.game.scheduler);
		this.registeredBullets.set(laser.id, laser);
	}
}

MidEnnemy.prototype.damage = function(damage)
{
	this.lifePoints -= damage;
	if (this.lifePoints <= 0)
		this.destroy();
}

MidEnnemy.prototype.destroy = function()
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
		if (s != null)
			s.parentNode.removeChild(s);
	};
	
	var timerX = window.setTimeout(f, 1200, s);
}

/* ----- Animation ----- */
MidEnnemy.prototype.anim = function(params)
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
MidEnnemy.prototype.printEnnemy = function(id)
{
	var texloc = this.game.textures.texturesLocation;
	
	var theEnnemy = document.querySelectorAll('img[id="' + id + '"]');
	if (theEnnemy.length == 0)
	{
		var ennemy = document.createElement('img');
		ennemy.id = id;
		ennemy.className = 'ennemy';
		ennemy.src = texloc + this.img;
		ennemy.alt = 'mid';
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
		theEnnemy[0].style.left = this.left + 'px';
	}
}