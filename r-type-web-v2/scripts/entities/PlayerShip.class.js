class PlayerShip extends SpawnableEntity
{
	/**
	 * Create a player ship	sprite, speed, lifePoints
	 */
	constructor()
	{
		super(
			new Sprite(
				'player' + (game.players.size + 1),
				'images/spritesheets/player/' + game.params.get('skin_' + 'player' + (game.players.size + 1)) + '.png',
				32,
				15,
				new Point(
					-32,
					canvas.height / 2
				),
				0,
				[2],
				false
			),
			2,
			1
		);
		this.direction = '';				// Used for setting the good texture when move
		this.score = 100;					// Used for store score
		this.triesLeft = 3;					// Used for get how many respawn left
		this.isInvulnerable = false;		// Used for respawning
		this.canMove = false;				// Used for starting animation
		this.isCharging = false;			// Used when player is charging a shot
		
		//Charged beam
		this.charge = {
			sprite: new Sprite(
				this.sprite.id + '_charge',
				'images/gui/none.png',
				1,
				1,
				new Point(
					this.sprite.position.x + 33,
					this.sprite.position.y - 5
				),
				0,
				[0],
				false
			),
			timer: null,
			audio: null
		};
		this.forcefield = null;
		this.shootAudio = null;
		
		//Module
		this.module = null;
		this.bitModules = new Map();
		this.hasRockets = false;
		this.rocketTimer = null;
		this.releasedModule = null;
		
		this.achievements = new Achievements();
		
		this.launch();
		
		//Events
		this.addEventListener('onshoot', 		function() {
			var sound = 'player_shoot.ogg';
			if (this.module != null && !this.module.cooldown)
				if (this.module.tier > 0)
					if (this.module.gun.type == 'DNA')
						sound = 'dna_beam.ogg';
					else if (this.module.gun.type == 'LASER')
						sound = 'bluelaser.ogg';
			
			this.shootAudio = new Sound('sounds/sound_' + sound, true, false);
		});
		this.addEventListener('onshootcharged', function() {new Sound('sounds/sound_player_shoot_charged.ogg', true, false);});
		this.addEventListener('oncharge', 		function() {this.isCharging = true; this.charge.audio = new Sound('sounds/sound_player_charge.ogg', true, false);});
		this.addEventListener('onchargeover', 	function() {this.isCharging = false; this.charge.audio.pause();});
		this.addEventListener('ondestroyed', 	function() {
			if (this.charge.audio != null)
				this.charge.audio.pause();
			document.getElementById('powerBar' + this.sprite.id).children[0].style.width = '0px';
			window.clearInterval(this.charge.timer);
			new Sound('sounds/sound_player_explosion.ogg', true, false);
		});
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger a 'onmove' event
	 */
	onMove()
	{
		this.emit('onmove', this);
	}
	
	/**
	 * Trigger a 'onshoot' event
	 */
	onShoot()
	{
		this.emit('onshoot', this);
	}
	
	/**
	 * Trigger a 'onshootcharged' event
	 */
	onShootCharged()
	{
		this.emit('onshootcharged', this);
	}
	
	/**
	 * Trigger a 'oncharge' event
	 */
	onCharge()
	{
		this.emit('oncharge', this);
	}
	
	/**
	 * Trigger a 'onshootcharged' event
	 */
	onChargeOver()
	{
		this.emit('onchargeover', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Do the entrance animation
	 */
	launch()
	{
		this.onLaunched();
		game.scheduler.addTask(new Task(this.sprite.id, this.animStart, this));
		game.renderer.addSprite(this.sprite);
	}
	
	/**
	 * Respawn the player if has tries left
	 */
	respawn()
	{
		game.renderer.replaceSprite(new Sprite(
			this.sprite.id,
			'images/spritesheets/player/' + game.params.get('skin_' + this.sprite.id) + '.png',
			32,
			15,
			new Point(
				5,
				canvas.height / 2
			),
			0,
			[2],
			true
		));
		this.score = (this.score >= 2000 ? this.score - 2000 : 0);
		this.lifePoints = 1;
		this.speed = 2;
		this.isDead = false;
		this.isInvulnerable = true;
		this.hasRockets = false;
		if (this.forcefield != null)
			game.renderer.deleteSprite(this.forcefield.id);
		window.clearInterval(this.rocketTimer);
		
		game.onScoreboardChange();
		
		if (game.players.size == 2)
			if (this.sprite.id == 'player1')
				this.sprite.position = new Point(5, canvas.height / 3);
			else
				this.sprite.position = new Point(5, canvas.height * (2 / 3));
		else
			this.sprite.position = new Point(5, canvas.height / 2);
		
		game.renderer.replaceSprite(this.sprite);
		
		window.setTimeout(function(player) {
			player.isInvulnerable = false;
		}, 2000, this);
	}
	
	/**
	 * Move the ship to a new position
	 * @param goal : [Point] The point wher the ship move
	 */
	move(goal)
	{
		if (!this.isDead && !game.scheduler.isPaused && this.canMove)
		{
			if ((this.sprite.position.x + goal.x) > 0 && (this.sprite.position.x + goal.x) < canvas.width - 32)
			{
				this.sprite.position.x += goal.x;
				this.charge.sprite.position.x += goal.x;
				if (this.acceleration != null)
					this.acceleration.position.x += goal.x;
				if (this.forcefield != null)
					this.forcefield.position.x += goal.x;
			}
			if ((this.sprite.position.y + goal.y) > 0 && (this.sprite.position.y + goal.y) < canvas.height - 15)
			{
				this.sprite.position.y += goal.y;
				this.charge.sprite.position.y += goal.y;
				if (this.acceleration != null)
					this.acceleration.position.y += goal.y;
				if (this.forcefield != null)
					this.forcefield.position.y += goal.y;
			}
			this.onMove();
		}
	}
	
	/**
	 * Damage the entity
	 * @param damager : [Entity] The damager
	 */
	damage(damager)
	{
		super.damage(damager);
		if (!this.isDead && this.lifePoints == 1 && this.forcefield != null)
		{
			game.renderer.deleteSprite(this.forcefield.id);
			this.forcefield = null;
		}
		if (!this.isDead && this.lifePoints - damager.damages > 1)
		{
			new Sound('sounds/sound_forcefield_hits.ogg', true, false);
			game.renderer.replaceSprite(new Sprite(
				this.sprite.id + 'forcefield',
				'images/spritesheets/particles/forcefield.png',
				64,
				64,
				new Point(
					this.sprite.position.x + (this.sprite.width / 2) - 32,
					this.sprite.position.y + (this.sprite.height / 2) - 32
				),
				4,
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
				false
			));
		}
	}
	
	/**
	 * Shoot a bullet
	 */
	shoot()
	{
		if (!this.isDead && !game.scheduler.isPaused && !hasPress[this.sprite.id])
		{
			this.onShoot();
			game.renderer.deleteSpritePattern(new RegExp(this.sprite.id + '_charge[0-9]+'));
			this.charge.sprite = new Sprite(
				this.sprite.id + '_shoot_bullet' + game.registeredProjectiles.size,
				'images/spritesheets/particles/bullet_emit.png',
				14,
				12,
				new Point(
					this.sprite.position.x + (this.module && this.module.slot == 'front' ? (this.module.tier < 2 ? 52 : 64) : 33),
					this.sprite.position.y + 4
				),
				4,
				[0, 1, 2],
				false,
				true
			);
			
			var bullet = new Bullet(this.sprite.id + 'shot' + game.registeredProjectiles.size, this);
			game.registeredProjectiles.set(bullet.sprite.id, bullet);
			
			if (this.module != null && this.module.gun != null && !this.module.cooldown)
				this.module.gun.shoot(this.module);
			
			var gameModule1 = game.getModule(1) || null;
			var gameModule2 = game.getModule(2) || null;
			if (this.module == null && gameModule1 != null && gameModule1.owner == null)
				gameModule1.shoot();
			else if (this.module == null && gameModule2 != null && gameModule2.owner == null)
				gameModule2.shoot();
		}
	}
	
	/**
	 * Charge the power bar
	 */
	chargeBeamBar(player)
	{
		var powerBar = document.getElementById('powerBar' + player.sprite.id).children[0];
		
		if (!game.scheduler.isPaused && powerBar && parseInt(powerBar.style.width) < 300)
			powerBar.style.width = parseFloat(powerBar.style.width) + ((1 / (game.scheduler.speed / 5)) * 4) + 'px';
	}
	
	/**
	 * Prepare a charged bullet
	 */
	prepareCharge()
	{
		if (!this.isDead && !game.scheduler.isPaused)
		{
			this.onCharge();
			this.charge.timer = window.setInterval(this.chargeBeamBar, 6, this);
			this.charge.sprite = new Sprite(
				this.sprite.id + '_charge' + game.registeredProjectiles.size,
				'images/spritesheets/particles/charge_bullet.png',
				32,
				32,
				new Point(
					this.sprite.position.x + (this.module && this.module.slot == 'front' ? (this.module.tier < 2 ? 52 : 64) : 33),
					this.sprite.position.y - 5
				),
				4,
				[0, 1, 2, 3, 4, 5, 6, 7],
				true
			);
		}
	}
	
	/**
	 * Launch the charged bullet
	 */
	launchCharge()
	{
		if (!this.isDead && !game.scheduler.isPaused)
		{
			this.onChargeOver();
			var powerBar = document.getElementById('powerBar' + this.sprite.id).children[0];
			var percent = (parseInt(powerBar.style.width) * 100) / 300;
			this.shootCharge(percent);
			powerBar.style.width = '0px';
			
			game.renderer.deleteSprite(this.charge.sprite.id);
			window.clearInterval(this.charge.timer);
			this.charge.sprite = new Sprite(
				this.sprite.id + '_charge' + game.registeredProjectiles.size,
				'images/spritesheets/particles/charge_shoot.png',
				36,
				20,
				new Point(
					this.sprite.position.x + (this.module && this.module.slot == 'front' ? (this.module.tier < 2 ? 52 : 64) : 33),
					this.sprite.position.y
				),
				4,
				[0, 1, 2, 3],
				false,
				true
			);
		}
	}
	
	/**
	 * Shoot the charged bullet
	 */
	shootCharge(percent)
	{
		this.onShootCharged();
		if (!this.isDead && !game.scheduler.isPaused && percent >= 15)
		{
			var bullet = new ChargedBullet('shipchargedshot' + game.registeredProjectiles.size, this, percent);
			this.charge.sprite.position.x += (this.module && this.module.slot == 'front' ? (this.module.tier < 2 ? 16 : 31) : 0);
			game.registeredProjectiles.set(bullet.sprite.id, bullet);
		}
	}
	
	/**
	 * Remove the entity from the game and trigger 'ondestroyed' event and play explosion animation
	 */
	 //@Override
	explode()
	{
		this.onDestroyed();
		game.renderer.deleteSpritePattern(new RegExp(this.sprite.id + '_charge[0-9]+'));
		game.renderer.replaceSprite(
			new Sprite(
				this.sprite.id,
				'images/spritesheets/particles/explosion_player.png',
				32,
				28,
				new Point(
					this.sprite.position.x,
					this.sprite.position.y
				),
				6,
				[0, 1, 2, 3, 4, 4, 5, 5, 6],
				false
			)
		);
		this.isDead = true;
		this.triesLeft--;
		game.onScoreboardChange();
		
		if (this.module != null)
			this.module.release();
		if (this.module != null && game.registeredModules.size == 2)
			this.releasedModule.removeEntity();
		
		if (this.bitModules.has('top'))
		{
			var drop = new BitModuleUpgrade(this.bitModules.get('top'));
			drop.launch();
			this.bitModules.get('top').removeEntity();
			this.bitModules.delete('top');
		}
		if (this.bitModules.has('bottom'))
		{
			var drop = new BitModuleUpgrade(this.bitModules.get('bottom'));
			drop.launch();
			this.bitModules.get('bottom').removeEntity();
			this.bitModules.delete('bottom');
		}
		
		window.setTimeout(function(player) {
			if (player.triesLeft > 0)
				player.respawn();
		}, 2000, this);
		
		if (this.triesLeft <= 0)
		{
			game.scores[this.sprite.id] = {
				score: this.score,
				achievements: this.achievements.getUnlockedAchievementsAsMap(),
				dieAtWave: game.wave
			};
			
			if (this.sprite.id == 'player1')
				player1 = null;
			else
				player2 = null;
			
			if (!player1 && !player2)
				game.onGameOver();
			
			game.players.delete(this.sprite.id);
		}
	}
	
	/**
	 * Call or release a module
	 */
	callOrRelease()
	{
		if (this.module != null)
		{
			if (this.module.canThrow)
			{
				this.releasedModule = this.module;
				this.module.release();
			}
		}
		else if (this.releasedModule != null)
			if (this.releasedModule.owner == null)
				if (this.releasedModule.sprite.id == 'module1')
					game.getModule(1).call();
				else
					game.getModule(2).call();
			else
				if (this.releasedModule.sprite.id == 'module1')
					game.getModule(2).call();
				else
					game.getModule(1).call();
	}
	
	/* ----- Animations ----- */
	/**
	 * Animate the player when entering the game
	 * @param player : [PlayerShip] The player
	 */
	animStart(player)
	{
		if (player.acceleration == null)
		{
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
				[0, 1, 2, 1],
				true
			);
		}
		
		if (player.sprite.position.x >= canvas.width * (1 / (Math.random() * 4)))
		{
			game.scheduler.removeTask(player.sprite.id);
			game.scheduler.addTask(new Task(player.sprite.id, player.animStartToIdle, player));
		}
		else
		{
			player.sprite.position.x += 4;
			player.acceleration.position.x += 4;
			player.charge.sprite.position.x += 4;
		}
	}
	
	/**
	 * Animate the player when entering the game
	 * @param player : [PlayerShip] The player
	 */
	animStartToIdle(player)
	{
		if (player.sprite.position.x <= 5)
		{
			game.scheduler.removeTask(player.sprite.id);
			player.acceleration = null;
			game.renderer.deleteSprite(player.sprite.id + '_acceleration');
			player.canMove = true;
		}
		else
		{
			player.sprite.position.x -= 2;
			player.acceleration.position.x -= 2;
			player.charge.sprite.position.x -= 2;
		}
	}
}