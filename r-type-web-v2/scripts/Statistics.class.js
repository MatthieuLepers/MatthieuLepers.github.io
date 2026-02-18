class Statistics
{
	/**
	 * Create the statistics for a player
	 */
	constructor()
	{
		//Players stats
		this.playerShots 		= {player1: 0, player2: 0};//Done
		this.playerShotHits 	= {player1: 0, player2: 0};//Done
		this.playerShotFails	= {player1: 0, player2: 0};//Done
		this.chargedShots		= {player1: 0, player2: 0};//Done
		this.chargedShotHits	= {player1: 0, player2: 0};//Done
		this.chargedShotFails	= {player1: 0, player2: 0};//Done
		this.isAI				= {player1: (game.params.has('ia') && game.params.get('ia') == 'player1'), player2: (game.params.has('ia') && game.params.get('ia') == 'player2')};//Done
		
		//Gun Stats
		this.dnaBulletShots		= {player1: 0, player2: 0};//Done
		this.dnaBulletShotHits	= {player1: 0, player2: 0};//Done
		this.dnaBulletShotFails	= {player1: 0, player2: 0};//Done
		this.dnaBeamShots		= {player1: 0, player2: 0};//Done
		this.dnaBeamShotHits	= {player1: 0, player2: 0};//Done
		this.dnaBeamShotFails	= {player1: 0, player2: 0};//Done
		this.laserShots			= {player1: 0, player2: 0};//Done
		this.laserShotHits		= {player1: 0, player2: 0};//Done
		this.laserShotFails		= {player1: 0, player2: 0};//Done
		this.fireballShots		= {player1: 0, player2: 0};//Done
		this.fireballShotHits	= {player1: 0, player2: 0};//Done
		this.fireballShotFails	= {player1: 0, player2: 0};//Done
		this.rocketLaunched		= {player1: 0, player2: 0};//Done
		this.rocketHits			= {player1: 0, player2: 0};//Done
		this.rocketFails		= {player1: 0, player2: 0};//Done
		
		//Module Stats
		this.moduleAbsorbedShot	= {module1: 0, module2: 0};//Done
		this.moduleShots		= {module1: 0, module2: 0};//Done
		this.moduleShotHits		= {module1: 0, module2: 0};//Done
		this.moduleShotFails	= {module1: 0, module2: 0};//Done
		this.bitModuleShots		= {player1: 0, player2: 0};//Done
		this.bitModuleShotHits	= {player1: 0, player2: 0};//Done
		this.bitModuleShotFails	= {player1: 0, player2: 0};//Done
		
		//Kills
		this.killedPataPata			= {player1: 0, player2: 0};//Done
		this.killedMid				= {player1: 0, player2: 0};//Done
		this.killedCheetah			= {player1: 0, player2: 0};//Done
		this.killedCancer			= {player1: 0, player2: 0};
		this.killedPowArmor			= {player1: 0, player2: 0};//Done
		this.killedBold				= {player1: 0, player2: 0};//Done
		this.killedScant			= {player1: 0, player2: 0};//Done
		this.killedBug				= {player1: 0, player2: 0};//Done
		this.killedCompiler			= {player1: 0, player2: 0};//Done
		this.totalSpawnedPataPata	= 0;//Done
		this.totalSpawnedMid		= 0;//Done
		this.totalSpawnedCheetah	= 0;//Done
		this.totalSpawnedCancer		= 0;
		this.totalSpawnedPowArmor	= 0;//Done
		this.totalSpawnedBold		= 0;//Done
		this.totalSpawnedScant		= 0;//Done
		this.totalSpawnedBug		= 0;//Done
		
		//Upgrades
		this.spawnedUpgrade			= 0;//Done
		this.pickedDnaUpgrade		= {player1: 0, player2: 0};//Done
		this.pickedLaserUpgrade		= {player1: 0, player2: 0};//Done
		this.pickedFireUpgrade		= {player1: 0, player2: 0};//Done
		this.pickedRocketsUpgrade	= {player1: 0, player2: 0};//Done
		this.pickedSpeedUpgrade		= {player1: 0, player2: 0};//Done
		this.pickedBitModuleUpgrade	= {player1: 0, player2: 0};//Done
		this.pickedForceFieldUpgrade= {player1: 0, player2: 0};//Done
		
		this.maximumScore;
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the JSON format for a player statistics
	 * @param player : [String] The player id
	 */
	getPlayerJSON(player)
	{
		var regex = new RegExp('player(1|2)');
		var module = game.getModule(player.replace(regex, '$1'));
		
		var moduleJSON = -1;
		if (module != null)
		{
			moduleJSON = {
				tier: module.tier,
				gun: (module.gun != null ? module.gun.type : 'None'),
				absorbed: this.moduleAbsorbedShot[module.sprite.id],
				bullets: {
					shots: this.moduleShots[module.sprite.id],
					hits: this.moduleShotHits[module.sprite.id],
					fails: this.moduleShotFails[module.sprite.id],
					accuracy: this.calculPercentage(this.moduleShotHits[module.sprite.id], this.moduleShots[module.sprite.id])
				} 
			}
		}
		
		var json = {
			global: {
				skin: game.params.get('skin_' + player),
				score: game.scores[player].score,
				bitmodule: (this.pickedBitModuleUpgrade[player] > 2 ? 2 : this.pickedBitModuleUpgrade[player]),
				achievements: game.scores[player].achievements,
				globalAccuracy: this.calculPercentage(
					this.playerShotHits[player] + this.chargedShotHits[player] + this.dnaBulletShotHits[player] + this.rocketHits[player]     + this.laserShotHits[player] + this.fireballShotHits[player],
					this.playerShots[player]    + this.chargedShots[player]    + this.dnaBulletShots[player]    + this.rocketLaunched[player] + this.laserShots[player]    + this.fireballShots[player]
				)
			},
			guns: {
				bullets: {
					shots: this.playerShots[player],
					hits: this.playerShotHits[player],
					fails: this.playerShotFails[player],
					accuracy: this.calculPercentage(this.playerShotHits[player], this.playerShots[player])
				},
				chargedBullets: {
					shots: this.chargedShots[player],
					hits: this.chargedShotHits[player],
					fails: this.chargedShotFails[player],
					accuracy: this.calculPercentage(this.chargedShotHits[player], this.chargedShots[player])
				},
				dnaBullets: {
					shots: this.dnaBulletShots[player],
					hits: this.dnaBulletShotHits[player],
					fails: this.dnaBulletShotFails[player],
					accuracy: this.calculPercentage(this.dnaBulletShotHits[player], this.dnaBulletShots[player])
				},
				dnaBeam: {
					shots: this.dnaBeamShots[player],
					hits: this.dnaBeamShotHits[player],
					fails: this.dnaBeamShotFails[player],
					accuracy: this.calculPercentage(this.dnaBeamShotHits[player], this.dnaBeamShots[player])
				},
				laser: {
					shots: this.laserShots[player],
					hits: this.laserShotHits[player],
					fails: this.laserShotFails[player],
					accuracy: this.calculPercentage(this.laserShotHits[player], this.laserShots[player])
				},
				fireball: {
					shots: this.fireballShots[player],
					hits: this.fireballShotHits[player],
					fails: this.fireballShotFails[player],
					accuracy: this.calculPercentage(this.fireballShotHits[player], this.fireballShots[player])
				},
				rocket: {
					shots: this.rocketLaunched[player],
					hits: this.rocketHits[player],
					fails: this.rocketFails[player],
					accuracy: this.calculPercentage(this.rocketHits[player], this.rocketLaunched[player])
				},
				bitmodule: {
					shots: this.bitModuleShots[player],
					hits: this.bitModuleShotHits[player],
					fails: this.bitModuleShotFails[player],
					accuracy: this.calculPercentage(this.bitModuleShotHits[player], this.bitModuleShots[player])
				}
			},
			module: moduleJSON,
			kills: {
				PataPata: this.killedPataPata[player],
				Mid: this.killedMid[player],
				Cancer: this.killedCancer[player],
				PowArmor: this.killedPowArmor[player],
				Cheetah: this.killedCheetah[player],
				Bold: this.killedBold[player],
				Scant: this.killedScant[player],
				Bug: this.killedBug[player]
			},
			upgrade: {
				dna: this.pickedDnaUpgrade[player],
				laser: this.pickedLaserUpgrade[player],
				fire: this.pickedFireUpgrade[player],
				rockets: this.pickedRocketsUpgrade[player],
				speed: this.pickedSpeedUpgrade[player],
				bitmodule: this.pickedBitModuleUpgrade[player],
				forcefield: this.pickedForceFieldUpgrade[player]
			}
		};
		
		return json;
	}
	
	/**
	 * Get the JSON format for all statistics
	 */
	getJSON()
	{
		var json = {
			global: {
				game: {
					assisted: game.params.get('assist'),
					twoPlayers: game.params.get('players') == 2,
					wave: game.wave,
					maxScore: this.getMaxScore(game.wave),
					isAI: this.isAI
				},
				maxSpawned: {
					PataPata: this.totalSpawnedPataPata,
					Mid: this.totalSpawnedMid,
					Cancer: this.totalSpawnedCancer,
					PowArmor: this.totalSpawnedPowArmor,
					Cheetah: this.totalSpawnedCheetah,
					Bold: this.totalSpawnedBold,
					Scant: this.totalSpawnedScant,
					Bug: this.totalSpawnedBug
				},
				upgrades: this.spawnedUpgrade
			},
			player1: this.getPlayerJSON('player1'),
			player2: this.getPlayerJSON('player2')
		};
		
		return JSON.stringify(json);
	}
	
	/**
	 * Get the maximum possible score
	 * @param wave : [Int] The current wave (players are dead)
	 * @return [Int] The maximum possible score
	 */
	getMaxScore(wave)
	{
		var scores1P = new Array(100, 1350, 3350, 6100, 9600, 14800, 19800, 24800, 29800, 34800, 42250, 47250, 52250, 57250, 62250, 69200, 74200, 79200, 84200, 89200, 96150, 101150, 106150, 111900, 114500, 122000);
		var scores2P = new Array(  0,    0,    0,    0,    0,   200,   200,   200,   200,   200,   400,   400,   400,   400,   400,   600,   600,   600,   600,   600,   800,    800,    800,    800,   1400,   1400);
		return scores1P[wave] + (game.params.has('players') && game.params.get('players') == 2 ? scores2P[wave] : 0);
	}
	
	/**
	 * Get all statistics for a player
	 * @param player : [String] The player ID (player1|player2)
	 */
	getPlayerStats(player)
	{
		var playerId = player.replace(/.+(1|2)/, '$1');
		
		//Create container
		var article = document.createElement('article');
		article.className = 'main ' + player + '_tab_score' + (player == 'player2' ? ' hide' : '');
		
		//Create main title
		var h2 = document.createElement('h2');
		h2.textContent = 'Total score P' + playerId + ': ' + game.scores[player].score + '/' + this.maximumScore + ' (' + (""+this.calculPercentage(game.scores[player].score, this.maximumScore)).substr(0, 5) + '%)';
		article.appendChild(h2);
		
		//Create Global statistics
		var globalStats = this.createCell('Global statistics');
		globalStats.appendChild(this.createCellSection(new Array('Score:', game.scores[player].score)));
		globalStats.appendChild(this.createCellSection(new Array('Maximum score:', this.maximumScore)));
		globalStats.appendChild(this.createCellSection(new Array('Skin:', '<img src="images/gui/player/' + game.params.get('skin_' + player) + '_idle.gif" alt="Skin" class="imgInfo" />')));
		globalStats.appendChild(this.createCellSection(new Array('Wave:', game.wave - 1)));
		globalStats.appendChild(
			this.createCellSection(
				new Array(
					'<img src="images/gui/accuracy.png" alt="accuracy" class="imgInfo" />Global accuracy:',
					this.calculPercentage(
						this.playerShotHits[player] + this.chargedShotHits[player] + this.dnaBulletShotHits[player] + this.rocketHits[player]     + this.laserShotHits[player] + this.fireballShotHits[player],
						this.playerShots[player]    + this.chargedShots[player]    + this.dnaBulletShots[player]    + this.rocketLaunched[player] + this.laserShots[player]    + this.fireballShots[player]
					) + '%'
				)
			)
		);
		article.appendChild(globalStats);
		
		//Create achievements unlocked statistics
		var achievementsMap = game.scores[player].achievements;
		
		if (achievementsMap != null && achievementsMap.getOjectSize() > 0)
		{
			var max = achievementsMap.getOjectSize() - 1;
			var unlocked = this.createCell('Achievements unlocked');
			for (var achievement in achievementsMap)
				if (max > 0)
				{
					unlocked.appendChild(this.createCellSection(new Array(achievement, achievementsMap[achievement])));
					max--;
				}
			
			article.appendChild(unlocked);
		}
		
		//Create Kills statistics
		var killsStats = this.createCell('Kills statistics');
		killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/patapata.gif" alt="PataPata" class="imgInfo" />PataPata:', this.killedPataPata[player] + '/' + this.totalSpawnedPataPata)));
		killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/mid.gif" alt="Mid" class="imgInfo" />Mid:', this.killedMid[player] + '/' + this.totalSpawnedMid)));
		if (this.killedCheetah[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/cheetah.gif" alt="Cheetah" class="imgInfo" />Cheetah:', this.killedCheetah[player] + '/' + this.totalSpawnedCheetah)));
		if (this.killedCancer[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/cancer.gif" alt="Cancer" class="imgInfo" />Cancer:', this.killedCancer[player] + '/' + this.totalSpawnedCancer)));
		if (this.killedPowArmor[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/powarmor_fly.gif" alt="PowArmor" class="imgInfo" />PowArmor:', this.killedPowArmor[player] + '/' + this.totalSpawnedPowArmor)));
		if (this.killedBold[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/bold.gif" alt="Bold" class="imgInfo" />Bold:', this.killedBold[player] + '/' + this.totalSpawnedBold)));
		if (this.killedScant[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/scant.gif" alt="Scant" class="imgInfo" />Scant:', this.killedScant[player] + '/' + this.totalSpawnedScant)));
		if (this.killedBug[player] != 0) killsStats.appendChild(this.createCellSection(new Array('<img src="images/spritesheets/enemies/bug.pg" alt="Bug" class="imgInfo" />Bug:', this.killedBug[player] + '/' + this.totalSpawnedBug)));
		article.appendChild(killsStats);
		
		//Create Ship statistics
		var shipStats = this.createCell('Ship statistics');
		shipStats.appendChild(this.createCellSection(
			new Array(
				'Bullets shots:', this.playerShots[player],
				'Bullets hits:', this.playerShotHits[player],
				'Bullets fails:', this.playerShotFails[player],
				'Accuracy:', this.calculPercentage(this.playerShotHits[player], this.playerShots[player]) + '%'
			)
		));
		if (this.chargedShots[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'Charged Bullets shots:', this.chargedShots[player],
					'Charged Bullets hits:', this.chargedShotHits[player],
					'Charged Bullets fails:', this.chargedShotFails[player],
					'Accuracy:', this.calculPercentage(this.chargedShotHits[player], this.chargedShots[player]) + '%'
				)
			));
		if (this.dnaBulletShots[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'DNA Bullets shots:', this.dnaBulletShots[player],
					'DNA Bullets hits:', this.dnaBulletShotHits[player],
					'DNA Bullets fails:', this.dnaBulletShotFails[player],
					'Accuracy:', this.calculPercentage(this.dnaBulletShotHits[player], this.dnaBulletShots[player]) + '%'
				)
			));
		if (this.rocketLaunched[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'Rockets launched:', this.rocketLaunched[player],
					'Rockets hits:', this.rocketHits[player],
					'Rockets fails:', this.rocketFails[player],
					'Accuracy:', this.calculPercentage(this.rocketHits[player], this.rocketLaunched[player]) + '%'
				)
			));
		if (this.laserShots[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'Laser shots:', this.laserShots[player],
					'Laser hits:', this.laserShotHits[player],
					'Laser fails:', this.laserShotFails[player],
					'Accuracy:', this.calculPercentage(this.laserShotHits[player], this.laserShots[player]) + '%'
				)
			));
		if (this.fireballShots[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'Firball shots:', this.fireballShots[player],
					'Firball hits:', this.fireballShotHits[player],
					'Firball fails:', this.fireballShotFails[player],
					'Accuracy:', this.calculPercentage(this.fireballShotHits[player], this.fireballShots[player]) + '%'
				)
			));
		if (this.dnaBeamShots[player] != 0)
			shipStats.appendChild(this.createCellSection(
				new Array(
					'Dna Beam shoot:', this.dnaBeamShots[player],
					'Dna Beam  hits:', this.dnaBeamShotHits[player],
					'Dna Beam  fails:', this.dnaBeamShotFails[player],
					'Accuracy:', this.calculPercentage(this.dnaBeamShotHits[player], this.dnaBeamShots[player]) + '%'
				)
			));
		article.appendChild(shipStats);
		
		//Create Upgrades statistics
		var upgradesStats = this.createCell('Upgrades statistics');
		upgradesStats.appendChild(this.createCellSection(new Array('Upgrade spawned:', this.spawnedUpgrade)));
		upgradesStats.appendChild(this.createCellSection(new Array('Upgrade picked:', (this.pickedDnaUpgrade[player] + this.pickedLaserUpgrade[player] + this.pickedFireUpgrade[player] + this.pickedRocketsUpgrade[player] + this.pickedSpeedUpgrade[player] + this.pickedBitModuleUpgrade[player] + this.pickedForceFieldUpgrade[player]))));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_dna.gif" alt="DNA" class="imgInfo" />Picked Dna upgrade:', this.pickedDnaUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_laser.gif" alt="Laser" class="imgInfo" />Picked Laser upgrade:', this.pickedLaserUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_fire.gif" alt="Fire" class="imgInfo" />Picked Fire upgrade:', this.pickedFireUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_rockets.gif" alt="Rockets" class="imgInfo" />Picked Rockets upgrade:', this.pickedRocketsUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_speed.gif" alt="Speed" class="imgInfo" />Picked Speed upgrade:', this.pickedSpeedUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/bit_module_top.gif" alt="BitModule" class="imgInfo" />Picked Bit Module upgrade:', this.pickedBitModuleUpgrade[player])));
		upgradesStats.appendChild(this.createCellSection(new Array('<img src="images/gui/icons/upgrade_forcefield.gif" alt="Forcefield" class="imgInfo" />Picked Forcefield upgrade:', this.pickedForceFieldUpgrade[player])));
		article.appendChild(upgradesStats);
		
		return article;
	}
	
	/**
	 * Get all statistics for all modules
	 */
	getModulesStats()
	{
		//Create container
		var article = document.createElement('article');
		article.className = 'main module_tab_score hide';
		
		//Create main title
		var h2 = document.createElement('h2');
		h2.textContent = 'Statistics for Module1';
		article.appendChild(h2);
		
		//Create Module1 statistics
		var module1Stats = this.createCell('Module statistics');
		module1Stats.appendChild(this.createCellSection(new Array('Module tier:', game.getModule(1).tier + 1)));
		module1Stats.appendChild(this.createCellSection(new Array('Shots absorbed:', this.moduleAbsorbedShot['module1'])));
		module1Stats.appendChild(this.createCellSection(new Array('Bullets shooted:', this.moduleShots['module1'])));
		module1Stats.appendChild(this.createCellSection(new Array('Bullets hits:', this.moduleShotHits['module1'])));
		module1Stats.appendChild(this.createCellSection(new Array('Bullets fails:', this.moduleShotFails['module1'])));
		module1Stats.appendChild(this.createCellSection(new Array('Accuracy:', this.calculPercentage(this.moduleShotHits['module1'], this.moduleShots['module1']) + '%')));
		article.appendChild(module1Stats);
		
		if (game.getModule(2) != null)
		{
			//Create Module2 statistics
			var module2Stats = this.createCell('Module statistics');
			module2Stats.appendChild(this.createCellSection(new Array('Module tier:', game.getModule(2).tier + 1)));
			module2Stats.appendChild(this.createCellSection(new Array('Shots absorbed:', this.moduleAbsorbedShot['module2'])));
			module2Stats.appendChild(this.createCellSection(new Array('Bullets shooted:', this.moduleShots['module2'])));
			module2Stats.appendChild(this.createCellSection(new Array('Bullets hits:', this.moduleShotHits['module2'])));
			module2Stats.appendChild(this.createCellSection(new Array('Bullets fails:', this.moduleShotFails['module2'])));
			module2Stats.appendChild(this.createCellSection(new Array('Accuracy:', this.calculPercentage(this.moduleShotHits['module2'], this.moduleShots['module2']) + '%')));
			article.appendChild(module2Stats);
		}
		
		return article;
	}
	
	/* ----- Processing ----- */
	/**
	 * Create a statistic cell
	 * @param title : [String] The title of the cell
	 */
	createCell(title)
	{
		var cell = document.createElement('div');
		var h3 = document.createElement('h3');
		
		cell.className = 'cell';
		h3.textContent = title;
		
		cell.appendChild(h3);
		
		return cell;
	}
	
	/**
	 * Create a statistic section
	 * @param labelValueArray : [Array] The array witch contains all the value to display
	 */
	createCellSection(labelValueArray)
	{
		var dl = document.createElement('dl');
		
		for (var i = 0; i < labelValueArray.length / 2; i++)
		{
			var dd = document.createElement('dd');
			var dt = document.createElement('dt');
			
			dd.innerHTML = labelValueArray[i * 2];
			dt.innerHTML = labelValueArray[i * 2 + 1];
			
			dl.appendChild(dd);
			dl.appendChild(dt);
		}
		
		return dl;
	}
	
	/**
	 * Calculate a percentage
	 * @param n : [Int] The number to pass in percentage
	 * @param total : [Int] The total number
	 */
	calculPercentage(n, total)
	{
		var a = (n * 100) / total;
		return (!isNaN(a) ? (''+a).substr(0, 5) : '0.00');
	}
	
	/* ----- Printers ----- */
	/**
	 * Print the statistics on screen
	 */
	print()
	{	
		this.maximumScore = this.getMaxScore(game.wave);
		
		var section = document.createElement('section');
		section.id = 'stats';
		
		var button = document.createElement('button');
		button.id = 'close';
		button.textContent = 'X';
		section.appendChild(button);
		
		var tabControl = document.createElement('div');
		tabControl.id = 'tab_control_score';
		if ((game.params.has('players') && game.params.get('players') == 2) || game.registeredModules.size > 0)
			tabControl.innerHTML = '<label id="player1_tab_score">Player 1</label>';
		if (game.params.has('players') && game.params.get('players') == 2)
			tabControl.innerHTML += '<label id="player2_tab_score">Player 2</label>';
		if (game.registeredModules.size > 0)
			tabControl.innerHTML += '<label id="module_tab_score">Modules</label>';
		if (tabControl.children.length > 0)
			section.appendChild(tabControl);
		
		var tabPane = document.createElement('div');
		tabPane.id = 'pane';
		tabPane.appendChild(this.getPlayerStats('player1'));
		if (game.params.has('players') && game.params.get('players') == 2)
			tabPane.appendChild(this.getPlayerStats('player2'));
		if (game.registeredModules.size > 0)
			tabPane.appendChild(this.getModulesStats());
		section.appendChild(tabPane);
		
		var changeTab = function()
		{
			var tabs = document.querySelectorAll('div#pane>article.main');
			if (tabs.length > 0)
				for (var i = 0; i < tabs.length; i++)
					tabs[i].className += ' hide';
			
			document.getElementsByClassName(this.id)[0].className = 'main ' + this.id;
		};
		
		var closeStats = function()
		{
			document.getElementById('close').removeEventListener('click', closeStats);
			var stats = document.getElementById('stats');
			stats.parentNode.removeChild(stats);
		}
		
		button.addEventListener('click', closeStats);
		document.getElementById('background').appendChild(section);
		var tabControlsLabels = document.querySelectorAll('div#tab_control_score>label');
		for (var i = 0; i < tabControlsLabels.length; i++)
			tabControlsLabels[i].addEventListener('click', changeTab);
	}
}
