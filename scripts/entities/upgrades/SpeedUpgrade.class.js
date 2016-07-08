class SpeedUpgrade extends Upgrade
{
	/**
	 * Create a speed upgrade
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(dropper)
	{
		super(
			new Sprite(
				'upgrade_' + dropper.id,
				'images/spritesheets/bonus/speed.png',
				24,
				20,
				new Point(
					dropper.sprite.position.x + (dropper.sprite.width / 2) - 12,
					dropper.sprite.position.y + (dropper.sprite.height / 2) - 10
				),
				6,
				[0, 1, 2, 1],
				true
			),
			dropper
		);
	}
	
	/* ----- Actions ----- */
	/**
	 * Pick the upgrade for a specific player
	 * @param player : [PlayerShip] The player who pick the upgrade
	 */
	//@Override
	pickup(player)
	{
		this.onPickup();
		game.statistics.pickedSpeedUpgrade[player.sprite.id]++;
		this.removeEntity();
		
		if (player.speed < 4)
			player.speed += 0.5;
		
		player.acceleration = new Sprite(
			player.sprite.id + '_acceleration',
			'images/spritesheets/particles/booster.png',
			32,
			32,
			new Point(
				player.sprite.position.x - 32,
				player.sprite.position.y - 8
			),
			6,
			[0, 1, 2, 3, 4],
			false
		);
		
		window.setTimeout(function(player) {
			player.acceleration = null;
			game.renderer.deleteSprite(player.sprite.id + '_acceleration');
		}, 1000, player);
	}
}