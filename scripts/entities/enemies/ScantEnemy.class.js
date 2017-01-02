class ScantEnemy extends EnemyShooter
{
	/**
	 * Create a tiny boss robot
	 * @param id : [String] The entity's id
	 */
	constructor(id)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/enemies/scant.png',
				56,
				54,
				new Point(
					canvas.width,
					(canvas.height / 2) - 27
				),
				6,
				[0],
				true
			),
			1,
			25,
			ExplosionEntity.bigExplosion(),
			100,
			1000,
			0
		);
		this.state = 'up';
		this.findTarget();
		
		game.statistics.totalSpawnedScant++;
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
				game.statistics.killedScant[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedScant[damager.owner.sprite.id]++;
		}
		else
			new Sound('sounds/sound_forcefield_hits.ogg', true, false);
	}
	
	/**
	 * Find a target to shoot
	 */
	findTarget()
	{
		if (player1 != null && player2 != null)
			this.target = (Math.random() >= 0.5 ? player2 : player1);
		else if (player1 != null && player2 == null)
			this.target = player1;
		else if (player1 == null && player2 == null)
			this.target = player2;
		else
			this.target = null;
	}
	
	/**
	 * Shoot a projectile to the player
	 */
	//@Override
	shoot()
	{
		this.onShoot();
		var projectile = new ScantChargedBullet(this.sprite.id + game.registeredProjectiles.size, this);
		game.registeredProjectiles.set(projectile.sprite.id, projectile);
		this.cooldown = true;
		window.setTimeout(this.clearCooldown, 1000, this);
		game.scheduler.removeTask(this.sprite.id);
		this.findTarget();
		game.scheduler.addTask(new Task(this.sprite.id, this.trackPlayerAnim, this));
	}
	
	/* ----- Animations ----- */
	/**
	 * The animation when the robot entering the canvas
	 */
	modifyPosition()
	{
		if (this.sprite.position.x < canvas.width - 140)
		{
			game.scheduler.removeTask(this.sprite.id);
			game.scheduler.addTask(new Task(this.sprite.id, this.trackPlayerAnim, this));
			this.speed = 0.5;
		}
		else
			this.sprite.position.x -= this.speed;
	}
	
	/**
	 * Track the player vertically and shoot it when has a shot line
	 * @param entity : [Robot] The entity to animate
	 */
	trackPlayerAnim(entity)
	{
		if (entity.target != null && entity.sprite.position.y + 19 > entity.target.sprite.position.y && entity.sprite.position.y + 19 < entity.target.sprite.position.y + entity.target.sprite.height)
		{
			game.scheduler.removeTask(entity.sprite.id);
			game.scheduler.addTask(new Task(entity.sprite.id, entity.shootAnim, entity));
		}
		else if (entity.target != null)
		{
			var id = entity.sprite.id;
			var distanceY = (entity.sprite.position.y + 19) - (entity.target.sprite.position.y + (entity.target.sprite.height / 2));
			
			if (distanceY < 0)
			{
				entity.sprite.position.y += entity.speed;
				if (entity.state != 'down')
				{
					game.renderer.deleteSprite(entity.sprite.id);
					entity.sprite = new Sprite(id, 'images/spritesheets/enemies/scant.png', 56, 54, entity.sprite.position, 6, [2], true);
				}
				entity.state = 'down';
			}
			else
			{
				entity.sprite.position.y -= entity.speed;
				if (entity.state != 'up')
				{
					game.renderer.deleteSprite(entity.sprite.id);
					entity.sprite = new Sprite(id, 'images/spritesheets/enemies/scant.png', 56, 54, entity.sprite.position, 6, [0], true);
				}
				entity.state = 'up';
			}
			
			entity.sprite.position.y += (distanceY < 0 ? entity.speed : (-entity.speed));
			if (entity.charge != null)
				entity.charge.position.y += (distanceY < 0 ? entity.speed : (-entity.speed));
		}
	}
	
	/**
	 * Shoot at the target
	 * @param entity : [Robot] The entity to animate
	 */
	shootAnim(entity)
	{
		if (!entity.cooldown)
		{
			entity.state = 'shoot';
			game.renderer.replaceSprite(new Sprite(entity.sprite.id, 'images/spritesheets/enemies/scant.png', 56, 54, entity.sprite.position, 6, [0, 1, 2], false));
			entity.charge = new Sprite(
				entity.sprite.id + '_charge',
				'images/spritesheets/particles/scant_charge.png',
				48,
				16,
				new Point(
					entity.sprite.position.x - 50,
					entity.sprite.position.y + 15
				),
				4,
				[0, 1, 2, 3],
				false,
				true
			);
			entity.shoot();
		}
	}
}