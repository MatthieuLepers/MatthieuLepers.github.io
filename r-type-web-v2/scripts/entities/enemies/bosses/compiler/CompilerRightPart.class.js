class CompilerRightPart extends CompilerPart
{
	/**
	 * Create the Top part of the Compiler Boss
	 */
	constructor()
	{
		super(
			new Sprite(
				'part3_boss_compiler_enemy',
				'images/spritesheets/enemies/bosses/compiler_right_part.png',
				96,
				80,
				new Point(
					canvas.width + 81,
					canvas.height / 2 - 8
				),
				6,
				[0, 1, 2, 3, 2, 1, 0],
				true
			)
		);
		
		this.addEventListener('oncanmove', function() {
			this.animate();
		});
		this.addEventListener('onready', function() {
			compiler.incrementReady();
		});
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'oncanmove' event
	 */
	onCanMove()
	{
		this.emit('oncanmove', this);
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the entity's eye collison box
	 * @return [Hitbox] The entity's eye collision box
	 */
	//@Override
	getHitbox()
	{
		return new Hitbox({position: new Point(this.sprite.position.x - 2, this.sprite.position.y + 24), width: 16, height: 26});
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
			projectile.sprite.position.x = (this.sprite.position.x + 62);
			projectile.sprite.position.y = (this.sprite.position.y + 20) + (Math.random() * 41);
			projectile.sign = 1;
			
			return projectile;
		}
	}
	
	/* ----- Animations ----- */
	/**
	 * Start animate this entity
	 */
	animate()
	{
		game.scheduler.addTask(new Task('phase_down_' + this.sprite.id, this.phaseMovementVerticallyAnim, {
			entity: this,
			objective: 0.5 * canvas.height,
			direction: 'down',
			fn: function(entity) {
				game.scheduler.addTask(new Task('phase_left_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
					entity: entity,
					objective: 0.1 * canvas.width,
					direction: 'left',
					fn: function(entity) {
						//Reforme
						game.scheduler.addTask(new Task('phase_right_' + entity.sprite.id, entity.phaseMovementHorizontallyAnim, {
							entity: entity,
							objective: canvas.width / 2 + 81,
							direction: 'right',
							fn: function(entity) {entity.incrementReady();}
						}));
						game.scheduler.addTask(new Task('phase_up_' + entity.sprite.id, entity.phaseMovementVerticallyAnim, {
							entity: entity,
							objective: canvas.height / 2 - 8,
							direction: 'up',
							fn: function(entity) {entity.incrementReady();}
						}));
					}
				}));
			}
		}));
	}
}