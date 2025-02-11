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
		this.randomAdd = Math.floor(Math.random() * 2);
		this.x = 2 + this.randomAdd;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	modifyPosition()
	{
		super.modifyPosition();
		
		this.sprite.position.x += this.sign * this.speed;
		this.sprite.position.y += ((Math.pow(this.x, 2)) / (Math.floor(Math.random() * 8) + 8)) - (2 + this.randomAdd);
		this.x -= 0.1;
	}
}