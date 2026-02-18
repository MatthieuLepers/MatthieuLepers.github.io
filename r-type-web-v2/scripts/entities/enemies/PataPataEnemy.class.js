class PataPataEnemy extends EnemyShooter
{
	/**
	 * Create a PataPata enemy
	 * @param id : [String] The entity id
	 */
	constructor(id)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/enemies/patapata.png',
				21,
				24,
				new Point(
					canvas.width + 21,
					100 + (Math.random() * (parseInt(canvas.height) - 250))
				),
				6,
				[0, 1, 2, 3, 4, 5, 6, 7],
				true
			),
			1,
			1,
			ExplosionEntity.littleExplosion(),
			1,
			100,
			99
		);
		this.staticTop = this.sprite.position.y;
		this.staticAng = 0.1;
		
		game.statistics.totalSpawnedPataPata++;
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
				game.statistics.killedPataPata[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedPataPata[damager.owner.sprite.id]++;
	}
	
	/**
	 * Select the targeted player
	 */
	getTarget()
	{
		return (player1 != null && player2 != null ? (Math.random() * 100 > 50 ? player2 : player1) : (player1 != null ? player1 : player2));
	}
	
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	getBooleanToSatisfyToShoot()
	{
		this.target = this.getTarget();
		return this.target && !this.target.isDead
	}
	
	/**
	 * Get the projectile to shoot
	 */
	getProjectile()
	{
		return new PlasmaBall(this.sprite.id + '_plasma_ball' + game.registeredProjectiles.size, this, this.target);
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
		this.sprite.position.y = this.staticTop + Math.sin(this.staticAng) * 40;
		this.staticAng += 0.03;
	}
}