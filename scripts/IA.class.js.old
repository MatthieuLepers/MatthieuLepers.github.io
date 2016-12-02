class IA
{
	/**
	 * Create an IA witch shoot when detects an enemy on the canvas
	 * @param player : [PlayerShip] The player witch use the IA
	 */
	constructor(player)
	{
		this.player = player;
		this.cooldown = false;
		
		this.launch();
	}
	
	/* ----- Actions ----- */
	/**
	 * Launch the IA in scheduler
	 */
	launch()
	{
		game.scheduler.addTask(new Task(this.player.sprite.id + '_id', this.anim, this));
	}
	
	/**
	 * Clear the entity cooldown
	 * @param entity : [IA] The ia to clear cooldown
	 */
	clearCooldown(entity)
	{
		entity.cooldown = false;
	}
	
	/* ----- Animations ----- */
	/**
	 * Animate the entity
	 * @param entity : [Entity] The entity to animate
	 */
	anim(entity)
	{
		for (var key of game.registeredEnemies.keys())
		{
			var enemy = game.registeredEnemies.get(key);
			if (enemy != null && /enemy[0-9]+/.test(enemy.sprite.id) && !entity.cooldown)
				if (enemy.sprite.position.y <= entity.player.sprite.position.y && enemy.sprite.position.y + enemy.sprite.height >= entity.player.sprite.position.y + entity.player.sprite.height)
				{
					entity.player.shoot();
					entity.cooldown = true;
					window.setTimeout(entity.clearCooldown, 100, entity);
				}
		}
	}
}