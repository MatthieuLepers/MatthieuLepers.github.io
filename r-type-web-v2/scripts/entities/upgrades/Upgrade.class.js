class Upgrade extends Entity
{
	/**
	 * Create an upgrade
	 * @param texture	: [Texture] The texture object for this entity
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(sprite, dropper)
	{
		super(
			sprite,
			0.75,
			1
		);
		this.dropper = dropper;
		
		//Events
		this.addEventListener('onpickup', function() {new Sound('sounds/sound_player_pick_upgrade.ogg', true, false);});
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger a 'onpickup' event
	 */
	onPickup()
	{
		this.emit('onpickup', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Launch the entity
	 */
	launch()
	{
		game.scheduler.addTask(new Task(this.sprite.id, this.anim, this));
		if (game.isLost)
			this.speed *= 2;
		game.statistics.spawnedUpgrade++;
	}
	
	/**
	 * Pick the upgrade for a specific player
	 * @param player : [PlayerShip] The player who pick the upgrade
	 */
	pickup(player)
	{
		this.onPickup();
		this.removeEntity();
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x -= this.speed;
	}
	
	/**
	 * Allow collision with players
	 */
	//@Override
	allowCollisionWithPlayers()
	{
		if (player1 != null && !player1.isDead && this.getHitbox().isHovering(player1.getHitbox()))
			this.pickup(player1);
		if (player2 != null && !player2.isDead && this.getHitbox().isHovering(player2.getHitbox()))
			this.pickup(player2);
	}
}