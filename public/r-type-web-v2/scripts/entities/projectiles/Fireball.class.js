class Fireball extends PlayerProjectile
{
	/**
	 * Create a player projectile
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 * @param direction : [String] The direction where the fireball is shot (up|down)
	 */
	constructor(id, shooter, direction)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/fireball.png',
				16,
				16,
				new Point(
					shooter.sprite.position.x + (shooter.module.slot == 'front' ? shooter.sprite.width + 2 : (-16)),
					shooter.sprite.position.y + 8
				),
				6,
				[0, 1, 2, 3],
				true
			),
			4,
			5,
			ExplosionEntity.fireballExplosion(),
			shooter,
			3
		);
		this.sign = (direction == 'up' ? -1 : 1);
		
		game.statistics.fireballShots[this.shooter.sprite.id]++;
		this.launch();
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		if (!this.hasHits)
			game.statistics.fireballShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.y += this.sign * this.speed;
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		game.statistics.fireballShotHits[this.shooter.sprite.id]++;
	}
}