class ChargedBullet extends PlayerProjectile
{
	/**
	 * Create a charged bullet
	 * @param id 		: [String] The entity unique id
	 * @param shooter 	: [PlayerShip] The shooter
	 * @param percent 	: [Int] The level of charge
	 */
	constructor(id, shooter, percent)
	{
		super(
			ChargedBullet.getSprite(id, percent, new Point(shooter.sprite.position.x + shooter.sprite.width + 5, shooter.sprite.position.y + 6)),
			ChargedBullet.getSpeed(percent),
			ChargedBullet.getSpeed(percent),
			ExplosionEntity.noExplosion(),
			shooter,
			ChargedBullet.getSpeed(percent)
		);
		this.percent = percent;
		
		game.statistics.chargedShots[this.shooter.sprite.id]++;
	}
	
	/* ----- Statics Getters ----- */
	/**
	 * Get the speed in function of the charge percentage
	 * @param percet : [Int] The charge percentage
	 */
	static getSpeed(percent)
	{
		if (percent >= 15 && percent < 35)
			return 6;
		else if (percent >= 35 && percent < 50)
			return 7;
		else if (percent >= 50 && percent < 75)
			return 8;
		else if (percent >= 75 && percent < 90)
			return 9;
		else if (percent >= 90 && percent <= 100)
			return 10;
	}
	
	/**
	 * Get the sprite in function of the charge percentage
	 * @param id 		: [String] The entity id
	 * @param percent 	: [Int] The charge percentage
	 * @param position	: [Point] The entity starting position
	 */
	static getSprite(id, percent, position)
	{
		if (percent >= 15 && percent < 35)
			return new Sprite(id, 'images/spritesheets/projectiles/chargedbullet_15.png', 16, 12, position, 4, [0, 1], true);
		else if (percent >= 35 && percent < 50)
			return new Sprite(id, 'images/spritesheets/projectiles/chargedbullet_25.png', 32, 12, position, 4, [0, 1], true);
		else if (percent >= 50 && percent < 75)
			return new Sprite(id, 'images/spritesheets/projectiles/chargedbullet_50.png', 48, 14, position, 4, [0, 1], true);
		else if (percent >= 75 && percent < 90)
			return new Sprite(id, 'images/spritesheets/projectiles/chargedbullet_75.png', 64, 14, position, 4, [0, 1], true);
		else if (percent >= 90 && percent <= 100)
			return new Sprite(id, 'images/spritesheets/projectiles/chargedbullet_90.png', 80, 16, position, 4, [0, 1], true);
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		if (!this.hasHits)
			game.statistics.chargedShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += this.speed;
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		this.hits++;
		game.statistics.chargedShotHits[this.shooter.sprite.id]++;
		
		switch (this.hits)
		{
			case 0:
				break;
			case 1:
				break;
			case 2:
				this.shooter.achievements.unlock('doubleKill');
				break;
			case 3:
				this.shooter.achievements.unlock('tripleKill');
				break;
			case 4:
				this.shooter.achievements.unlock('quadraKill');
				break;
			case 5:
				this.shooter.achievements.unlock('pentaKill');
				break;
			default:
				this.shooter.achievements.unlock('monsterKill');
				break;
		}
	}
}