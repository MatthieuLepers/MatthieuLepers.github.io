class CompilerRightPart extends EnemyShooter
{
	/**
	 * Create the Top part of the Compiler Boss
	 */
	constructor()
	{
		super(
			new Sprite(
				'part3_boss_compiler',
				'images/spritesheets/enemies/bosses/compiler_right_part.png',
				96,
				80,
				new Point(
					canvas.width / 2 + 81,
					canvas.height / 2 - 8
				),
				6,
				[0, 1, 2, 3, 2, 1, 0],
				true
			),
			0,
			400,
			ExplosionEntity.bigExplosion(),
			10,
			2500,
			90
		);
		this.cooldownTime = 400;
		
		this.attachedEntities = new Map();
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
	 * Get the entity's collison box
	 * @return [Hitbox] The entity's collision box
	 */
	getFullHitbox()
	{
		return new Hitbox(this.sprite);
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
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		//this.getHitbox().debugDraw();
		//this.getFullHitbox().debugDraw();
		for (var key of game.registeredProjectiles.keys())
		{
			var pr = game.registeredProjectiles.get(key);
			if (pr != null && pr instanceof PlayerProjectile && this.getFullHitbox().isHovering(pr.getHitbox()))
				pr.explode();
		}
		if (player1 != null && !player1.isDead && !player1.isInvulnerable && this.getFullHitbox().isHovering(player1.getHitbox()))
		{
			this.explode();
			player1.explode();
		}
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && this.getFullHitbox().isHovering(player2.getHitbox()))
		{
			this.explode();
			player2.explode();
		}
	}
}