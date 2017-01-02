class CompilerPart extends EnemyShooter
{
	constructor(sprite)
	{
		super(sprite, 1, 400, ExplosionEntity.bigExplosion(), 10, 2500, 90);
		this.attachedEntities = new Map();
		this.target = player1;
		this.cooldownTime = 400;
		this.ready = 0;
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onready' event
	 */
	onReady()
	{
		this.emit('onready', this);
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the entity's collison box
	 * @return [Hitbox] The entity's collision box
	 */
	getFullHitbox()
	{
		return new Hitbox(this.sprite);
	}
	
	/* ----- Setters ----- */
	/**
	 * Increment ready by 1 an emit an onready event if equals 2
	 */
	incrementReady()
	{
		this.ready++;
		if (this.ready == 2)
			this.onReady();
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
				game.statistics.killedCompiler[damager.shooter.sprite.id]++;
			//Module if attached to a player
			else if (damager.owner)
				game.statistics.killedCompiler[damager.owner.sprite.id]++;
		}
		else
			new Sound('sounds/sound_forcefield_hits.ogg', true, false);
	}
	
	/**
	 * Make the entity explode
	 */
	//@Override
	explode()
	{
		super.explode();
		compiler.onPartDestroyed();
		for (var key of this.attachedEntities.keys())
			if (this.attachedEntities.get(key) != null)
				this.attachedEntities.get(key).explode();
	}
	
	/**
	 * Move the entity
	 * @param goal : [Point] The dual value to add to the entity position
	 */
	move(goal)
	{
		this.sprite.position.x += goal.x;
		this.sprite.position.y += goal.y;
		
		for (var key of this.attachedEntities.keys())
			if (this.attachedEntities.get(key) != null)
			{
				var entity = this.attachedEntities.get(key);
				entity.sprite.position.x += goal.x;
				entity.sprite.position.y += goal.y;
				entity.sprite.deltaPoint = new Point(entity.sprite.deltaPoint.x + goal.x, entity.sprite.deltaPoint.y + goal.y);
			}
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		for (var key of game.registeredProjectiles.keys())
		{
			var pr = game.registeredProjectiles.get(key);
			if (pr != null && pr instanceof PlayerProjectile && this.getFullHitbox().isHovering(pr.getHitbox()))
				pr.explode();
		}
		if (player1 != null && !player1.isDead && !player1.isInvulnerable && this.getFullHitbox().isHovering(player1.getHitbox()))
			player1.explode();
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && this.getFullHitbox().isHovering(player2.getHitbox()))
			player2.explode();
	}
	
	/**
	 * Make the entity playing move horizontally animation
	 * @param entity : [CompilerPart] The boss part to animate
	 */
	phaseMovementHorizontallyAnim(object)
	{
		var entity = object.entity;
		var direction = object.direction;
		var objective = object.objective;
		var goal = new Point(0, 0);
		var b = true;
		
		if (direction == 'left')
		{
			goal.x = -entity.speed;
			b = b && entity.sprite.position.x <= objective;
		}
		else if (direction == 'right')
		{
			goal.x = entity.speed;
			b = b && entity.sprite.position.x >= objective;
		}
		
		if (b)
		{
			game.scheduler.removeTask('phase_' + direction + '_' + entity.sprite.id);
			object.fn(entity);
		}
		else if (!entity.isDead)
			entity.move(goal);
	}
	
	/**
	 * Make the entity playing move vertically animation
	 * @param entity : [CompilerPart] The boss part to animate
	 */
	phaseMovementVerticallyAnim(object)
	{
		var entity = object.entity;
		var direction = object.direction;
		var objective = object.objective;
		var goal = new Point(0, 0);
		var b = true;
		
		if (direction == 'up')
		{
			goal.y = -entity.speed;
			b = b && entity.sprite.position.y <= objective;
		}
		else if (direction == 'down')
		{
			goal.y = entity.speed;
			b = b && entity.sprite.position.y >= objective;
		}
		
		if (b)
		{
			game.scheduler.removeTask('phase_' + direction + '_' + entity.sprite.id);
			object.fn(entity);
		}
		else if (!entity.isDead)
			entity.move(goal);
	}
}
