function Module(ship)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.ship = ship;
	this.id = 'module';
	this.speed = 1.5;
	this.top = Math.floor(parseInt(window.innerHeight) / 2);
	this.left = -12;
	this.img = ship.game.textures.module_tier0.getPath();
	this.width = ship.game.textures.module_tier0.getWidth();
	this.height = ship.game.textures.module_tier0.getHeight();
	this.position = '';
	this.tier = 0;
	this.type;
	this.registeredBullets = new Map();
	
	this.launch(this.id);
	this.printModule(this.id);
	
	var setup = function(e)
	{
		var module = e;
		var ship = module.ship;
		
		var distance = ship.getHitbox().boxOrigin.getX() - module.getHitbox().boxOrigin.getX();
		
		if (distance > 16)
		{
			module.position = 'back';
			if (module.tier == 1)
			{
				module.img = ship.game.textures.module_tier1_back.getPath();
				module.width = ship.game.textures.module_tier1_back.getWidth();
				module.height = ship.game.textures.module_tier1_back.getHeight();
			}
			module.top = ship.top;
			module.left = ship.left - module.width;
		}
		else
		{
			module.position = 'front';
			if (module.tier == 1)
			{
				module.img = ship.game.textures.module_tier1_front.getPath();
				module.width = ship.game.textures.module_tier1_front.getWidth();
				module.height = ship.game.textures.module_tier1_front.getHeight();
			}
			module.top = ship.top;
			module.left = ship.left + ship.width;
		}
		module.ship.game.scheduler.removeTask(module.id);
		module.ship.game.scheduler.addTask(module.id, module.anim2, new Array(module, module.id, module.ship.game.scheduler));
		module.printModule(module.id);
	}
	
	this.addEventListener('onhover', setup);
}

/* ----- Getters ----- */
Module.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height);
}

/* ----- Setters ----- */
Module.prototype.updateTier = function()
{
	if (this.tier < 2)
	{
		this.tier++;
		if (this.tier == 1)
		{
			if (this.position == 'back')
			{
				this.img = ship.game.textures.module_tier1_back.getPath();
				this.width = ship.game.textures.module_tier1_back.getWidth();
				this.height = ship.game.textures.module_tier1_back.getHeight();
			}
			else
			{
				this.img = ship.game.textures.module_tier1_front.getPath();
				this.width = ship.game.textures.module_tier1_front.getWidth();
				this.height = ship.game.textures.module_tier1_front.getHeight();
			}
		}
		else
		{
			this.img = ship.game.textures.module_tier2.getPath();
			this.width = ship.game.textures.module_tier2.getWidth();
			this.height = ship.game.textures.module_tier2.getHeight();
		}
		
		this.printModule(this.id);
	}
}

/* ----- Events ----- */
Module.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Module.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Module.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Module.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunched', this));
	this.ship.game.stats.moduleTier++;
}

Module.prototype.onShoot = function()
{
	this.fire(new Event('onshoot', this));
}

Module.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
Module.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.goMiddle, new Array(this, id, this.ship.game.scheduler));
}

Module.prototype.shoot = function()
{
	this.onShoot();
	switch (this.tier)
	{
		case 0:
			var bullet = new ModuleAngleBullet(this, 'moduleshot' + this.registeredBullets.size, 0);
			this.registeredBullets.set(bullet.id, bullet);
			break;
		case 1:
			var angleBullet1 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size, 20);
			angleBullet1.top += 6;
			var angleBullet2 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size + 1, -20);
			angleBullet1.top -= 6;
			this.registeredBullets.set(angleBullet1.id, angleBullet1);
			this.registeredBullets.set(angleBullet2.id, angleBullet2);
			break;
		case 2:
			var angleBullet1 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size, 25);
			angleBullet1.top += 6;
			var angleBullet2 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size + 1, -25);
			angleBullet1.top -= 6;
			var angleBullet3 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size + 2, 85);
			angleBullet3.top += 6;
			angleBullet3.left -= 15;
			var angleBullet4 = new ModuleAngleBullet(this, 'moduleangleshot' + this.registeredBullets.size + 3, -85);
			angleBullet4.top -= 6;
			angleBullet4.left -= 15;
			this.registeredBullets.set(angleBullet1.id, angleBullet1);
			this.registeredBullets.set(angleBullet2.id, angleBullet2);
			this.registeredBullets.set(angleBullet3.id, angleBullet3);
			this.registeredBullets.set(angleBullet4.id, angleBullet4);
			break;
	}
}

/* ----- Animation ----- */
Module.prototype.goMiddle = function(params)
{
	var module = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (module.left <= window.innerWidth * (3 / 4))
	{
		module.left += module.speed;
		module.printModule(id);
		
		for (var i of module.ship.game.registeredEnnemies.keys())
		{
			var ennemy = module.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && module.getHitbox().isHovering(ennemy.getHitbox()))
			{
				ennemy.destroy();
			}
		}
		
		if (module.getHitbox().isHovering(module.ship.getHitbox()))
		{
			module.onHover();
			scheduler.removeTask(id);
		}
	}
	else
	{
		scheduler.removeTask(id);
		scheduler.addTask(id, module.anim, new Array(module, id, scheduler));
	}
}

Module.prototype.anim = function(params)
{
	var module = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (module.getHitbox().isHovering(module.ship.getHitbox()))
	{
		module.onHover();
	}
	else
	{
		var runner = new Point(module.getHitbox().boxOrigin.getX(), module.getHitbox().boxOrigin.getY());
		var target = new Point(module.ship.getHitbox().boxOrigin.getX() + (module.ship.getHitbox().getWidth() / 2) - (module.width / 2), module.ship.getHitbox().boxOrigin.getY() + (module.ship.getHitbox().getHeight() / 2) - (module.height / 2));
		
		var distanceX = runner.getX() - target.getX();
		var distanceY = runner.getY() - target.getY();
		module.speed = 1.5;
		
		if (distanceX < 0)
			module.left += module.speed;
		else
			module.left -= module.speed;
		
		if (distanceY < 0)
			module.top += (module.speed / 2);
		else
			module.top -= (module.speed / 2);
		
		for (var i of module.ship.game.registeredEnnemies.keys())
		{
			var ennemy = module.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && module.getHitbox().isHovering(ennemy.getHitbox()))
			{
				ennemy.destroy();
			}
		}
		
		module.printModule(module.id);
	}
}

Module.prototype.anim2 = function(params)
{
	var module = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	for (var i of module.ship.game.registeredEnnemies.keys())
	{
		var ennemy = module.ship.game.registeredEnnemies.get(i);
		if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && module.getHitbox().isHovering(ennemy.getHitbox()))
		{
			ennemy.destroy();
		}
	}
	
	module.printModule(module.id);
}

Module.prototype.anim3 = function(params)
{
	var module = params[0];
	var id = params[1];
	var scheduler = params[2];
	var signe = 1;
	var b;
	
	if (module.speed < 0)
	{
		signe = -1;
		module.theStaticLeft = (module.left + signe * (window.innerWidth * (3/4)) > 0 ? module.left + signe * (window.innerWidth * (3/4)) : 0);
		b = module.left >= module.theStaticLeft;
	}
	else
	{
		module.theStaticLeft = (module.left + signe * (window.innerWidth * (3/4)) < window.innerWidth ? module.left + signe * (window.innerWidth * (3/4)) : window.innerWidth);
		b = module.left <= module.theStaticLeft;
	}
	
	if (b)
	{
		module.left += module.speed;
		module.printModule(id);
		for (var i of module.ship.game.registeredEnnemies.keys())
		{
			var ennemy = module.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && module.getHitbox().isHovering(ennemy.getHitbox()))
			{
				ennemy.destroy();
			}
		}
		
		if (module.getHitbox().isHovering(module.ship.getHitbox()))
		{
			module.onHover();
			scheduler.removeTask(id);
		}
	}
	else
	{
		scheduler.removeTask(id);
		scheduler.addTask(id, module.anim, new Array(module, id, scheduler));
	}
}

/* ----- Printers ----- */
Module.prototype.printModule = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	if (this.position == '')
	{
		var theModule = document.querySelectorAll('body>img[id="' + id + '"]');
		if (theModule.length == 0)
		{
			var module = document.createElement('img');
			module.id = id;
			module.src = texloc + this.img;
			module.alt = 'module';
			module.style.width = this.width + 'px';
			module.style.height = this.height + 'px';
			module.style.top = this.top + 'px';
			module.style.left = this.left + 'px';
			
			document.getElementsByTagName('body')[0].appendChild(module);
		}
		else
		{
			if (!theModule[0].src.contains(texloc + this.img))
				theModule[0].src = texloc + this.img;
			theModule[0].style.width = this.width + 'px';
			theModule[0].style.height = this.height + 'px';
			theModule[0].style.top = this.top + 'px';
			theModule[0].style.left = this.left + 'px';
		}
	}
	else if (this.position == 'front')
	{
		var theModule = document.querySelectorAll('div[id="ship"] div[id="moduleFront"] img[id="' + id + '1"]');
		if (theModule.length == 0 && !this.ship.hasModule)
		{
			var module = document.createElement('img');
			module.id = id + '1';
			module.src = texloc + this.img;
			module.alt = 'module';
			module.style.width = this.width + 'px';
			module.style.height = this.height + 'px';
			module.style.top = this.top + 'px';
			module.style.left = this.left + 'px';
			
			document.getElementById('moduleFront').appendChild(module);
		}
		else
		{
			if (!theModule[0].src.contains(texloc + this.img))
				theModule[0].src = texloc + this.img;
			theModule[0].style.width = this.width + 'px';
			theModule[0].style.height = this.height + 'px';
			theModule[0].style.top = this.top + 'px';
			theModule[0].style.left = this.left + 'px';
		}
		
		this.ship.hasModule = true;
		
		var theModule = document.querySelectorAll('body>img[id="' + id + '"]');
		if (theModule.length == 1)
			theModule[0].parentNode.removeChild(theModule[0]);
	}
	else if (this.position == 'back')
	{
		var theModule = document.querySelectorAll('div[id="ship"] div[id="moduleBack"] img[id="' + id + '1"]');
		if (theModule.length == 0 && !this.ship.hasModule)
		{
			var module = document.createElement('img');
			module.id = id + '1';
			module.src = texloc + this.img;
			module.alt = 'module';
			module.style.width = this.width + 'px';
			module.style.height = this.height + 'px';
			module.style.top = this.top + 'px';
			module.style.left = this.left + this.width + 'px';
			
			document.getElementById('moduleBack').appendChild(module);
		}
		else
		{
			if (!theModule[0].src.contains(texloc + this.img))
				theModule[0].src = texloc + this.img;
			theModule[0].style.width = this.width + 'px';
			theModule[0].style.height = this.height + 'px';
			theModule[0].style.top = this.top + 'px';
			theModule[0].style.left = this.left + this.width + 'px';
		}
		
		this.ship.hasModule = true;
		
		var theModule = document.querySelectorAll('body>img[id="' + id + '"]');
		if (theModule.length == 1)
			theModule[0].parentNode.removeChild(theModule[0]);
	}
}