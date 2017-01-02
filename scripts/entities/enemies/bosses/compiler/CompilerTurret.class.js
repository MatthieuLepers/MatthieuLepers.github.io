class CompilerTurret extends EnemyShooter
{
	/**
	 * Create an attached Compiler turret
	 * @param id : [String] Then entity id
	 * @param angle : [Double] The angle of the sprite
	 * @param partOfScreenForShooting : [String] The part of the screen the turret can see (left|right)
	 */
	constructor(id, position, deltaPoint, angle, partOfScreenForShooting)
	{
		super(
			new Sprite(
				id,
				'images/spritesheets/enemies/bosses/compiler_turret.png',
				27,
				16,
				position,
				6,
				[0],
				true
			),
			0,
			0,
			ExplosionEntity.littleExplosion(),
			0,
			0,
			95
		);
		this.sprite.deltaPoint = new Point(this.sprite.position.x + deltaPoint.x, this.sprite.position.y + deltaPoint.y);
		this.sprite.savedPos = new Point(21, 8);
		this.sprite.angle = angle;
		this.isInvulnerable = true;
		this.partOfScreenForShooting = partOfScreenForShooting;
		this.target = player1;
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the boolean to satisfy when the enemy try to shoot
	 */
	//@Override
	getBooleanToSatisfyToShoot()
	{
		if (this.partOfScreenForShooting.contains('left'))
			if (this.partOfScreenForShooting.contains('bottom'))
				return (player1 != null && !player1.isDead && player1.sprite.position.y - this.sprite.position.y > 0) || (player2 != null && !player2.isDead && player2.sprite.position.y - this.sprite.position.y > 0) || (player1 != null && !player1.isDead && player1.sprite.position.x - this.sprite.position.x < 0) || (player2 != null && !player2.isDead && player2.sprite.position.x - this.sprite.position.x < 0);
			else
				return (player1 != null && !player1.isDead && player1.sprite.position.x - this.sprite.position.x < 0) || (player2 != null && !player2.isDead && player2.sprite.position.x - this.sprite.position.x < 0);
		else if (this.partOfScreenForShooting.contains('right'))
			return (player1 != null && !player1.isDead && player1.sprite.position.x - this.sprite.position.x > 0) || (player2 != null && !player2.isDead && player2.sprite.position.x - this.sprite.position.x > 0);
	}
	
	/**
	 * Get the projectile to shoot
	 */
	//@Override
	getProjectile()
	{
		return new PlasmaBall(this.sprite.id + '_plasmaball' + game.registeredProjectiles.size, this, this.target);
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the enemy position for animate it
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.targetPoint = new Point(this.target.sprite.position.x + this.sprite.width, this.target.sprite.position.y);
		
		var distanceX = this.sprite.position.x - this.targetPoint.x;
		var distanceY = (this.sign == 1 ? this.sprite.position.y - this.targetPoint.y : this.targetPoint.y - this.sprite.position.y);
		
		if (this.getBooleanToSatisfyToShoot())
			this.sprite.angle = -(180 * Math.atan2(distanceY, distanceX)) / Math.PI;
	}
}