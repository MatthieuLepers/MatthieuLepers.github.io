class DnaBullet extends PlayerProjectile
{
	/**
	 * Create a dna bullet
	 * @param id		: [String] The entity unique id
	 * @param color		: [String] The color of the bullet (red or blue)
	 * @param module	: [Module] The module
	 * @param shooter	: [Entity] The entity witch has shot the projectile
	 */
	constructor(id, color, module, shooter)
	{
		super(
			DnaBullet.getSprite(id, color, module, shooter),
			8,
			3,
			ExplosionEntity.dnaBulletExplosion(),
			shooter,
			3
		);
		this.color = color;
		this.module = module;
		this.sign = (module.slot == 'front' ? 1 : -1);
	}
	
	/* ----- Getters ----- */
	static getSprite(id, color, module, shooter)
	{
		return new Sprite(
			id,
			'images/spritesheets/projectiles/dna_bullet.png',
			32,
			4,
			DnaBullet.getPosition(color, module, shooter),
			6,
			(module.slot == 'front' ? (color == 'blue' ? [0, 1] : [2, 3]) : (color == 'blue' ? [4, 5] : [6, 7])),
			true
		);
	}
	
	static getPosition(color, module, shooter)
	{
		var sign = (module.slot == 'front' ? 1 : -1);
		
		//Shooter is a bit module
		if (module == shooter)
			return new Point(module.owner.sprite.position.x + (sign > 0 ? (module.owner.sprite.width + 5) : (-module.owner.sprite.width)), module.owner.sprite.position.y + (color == 'blue' ? 16 : (-3)));
		//Shooter is the module
		else
			return new Point(module.owner.sprite.position.x + (sign > 0 ? 14 : (-2)), module.owner.sprite.position.y + (color == 'blue' ? 44 : (-31)));
	}
	
	/* ----- Actions ----- */
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		//Shooter is a bit module
		if (this.module == this.shooter && this.module.owner != null)
			game.statistics.bitModuleShotFails[this.module.owner.sprite.id] += (!this.hasHits ? 1 : 0);
		//Shooter is the module
		else if (this.module.owner != null)
			game.statistics.dnaBulletShotFails[this.module.owner.sprite.id] += (!this.hasHits ? 1 : 0);
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		this.sprite.position.x += this.sign * this.speed;
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		//Shooter is a bit module
		if (this.module == this.shooter && this.module.owner != null)
			game.statistics.bitModuleShotHits[this.module.owner.sprite.id]++;
		//Shooter is the module
		else if (this.module.owner != null)
			game.statistics.dnaBulletShotHits[this.module.owner.sprite.id]++;
	}
}