class MidEnemy extends EnemyShooter
{
	/**
	 * Create a game entity
	 * @param id : [String] The entity unique id
	 */
	constructor(id)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/enemies/mid.png',
				32,
				22,
				new Point(
					canvas.width + 32,
					120 + (Math.random() * (parseInt(canvas.height) - 240))
				),
				6,
				[0, 1, 2, 3, 4, 5, 6, 7],
				true
			),
			1.1,
			1,
			ExplosionEntity.littleExplosion(),
			1,
			50,
			96
		);
		
		game.statistics.totalSpawnedMid++;
		this.launch();
	}
	
	/* ----- Actions ----- */
	/**
	 * Damage the entity
	 * @param damager : [Entity] The damager
	 */
	//@Override
	damage(damager)
	{
		super.damage(damager);
		if (this.lifePoints <= 0)
			//Player bullets
			if (damager.shooter)
				game.statistics.killedMid[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedMid[damager.owner.sprite.id]++;
	}
	
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	getBooleanToSatisfyToShoot()
	{
		return ((player1 != null && !player1.isDead) || (player2 != null && !player2.isDead)) && (canvas.width - this.sprite.position.x) >= 120;
	}
	
	/**
	 * Get the projectile to shoot
	 */
	getProjectile()
	{
		return new RedLaser(this.sprite.id + '_midshot' + game.registeredProjectiles.size, this);
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the enemy position for animate it
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x -= this.speed;
	}
}