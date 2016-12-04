class CompilerBottomPart extends Enemy
{
	/**
	 * Create the Bottom part of the Compiler Boss
	 */
	constructor()
	{
		super(
			new Sprite(
				'part2_boss_compiler',
				'images/spritesheets/enemies/bosses/compiler_bottom_part.png',
				96,
				96,
				new Point(
					canvas.width / 2 + 33,
					canvas.height / 2 + 40
				),
				6,
				[0, 1, 2, 3, 2, 1, 0],
				true
			),
			0,
			400,
			ExplosionEntity.bigExplosion(),
			10,
			2500
		);
		
		this.target = player1;
		
		this.cooldownTime = 400;
		
		this.attachedEntities = new Map();
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
	getFullHitbox()
	{
		return new Hitbox({position: new Point(this.sprite.position.x, this.sprite.position.y + 29), width: this.sprite.width, height: this.sprite.height - 29});
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
	
	//@Override
	explode()
	{
		super.explode();
		for (var key of this.attachedEntities.keys())
			if (this.attachedEntities.get(key) != null)
				this.attachedEntities.get(key).explode();
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
		var hitbox = new Hitbox({position: this.sprite.position, width: 48, height: 29});
		//hitbox.debugDraw();
		
		for (var key of game.registeredProjectiles.keys())
		{
			var pr = game.registeredProjectiles.get(key);
			if (pr != null && pr instanceof PlayerProjectile && (this.getFullHitbox().isHovering(pr.getHitbox()) || hitbox.isHovering(pr.getHitbox())))
				pr.explode();
		}
		if (player1 != null && !player1.isDead && !player1.isInvulnerable && (this.getFullHitbox().isHovering(player1.getHitbox()) || hitbox.isHovering(player1.getHitbox())))
		{
			this.explode();
			player1.explode();
		}
		if (player2 != null && !player2.isDead && !player2.isInvulnerable && (this.getFullHitbox().isHovering(player2.getHitbox()) || hitbox.isHovering(player2.getHitbox())))
		{
			this.explode();
			player2.explode();
		}
	}
}