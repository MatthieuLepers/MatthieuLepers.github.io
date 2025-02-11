class DestroyableEntity extends SpawnableEntity
{
	/**
	 * Create a game entity
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 * @param explosion	: [ExplosionEntity] The explosion type for this entity
	 */
	constructor(sprite, speed, lifePoints, explosion)
	{
		super(sprite, speed, lifePoints);
		this.explosion = explosion;
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
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	explode()
	{
		this.onDestroyed();
		this.isDead = true;
		var explosionEntity = new ExplosionEntity(
			this.sprite.id,
			this.explosion.image,
			this.explosion.width,
			this.explosion.height,
			this.sprite.position,
			this.explosion.frames
		);
		
		game.renderer.replaceSprite(explosionEntity.sprite);
		window.setTimeout(function(entity) {
			entity.removeEntity();
		}, 1000, this);
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
}