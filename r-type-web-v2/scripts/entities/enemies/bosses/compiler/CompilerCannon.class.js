class CompilerCannon extends EnemyShooter
{
	/**
	 * Create an attached Compiler turret
	 * @param id : [String] Then entity id
	 * @param position : [Point] The position where the cannon is
	 * @param partOfScreenForShooting : [String] The part of the screen the turret can see (left|right)
	 */
	constructor(id, position)
	{
		super(
			new Sprite(
				id,
				'images/gui/none.png',
				16,
				1,
				position,
				6,
				[0],
				false
			),
			0,
			0,
			ExplosionEntity.bigExplosion(),
			0,
			0,
			95
		);
		this.isInvulnerable = true;
		this.target = player1;
		
		this.cooldownTime = 600;
		this.otherProjectiles = function(entity) {
			window.setTimeout(function(entity) {
				var projectile = entity.getProjectile();
				game.registeredProjectiles.set(projectile.sprite.id, projectile);
			}, 300, entity);
		};
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	getBooleanToSatisfyToShoot()
	{
		return (player1 != null && !player1.isDead && player1.sprite.position.y + player1.sprite.height >= this.sprite.position.y - 200 && player1.sprite.position.y + player1.sprite.height <= this.sprite.position.y && player1.sprite.position.x + player1.sprite.width >= this.sprite.position.x - 100 && player1.sprite.position.x <= this.sprite.position.x + this.sprite.width + 100) || 
		(player2 != null && !player2.isDead && player2.sprite.position.y + player2.sprite.height >= this.sprite.position.y - 200 && player2.sprite.position.y + player2.sprite.height <= this.sprite.position.y && player2.sprite.position.x + player2.sprite.width >= this.sprite.position.x - 100 && player2.sprite.position.x <= this.sprite.position.x + this.sprite.width + 100);
	}
	
	/**
	 * Get the projectile to shoot
	 */
	getProjectile()
	{
		return new CompilerPlasmaBall(this.sprite.id + '_plasmaball' + game.registeredProjectiles.size, this, this.target);
	}
}