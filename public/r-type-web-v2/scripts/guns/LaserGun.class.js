class LaserGun extends Gun
{
	/**
	 * Create a LaserGun
	 */
	constructor()
	{ 
		super('LASER');
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
			var bluelaser45 = new BlueLaser('shipbluelaser45' + game.registeredProjectiles.size, module.owner, 45, 1);
			game.registeredProjectiles.set(bluelaser45.sprite.id, bluelaser45);
			var bluelaser0 = new BlueLaser('shipbluelaser0' + game.registeredProjectiles.size, module.owner, 0, 1);
			game.registeredProjectiles.set(bluelaser0.sprite.id, bluelaser0);
			var bluelaser_45 = new BlueLaser('shipbluelaser_45' + game.registeredProjectiles.size, module.owner, -45, 1);
			game.registeredProjectiles.set(bluelaser_45.sprite.id, bluelaser_45);
			
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
		this.shootTier1(module);
	}
}
