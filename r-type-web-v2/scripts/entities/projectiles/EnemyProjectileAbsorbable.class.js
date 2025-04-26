class EnemyProjectileAbsorbable extends Projectile
{
	/**
	 * Create a piercing enemy projectile
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 * @param explosion	: [Object] The explosion type for this entity
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 * @param damages	: [Int] The amount of damages this projectile do
	 */
	constructor(sprite, speed, lifePoints, explosion, shooter, damages)
	{
		super(sprite, speed, lifePoints, explosion, shooter, damages);
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onabsorbed' event
	 */
	onAbsorbed()
	{
		this.emit('onabsorbed', this);
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow the entity to be absorbed by modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	//@Override
	allowAbsorbsion(module1, module2)
	{
		if (module1 != null && module1.owner != null && !module1.owner.isDead && this.getHitbox().isHovering(module1.getHitbox()))
		{
			this.onAbsorbed();
			game.statistics.moduleAbsorbedShot[module1.sprite.id]++;
			this.removeEntity();
		}
		if (module2 != null && module2.owner != null && !module2.owner.isDead && this.getHitbox().isHovering(module2.getHitbox()))
		{
			this.onAbsorbed();
			game.statistics.moduleAbsorbedShot[module2.sprite.id]++;
			this.removeEntity();
		}
		
		if (module1 != null && module1.owner != null && module1.owner.bitModules.get('top') != null && !module1.owner.isDead && this.getHitbox().isHovering(module1.owner.bitModules.get('top').getHitbox()))
			this.removeEntity();
		if (module1 != null && module1.owner != null && module1.owner.bitModules.get('bottom') != null && !module1.owner.isDead && this.getHitbox().isHovering(module1.owner.bitModules.get('bottom').getHitbox()))
			this.removeEntity();
		if (module2 != null && module2.owner != null && module2.owner.bitModules.get('top') && !module2.owner.isDead && this.getHitbox().isHovering(module2.owner.bitModules.get('top').getHitbox()))
			this.removeEntity();
		if (module2 != null && module2.owner != null && module2.owner.bitModules.get('bottom') != null && !module2.owner.isDead && this.getHitbox().isHovering(module2.owner.bitModules.get('bottom').getHitbox()))
			this.removeEntity();
	}
}