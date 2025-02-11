class Gun {
	/**
	 * Create a gun
	 * @param type : [String] The type of the gun
	 */
	constructor(type)
	{
		this.type = type;
		this.cooldownActive = false;
	}
	
	/* ----- Actions ----- */
	/**
	 * Shoot with the primary gun
	 * @param module : [Module] The force module
	 */
	primaryShoot(module) {}
	
	/**
	 * Shoot projectiles for module tier 1
	 * @param module : [Module] The force module
	 */
	shootTier1() {}
	
	/**
	 * Shoot projectiles for module tier 2
	 * @param module : [Module] The force module
	 */
	shootTier2() {}
	
	/**
	 * Shoot with the secundary gun
	 * @param module : [Module] The force module
	 */
	secundaryShoot(module) {}
}