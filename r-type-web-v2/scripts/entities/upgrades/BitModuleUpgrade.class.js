class BitModuleUpgrade extends Upgrade
{
	/**
	 * Create a bit module upgrade
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(dropper)
	{
		super(
			new Sprite(
				'upgrade_' + dropper.sprite.id,
				'images/spritesheets/module/bit_module.png',
				16,
				16,
				new Point(
					dropper.sprite.position.x + (dropper.sprite.width / 2) - 8,
					dropper.sprite.position.y + (dropper.sprite.height / 2) - 8
				),
				6,
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
		game.statistics.pickedBitModuleUpgrade[player.sprite.id]++;
		this.removeEntity();
		
		if (player.bitModules.size == 0)
			player.bitModules.set('top', new BitModule(player, 'top'));
		else if(player.bitModules.size == 1)
			player.bitModules.set('bottom', new BitModule(player, 'bottom'));
	}
}