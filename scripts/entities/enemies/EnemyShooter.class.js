class EnemyShooter extends Enemy
{
	/**
	 * Create a game entity
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 * @param explosion	: [Object] The explosion type for this entity
	 * @param resistance: [Int] The enemy resitance to projectiles
	 * @param points	: [Int] The reward when killed
	 * @param probaShoot: [Double] The probability for shooting in percent
	 */
	constructor(sprite, speed, lifePoints, explosion, resistance, points, probaShoot)
	{
		super(sprite, speed, lifePoints, explosion, resistance, points);
		this.probaShoot = probaShoot;
		this.cooldown = false;
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onshoot' event
	 */
	onShoot()
	{
		this.emit('onshoot', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Shoot a projectile to the player
	 */
	shoot()
	{
		var percent50Fps = (10 * game.scheduler.speed) / 2;
		var fps = game.scheduler.fps;
		
		if (Math.random() * 100 > this.probaShoot && this.getBooleanToSatisfyToShoot() && !this.cooldown && fps >= percent50Fps)
		{
			this.onShoot();
			var projectile = this.getProjectile();
			registeredProjectiles.set(projectile.sprite.id, projectile);
			
			this.cooldown = true;
			window.setTimeout(this.clearCooldown, 900 + Math.random() * 400, this);
		}
	}
	
	/**
	 * Clear the shooting cooldown
	 * @param enemy : [EnemyShooter] The enemy
	 */
	clearCooldown(enemy)
	{
		enemy.cooldown = false;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the enemy position for animate it
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		if (!this.isDead)
			this.shoot();
	}
}