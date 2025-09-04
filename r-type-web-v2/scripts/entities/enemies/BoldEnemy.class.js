class BoldEnemy extends Enemy
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
				'images/spritesheets/enemies/bold.png',
				130,
				50,
				new Point(
					canvas.width + 130,
					200 + Math.random() * (canvas.height - 400)
				),
				0,
				[0],
				false
			),
			0.4,
			200,
			ExplosionEntity.bigExplosion(),
			200,
			1500
		);
		
		game.statistics.totalSpawnedBold++;
		
		this.addEventListener('ondestroyed', function() {new Sound('sounds/sound_big_explosion.ogg', true, false);});
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
				game.statistics.killedBold[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedBold[damager.owner.sprite.id]++;
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