class Module extends SpawnableEntity
{
	/**
	 * Create a Module entity
	 * @param id : [String] The entity unique id
	 */
	constructor(id)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/module/module_t0.png',
				20,
				32,
				new Point(
					-20,
					parseInt(canvas.height / 2)
				),
				6,
				[0, 1, 2, 3, 4, 5],
				true
			),
			1.5,
			1
		);
		this.isInvulnerable = true;
		this.tier = 0;
		this.slot = '';
		this.owner = null;
		this.damages = 1;
		this.gun = null;
		this.cooldown = false;
		this.canThrow = true;
		
		this.animLeft = null;
		this.animRight = null;
		
		//Events
		this.addEventListener('onhover', 	this.attachToPlayer);
		this.addEventListener('onattached', function() {new Sound('sounds/sound_player_attach_module.ogg', true, false);});
		this.addEventListener('onreleased', function() {new Sound('sounds/sound_player_release_module.ogg', true, false);});
	}
	
	/* ----- Getters ----- */
	/**
	 * Select a player to go to
	 * @return [PlayerShip] The selected player or null if both players are dead
	 */
	getTargetedPlayer()
	{
		if (player1 != null && player2 != null)
		{
			if (player1 != null && !player1.module)
				return player1
			if (player2 != null && !player2.module)
				return player2
			
			var distanceToP1 = {
				x: (module.sprite.position.x - player1.sprite.position.x > 0 ? module.sprite.position.x - player1.sprite.position.x : player1.sprite.position.x - module.sprite.position.x),
				y: (module.sprite.position.x - player1.sprite.position.y > 0 ? module.sprite.position.y - player1.sprite.position.y : player1.sprite.position.y - module.sprite.position.y)
			};
			var distanceToP2 = {
				x: (module.sprite.position.x - player2.sprite.position.x > 0 ? module.sprite.position.x - player2.sprite.position.x : player2.sprite.position.x - module.sprite.position.x),
				y: (module.sprite.position.x - player2.sprite.position.y > 0 ? module.sprite.position.y - player2.sprite.position.y : player2.sprite.position.y - module.sprite.position.y)
			};
			
			if (distanceToP1.x < distanceToP2.x)
				return player1;
			else if (distanceToP1.x > distanceToP2.x)
				return player2;
			else
				if (distanceToP1.y < distanceToP2.y)
					return player1;
				else if (distanceToP1.y > distanceToP2.y)
					return player2;
				else
					return (Math.random() * 100 > 50 ? player1 : player2);
		}
		else
		{
			if (player1 != null && !player1.module)
				return player1
			if (player2 != null && !player2.module)
				return player2
		}
		return null;
	}
	
	/**
	 * Get the neerest player for attaching to it
	 */
	getPayerToAttach()
	{
		if (player1 != null && player2 != null)
		{
			var distanceToP1 = {
				x: (this.sprite.position.x - player1.sprite.position.x > 0 ? this.sprite.position.x - player1.sprite.position.x : player1.sprite.position.x - this.sprite.position.x),
				y: (this.sprite.position.x - player1.sprite.position.y > 0 ? this.sprite.position.y - player1.sprite.position.y : player1.sprite.position.y - this.sprite.position.y)
			};
			var distanceToP2 = {
				x: (this.sprite.position.x - player2.sprite.position.x > 0 ? this.sprite.position.x - player2.sprite.position.x : player2.sprite.position.x - this.sprite.position.x),
				y: (this.sprite.position.x - player2.sprite.position.y > 0 ? this.sprite.position.y - player2.sprite.position.y : player2.sprite.position.y - this.sprite.position.y)
			};
			
			if (distanceToP1.x < distanceToP2.x)
				return player1;
			else if (distanceToP1.x > distanceToP2.x)
				return player2;
			else
				if (distanceToP1.y < distanceToP2.y)
					return player1;
				else if (distanceToP1.y > distanceToP2.y)
					return player2;
				else
					return (Math.random() * 100 > 50 ? player1 : player2);
		}
		else
		{
			if (player1 != null)
				return player1
			if (player2 != null)
				return player2
		}
		return null;
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onhover' event
	 */
	onHover()
	{
		this.emit('onhover', this);
	}
	
	/**
	 * Trigger a 'onshoot' event
	 */
	onShoot()
	{
		this.emit('onshoot', this);
	}
	
	/**
	 * Trigger an 'onattached' event
	 */
	onAttached()
	{
		this.emit('onattached', this);
	}
	
	/**
	 * Trigger an 'onreleased' event
	 */
	onReleased()
	{
		this.emit('onreleased', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Launch the entity
	 */
	//@Override
	launch()
	{
		this.onLaunched();
		game.scheduler.addTask(new Task(this.sprite.id, this.spawnAnim, this));
	}
	
	/**
	 * Increase the module tier ans change texture
	 */
	increaseTier()
	{
		if (this.tier < 2)
		{
			this.tier++;
			if (this.tier == 1)
			{
				this.sprite = new Sprite(
					this.sprite.id,
					'images/spritesheets/module/module_t1_' + (this.slot == 'back' ? 'back' : 'front') + '.png',
					27,
					32,
					this.sprite.position,
					6,
					[0, 1, 2, 3, 4, 5],
					true
				);
				game.renderer.replaceSprite(this.sprite);
			}
			else
			{
				this.sprite = new Sprite(
					this.sprite.id,
					'images/spritesheets/module/module_t2.png',
					31,
					32,
					this.sprite.position,
					6,
					[0, 1, 2, 3],
					true
				);
				game.renderer.replaceSprite(this.sprite);
			}
		}
	}
	
	/**
	 * Clear the gun cooldown
	 * @param module : [Module] The module
	 */
	clearCooldown(module)
	{
		module.cooldown = false;
	}
	
	/**
	 * Release the module
	 */
	release()
	{
		this.onReleased();
		if (this.slot != 'back')
		{
			this.sprite.position.x = this.owner.sprite.position.x + this.owner.sprite.width + this.sprite.width;
			this.speed = 3;
			this.sign = 1;
			/*this.animRight = new Sprite(
				this.sprite.id + '_release',
				'images/spritesheets/particles/module_release_back.png',
				width,
				height,
				position,
				5,
				false,
				true
			);*/
		}
		else
		{
			this.sprite.position.x = this.owner.sprite.position.x - this.sprite.height;
			this.speed = -3;
			this.sign = -1;
			/*this.animLeft = new Sprite(
				this.sprite.id + '_release',
				'images/spritesheets/particles/module_release_front.png',
				width,
				height,
				position,
				5,
				false,
				true
			);*/
		}
		this.sprite.position.y = this.owner.sprite.position.y + (this.owner.sprite.height / 2) - (this.sprite.height / 2);
		
		this.owner.module = null;
		this.owner = null;
		this.slot = '';
		game.scheduler.removeTask(this.sprite.id);
		game.scheduler.addTask(new Task(this.sprite.id, this.releasedAnim, this));
	}
	
	/**
	 * Call the module
	 */
	call()
	{
		this.speed = 1.5;
		game.scheduler.removeTask(this.sprite.id);
		game.scheduler.addTask(new Task(this.sprite.id, this.trackPlayerAnim, this));
	}
	
	/**
	 * Shoot angle bullet
	 */
	shoot()
	{
		this.onShoot();
		switch (this.tier)
		{
			case 0:
				var bullet = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, 0);
				game.registeredProjectiles.set(bullet.sprite.id, bullet);
				break;
			case 1:
				var angleBullet1 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, 20);
				angleBullet1.sprite.position.y += 6;
				game.registeredProjectiles.set(angleBullet1.sprite.id, angleBullet1);
				var angleBullet2 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, -20);
				angleBullet2.sprite.position.y -= 6;
				game.registeredProjectiles.set(angleBullet2.sprite.id, angleBullet2);
				break;
			case 2:
				var angleBullet1 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, 20);
				angleBullet1.sprite.position.y += 6;
				game.registeredProjectiles.set(angleBullet1.sprite.id, angleBullet1);
				var angleBullet2 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, -20);
				angleBullet2.sprite.position.y -= 6;
				game.registeredProjectiles.set(angleBullet2.sprite.id, angleBullet2);
				var angleBullet3 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, 90);
				angleBullet3.sprite.position.x -= 15;
				angleBullet3.sprite.position.y += 6;
				game.registeredProjectiles.set(angleBullet3.sprite.id, angleBullet3);
				var angleBullet4 = new ModuleAngleBullet('moduleshot' + game.registeredProjectiles.size, this, -90);
				angleBullet4.sprite.position.x -= 15;
				angleBullet4.sprite.position.y -= 6;
				game.registeredProjectiles.set(angleBullet4.sprite.id, angleBullet4);
				break;
		}
	}
	
	/**
	 * Attach the module to a player
	 */
	attachToPlayer()
	{
		var player = this.getPayerToAttach();
		var distance = (player.sprite.position.x + (player.sprite.width / 2)) - this.sprite.position.x;
		
		if (!player.module)
		{
			if (distance >= 16)
			{
				this.slot = 'back';
				this.sprite.position.x = player.sprite.position.x - this.sprite.width;
			}
			else
			{
				this.slot = 'front';
				this.sprite.position.x = player.sprite.position.x - this.sprite.width;
			}
			if (this.tier == 1)
			{
				this.sprite = new Sprite(
					this.sprite.id,
					'images/spritesheets/module/module_t1_' + this.slot + '.png',
					27,
					32,
					this.sprite.position,
					6,
					[0, 1, 2, 3, 4, 5],
					true
				);
				game.renderer.replaceSprite(this.sprite);
			}
			
			this.onAttached();
			player.module = this;
			this.owner = player;
			this.sprite.position.y = player.sprite.position.y - 7.5;
			game.scheduler.removeTask(this.sprite.id);
			game.scheduler.addTask(new Task(this.sprite.id, this.anim, this));
		}
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		if ((player1 && !player1.module && !player1.isDead && this.getHitbox().isHovering(player1.getHitbox())) || (player2 && !player2.module && !player2.isDead && this.getHitbox().isHovering(player2.getHitbox())))
			this.onHover();
	}
	
	/**
	 * Allow collision with enemies
	 */
	//@Override
	allowCollisionWithEnemies()
	{
		for (var key of game.registeredEnemies.keys())
		{
			var enemy = game.registeredEnemies.get(key);
			if (enemy != null && enemy.sprite.id.contains('enemy') && !enemy.isDead && this.getHitbox().isHovering(enemy.getHitbox()) && !this.cooldown)
			{
				enemy.damage(this);
				this.cooldown = true;
				window.setTimeout(function(entity) {entity.cooldown = false;}, 800, this);
			}
		}
	}
	
	/**
	 * Do the spawning animation for module
	 * @param entity : [Module] The module
	 */
	spawnAnim(module)
	{
		if (module.sprite.position.x <= canvas.width * (3 / 4))
		{
			module.sprite.position.x += module.speed;
			
			module.allowCollisionWithEnemies();
			module.allowCollisionWithPlayers();
		}
		else
		{
			game.scheduler.removeTask(module.sprite.id);
			game.scheduler.addTask(new Task(module.sprite.id, module.trackPlayerAnim, module));
		}
	}
	
	/**
	 * Anim the module to find and pair with a player
	 */
	trackPlayerAnim(module)
	{	
		module.speed = 1.5;
		
		if (!module.targetedPlayer || (module.targetedPlayer && (module.targetedPlayer.module || module.targetedPlayer.isDead)))
			module.targetedPlayer = module.getTargetedPlayer();
		
		
		if (module.targetedPlayer && module.getHitbox().isHovering(module.targetedPlayer.getHitbox()))
			module.onHover();
		else if (module.targetedPlayer && !module.targetedPlayer.module)
		{
			var target = new Point(
				module.targetedPlayer.sprite.position.x + (module.targetedPlayer.sprite.width / 2) - (module.sprite.width / 2),
				module.targetedPlayer.sprite.position.y + (module.targetedPlayer.sprite.height / 4)
			);
			
			if (module.sprite.position.x - target.x < 0)
				module.sprite.position.x += module.speed * (3 / 4);
			else
				module.sprite.position.x -= module.speed * (3 / 4);
			
			if (module.sprite.position.y - target.y < 0)
				module.sprite.position.y += module.speed * (3 / 4);
			else
				module.sprite.position.y -= module.speed * (3 / 4);
			
			module.allowCollisionWithEnemies();
			module.allowCollisionWithPlayers();
		}
	}
	
	/**
	 * Anim the module when paired to a player
	 */
	//@Override
	anim(module)
	{
		module.sprite.position.x = module.owner.sprite.position.x + (module.slot == 'front' ? module.owner.sprite.width : -(module.sprite.width));
		module.sprite.position.y = module.owner.sprite.position.y - 7.5;
		module.allowCollisionWithEnemies();
	}
	
	/**
	 * Anim the module to release it
	 */
	releasedAnim(entity)
	{
		if (entity.speed < 0)
			entity.releasedBackAnim(entity);
		else
			entity.releasedFrontAnim(entity);
	}
	
	/**
	 * Release module at front of player
	 */
	releasedFrontAnim(module)
	{
		module.goalX = (module.sprite.position.x + (canvas.width * (3 / 4)) < canvas.width ? module.sprite.position.x + (canvas.width * (3 / 4)) : canvas.width);
		
		if (module.sprite.position.x <= module.goalX)
		{
			module.sprite.position.x += module.speed;
			if (module.speed > 1.5)
				module.speed -= 0.001;
			
			module.allowCollisionWithEnemies();
			module.allowCollisionWithPlayers();
		}
		else
		{
			game.scheduler.removeTask(module.sprite.id);
			game.scheduler.addTask(new Task(module.sprite.id, module.trackPlayerAnim, module));
		}
	}
	
	/**
	 * Release module at back of player
	 */
	releasedBackAnim(module)
	{
		module.goalX = (module.sprite.position.x - (canvas.width * (3 / 4)) > 0 ? module.sprite.position.x - (canvas.width * (3 / 4)) : 0);
		
		if (module.sprite.position.x >= module.goalX)
		{
			module.sprite.position.x += module.speed;
			if (module.speed < -1.5)
				module.speed += 0.001;
			
			module.allowCollisionWithEnemies();
			module.allowCollisionWithPlayers();
		}
		else
		{
			game.scheduler.removeTask(module.sprite.id);
			game.scheduler.addTask(new Task(module.sprite.id, module.trackPlayerAnim, module));
		}
	}
}
