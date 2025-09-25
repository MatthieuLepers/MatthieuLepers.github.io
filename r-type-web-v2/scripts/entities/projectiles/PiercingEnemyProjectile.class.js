class PiercingEnemyProjectile extends Projectile
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
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		if (player1 != null && !player1.isDead && this.getHitbox().isHovering(player1.getHitbox()))
		{
			if (player1.lifePoints >= 3)
			{
				this.removeEntity();
				player1.achievements.unlock('indestructible');
			}
			player1.damage(this);
		}
		if (player2 != null && !player2.isDead && this.getHitbox().isHovering(player2.getHitbox()))
		{
			if (player2.lifePoints >= 3)
			{
				this.removeEntity();
				player2.achievements.unlock('indestructible');
			}
			player2.damage(this);
		}
	}
	
	/**
	 * Allow collision with modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	//@Override
	allowCollisionWithModules(module1, module2) {}
}