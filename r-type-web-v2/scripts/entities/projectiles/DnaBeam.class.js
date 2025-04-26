class DnaBeam extends PlayerProjectile
{
	/**
	 * Create a player projectile
	 * @param id		: [String] The entity unique id
	 * @param shooter	: [Entity] The entity witch has shot this projectile
	 */
	constructor(id, shooter)
	{
		super(
			new MultipleWidthSprite(
				id,
				'images/spritesheets/projectiles/dna_beam_part1_' + shooter.module.slot + '.png',
				[12, 18, 27, 55, 61, 64, 70, 80, 87, 92, 98, 101, 120],
				56,
				new Point(
					shooter.sprite.position.x + (shooter.module.slot == 'front' ? 38 : (-128)),
					shooter.sprite.position.y - 18
				),
				1,
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				false
			),
			0,
			5,
			ExplosionEntity.noExplosion(),
			shooter,
			10
		);
		
		this.sign = (shooter.module.slot == 'front' ? 1 : -1);
		
		game.statistics.dnaBeamShots[this.shooter.sprite.id]++;
		shooter.module.canThrow = false;
		
		var beam = this;
		this.sprite.addEventListener('ondone', function() {beam.launchBeam(beam);});
	}
	
	/* ----- Actions ----- */
	/**
	 * Modify position and prepare for launching the beam
	 * @param beam : [DnaBeam] The beam
	 */
	launchBeam(beam)
	{
		var id = beam.sprite.id;
		beam.speed = 8;
		game.renderer.deleteSprite(beam.sprite);
		beam.sprite = null;
		beam.sprite = new Sprite(
			id,
			'images/spritesheets/projectiles/dna_beam_part2_' + beam.shooter.module.slot + '.png',
			64,
			32,
			new Point(
				beam.shooter.sprite.position.x + (beam.sign == 1 ? 130 : (-132)),
				beam.shooter.sprite.position.y - 6
			),
			4,
			[0, 1, 2, 3, 4, 5, 6, 7],
			true
		);
		beam.shooter.module.canThrow = true;
	}
	
	/**
	 * Remove the entity from the game without event and animation
	 */
	//@Override
	removeEntity()
	{
		super.removeEntity();
		if (!this.hasHits)
			game.statistics.dnaBeamShotFails[this.shooter.sprite.id]++;
	}
	
	/* ----- Animations ----- */
	/**
	 * Modify the entity position when move
	 */
	//@Override
	modifyPosition()
	{
		super.modifyPosition();
		if (this.speed == 0)
		{
			this.sprite.position.x = this.shooter.sprite.position.x + (this.shooter.module.slot == 'front' ? 38 : (-128));
			this.sprite.position.y = this.shooter.sprite.position.y - 18;
		}
		else
			this.sprite.position.x += this.sign * this.speed;
	}
	
	/**
	 * Set hasHits to true if is a piercing projectile from the player
	 */
	//@Override
	modifyHits()
	{
		super.modifyHits();
		game.statistics.dnaBeamShotHits[this.shooter.sprite.id]++;
	}
}