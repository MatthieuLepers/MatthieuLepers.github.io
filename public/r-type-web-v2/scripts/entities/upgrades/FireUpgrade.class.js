class FireUpgrade extends UpgradeWithGun
{
	/**
	 * Create a Fire Upgrade witch contains FIRE gun
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(dropper)
	{
		super(
			new Sprite(
				'upgrade_' + dropper.sprite.id,
				'images/spritesheets/bonus/fire.png',
				20,
				18,
				new Point(
					dropper.sprite.position.x + (dropper.sprite.width / 2) - 10,
					dropper.sprite.position.y + (dropper.sprite.height / 2) - 9
				),
				6,
				[0, 1, 2, 1],
				true
			),
			dropper,
			new FireGun()
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
		super.pickup(player);
		game.statistics.pickedFireUpgrade[player.sprite.id]++;
	}
}