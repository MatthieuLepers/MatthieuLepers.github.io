class ModuleAngleBullet extends PlayerProjectile
{
	/**
	 * Create a module bullet with a specific angle when shot
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 * @param angle 	: [Double] The angle of the bullet in degree
	 */
	constructor(id, shooter, angle)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/module_shot_' + angle + '.png',
				(angle == 90 || angle == -90 ?  4 : 16),
				(angle == 90 || angle == -90 ? 16 : (angle == 0 ? 4 : 8)),
				new Point(
					shooter.sprite.position.x + shooter.sprite.width + 2,
					shooter.sprite.position.y + 12
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
		this.angle = angle;
		
		game.statistics.moduleShots[this.shooter.sprite.id]++;
		this.launch();
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
			game.statistics.moduleShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += parseFloat(this.speed) * Math.cos((Math.PI * this.angle) / 180);
		this.sprite.position.y += parseFloat(this.speed) * Math.sin((Math.PI * this.angle) / 180);
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		game.statistics.moduleShotHits[this.shooter.sprite.id]++;
	}
}