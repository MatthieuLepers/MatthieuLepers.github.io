class Rocket extends PlayerProjectile
{
	/**
	 * Create a player projectile
	 * @param id		: [String] The entity unique id
	 * @param direction	: [String] The direction where the targeting starts (up|down)
	 */
	constructor(id, shooter, direction)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/projectiles/rocket.png',
				12,
				4,
				new Point(
					shooter.sprite.position.x + 8,
					shooter.sprite.position.y + (direction == 'up' ? (-10) : 19)
				),
				0,
				[0],
				false
			),
			6.5,
			1,
			ExplosionEntity.rocketExplosion(),
			shooter,
			2
		);
		this.direction = direction;
		this.trail = new Sprite(
			this.sprite.id + '_trail',
			'images/spritesheets/particles/rocket_trail.png',
			14,
			12,
			new Point(
				this.sprite.position.x - 7,
				this.sprite.position.y - 4
			),
			5,
			[0, 1, 2, 3, 2, 1],
			true
		);
		
		game.statistics.rocketLaunched[this.shooter.sprite.id]++;
	}
	
	/* ----- Statics ----- */
	/**
	 * Shoot 2 rockets if shooter is alive
	 * @param player : [PlayerShip] The player who shoot the rockets
	 */
	static launchRockets(player)
	{
		if (player.isDead)
		{
			window.clearInterval(player.rocketTimer);
			player.rocketTimer = null;
			player.hasRockets = false;
		}
		else if (!game.scheduler.isPaused && player.hasRockets)
		{
			var rocketUp = new Rocket('rocketUp_' + player.sprite.id + '_' + game.registeredProjectiles.size, player, 'up');
			game.registeredProjectiles.set(rocketUp.sprite.id, rocketUp);
			var rocketDown = new Rocket('rocketDown_' + player.sprite.id + '_' + (game.registeredProjectiles.size), player, 'down');
			game.registeredProjectiles.set(rocketDown.sprite.id, rocketDown);
			new Sound('sounds/sound_rocket_launch.ogg', true, false);
		}
	}
	
	/* ----- Getters ----- */
	/**
	 * Find an enemy to destroy
	 */
	findTarget()
	{
		this.sprite.angle = 0;
		for (var key of game.registeredEnemies.keys())
		{
			var enemy = game.registeredEnemies.get(key);
			if (enemy != null && enemy.sprite.id.contains('enemy'))
			{
				var distanceX = enemy.sprite.position.x - this.sprite.position.x;
				var distanceY = this.sprite.position.y - enemy.sprite.position.y;
				
				if (this.direction == 'up')
				{
					//console.log(this.sprite.id + ' search a target up');
					if (distanceX > 0 && distanceY > 0)
					{
						this.target = enemy;
						//console.log(this.sprite.id + ' found a target up');
						break;
					}
				}
				else
				{
					//console.log(this.sprite.id + ' search a target down');
					if (distanceX > 0 && distanceY < 0)
					{
						this.target = enemy;
						//console.log(this.sprite.id + ' found a target down');
						break;
					}
				}
			}
		}
		this.sprite.position.x += this.speed;
		this.trail.position.x += this.speed;
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	//@Override
	explode()
	{
		super.explode();
		game.statistics.rocketHits[this.shooter.sprite.id]++;
		game.renderer.deleteSprite(this.trail.id);
		this.sprite.angle = 0;
	}
	
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		game.renderer.deleteSprite(this.trail.id);
		game.statistics.rocketFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Animate the entity
	 * @param entity : [Entity] The entity to animate
	 */
	//@Override
	anim(entity)
	{
		if (entity.isOutOfScreen())
			entity.removeEntity();
		else if (entity.target == null || entity.target.isDead)
			entity.findTarget();
		else
			entity.modifyPosition();
		
		entity.allowCollisionWithEnemies();
	}
	
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		if (this.target != null)
		{
			var targetPoint = new Point(this.target.sprite.position.x + (this.target.sprite.width / 2), this.target.sprite.position.y + (this.target.sprite.height / 2));
			var rocketPoint = new Point(this.sprite.position.x, this.sprite.position.y);
			
			var distanceX = targetPoint.x - rocketPoint.x;
			var distanceY = targetPoint.y - rocketPoint.y;
			
			if (distanceX < 0)
				this.modifyPositionFront((this.direction == 'up' ? -1 : 1), distanceX, distanceY);
			else
				this.modifyPositionBack((this.direction == 'up' ? -1 : 1), distanceX, distanceY);
			this.sprite.angle = parseInt((Math.atan2(distanceY, distanceX) / Math.PI) * 180);
			this.trail.angle = this.sprite.angle;
			this.trail.deltaPoint = new Point(this.sprite.position.x + (this.sprite.width / 2), this.sprite.position.y + (this.sprite.height / 2));
			this.trail.savedPos = new Point(this.sprite.width / 2, (this.trail.height / 2) - (this.sprite.height / 2));
		}
		else
		{
			this.sprite.position.x += this.speed;
			this.sprite.angle = 0;
			this.trail.angle = 0;
		}
	}
	
	/**
	 * Modify entity position for tracking an enemy who is behind this entity
	 */
	modifyPositionBack(sign, distanceX, distanceY)
	{
		if (distanceY > 0 && parseInt(Math.floor(this.sprite.position.y)) != 0)
		{
			this.sprite.position.y += sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
			this.trail.position.y += sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
		}
		else if (parseInt(Math.floor(this.sprite.position.y)) != 0)
		{
			this.sprite.position.y -= sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
			this.trail.position.y -= sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
		}
		this.sprite.position.x += (distanceX / this.sprite.position.x) + (this.speed / 2);
		this.trail.position.x += (distanceX / this.sprite.position.x) + (this.speed / 2);
	}
	
	/**
	 * Modify entity position for tracking an enemy who is ahead this entity
	 */
	modifyPositionFront(sign, distanceX, distanceY)
	{
		if (distanceY > 0 && parseInt(Math.floor(this.sprite.position.y)) != 0)
		{
			this.sprite.position.y += sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
			this.trail.position.y += sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
		}
		else if (parseInt(Math.floor(this.sprite.position.y)) != 0)
		{
			this.sprite.position.y -= sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
			this.trail.position.y -= sign * (distanceY / this.sprite.position.y) + (this.speed / 3);
		}
		this.sprite.position.x -= (distanceX / this.sprite.position.x) + (this.speed / 2);
		this.trail.position.x -= (distanceX / this.sprite.position.x) + (this.speed / 2);
	}
}
