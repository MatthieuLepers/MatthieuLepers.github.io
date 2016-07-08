class RocketsUpgrade extends Upgrade
{
	/**
	 * Create a rockets upgrade
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(dropper)
	{
		super(
			new Sprite(
				'upgrade_' + dropper.sprite.id,
				'images/spritesheets/bonus/rockets.png',
				21,
				18,
				new Point(
					dropper.sprite.position.x + (dropper.sprite.width / 2) - 10.5,
					dropper.sprite.position.y + (dropper.sprite.height / 2) - 9
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
		game.statistics.pickedRocketsUpgrade[player.sprite.id]++;
		this.removeEntity();
		
		if (!player.isDead && !player.hasRockets)
		{
			player.hasRockets = true;
			player.rocketsTimer = window.setInterval(Rocket.launchRockets, 2000, player);
		}
	}
}