class BlueLaser extends PlayerProjectile
{
	/** 16*3
	 * Create a player projectile
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 * @param angle 	: [Int] The angle where the laser go (0|45|-45)
	 */
	constructor(id, shooter, angle)
	{
		super(
			new MultipleWidthSprite(
				id,
				'images/spritesheets/projectiles/blue_laser.png',
				(shooter.module.tier == 1 ? [16, 32, 48, 64] : [16, 32, 48, 64, 80, 96, 112, 128]),
				3,
				BlueLaser.getPosition(shooter, angle),
				1,
				(shooter.module.tier == 1 ? [0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0]),
				false,
				false,
				true
			),
			5,
			5,
			ExplosionEntity.noExplosion(),
			shooter,
			2
		);
		this.sign = (shooter.module.slot == 'front' ? 1 : -1);
		this.sprite.angle = (this.sign < 0 ? angle + 180 : angle);
		
		game.statistics.laserShots[this.shooter.sprite.id]++;
	}
	
	/* ----- Statics ----- */
	static getPosition(shooter, angle)
	{
		var sign = (shooter.module.slot == 'front' ? 1 : -1);
		if (sign < 0)
			return new Point(
				shooter.sprite.position.x,
				shooter.sprite.position.y + (angle != 0 ? (angle == 45 ? (32 * shooter.module.tier) - 46 : (-(32 * shooter.module.tier) + 8) + 43) : 8)
			);
		else
			return new Point(
				shooter.sprite.position.x,
				shooter.sprite.position.y + (angle != 0 ? (angle == 45 ? (-4) : 19) : 8)
			);
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	//@Override
	explode()
	{
		this.onDestroyed();
		game.renderer.replaceSprite(new MultipleWidthSprite(
			this.sprite.id,
			'images/spritesheets/projectiles/blue_laser.png',
			(this.shooter.module.tier == 1 ? [64, 48, 32, 16] : [128, 112, 96, 80, 64, 48, 32, 16]),
			3,
			BlueLaser.getPosition(this.shooter, this.sprite.angle),
			6,
			(this.shooter.module.tier == 1 ? [0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0]),
			false,
			true
		));
		this.isDead = true;
		game.scheduler.removeTask(this.sprite.id);
		game.registeredProjectiles.set(this.sprite.id, null);
	}
	
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		if (!this.hasHits)
			game.statistics.laserShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += parseFloat(this.speed) * Math.cos((Math.PI * this.sprite.angle) / 180);
		this.sprite.position.y += parseFloat(this.speed) * Math.sin((Math.PI * this.sprite.angle) / 180);
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		game.statistics.laserShotHits[this.shooter.sprite.id]++;
	}
}
