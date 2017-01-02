class CompilerBoss extends Boss
{
	constructor()
	{
		super('compiler', 1);
		this.compiler1 = new CompilerTopPart();
		this.compiler2 = new CompilerBottomPart();
		this.compiler3 = new CompilerRightPart();
		this.ready = 0;
		this.killedPart = 0;
		
		game.registeredEnemies.set(this.compiler1.sprite.id, this.compiler1);
		game.registeredEnemies.set(this.compiler2.sprite.id, this.compiler2);
		game.registeredEnemies.set(this.compiler3.sprite.id, this.compiler3);
		
		this.addEventListener('onready', function() {
			this.ready = 0;
			game.scheduler.addTask(new Task('idle_' + this.id, this.idleAnim, this));
		});
		this.addEventListener('onpartdestroyed', function() {
			this.killedPart++;
			if (this.killedPart == 3)
				game.onWin();
		});
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onseparate' event
	 */
	onSeparate()
	{
		this.emit('onseparate', this);
	}
	
	/**
	 * Trigger an 'onready' event
	 */
	onReady()
	{
		this.emit('onready', this);
	}
	
	/**
	 * Trigger an 'onpartdestroyed' event
	 */
	onPartDestroyed()
	{
		this.emit('onpartdestroyed', this);
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the number of alive part
	 */
	getNbAliveParts()
	{
		return (this.compiler1.isDead ? 0 : 1) + (this.compiler2.isDead ? 0 : 1) + (this.compiler3.isDead ? 0 : 1);
	}
	
	/* ----- Setters ----- */
	/**
	 * Increment ready by 1 an emit an onready event if equals 2
	 */
	incrementReady()
	{
		this.ready++;
		if (this.ready == this.getNbAliveParts())
			this.onReady();
	}
	
	/* ----- Actions ----- */
	/**
	 * Move the entity
	 * @param goal : [Point] The value to add to sprite position
	 */
	move(goal)
	{
		this.compiler1.move(goal);
		this.compiler2.move(goal);
		this.compiler3.move(goal);
	}
	
	/* ----- Animations ----- */
	/**
	 * Make the entity entering the canvas
	 * @param entity : [Boss] The boss to animate
	 */
	//@Override
	enteringAnim(entity)
	{
		if (entity.compiler1.sprite.position.x <= canvas.width / 2 - (entity.compiler1.sprite.width / 2))
		{
			game.scheduler.removeTask('entering_' + entity.id);
			entity.compiler1.addCannons();
			entity.idleTime = Math.floor(Math.random() * 5) * 1000;
			game.scheduler.addTask(new Task('idle_' + entity.id, entity.idleAnim, entity));
		}
		else
			entity.move(new Point(-entity.speed, 0));
	}
	
	/**
	 * Make the entity playing idle animation
	 * @param entity : [Boss] The boss to animate
	 */
	//@Override
	idleAnim(entity)
	{
		if (entity.idleTime <= 0)
		{
			game.scheduler.removeTask('idle_' + entity.id);
			entity.idleTime = Math.floor(Math.random() * 5) * 1000;
			game.scheduler.addTask(new Task('phase_right_' + entity.id, entity.phaseMovementHorizontallyAnim, {
				entity: entity,
				objective: 0.7 * canvas.width,
				direction: 'right',
				fn: function(entity) {
					game.scheduler.addTask(new Task('phase_down_' + entity.id, entity.phaseMovementVerticallyAnim, {
						entity: entity,
						objective: 0.8 * canvas.height,
						direction: 'down',
						fn: function(entity) {
							game.scheduler.addTask(new Task('phase_up_' + entity.id, entity.phaseMovementVerticallyAnim, {
								entity: entity,
								objective: 0.1 * canvas.height,
								direction: 'up',
								fn: function(entity) {
									game.scheduler.addTask(new Task('phase_separate_' + entity.id, entity.phaseSeparateAnim, entity));
								}
							}));
						}
					}));
				}
			}));
		}
		else
			entity.idleTime -= game.scheduler.speed;
	}
	
	/**
	 * Make the entity playing move horizontally animation
	 * @param entity : [Boss] The boss to animate
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
			b = b && entity.compiler1.sprite.position.x <= objective;
		}
		else if (direction == 'right')
		{
			goal.x = entity.speed;
			b = b && entity.compiler1.sprite.position.x >= objective;
		}
		
		if (b)
		{
			game.scheduler.removeTask('phase_' + direction + '_' + entity.id);
			object.fn(entity);
		}
		else
			entity.move(goal);
	}
	
	/**
	 * Make the entity playing move vertically animation
	 * @param entity : [Boss] The boss to animate
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
			b = b && entity.compiler1.sprite.position.y <= objective;
		}
		else if (direction == 'down')
		{
			goal.y = entity.speed;
			b = b && entity.compiler1.sprite.position.y >= objective;
		}
		
		if (b)
		{
			game.scheduler.removeTask('phase_' + direction + '_' + entity.id);
			object.fn(entity);
		}
		else
			entity.move(goal);
	}
	
	/**
	 * Make the entity playing separate animation
	 * @param entity : [Boss] The boss to animate
	 */
	phaseSeparateAnim(entity)
	{
		game.scheduler.removeTask('phase_separate_' + entity.id);
		//Separate top & bottom
		entity.onSeparate();
		entity.compiler1.ready = 0;
		entity.compiler2.ready = 0;
		entity.compiler3.ready = 0;
		entity.compiler1.separate();
		entity.compiler2.separate();
	}
	
	phaseSemiSeparateAnim(entity)
	{
		game.scheduler.removeTask('phase_separate_' + entity.id);
		//Separate only bottom
		entity.compiler2.separate();
	}
}
