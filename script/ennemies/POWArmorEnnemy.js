function POWArmorEnnemy(game, id, upgrade)
{
	this.listeners = new Array();
	this.id = id;
	this.speed = 1;
	this.upgrade = upgrade;
	this.top = window.innerHeight / 2;
	this.left = window.innerWidth + 50;
	this.isDead = false;
	this.game = game;
	this.staticTop = this.top;
	this.staticDeg = 0.01;
	this.img = game.textures.powarmor_fly.getPath();
	this.width = game.textures.powarmor_fly.getWidth();
	this.height = game.textures.powarmor_fly.getHeight();
	this.lifePoints = 1;
	
	this.points = 200;
	
	this.launch(id);
	this.printEnnemy(id);
}

/* ----- Getters ----- */
POWArmorEnnemy.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Events ----- */
POWArmorEnnemy.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

POWArmorEnnemy.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

POWArmorEnnemy.prototype.fire = function(event)
{
	event.dispatchEvent();
}

POWArmorEnnemy.prototype.onMove = function()
{
	this.fire(new Event('onmove', this));
}

POWArmorEnnemy.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.game.stats.killedPowArmor++;
	this.game.killCounter++;
}

POWArmorEnnemy.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.game.nbEnnemySpawnedForThisWave++;
	if (!this.game.ship.isDead)
		this.game.stats.totalSpawnedPowArmor++;
}

/* ----- Actions ----- */
POWArmorEnnemy.prototype.launch = function(id)
{
	this.onLaunch();
	this.game.scheduler.addTask(id, this.anim, new Array(this, id, this.game.scheduler));
}

POWArmorEnnemy.prototype.damage = function(damage)
{
	this.lifePoints -= damage;
	if (this.lifePoints <= 0)
		this.destroy();
}

POWArmorEnnemy.prototype.destroy = function()
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
	
	switch (this.upgrade)
	{
		case 'speed':
			new SpeedUpgrade(this);
			break;
		case 'laser':
			new LaserUpgrade(this);
			break;
		case 'dna':
			new DnaUpgrade(this);
			break;
		case 'fire':
			new FireUpgrade(this);
			break;
		case 'rockets':
			new RocketsUpgrade(this);
			break;
		case 'bitmodule':
			new BitModuleUpgrade(this);
			break;
	}
}

/* ----- Animation ----- */
POWArmorEnnemy.prototype.anim = function(params)
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
		ennemy.top = ennemy.staticTop + Math.sin(ennemy.staticDeg) * ((window.innerHeight / 2) - 100);
		ennemy.staticDeg += 0.01;
		ennemy.left -= ennemy.speed;
		ennemy.printEnnemy(id);
		
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
POWArmorEnnemy.prototype.printEnnemy = function(id)
{
	var texloc = this.game.textures.texturesLocation;
	
	var theEnnemy = document.querySelectorAll('img[id="' + id + '"]');
	if (theEnnemy.length == 0)
	{
		var ennemy = document.createElement('img');
		ennemy.id = id;
		ennemy.className = 'ennemy';
		ennemy.src = texloc + this.img;
		ennemy.alt = 'POWArmor';
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