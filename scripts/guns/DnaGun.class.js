class DnaGun extends Gun
{
	/**
	 * Create a DnaGun
	 */
	constructor()
	{
		super('DNA');
	}
	
	/* ----- Actions ----- */
	/**
	 * Shoot with this gun
	 * @param module : [Module] The force module
	 */
	shoot(module)
	{
		this.primaryShoot(module);
		this.secundaryShoot(module);
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
			var DNARed = new DnaBullet(module.owner.sprite.id + 'dnashot' + module.owner.registeredProjectiles.size, 'red', module, module);
			module.owner.registeredProjectiles.set(DNARed.sprite.id, DNARed);
			var DNABlue = new DnaBullet(module.owner.sprite.id + 'dnashot' + module.owner.registeredProjectiles.size, 'blue', module, module);
			module.owner.registeredProjectiles.set(DNABlue.sprite.id, DNABlue);
			
			game.statistics.dnaBulletShots += 2;
			module.cooldown = true;
			window.setTimeout(module.clearCooldown, 140, module);
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
			var dnaBeam = new DnaBeam(module.owner.sprite.id + 'DnaBeam' + module.owner.registeredProjectiles.size, module.owner);
			module.owner.registeredProjectiles.set(dnaBeam.sprite.id, dnaBeam);
			
			module.cooldown = true;
			window.setTimeout(module.clearCooldown, 420, module);
		}
	}
	
	/**
	 * Shoot with the secundary gun
	 * @param module : [Module] The force module
	 */
	//@Override
	secundaryShoot(module)
	{
		var bitModuleTop = module.owner.bitModules.get('top') || null;
		var bitModuleBottom = module.owner.bitModules.get('bottom') || null;
		
		if (bitModuleTop != null && module != null && module.tier >= 1)
		{
			var DNARed = new DnaBullet(module.owner.sprite.id + 'dnashot' + module.owner.registeredProjectiles.size, 'red', module, bitModuleTop);
			game.statistics.bitModuleShots[module.owner.sprite.id]++;
			module.owner.registeredProjectiles.set(DNARed.sprite.id, DNARed);
		}
		if (bitModuleBottom != null && module != null && module.tier >= 1)
		{
			var DNABlue = new DnaBullet(module.owner.sprite.id + 'dnashot' + module.owner.registeredProjectiles.size, 'blue', module, bitModuleBottom);
			game.statistics.bitModuleShots[module.owner.sprite.id]++;
			module.owner.registeredProjectiles.set(DNABlue.sprite.id, DNABlue);
		}
	}
}