class BitModule extends SpawnableEntity
{
	/**
	 * Create a game entity
	 * @param owner	: [PlayerShip] The owner of this Bit module
	 * @param slot		: [String] The slot of this bit module (top or bottom)
	 */
	constructor(owner, slot)
	{
		super(
			new Sprite(
				owner.sprite.id + 'BitModule-' + slot,
				'images/spritesheets/module/bit_module.png',
				16,
				16,
				new Point(
					owner.sprite.position.x + 7.5,
					owner.sprite.position.y + (slot == 'top' ? (-36) : 36)
				),
				6,
				(slot == 'top' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
				true
			),
			0,
			1
		);
		this.owner = owner;
		this.slot = slot;
		this.damages = 1;
		this.cooldown = false;
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onshoot' event
	 */
	onShoot()
	{
		this.emit('onshoot', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Shoot a DnaBullet
	 */
	shoot()
	{
		if (this.owner.module && this.owner.module.tier >= 1 && this.owner.gun && this.owner.gun.type == 'DNA')
		{
			this.onShoot();
			this.owner.gun.secundaryShoot(this.owner.module);
		}
	}
	
	/* ----- Animations ----- */
	/**
	 * Allow collision with enemies
	 */
	//@Override
	allowCollisionWithEnemies()
	{
		for (var key of game.registeredEnemies.keys())
		{
			var enemy = game.registeredEnemies.get(key);
			if (enemy && enemy.sprite.id.contains('enemy') && !enemy.isDead && this.getHitbox().isHovering(enemy.getHitbox()) && !this.cooldown)
			{
				enemy.damage(this);
				this.cooldown = true;
				window.setTimeout(function(entity) {entity.cooldown = false;}, 800, this);
			}
		}
	}
	
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		this.sprite.position.x = this.owner.sprite.position.x + 7.5;
		this.sprite.position.y = this.owner.sprite.position.y + (this.slot == 'top' ? (-36) : 36);
	}
}
