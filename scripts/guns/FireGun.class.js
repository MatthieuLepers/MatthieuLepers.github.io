class FireGun extends Gun
{
	/**
	 * Create a FireGun
	 */
	constructor()
	{ 
		super('FIRE');
	}
	
	/* ----- Actions ----- */
	/**
	 * Shoot with this gun
	 * @param module : [Module] The force module
	 */
	shoot(module)
	{
		this.primaryShoot(module);
	}
	
	/**
	 * Shoot with the primary gun
	 * @param module : [Module] The force module
	 */
	//@Override
	primaryShoot(module)
	{
		if (module != null && (module.slot == 'front' || module.slot == 'back'))
			if (module.tier == 1)
				this.shootTier1(module);
			else if (module.tier == 2)
				this.shootTier2(module);
	}
	
	/**
	 * Shoot projectiles for module tier 1
	 * @param module : [Module] The force module
	 */
	//@Override
	shootTier1(module)
	{
		if (!module.cooldown)
		{
			var fireball = new Fireball('fireballup' + game.registeredProjectiles.size, module.owner, 'up');
			game.registeredProjectiles.set(fireball.sprite.id, fireball);
			var fireball1 = new Fireball('fireballdown' + game.registeredProjectiles.size, module.owner, 'down');
			game.registeredProjectiles.set(fireball1.sprite.id, fireball1);
			window.setTimeout(this.fireLaunch,  70, module.owner, 'up');
			window.setTimeout(this.fireLaunch,  70, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 140, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 140, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 210, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 210, module.owner, 'down');
			
			module.cooldown = true;
			window.setTimeout(module.clearCooldown, (module.tier == 1 ? 1000 : 850), module);
		}
	}
	
	/**
	 * Shoot projectiles for module tier 2
	 * @param module : [Module] The force module
	 */
	//@Override
	shootTier2(module)
	{
		if (!module.cooldown)
		{
			var fireball = new Fireball('fireballup' + game.registeredProjectiles.size, module.owner, 'up');
			game.registeredProjectiles.set(fireball.sprite.id, fireball);
			var fireball1 = new Fireball('fireballdown' + game.registeredProjectiles.size, module.owner, 'down');
			game.registeredProjectiles.set(fireball1.sprite.id, fireball1);
			window.setTimeout(this.fireLaunch,  70, module.owner, 'up');
			window.setTimeout(this.fireLaunch,  70, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 140, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 140, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 210, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 210, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 280, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 280, module.owner, 'down');
			window.setTimeout(this.fireLaunch, 350, module.owner, 'up');
			window.setTimeout(this.fireLaunch, 350, module.owner, 'down');
			
			module.cooldown = true;
			window.setTimeout(module.clearCooldown, (module.tier == 1 ? 1000 : 850), module);
		}
	}
	
	/**
	 * Create a fireball and launch it
	 * @param player 	: [PlayerShip] The player who shoot
	 * @param direction	: [String] The direction where the fireball is launched (up|down)
	 */
	fireLaunch(player, direction)
	{
		var fireball = new Fireball('fireball' + direction + game.registeredProjectiles.size, player, direction);
		game.registeredProjectiles.set(fireball.sprite.id, fireball);
	}
}
