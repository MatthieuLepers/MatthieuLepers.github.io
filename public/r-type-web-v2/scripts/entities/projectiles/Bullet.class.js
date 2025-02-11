class Bullet extends PlayerProjectile
{
	/**
	 * Create a Bullet shooted by a player
	 * @param id 		: [String] The entity unique id
	 * @param shooter 	: [PlayerShip] The shooter
	 */
	constructor(id, shooter)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/bullet.png',
				16,
				4,
				new Point(
					shooter.sprite.position.x + shooter.sprite.width + 5,
					shooter.sprite.position.y + 7.5
				),
				0,
				[0],
				false
			),
			6.5,
			1,
			ExplosionEntity.noExplosion(),
			shooter,
			1
		);
		
		game.statistics.playerShots[this.shooter.sprite.id]++;
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		if (!this.hasHits)
			game.statistics.playerShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += this.speed;
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		game.statistics.playerShotHits[this.shooter.sprite.id]++;
	}
}