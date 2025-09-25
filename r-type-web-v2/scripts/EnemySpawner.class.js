class EnemySpawner
{
	/**
	 * Create the enemy spawner
	 */
	constructor() {}
	
	/* ----- Spawners ----- */
	/**
	 * Spawn an enemy type in function of game wave
	 */
	spawnWave()
	{
		game.wave++;
		this.spawnedPataPata	= 0;
		this.spawnedMid			= 0;
		this.spawnedCheetah		= 0;
		this.spawnedCancer		= 0;
		this.spawnedPowArmor	= 0;
		this.spawnedBold		= 0;
		this.spawnedScant		= 0;
		this.spawnedBug			= 0;
		
		game.scoreboard.print();
		game.scheduler.addTask(new Task('aPowArmorSpawner', this.spawn, {
				maxEnemies: (game.wave == 24 ? game.players.size * 3 : game.players.size),
				waveCond: (game.wave > 0 && game.wave % 5 == 0) || game.wave == 24,
				enemyType: 'PowArmor',
				clazz: PowArmorEnemy,
				taskName: 'aPowArmorSpawner'
		}));
		game.scheduler.addTask(new Task('patapataSpawner', this.spawn, {
				maxEnemies: (game.wave * 5 <= 30 ? game.wave * 5 : 30),
				waveCond: game.wave <= 23,
				enemyType: 'PataPata',
				clazz: PataPataEnemy,
				taskName: 'patapataSpawner'
		}));
		game.scheduler.addTask(new Task('midSpawner', this.spawn, {
				maxEnemies: (game.wave * 5 <= 30 ? game.wave * 5 : 30),
				waveCond: game.wave <= 23,
				enemyType: 'Mid',
				clazz: MidEnemy,
				taskName: 'midSpawner'
		}));
		game.scheduler.addTask(new Task('cheetahSpawner', this.spawn, {
				maxEnemies: (game.wave == 24 ? 10 : 5),
				waveCond: (game.wave >= 0 && game.wave < 25 && game.wave % 5 == 0) || game.wave == 23 || game.wave == 24,
				enemyType: 'Cheetah',
				clazz: CheetahEnemy,
				taskName: 'cheetahSpawner'
		}));
		game.scheduler.addTask(new Task('boldSpawner', this.spawn, {
				maxEnemies: 1,
				waveCond: game.wave == 10,
				enemyType: 'Bold',
				clazz: BoldEnemy,
				taskName: 'boldSpawner'
		}));
		game.scheduler.addTask(new Task('scantSpawner', this.spawn, {
				maxEnemies: 1,
				waveCond: game.wave == 15 || game.wave == 23,
				enemyType: 'Scant',
				clazz: ScantEnemy,
				taskName: 'scantSpawner'
		}));
		/*game.scheduler.addTask(new Task('bugSpawner', this.spawn, {
				maxEnemies: 15,
				waveCond: game.wave >= 0,
				enemyType: 'Bug',
				clazz: BugEnemy,
				taskName: 'bugSpawner',
				position: new Point(canvas.width, Math.random() * (canvas.height - 200)),
				time: 200
		}));*/
		game.scheduler.addTask(new Task('compilerSpawner', function() {
			if (game.wave == 25)
			{
				game.scheduler.removeTask('gameRoutine');
				compiler = new CompilerBoss();
				game.scheduler.removeTask('compilerSpawner');
			}
		}));
	}
	
	/**
	 * Spawn an enemy type
	 * @param params 	: [Object] The object witch contains the following keys:
	 * 		maxEnemies 	: [Int] The maximum number of this enemy type witch can be display each wave
	 *		waveCond	: [Boolean] The codition to spawn the enemy
	 *		enemyType	: [String] The enemyType with caps
	 *		clazz		: [Class] The class file of the enemy type
	 *		taskName	: [String] The name of the task witch is run for executing spawner
	 *		position	: [Point] The spawnpoint of the enemy
	 */
	spawn(params)
	{
		var spawnPoint = params.position || null;
		if (!game.isWin && !game.isLost && !game.scheduler.isPaused && params.waveCond && game.spawner['spawned' + params.enemyType] < params.maxEnemies)
		{
			if (!game.spawner['cooldown' + params.enemyType])
			{
				var wait = params.time || 1000;
			
				var enemy = new params.clazz('enemy' + game.registeredEnemies.size);
				if (spawnPoint != null)
				{
					enemy.sprite.position.x = spawnPoint.x;
					enemy.sprite.position.y = spawnPoint.y;
					enemy.staticTop = spawnPoint.y;
				}
				game.registeredEnemies.set(enemy.sprite.id, enemy);
				
				game.spawner['spawned' + params.enemyType]++;
				game.spawner['cooldown' + params.enemyType] = true;
				window.setTimeout(function() {game.spawner['cooldown' + params.enemyType] = false;}, wait);
			}
		}
		else
			game.scheduler.removeTask(params.taskName);
	}
}