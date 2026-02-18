class SpawnableEntity extends Entity
{
	/**
	 * Create a game entity
	 * @param sprite	: [Sprite] The sprite who represents the entity
	 * @param speed		: [Double] The speed of the entity in pixels
	 * @param lifePoints: [Int] The amount of life poitns for this entity
	 */
	constructor(sprite, speed, lifePoints)
	{
		super(sprite, speed, lifePoints);
		this.launch();
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onlaunched' event
	 */
	onLaunched()
	{
		this.emit('onlaunched', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Launch the entity
	 */
	launch()
	{
		this.onLaunched();
		game.scheduler.addTask(new Task(this.sprite.id, this.anim, this));
		if (game.isLost)
			this.speed *= 2;
	}
}