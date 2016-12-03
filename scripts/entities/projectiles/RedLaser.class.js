class RedLaser extends PiercingEnemyProjectile
{
	/**
	 * Create a red laser enemy projectile
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 */
	constructor(id, shooter)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/red_laser.png',
				48,
				4,
				new Point(
					shooter.sprite.position.x,
					shooter.sprite.position.y + (shooter.sprite.height / 2) - 2
				),
				4,
				[0, 1, 2, 3],
				true
			),
			6,
			1,
			ExplosionEntity.noExplosion(),
			shooter,
			2
		);
		this.sign = -1;
		this.launch();
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += this.sign * this.speed;
	}
}