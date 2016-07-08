class PlayerProjectile extends Projectile
{
	/**
	 * Create a player projectile
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
		this.hasHits = false;
		this.hits = 0;
	}
	
	/* ----- Animations ----- */
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	modifyHits()
	{
		this.hasHits = true;
	}
	
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers() {}
	
	/**
	 * Allow collision with modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	//@Override
	allowCollisionWithModules(module1, module2) {}
	
	/**
	 * Allow collision with enemies
	 */
	//@Override
	allowCollisionWithEnemies()
	{
		for (var key of game.registeredEnemies.keys())
		{
			var enemy = game.registeredEnemies.get(key);
			if (enemy != null && enemy.sprite.id.contains('enemy') && !enemy.isDead && this.getHitbox().isHovering(enemy.getHitbox()))
			{
				this.modifyHits();
				this.damage(enemy);
				enemy.damage(this);
			}
		}
	}
}