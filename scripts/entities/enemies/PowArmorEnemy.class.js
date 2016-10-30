class PowArmorEnemy extends Enemy
{
	/**
	 * Create a PowArmor enemy
	 * @param id : [String] The entity id
	 */
	constructor(id)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/enemies/powarmor.png',
				32,
				32,
				new Point(
					canvas.width + 32,
					(canvas.height / 2) - 50
				),
				0,
				[0],
				false
			),
			1,
			1,
			ExplosionEntity.littleExplosion(),
			1,
			200
		);
		this.upgrade = this.getRandomUpdate();
		this.staticTop = this.sprite.position.y;
		this.staticAng = 0.1;
		
		game.statistics.totalSpawnedPowArmor++;
	}
	
	/* ----- Getters ----- */
	/**
	 * Get a radom upgrade
	 */
	getRandomUpdate()
	{
		var random = parseInt(Math.random() * 7);
		var returned = '';
		
		switch (random)
		{
			case 0:
				returned = new DnaUpgrade(this);
				break;
			case 1:
				returned = new LaserUpgrade(this);
				break;
			case 2:
				returned = new FireUpgrade(this);
				break;
			case 3:
				if (player1 != null && player2 != null)
					returned = (player1.speed < 4 || player2.speed < 4 ? new SpeedUpgrade(this) : this.getRandomUpdate());
				else if (player1 != null && !player2)
					returned = (player1.speed < 4 ? new SpeedUpgrade(this) : this.getRandomUpdate());
				else if (!player1 && player2 != null)
					returned = (player2.speed < 4 ? new SpeedUpgrade(this) : this.getRandomUpdate());
				break
			case 4:
				if (player1 != null && player2 != null)
					returned = (!player1.hasRockets || !player2.hasRockets ? new RocketsUpgrade(this) : this.getRandomUpdate());
				else if (player1 != null && !player2)
					returned = (!player1.hasRockets ? new RocketsUpgrade(this) : this.getRandomUpdate());
				else if (!player1 && player2 != null)
					returned = (!player2.hasRockets ? new RocketsUpgrade(this) : this.getRandomUpdate());
				break;
			case 5:
				if (player1 != null && player2 != null)
					returned = (player1.bitModules.size < 2 || player2.bitModules.size < 2 ? new BitModuleUpgrade(this) : this.getRandomUpdate());
				else if (player1 != null && !player2)
					returned = (player1.bitModules.size < 2 ? new BitModuleUpgrade(this) : this.getRandomUpdate());
				else if (!player1 && player2 != null)
					returned = (!player2.bitModules.size < 2 ? new BitModuleUpgrade(this) : this.getRandomUpdate());
				break;
			case 6:
				returned = new ForceFieldUpgrade(this);
				break;
			default:
				returned = this.getRandomUpdate();
		}
		
		return returned;
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
				game.statistics.killedPowArmor[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedPowArmor[damager.owner.sprite.id]++
	}
	
	/**
	 * Destroy the entity and drop the upgrade
	 */
	//@Override
	explode()
	{
		super.explode();
		
		if (((player1 != null && !player1.isDead) || (player2 != null && !player2.isDead)) && this.upgrade)
		{
			this.upgrade.sprite.position.x = this.sprite.position.x;
			this.upgrade.sprite.position.y = this.sprite.position.y;
			this.upgrade.launch();
		}
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the enemy position for anima it
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x -= this.speed;
		this.sprite.position.y = this.staticTop + Math.sin(this.staticAng) * ((canvas.height / 2) - 50);
		this.staticAng += 0.01;
	}
}