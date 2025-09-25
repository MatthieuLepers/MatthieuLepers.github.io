class UpgradeWithGun extends Upgrade
{
	/**
	 * Create an upgrade with gun
	 * @param texture	: [Texture] The texture object for this entity
	 * @param dropper	: [PowArmorEnemy] The entity witch drop this upgrade
	 * @param gun		: [Gun] The gun to give to a player when picked
	 */
	constructor(sprite, dropper, gun)
	{
		super(sprite, dropper);
		this.gun = gun;
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
		
		if (game.registeredModules.size > 0)
			if (player.module != null)
			{
				player.module.increaseTier();
				player.module.gun = this.gun;
			}
			else
				for (var key of game.registeredModules.keys())
				{
					var module = game.registeredModules.get(key);
					if (module.owner == null)
					{
						module.increaseTier();
						module.gun = this.gun;
						break;
					}
				}
		
		if (game.registeredModules.size < game.players.size)
		{
			var id = 'module' + (game.registeredModules.size + 1);
			game.registeredModules.set(id, new Module(id));
		}
	}
}