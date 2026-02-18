class CompilerBottomPart extends CompilerPart
{
	/**
	 * Create the Bottom part of the Compiler Boss
	 */
	constructor()
	{
		super(
			new Sprite(
				'part2_boss_compiler_enemy',
				'images/spritesheets/enemies/bosses/compiler_bottom_part.png',
				96,
				96,
				new Point(
					canvas.width + 33,
					canvas.height / 2 + 40
				),
				6,
				[0, 1, 2, 3, 2, 1, 0],
				true
			)
		);
		this.attachedEntities.set('a' + this.sprite.id + '_attachedTurret1', new CompilerTurret(
			'a' + this.sprite.id + '_attachedTurret1',
			new Point(
				this.sprite.position.x + 6,
				this.sprite.position.y + 49
			),
			new Point(19, 7),
			0,
			'left'
		));
		this.attachedEntities.set('a' + this.sprite.id + '_attachedTurret2', new CompilerTurret(
			'a' + this.sprite.id + '_attachedTurret2',
			new Point(
				this.sprite.position.x + 12,
				this.sprite.position.y + 73
			),
			new Point(21, 7),
			0,
			'bottom left'
		));
		
		this.addEventListener('onready', function() {
			compiler.incrementReady();
		});
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the entity's eye collison box
	 * @return [Hitbox] The entity's eye collision box
	 */
	//@Override
	getHitbox()
	{
		return new Hitbox({position: new Point(this.sprite.position.x + 57, this.sprite.position.y + 17), width: 32, height: 16});
	}
	
	/**
	 * Get the entity's collison box
	 * @return [Hitbox] The entity's collision box
	 */
	//@Override
	getFullHitbox()
	{
		return new Hitbox({position: new Point(this.sprite.position.x, this.sprite.position.y + 29), width: this.sprite.width, height: this.sprite.height - 29});
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		var hitbox = new Hitbox({position: this.sprite.position, width: 48, height: 29});
		for (var key of game.registeredProjectiles.keys())
		{
			var pr = game.registeredProjectiles.get(key);
			if (pr != null && pr instanceof PlayerProjectile && (this.getFullHitbox().isHovering(pr.getHitbox()) || hitbox.isHovering(pr.getHitbox())))
				pr.explode();
		}
		if (player1 != null && !player1.isDead && !player1.isInvulnerable && (this.getFullHitbox().isHovering(player1.getHitbox()) || hitbox.isHovering(player1.getHitbox())))
			this.explode();
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && (this.getFullHitbox().isHovering(player2.getHitbox()) || hitbox.isHovering(player2.getHitbox())))
			this.explode();
	}
	
	separate()
	{
		game.scheduler.addTask(new Task('separate_' + this.sprite.id, this.separateAnim, {
			entity: this,
			fn: function(entity) {
				game.scheduler.addTask(new Task('phase_up_' + entity.sprite.id, entity.phaseMovementVerticallyAnim, {
					entity: entity,
					objective: 0.1 * canvas.height,
					direction: 'up',
					fn: function(entity) {}
				}));
				game.scheduler.addTask(new Task('phase_left_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
					entity: entity,
					objective: 0.1 * canvas.width,
					direction: 'left',
					fn: function(entity) {
						game.scheduler.addTask(new Task('phase_right_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
							entity: entity,
							objective: 0.8 * canvas.width,
							direction: 'right',
							fn: function(entity) {
								//Reforme
								game.scheduler.addTask(new Task('phase_left_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
									entity: entity,
									objective: canvas.width / 2 + 33,
									direction: 'left',
									fn: function(entity) {entity.incrementReady();}
								}));
								game.scheduler.addTask(new Task('phase_down_' + entity.sprite.id, entity.phaseMovementVerticallyAnim, {
									entity: entity,
									objective: canvas.height / 2 + 40,
									direction: 'down',
									fn: function(entity) {entity.incrementReady();}
								}));
							}
						}));
					}
				}));
			}
		}));
	}
	
	separateAnim(object)
	{
		var entity = object.entity;
		
		if (entity.sprite.position.y >= canvas.height * 0.8)
		{
			game.scheduler.removeTask('separate_' + entity.sprite.id);
			object.fn(entity);
		}
		else
			entity.move(new Point(0, entity.speed));
	}
}