class Enemy extends DestroyableEntity
{
	/**
	 * Create a game entity
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 * @param explosion	: [Object] The explosion type for this entity
	 * @param resistance: [Int] The enemy resitance to projectiles
	 * @param points	: [Int] The reward when killed
	 */
	constructor(sprite, speed, lifePoints, explosion, resistance, points)
	{
		super(sprite, speed, lifePoints, explosion);
		this.resistance = resistance;
		this.points = points;
		
		this.addEventListener('ondestroyed', function() {new Sound('sounds/sound_explosion.ogg', true, false);});
	}
	
	/* ----- Actions ----- */
	/**
	 * Damage the entity
	 * @param damager : [Entity] The damager
	 */
	//@Override
	damage(damager)
	{
		this.lifePoints -= damager.damages;
		if (this.lifePoints <= 0)
		{
			//Player bullets
			this.explode();
			if (damager.shooter)
				damager.shooter.score += this.points;
			//Module if attached to a player
			else if (damager.owner)
				damager.owner.score += this.points;
			game.onScoreboardChange();
		}
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
			player1.explode();
		}
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && this.getHitbox().isHovering(player2.getHitbox()))
		{
			this.explode();
			player2.explode();
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
		if (module1 != null && module1.owner != null && !module1.owner.isDead && this.getHitbox().isHovering(module1.getHitbox()))
			this.damage(module1);
		if (module2 != null && module2.owner != null && !module2.owner.isDead && this.getHitbox().isHovering(module2.getHitbox()))
			this.damage(module2);
	}
	
	/**
	 * Allow collision with bit modules
	 */
	allowCollisionWithBitModules()
	{
		if (player1 != null && player1.bitModules.get('top') != null && !player1.isDead && this.getHitbox().isHovering(player1.bitModules.get('top').getHitbox()))
			this.damage(player1.bitModules.get('top'));
		if (player1 != null && player1.bitModules.get('bottom') != null && !player1.isDead && this.getHitbox().isHovering(player1.bitModules.get('bottom').getHitbox()))
			this.damage(player1.bitModules.get('bottom'));
		if (player2 != null && player2.bitModules.get('top') && !player2.isDead && this.getHitbox().isHovering(player2.bitModules.get('top').getHitbox()))
			this.damage(player2.bitModules.get('top'));
		if (player2 != null && player2.bitModules.get('bottom') != null && !player2.isDead && this.getHitbox().isHovering(player2.bitModules.get('bottom').getHitbox()))
			this.damage(player2.bitModules.get('bottom'));
	}
}