class CompilerPlasmaBall extends EnemyProjectileAbsorbable
{
	/**
	 * Create a shot enemy projectile
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 */
	constructor(id, shooter, target)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/plasma_ball.png',
				7,
				6,
				new Point(
					shooter.sprite.position.x + (shooter.sprite.width / 2) - 3.5,
					shooter.sprite.position.y + (shooter.sprite.height / 2) - 3
				),
				4,
				[0, 1, 2, 3],
				72,
				true
			),
			1,
			1,
			ExplosionEntity.noExplosion(),
			shooter,
			1
		);
		this.target = target;
		this.sign = (this.target.sprite.position.x - this.sprite.position.x > 0 ? 1 : -1);
		this.x = 0.0;
		this.staticTop = Math.random() * 4 + 4;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	modifyPosition()
	{
		//Find better function
		super.modifyPosition();
		this.sprite.position.x += this.sign * this.speed;
		this.sprite.position.y -= (-Math.pow(this.x, 2) / (Math.random() * 100 + 5) + this.staticTop) / 4;
		this.x -= 0.1;
	}
}