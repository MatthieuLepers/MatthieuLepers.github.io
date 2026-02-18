class Entity extends EventsEmitter
{
	/**
	 * Create a game entity
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 */
	constructor(sprite, speed, lifePoints)
	{
		super();
		
		//Entity informations
		this.sprite = sprite;
		this.speed = speed;
		this.lifePoints = lifePoints;
		this.resistance = 1;
		this.isInvulnerable = true;
		this.isDead = false;
		this.tags = new Map();
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the entity's collison box
	 * @return [Hitbox] The entity's collision box
	 */
	getHitbox()
	{
		return new Hitbox(this.sprite);
	}
	
	/* ----- Booleans ----- */
	/**
	 * Test if the entity is out of screen
	 * @return [Boolean] true if is, false else
	 */
	isOutOfScreen()
	{
		var bX = this.sprite.position.x < -(this.sprite.width + 50) || this.sprite.position.x > canvas.width + this.sprite.width + 50;
		var bY = this.sprite.position.y < -(this.sprite.height + 50) || this.sprite.position.y > canvas.height + this.sprite.height + 50;
		return bX || bY;
	}
	
	addTag(tagName)
	{
		this.tags.set(tagName, true);
	}
	
	hasTag(tagName)
	{
		return this.tags.has(tagName);
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'ondestroyed' event
	 */
	onDestroyed()
	{
		this.emit('ondestroyed', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Damage the entity
	 * @param damager : [Entity] The damager
	 */
	damage(damager)
	{
		this.lifePoints -= damager.damages;
		if (this.lifePoints <= 0 && !this.isInvulnerable)
			this.explode();
	}
	
	/**
	 * Remove the entity from the game without event and animation
	 */
	removeEntity()
	{
		this.sprite.position.x = -this.sprite.width;
		this.sprite.position.y = -this.sprite.height;
		game.scheduler.removeTask(this.sprite.id);
		this.sprite.onAnimationFinished();
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	modifyPosition()
	{
		if (!this.isOutOfScreen())
			this.isInvulnerable = false;
	}
	
	/**
	 * Allow collision with players
	 */
	allowCollisionWithPlayers() {}
	
	/**
	 * Allow collision with enemies
	 */
	allowCollisionWithEnemies() {}
	
	/**
	 * Allow collision with modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	allowCollisionWithModules(module1, module2) {}
	
	/**
	 * Allow collision with bit modules
	 */
	allowCollisionWithBitModules() {}
	
	/**
	 * Allow the entity to be absorbed by modules
	 * @param module1 : [Module] The first module in game
	 * @param module2 : [Module] The second module in game
	 */
	allowAbsorbsion(module1, module2) {}
	
	/**
	 * Animate the entity
	 * @param entity : [Entity] The entity to animate
	 */
	anim(entity)
	{
		var id = entity.sprite.id;
		var scheduler = game.scheduler;
		
		if (entity.isOutOfScreen())
		{
			entity.removeEntity();
			game.registeredProjectiles.set(entity.sprite.id, null);
		}
		else
		{
			var module1 = game.getModule(1) || null;
			var module2 = game.getModule(2) || null;
			
			if (!entity.isDead)
			{
				entity.modifyPosition();
				entity.allowCollisionWithPlayers();
				entity.allowCollisionWithModules(module1, module2);
				entity.allowCollisionWithBitModules();
			}
			
			entity.allowAbsorbsion(module1, module2);
			entity.allowCollisionWithEnemies();
		}
	}
}