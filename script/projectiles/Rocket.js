function Rocket(ship, id, direction)
{
	this.listeners = new Array();
	this.id = id;
	this.ship = ship;
	this.speed =6.5;
	this.direction = direction;
	this.target = null;
	this.angle = 0;
	
	this.img = ship.game.textures.projectile_rocket.getPath();
	this.width = ship.game.textures.projectile_rocket.getWidth();
	this.height = ship.game.textures.projectile_rocket.getHeight();
	if (direction == 'up')
		this.top = ship.top - 10;
	else
		this.top = ship.top + 14;
	this.left = ship.left + 8;
	this.trailImg = ship.game.textures.projectile_rocket_trail.getPath();
	this.trailWidth = ship.game.textures.projectile_rocket_trail.getWidth();
	this.trailHeight = ship.game.textures.projectile_rocket_trail.getHeight();
	
	this.launch(this.id);
	this.printRocket(this.id);
}

/* ----- Getters ----- */
Rocket.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
Rocket.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Rocket.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Rocket.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Rocket.prototype.onLaunch = function()
{
	this.fire(new Event('onlaunch', this));
	this.ship.game.stats.rocketLaunched++;
}

Rocket.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
	this.ship.game.stats.rocketHits++;
}

Rocket.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}

/* ----- Actions ----- */
Rocket.prototype.launch = function(id)
{
	this.onLaunch();
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

Rocket.prototype.destroy = function()
{
	this.ship.game.scheduler.removeTask(this.id);
	//this.ship.getRegisteredBullets().delete(this.id);
	
	var rocketNode = document.getElementById(this.id);
	if (rocketNode != null)
		rocketNode.parentNode.removeChild(rocketNode);
}

/* ----- Annimations ----- */
Rocket.prototype.anim = function(params)
{
	var rocket = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	if (rocket.left < -10 || rocket.left > window.innerWidth + 10 || rocket.top < -10 || rocket.top > window.innerHeight + 10)
	{
		scheduler.removeTask(id);
		var b = document.getElementById(""+id);
		b.parentNode.removeChild(b);
		this.ship.game.stats.rocketFails++;
	}
	else if (rocket.target == null)
	{
		for (var key of rocket.ship.game.registeredEnnemies.keys())
		{
			var ennemy = rocket.ship.game.registeredEnnemies.get(key);
			if (ennemy != null && ennemy.id != 'module')
			{
				var distanceX = ennemy.left - rocket.left;
				var distanceY = rocket.top - ennemy.top;
				
				if (rocket.target == null)
					rocket.target = ennemy;
				
				if (rocket.direction == 'up')
				{
					if (distanceX > 0 && distanceY > 0 && rocket.target.left > ennemy.left)
					{
						rocket.target = ennemy;
					}
				}
				else
				{
					if (distanceX > 0 && distanceY < 0 && rocket.target.left > ennemy.left)
					{
						rocket.target = ennemy;
					}
				}
			}
		}
	}
	else
	{
		if (rocket.target != null)
		{
			var targetPoint = new Point(rocket.target.left + (rocket.target.width / 2), rocket.target.top + (rocket.target.height / 2));
			var rocketPoint = new Point(rocket.left, rocket.top);
			
			if (rocket.direction == 'up')
			{
				//rocket.top -=
			}
			else
			{
				//rocket.top +=
			}
			rocket.left += rocket.speed;
		}
		else
		{
			rocket.left += rocket.speed;
		}
		
		rocket.printRocket(id);
		
		for (var i of rocket.ship.game.registeredEnnemies.keys())
		{
			var ennemy = rocket.ship.game.registeredEnnemies.get(i);
			if (ennemy != null && ennemy.id != 'module' && !ennemy.isDead && rocket.getHitbox().isHovering(ennemy.getHitbox()))
			{
				rocket.destroy();
				ennemy.destroy();
			}
		}
	}
}

/* ----- Printers ----- */
Rocket.prototype.printRocket = function(id)
{
	var texloc = this.ship.game.textures.texturesLocation;
	
	var theRocket = document.querySelectorAll('div[id="' + id + '"]');
	if (theRocket.length == 0)
	{
		var rocket = document.createElement('div');
		rocket.id = id;
		rocket.className = 'rocket';
		rocket.style.top = this.top + 'px';
		rocket.style.left = this.left + 'px';
		rocket.style.width = '24px';
		rocket.style.height = '12px';
		
		var trail = document.createElement('img');
		trail.id = 'trail' + id;
		trail.className = 'trail';
		trail.src = texloc + this.trailImg;
		trail.style.width = this.trailWidth + 'px';
		trail.style.height = this.trailHeight + 'px';
		
		var rocketi = document.createElement('img');
		rocketi.id = 'rocket' + id;
		rocketi.className = 'rocket';
		rocketi.src = texloc + this.img;
		rocketi.style.width = this.width + 'px';
		rocketi.style.height = this.height + 'px';
		
		rocket.appendChild(trail);
		rocket.appendChild(rocketi);
		
		document.getElementsByTagName('body')[0].appendChild(rocket);
	}
	else
	{
		theRocket[0].style.top = this.top + 'px';
		theRocket[0].style.left = this.left + 'px';
		theRocket[0].children[0].style.width = this.trailWidth + 'px';
		theRocket[0].children[0].style.height = this.trailHeight + 'px';
		if (!theRocket[0].children[0].src.contains(texloc + this.trailImg))
			theRocket[0].children[0].src = texloc + this.trailImg;
		theRocket[0].children[1].style.width = this.width + 'px';
		theRocket[0].children[1].style.height = this.height + 'px';
		if (!theRocket[0].children[1].src.contains(texloc + this.img))
			theRocket[0].children[1].src = texloc + this.img;
	}
}