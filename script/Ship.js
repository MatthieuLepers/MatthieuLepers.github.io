function Ship(game)
{
	this.listeners = new Array(); //contains arrays looks like : Array(String eventName, Function action)
	this.speed = 2;
	this.direction = "";
	this.top = Math.floor(parseInt(window.innerHeight) / 2);
	this.left = 10;
	this.isDead = false;
	this.game = game;
	this.registeredBullets = new Map();
	this.img = game.textures.ship_idle.getPath();
	this.width = game.textures.ship_idle.getWidth();
	this.height = game.textures.ship_idle.getHeight();
	this.module;
	this.id = 'ship';
	this.hasModule = false;
	this.hasRockets = false;
	this.rocketTimer;
	
	this.chargeImg = game.textures.none.getPath();
	this.chargeWidth = game.textures.none.getWidth();
	this.chargeHeight = game.textures.none.getHeight();
	this.chargeLeft = 33;
	this.chargeTop = -5;
	this.charge;
	
	this.bitModule = 0;
	this.bitModules = new Map();
}

/* ----- Getters ----- */
Ship.prototype.getHitbox = function()
{
	return new Hitbox(new Point(this.left, this.top), this.width, this.height, this);
}

/* ----- Events ----- */
Ship.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Ship.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Ship.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Ship.prototype.onMove = function()
{
	this.fire(new Event('onmove', this));
}

Ship.prototype.onShoot = function()
{
	this.fire(new Event('onshoot', this));
}

Ship.prototype.onDestroyed = function()
{
	this.fire(new Event('ondestroyed', this));
}

/* ----- Actions ----- */
Ship.prototype.shoot = function()
{
	if (this.game.score >= 20 && !this.isDead && !this.game.pause)
	{
		this.onShoot();
		this.chargeImg = this.game.textures.ship_shoot_bullet.getPath();
		this.chargeWidth = this.game.textures.ship_shoot_bullet.getWidth();
		this.chargeHeight = this.game.textures.ship_shoot_bullet.getHeight();
		this.chargeTop = 4;
		if (this.module == null)
		{
			this.chargeLeft = 33;
		}
		else
		{
			if (this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					this.chargeLeft = 52;
				}
				else
				{
					this.chargeLeft = 64;
				}
			}
			else
			{
				this.chargeLeft = 33;
			}
		}
		
		var updateChargement = function(ship, timer)
		{
			ship.chargeImg = ship.game.textures.none.getPath();
			ship.chargeWidht = ship.game.textures.none.getWidth();
			ship.chargeHeight = ship.game.textures.none.getHeight();
			ship.printShip();
			window.clearTimeout(timer);
		}
		
		var timerZ;
		
		timerZ = window.setTimeout(updateChargement, 135, this, timerZ);
		
		this.printShip();
		
		var bullet = new Bullet(this, 'shipshot' + this.registeredBullets.size);
		this.registeredBullets.set(bullet.id, bullet);
		
		//TODO
		if (this.module != null && this.module.tier >= 1 && this.module.type == 'dna')
		{
			if (this.module.position == 'front')
			{
				var DANRed = new DnaRedBullet(this, 'shipredshot' + this.registeredBullets.size, 1);
				var DANblue = new DnaBlueBullet(this, 'shipblueshot' + this.registeredBullets.size, 1);
				this.registeredBullets.set(DANRed.id, DANRed);
				this.registeredBullets.set(DANblue.id, DANblue);
			}
			else if (this.module.position == 'back')
			{
				var DANRed = new DnaRedBullet(this, 'shipredreverseshot' + this.registeredBullets.size, -1);
				var DANblue = new DnaBlueBullet(this, 'shipbluereverseshot' + this.registeredBullets.size, -1);
				this.registeredBullets.set(DANRed.id, DANRed);
				this.registeredBullets.set(DANblue.id, DANblue);
			}
		}
		
		if (this.bitModule == 1)
		{
			this.bitModules.get('top').shoot();
		}
		else if (this.bitModule == 2)
		{
			this.bitModules.get('top').shoot();
			this.bitModules.get('bottom').shoot();
		}
		
		if (document.querySelectorAll('body img[id="module"]').length == 1 && this.module.position == '')
			this.module.shoot();
	}
}

Ship.prototype.shootCharged = function(percent)
{
	if (this.game.score >= (20 + parseInt(percent)) && !this.isDead && !this.game.pause)
	{
		if (percent >= 15 && percent < 35)
		{
			this.onShoot();
			var bullet = new ChargedBullet(this, 'shipchargedshot' + this.registeredBullets.size, this.game.scheduler, this.game.textures.ship_charged_beam_15.getPath(), this.game.textures.ship_charged_beam_15.getWidth(), this.game.textures.ship_charged_beam_15.getHeight(), 6);
			if (this.module != null && this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					bullet.left += 19;
				}
				else
				{
					bullet.left += 31;
				}
			}
			else
			{
				this.registeredBullets.set(bullet.id, bullet);
			}
		}
		else if (percent >= 35 && percent < 50)
		{
			this.onShoot();
			var bullet = new ChargedBullet(this, 'shipchargedshot' + this.registeredBullets.size, this.game.scheduler, this.game.textures.ship_charged_beam_25.getPath(), this.game.textures.ship_charged_beam_25.getWidth(), this.game.textures.ship_charged_beam_25.getHeight(), 7);
			if (this.module != null && this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					bullet.left += 19;
				}
				else
				{
					bullet.left += 31;
				}
			}
			else
			{
				this.registeredBullets.set(bullet.id, bullet);
			}
			this.registeredBullets.set(bullet.id, bullet);
		}
		else if (percent >= 50 && percent < 75)
		{
			this.onShoot();
			var bullet = new ChargedBullet(this, 'shipchargedshot' + this.registeredBullets.size, this.game.scheduler, this.game.textures.ship_charged_beam_50.getPath(), this.game.textures.ship_charged_beam_50.getWidth(), this.game.textures.ship_charged_beam_50.getHeight(), 8);
			if (this.module != null && this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					bullet.left += 19;
				}
				else
				{
					bullet.left += 31;
				}
			}
			else
			{
				this.registeredBullets.set(bullet.id, bullet);
			}
			this.registeredBullets.set(bullet.id, bullet);
		}
		else if (percent >= 75 && percent < 90)
		{
			this.onShoot();
			var bullet = new ChargedBullet(this, 'shipchargedshot' + this.registeredBullets.size, this.game.scheduler, this.game.textures.ship_charged_beam_75.getPath(), this.game.textures.ship_charged_beam_75.getWidth(), this.game.textures.ship_charged_beam_75.getHeight(), 9);
			if (this.module != null && this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					bullet.left += 19;
				}
				else
				{
					bullet.left += 31;
				}
			}
			else
			{
				this.registeredBullets.set(bullet.id, bullet);
			}
			this.registeredBullets.set(bullet.id, bullet);
		}
		else if (percent >= 90 && percent <= 100)
		{
			this.onShoot();
			var bullet = new ChargedBullet(this, 'shipchargedshot' + this.registeredBullets.size, this.game.scheduler, this.game.textures.ship_charged_beam_90.getPath(), this.game.textures.ship_charged_beam_90.getWidth(), this.game.textures.ship_charged_beam_90.getHeight(), 10);
			if (this.module != null && this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					bullet.left += 19;
				}
				else
				{
					bullet.left += 31;
				}
			}
			else
			{
				this.registeredBullets.set(bullet.id, bullet);
			}
			this.registeredBullets.set(bullet.id, bullet);
		}
	}
}

Ship.prototype.throwModule = function()
{
	if (this.module != null && this.module.position != '' && !this.game.pause)
	{
		this.hasModule = false;
		this.game.scheduler.removeTask(this.module.id);
		document.getElementsByClassName('modulePosition')[0].innerHTML = '';
		document.getElementsByClassName('modulePosition')[1].innerHTML = '';
		
		if (this.module.position == 'front')
		{
			this.module.top = this.top + (this.height / 2) - (this.module.height / 2);
			this.module.left = this.left + (this.width / 2) + 2;
			this.module.speed = 3;
		}
		else
		{
			this.module.top = this.top + (this.height / 2) - (this.module.height / 2);
			this.module.left = this.left - 20;
			this.module.speed = -3;
		}
		
		this.module.position = '';
		this.module.printModule(this.module.id);
		
		this.game.scheduler.addTask(this.module.id, this.module.anim3, new Array(this.module, this.module.id, this.game.scheduler));
	}
}

Ship.prototype.move = function(xPos, yPos)
{
	if (!ship.isDead && !this.game.pause)
	{
		this.onMove();
		if (this.top + yPos > 0 && this.top + yPos < window.innerHeight - 70)
		{
			this.top += yPos;
			if (this.module != null && this.module.position != '')
				this.module.top += yPos;
		}
		if (this.left + xPos > 0 && this.left + xPos < window.innerWidth - 50)
		{
			this.left += xPos;
			if (this.module != null && this.module.position != '')
				this.module.left += xPos;
		}
		this.printShip();
		if (this.module != null)
			this.module.printModule(this.module.id);
		if (this.bitModule == 1)
			this.bitModules.get('top').printBitModule(this.bitModules.get('top').id);
		if (this.bitModule == 2)
		{
			this.bitModules.get('top').printBitModule(this.bitModules.get('top').id);
			this.bitModules.get('bottom').printBitModule(this.bitModules.get('bottom').id);
		}
	}
}

Ship.prototype.destroy = function()
{
	this.onDestroyed();
	this.throwModule();
	this.game.setLost();
	var s = document.getElementById('ship');
	this.img = this.game.textures.ship_explosion.getPath();
	this.width = this.game.textures.ship_explosion.getWidth();
	this.height = this.game.textures.ship_explosion.getHeight();
	this.isDead = true;
	if (ship.hasRockets)
		window.clearInterval(ship.rocketTimer);
	this.printShip();
	
	if (this.module != null)
		this.game.scheduler.removeTask(this.module.id);
	
	var f = function(s)
	{
		window.clearTimeout(timerX);
		s.parentNode.removeChild(s);
	};
	
	var timerX = window.setTimeout(f, 1200, s);
}

Ship.prototype.chargeBeamBar = function()
{
	var bar = document.getElementById('powerBar').children[0];
	
	if (parseInt(bar.style.width) < 300)
	{
		bar.style.width = parseFloat(bar.style.width) + 1.5 + 'px';
	}
}

Ship.prototype.prepareCharge = function()
{
	if (!this.isDead && !this.game.pause)
	{
		this.charge = window.setInterval(this.chargeBeamBar, 6);
		this.chargeImg = this.game.textures.ship_charge_beam.getPath();
		this.chargeWidth = this.game.textures.ship_charge_beam.getWidth();
		this.chargeHeight = this.game.textures.ship_charge_beam.getHeight();
		this.chargeTop = -5;
		if (this.module == null)
		{
			this.chargeLeft = 33;
		}
		else
		{
			if (this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					this.chargeLeft = 52;
				}
				else
				{
					this.chargeLeft = 64;
				}
			}
			else
			{
				this.chargeLeft = 33;
			}
		}
		
		this.printShip();
	}
}

Ship.prototype.launchCharge = function()
{
	if (!this.isDead && !this.game.pause)
	{
		var bar = document.getElementById('powerBar').children[0];
		var percent = (parseInt(bar.style.width) * 100) / 300;
		this.shootCharged(percent);
		bar.style.width = '0px';
		
		window.clearInterval(this.charge);
		this.chargeImg = this.game.textures.ship_shoot_charged.getPath();
		this.chargeWidth = this.game.textures.ship_shoot_charged.getWidth();
		this.chargeHeight = this.game.textures.ship_shoot_charged.getHeight();
		this.chargeLeft = 33;
		this.chargeTop = 0;
		if (this.module == null)
		{
			this.chargeLeft = 33;
		}
		else
		{
			if (this.module.position == 'front')
			{
				if (this.module.tier < 2)
				{
					this.chargeLeft = 52;
				}
				else
				{
					this.chargeLeft = 64;
				}
			}
			else
			{
				this.chargeLeft = 33;
			}
		}
		
		this.printShip();
		
		var f = function(ship)
		{
			ship.chargeImg = this.game.textures.none.getPath();
			ship.printShip();
		}
		window.setTimeout(f, 400, this);
	}
}

Ship.prototype.launchRocket = function(ship)
{
	var r1 = new Rocket(ship, 'shiprocket' + ship.registeredBullets.size, 'up');
	var r2 = new Rocket(ship, 'shiprocket' + (ship.registeredBullets.size + 1), 'down');
	ship.registeredBullets.set(r1.id, r1);
	ship.registeredBullets.set(r2.id, r2);
}

/* ----- Printers ----- */
Ship.prototype.printShip = function()
{
	var texloc = this.game.textures.texturesLocation;
	
	if (document.querySelectorAll('div#ship').length != 0)
	{
		var shipDiv = document.getElementById('ship');
		shipDiv.style.width = this.width + 'px';
		shipDiv.style.height = this.height + 'px';
		shipDiv.style.top = this.top + 'px';
		shipDiv.style.left = this.left + 'px';
		
		var ship = document.getElementById('shipImg');
		if (!ship.src.contains(texloc + this.chargeImg))
			ship.src = texloc + this.img;
		ship.style.width = this.width + 'px';
		ship.style.height = this.height + 'px';
		ship.style.top = this.top + 'px';
		ship.style.left = this.left + 'px';
		
		var charge = document.getElementById('charge');
		if (!charge.src.contains(texloc + this.chargeImg))
			charge.src = texloc + this.chargeImg;
		charge.style.width = this.chargeWidth + 'px';
		charge.style.height = this.chargeHeight + 'px';
		charge.style.left = this.chargeLeft + 'px';
		charge.style.top = this.chargeTop + 'px';
	}
	else
	{
		var shipDiv = document.createElement('div');
		shipDiv.id = 'ship';
		shipDiv.style.width = this.width + 'px';
		shipDiv.style.height = this.height + 'px';
		shipDiv.style.top = this.top + 'px';
		shipDiv.style.left = this.left + 'px';
		
		
		var ship = document.createElement('img');
		ship.id = 'shipImg';
		if (!ship.src.contains(texloc + this.img))
			ship.src = texloc + this.img;
		ship.alt = 'ship';
		ship.style.width = this.width + 'px';
		ship.style.height = this.height + 'px';
		ship.style.top = this.top + 'px';
		ship.style.left = this.left + 'px';
		
		var charge = document.createElement('img');
		charge.id = 'charge';
		if (!charge.src.contains(texloc + this.chargeImg))
			charge.src = texloc + this.chargeImg;
		charge.alt = 'charge';
		charge.style.width = '32px';
		charge.style.height = '32px';
		charge.style.left = this.chargeLeft + 'px';
		charge.style.top = this.chargeTop + 'px';
		
		//Module Front
		var moduleFront = document.createElement('div');
		moduleFront.id = 'moduleFront';
		moduleFront.className = 'modulePosition';
		if (this.module != null && this.module.position == 'front')
			this.module.printModule();
		
		//Module Back
		var moduleBack = document.createElement('div');
		moduleBack.id = 'moduleBack';
		moduleBack.className = 'modulePosition';
		if (this.module != null && this.module.position == 'back')
			this.module.printModule();
		
		//Bit Module Top
		var bitModuleTop = document.createElement('div');
		bitModuleTop.className = 'bitmodule top';
		if (this.bitModule == 1)
			this.bitModules.get('top').printBitModule();
		
		//Bit Module Bottom
		var bitModuleBottom = document.createElement('div');
		bitModuleBottom.className = 'bitmodule bottom';
		if (this.bitModule == 2)
			this.bitModulesget('bottom').printBitModule();
		
		shipDiv.appendChild(ship);
		shipDiv.appendChild(charge);
		shipDiv.appendChild(bitModuleTop);
		shipDiv.appendChild(bitModuleBottom);
		shipDiv.appendChild(moduleFront);
		shipDiv.appendChild(moduleBack);
		
		document.getElementsByTagName('body')[0].appendChild(shipDiv);
	}
}