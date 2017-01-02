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
		this.cooldownTime = 900 + Math.random() * 400;
		this.otherProjectiles = function(entity) {};
	}
	
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	getBooleanToSatisfyToShoot() {return false;}
	
	/**
	 * Get the projectile to shoot
	 */
	getProjectile() {return null;}
	
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
		if (Math.random() * 100 > this.probaShoot && this.getBooleanToSatisfyToShoot() && !this.cooldown)
		{
			this.onShoot();
			var projectile = this.getProjectile();
			if (projectile != null)
			{
				game.registeredProjectiles.set(projectile.sprite.id, projectile);
				
				this.otherProjectiles(this);
				
				this.cooldown = true;
				window.setTimeout(this.clearCooldown, this.cooldownTime, this);
			}
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