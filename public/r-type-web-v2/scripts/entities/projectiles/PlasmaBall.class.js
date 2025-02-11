class PlasmaBall extends EnemyProjectileAbsorbable
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
			3,
			1,
			ExplosionEntity.noExplosion(),
			shooter,
			1
		);
		this.target = target;
		this.sign = (this.target.sprite.position.x - this.sprite.position.x > 0 ? -1 : 1);
		this.targetPoint = new Point(this.target.sprite.position.x + this.shooter.sprite.width, this.target.sprite.position.y);
		
		var distanceX = this.shooter.sprite.position.x - this.targetPoint.x;
		var distanceY = (this.sign == 1 ? this.shooter.sprite.position.y - this.targetPoint.y : this.targetPoint.y - this.shooter.sprite.position.y);
		
		this.angle = -(180 * Math.atan2(distanceY, distanceX)) / Math.PI;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x -= (this.sign * this.speed * Math.cos((Math.PI * this.angle) / 180));
		this.sprite.position.y += (this.sign * this.speed * Math.sin((Math.PI * this.angle) / 180));
	}
}