class ForceFieldUpgrade extends Upgrade
{
	/**
	 * Create a force field upgrade
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 */
	constructor(dropper)
	{
		super(
			new Sprite(
				'upgrade_' + dropper.id,
				'images/spritesheets/bonus/forcefield.png',
				20,
				20,
				new Point(
					dropper.sprite.position.x + (dropper.sprite.width / 2) - 10,
					dropper.sprite.position.y + (dropper.sprite.height / 2) - 10
				),
				6,
				[0, 1, 2, 3],
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
		game.statistics.pickedForceFieldUpgrade[player.sprite.id]++;
		this.removeEntity();
		if (!player.isDead)
		{
			player.lifePoints += 2;
			player.forcefield = new Sprite(
				player.sprite.id + 'forcefield',
				'images/spritesheets/particles/forcefield.png',
				64,
				64,
				new Point(
					player.sprite.position.x + (player.sprite.width / 2) - 32,
					player.sprite.position.y + (player.sprite.height / 2) - 32
				),
				4,
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
				false
			);
		}
	}
}