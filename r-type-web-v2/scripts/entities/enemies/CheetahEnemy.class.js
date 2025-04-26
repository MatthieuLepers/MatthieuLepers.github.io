class CheetahEnemy extends EnemyShooter
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
				'images/spritesheets/enemies/cheetah.png',
				48,
				48,
				new Point(
					canvas.width + 48,
					120 + (Math.random() * (parseInt(canvas.height) - 240))
				),
				6,
				[0, 1, 2, 3, 2, 1],
				true
			),
			0.9,
			16,
			ExplosionEntity.bigExplosion(),
			10,
			150,
			95
		);
		
		game.statistics.totalSpawnedCheetah++;
	}
	
	/* ----- Getters ----- */
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
		var projectile = new RedLaser(this.sprite.id + '_cheetahshot' + game.registeredProjectiles.size, this);
		projectile.sprite.position.y = (this.sprite.position.y + 2) + (Math.random() * (this.sprite.height - 2));
		
		return projectile;
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
		{
			//Player bullets
			if (damager.shooter)
				game.statistics.killedCheetah[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedCheetah[damager.owner.sprite.id]++;
		}
		else
			new Sound('sounds/sound_forcefield_hits.ogg', true, false);
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