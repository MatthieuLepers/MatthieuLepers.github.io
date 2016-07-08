class Projectile extends DestroyableEntity
{
	/**
	 * Create a enemy projectile
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 * @param explosion	: [Object] The explosion type for this entity
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 * @param damages	: [Int] The amount of damages this projectile do
	 */
	constructor(sprite, speed, lifePoints, explosion, shooter, damages)
	{
		super(sprite, speed, lifePoints, explosion);
		this.shooter = shooter;
		this.damages = damages;
	}
	
	/* ----- Actions ----- */
	 /**
	 * Damage the projectile with the hitten entity resistance
	 * @param damager : [Entity] The damager
	 */
	//@Override
	damage(damager)
	{
		this.lifePoints -= damager.resistance;
		if (this.lifePoints <= 0)
			this.explode();
	}
	
	/**
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	//@Override
	explode()
	{
		this.onDestroyed();
		this.isDead = true;
		this.removeEntity();
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		if (player1 != null && !player1.isDead && !player1.isInvulnerable && this.getHitbox().isHovering(player1.getHitbox()))
		{
			this.explode();
			player1.damage(this);
		}
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && this.getHitbox().isHovering(player2.getHitbox()))
		{
			this.explode();
			player2.damage(this);
		}
	}
	
	/**
	 * Allow collision with modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	//@Override
	allowCollisionWithModules(module1, module2)
	{
		if (module1 && module1.owner && !module1.owner.isDead && this.getHitbox().isHovering(module1.getHitbox()))
			this.damage(module1.damages);
		if (module2 && module2.owner && !module2.owner.isDead && this.getHitbox().isHovering(module2.getHitbox()))
			this.damage(module2.damages);
	}
}