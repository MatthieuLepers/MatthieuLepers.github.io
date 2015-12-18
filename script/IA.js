function IA(ship)
{
	this.ship = ship;
	this.cooldown = false;
	this.launch('ia');
}

/* ----- Actions ----- */
IA.prototype.launch = function(id)
{
	this.ship.game.scheduler.addTask(id, this.anim, new Array(this, id, this.ship.game.scheduler));
}

IA.prototype.anim = function(params)
{
	var ia = params[0];
	var id = params[1];
	var scheduler = params[2];
	
	var clearCoolDown = function(ia)
	{
		ia.cooldown = false;
	}
	
	for (var key of ia.ship.game.registeredEnnemies.keys())
	{
		var ennemy = ia.ship.game.registeredEnnemies.get(key);
		if (ennemy != null && ennemy.id != 'module' && ennemy.registeredBullets != null && !ia.cooldown)
		{
			if (ennemy.top <= ia.ship.top && ennemy.top + ennemy.height >= ia.ship.top + ia.ship.height)
			{
				if (true)
				{
					ia.ship.shoot();
					ia.cooldown = true;
					window.setTimeout(clearCoolDown, 100, ia);
				}
			}
		}
	}
}