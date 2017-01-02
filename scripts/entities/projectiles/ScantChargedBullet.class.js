class ScantChargedBullet extends PiercingEnemyProjectile
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
				'images/spritesheets/projectiles/scant_shot.png',
				63,
				16,
				new Point(
					shooter.sprite.position.x - 63,
					shooter.sprite.position.y + 19
				),
				4,
				[0, 1],
				true
			),
			7.5,
			10,
			ExplosionEntity.noExplosion(),
			shooter,
			10
		);
		
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
		this.sprite.position.x -= this.speed;
	}
}