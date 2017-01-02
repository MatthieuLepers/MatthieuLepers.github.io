class CompilerTopPart extends CompilerPart
{
	/**
	 * Create the Top part of the Compiler Boss
	 */
	constructor()
	{
		super(
			new Sprite(
				'part1_boss_compiler_enemy',
				'images/spritesheets/enemies/bosses/compiler_top_part.png',
				112,
				64,
				new Point(
					canvas.width,
					canvas.height / 2
				),
				6,
				[0, 1, 2, 3, 2, 1, 0],
				true
			)
		);
		this.attachedEntities.set(this.sprite.id + '_attachedTurret', new CompilerTurret(
			this.sprite.id + '_attachedTurret',
			new Point(
				this.sprite.position.x,
				this.sprite.position.y + 25
			),
			new Point(18, 7),
			0,
			'left'
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
		return new Hitbox({position: new Point(this.sprite.position.x + 37, this.sprite.position.y + 52), width: 31, height: 15});
	}
	
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	//@Override
	getBooleanToSatisfyToShoot()
	{
		return (player1 != null && !player1.isDead && player1.sprite.position.x - this.sprite.position.x > this.sprite.width && player1.sprite.position.y + player1.sprite.height >= this.sprite.position.y - 50 && player1.sprite.position.y <= this.sprite.position.y + this.sprite.height + 50) || 
			(player2 != null && !player2.isDead && player2.sprite.position.x - this.sprite.position.x > this.sprite.width && player2.sprite.position.y + player2.sprite.height >= this.sprite.position.y - 50 && player2.sprite.position.y <= this.sprite.position.y + this.sprite.height + 50);
	}
	
	/**
	 * Get the projectile to shoot
	 */
	//@Override
	getProjectile()
	{
		if (this.getBooleanToSatisfyToShoot())
		{
			var projectile = new RedLaser(this.sprite.id + '_redlaser' + game.registeredProjectiles.size, this);
			projectile.sprite.position.x = (this.sprite.position.x + 92);
			projectile.sprite.position.y = (this.sprite.position.y + 19) + (Math.random() * 25);
			projectile.sign = 1;
			
			return projectile;
		}
	}
	
	/* ----- Actions ----- */
	/**
	 * Add attached cannon when entering
	 */
	addCannons()
	{
		this.attachedEntities.set(this.sprite.id + '_attachedCannon_1', new CompilerCannon(
			this.sprite.id + '_attachedCannon_1',
			new Point(
				this.sprite.position.x + 41,
				this.sprite.position.y
			),
			'top'
		));
		//ce cannon est détruit après ajout, trouver pourquoi. Supprimer car outofscreen ?
		this.attachedEntities.set(this.sprite.id + '_attachedCannon_2', new CompilerCannon(
			this.sprite.id + '_attachedCannon_2',
			new Point(
				this.sprite.position.x + 73,
				this.sprite.position.y
			),
			'top'
		));
	}
	
	/* ----- Animations ----- */
	separate()
	{
		game.scheduler.addTask(new Task('separate_' + this.sprite.id, this.separateAnim, {
			entity: this,
			fn: function(entity) {
				compiler.compiler3.onCanMove();
				game.scheduler.addTask(new Task('phase_down_' + entity.sprite.id, entity.phaseMovementVerticallyAnim, {
					entity: entity,
					objective: 0.8 * canvas.height,
					direction: 'down',
					fn: function(entity) {
						game.scheduler.addTask(new Task('phase_right_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
							entity: entity,
							objective: 0.8 * canvas.width,
							direction: 'right',
							fn: function(entity) {
								//Reforme
								game.scheduler.addTask(new Task('phase_left_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
									entity: entity,
									objective: canvas.width / 2,
									direction: 'left',
									fn: function(entity) {entity.incrementReady();}
								}));
								game.scheduler.addTask(new Task('phase_up_' + entity.sprite.id, entity.phaseMovementVerticallyAnim, {
									entity: entity,
									objective: canvas.height / 2,
									direction: 'up',
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
		
		if (entity.sprite.position.x <= canvas.width * 0.1)
		{
			game.scheduler.removeTask('separate_' + entity.sprite.id);
			object.fn(entity);
		}
		else
			entity.move(new Point(-entity.speed, 0));
	}
}