class Game extends EventsEmitter
{
	/**
	 * Create the game
	 * @param gameSpeed : the game speed
	 */
	constructor(gameSpeed)
	{
		super();
		this.players = new Map();
		this.scores = {
			player1: {score: 0, achievements: null}, 
			player2: {score: 0, achievements: null}
		}; //Defined after player death
		this.gameSpeed = gameSpeed;
		this.scheduler = new Scheduler(gameSpeed);
		this.renderer = new Renderer();
		this.isLost = false;
		this.isWin = false;
		this.wave = 0;
		this.spawner = null;
		
		//Url Parameters
		this.params = this.parseUrlParams();
		
		//Entities
		this.registeredEnemies = new Map();
		this.registeredModules = new Map();
		this.registeredProjectiles = new Map();
		
		this.scoreboard = null;
		this.statistics = new Statistics();
	}
	
	/* ----- Getters ----- */
	/**
	 * Get a player by his id
	 * @param id : [Int] The id of the player
	 * @return the player or null
	 */
	getModule(id)
	{
		return this.registeredModules.get('module' + id);
	}
	
	/**
	 * Make an url with all game parameters
	 * @param startSymbole : [Boolean] The result will start with the '?' symbole
	 * @return [String] The url with all game parameters
	 */
	encodeUriParams(startSymbole, ignore)
	{
		var url = '';
		if (ignore != 'drawFps' && this.params.has('drawFps') && this.params.get('drawFps'))		url += '&drawFps=true';
		if (ignore != 'skin_player1' && this.params.has('skin_player1'))							url += '&skin_player1=' + this.params.get('skin_player1');
		if (ignore != 'skin_player2' && this.params.has('skin_player2'))							url += '&skin_player2=' + this.params.get('skin_player2');
		if (ignore != 'assist' && this.params.has('assist') && this.params.get('assist'))			url += '&assist=true';
		if (ignore != 'players' && this.params.has('players') && this.params.get('players') == 2)	url += '&players=2';
		if (ignore != 'noSounds' && this.params.has('noSounds') && this.params.get('noSounds'))	url += '&noSounds=true';
		if (ignore != 'noBackground' && this.params.has('noBackground') && this.params.get('noBackground'))	url += '&noBackground=true';
		
		if (startSymbole)
			return url.replace(/&(.+)/, '?$1');
		return url;
	}
	
	/**
	 * Parse the params witch are presents in the URL
	 * @return the map witch contains all aprams with values
	 */
	parseUrlParams()
	{
		var params = new Map();
		var skinRegexP1 = new RegExp(/.+skin_player1=(blue|darkblue|green|purple|red|yellow)(.+)?/);
		var skinRegexP2 = new RegExp(/.+skin_player2=(blue|darkblue|green|purple|red|yellow)(.+)?/);
		var gameIdRegex = new RegExp(/.+gameId=([0-9]+)(.+)?/);
		var playersRegex = new RegExp(/.+players=2(.+)?/);
		
		params.set('drawFps', (document.URL.contains('drawFps=true')));
		params.set('noSounds', (document.URL.contains('noSounds=true')));
		params.set('noBackground', (document.URL.contains('noBackground=true')));
		params.set('skin_player1', (skinRegexP1.test(document.URL) ? document.URL.replace(skinRegexP1, '$1') : 'blue'));
		params.set('skin_player2', (skinRegexP2.test(document.URL) ? document.URL.replace(skinRegexP2, '$1') : 'blue'));
		params.set('assist', document.URL.contains('assist=true'));
		params.set('players', (playersRegex.test(document.URL) ? 2 : 1));
		params.set('ambient', (document.URL.contains('ambient=R-Type%20II') ? 'R-Type II' : (document.URL.contains('ambient=R-Type%20I') ? 'R-Type I' : '')));
		
		return params;
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onkonamicode' event
	 */
	onKonamiCode()
	{
		this.emit('onkonamicode', this);
	}
	
	/**
	 * Trigger an 'onscoreboardchange' event
	 */
	onScoreboardChange()
	{
		this.emit('onscoreboardchange', this);
	}
	
	/**
	 * Trigger an 'ongameover' event
	 */
	onGameOver()
	{
		this.emit('ongameover', this);
	}
	
	/**
	 * Trigger an 'onunregisterenemy' event
	 */
	onUnregisterEnemy()
	{
		if (this.registeredEnemies.size == 0)
			this.emit('onunregisterenemy', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Initialize and start the game
	 */
	start()
	{
		//Set game params
		if (this.params.has('noBackground') && this.params.get('noBackground'))
			document.getElementById('canvas').removeAttribute('id');
		
		if (this.params.has('ambient') && this.params.get('ambient') != '')
		{
			this.ambient = new Sound('sounds/' + this.params.get('ambient') + '/sound_stage_start.ogg', true, false);
			window.setTimeout(function(game) {
				game.ambient = new Sound('sounds/' + game.params.get('ambient') + '/sound_stage_loop.ogg', true, true);
			}, (this.params.get('ambient') == 'R-Type I' ? 16662 : 5916), this);
		}
		
		this.scoreboard = new Scoreboard();
		this.spawner = new EnemySpawner();
		
		player1 = new PlayerShip(this);
		this.players.set('player1', player1);
		
		if (this.params.get('players') == 2)
		{
			player2 = new PlayerShip(this);
			this.players.set('player2', player2);
		}
		
		if (this.params.has('assist') && this.params.get('assist'))
		{
			new IA(player1);
			if (player2 != null) new IA(player2);
		}
		
		if (player1 != null && player2 != null)
		{
			player1.sprite.position = new Point(5, canvas.height / 3);
			player2.sprite.position = new Point(5, 2 * (canvas.height / 3));
		}
		else if (player1 != null && !player2)
			player1.sprite.position = new Point(5, canvas.height / 2);
		
		this.scoreboard.print();
		window.setTimeout(function(game) {game.spawner.spawnWave();}, 5000, this);
		
		//Default scheduler tasks
		this.scheduler.addTask(new Task('gameRoutine', this.checkEnemiesOnScreen));
		
		this.scheduler.start();
		
		//Game default events
		this.addEventListener('onkonamicode', function() {
			if (player1 != null)
				player1.triesLeft++;
			if (player2 != null)
				player2.triesLeft++; game.onScoreboardChange();
			new Sound('sounds/sound_extra_life.ogg', true, false);
		});
		this.addEventListener('onscoreboardchange', function() {this.scoreboard.print();});
		this.addEventListener('onunregisterenemy', 	function() {this.rewardPlayers(); this.spawner.spawnWave();});
		this.addEventListener('ongameover', function() {
			this.isLost = true;
			if (this.ambient != null)
				this.ambient.audio.pause();
			this.ambient = null;
			
			this.ambient = new Sound('sounds/sound_game_over.ogg', true, false);
			document.getElementById('canvas').removeAttribute('class');
			this.muliplyEnemiesSpeed();
			this.scoreboard.gameOver();
		});
		
		gameLoop();
	}
	
	/**
	 * Restart game
	 */
	restart()
	{
		this.scheduler.stop();
		this.renderer.stop();
		this.isLost = false;
		this.isWin = false;
		this.wave = 0;
		this.spawner = null;
		this.params = this.parseUrlParams();
		this.players.clear();
		this.registeredEnemies.clear();
		this.registeredModules.clear();
		this.registeredProjectiles.clear();
		this.scoreboard = null;
		this.statistics = new Statistics();
		this.scores = {
			player1: {score: 0, achievements: null}, 
			player2: {score: 0, achievements: null}
		};
		
		if (document.getElementById('gameOver') != null)
			document.getElementById('gameOver').remove();
		
		if (this.ambient != null)
				this.ambient.audio.pause();
		this.ambient = null;
		
		document.getElementById('canvas').className = 'animate';
		this.start();
	}
	
	/* ----- Actions ----- */
	/**
	 * Give 500 points for all players as a reward for survive the current wave
	 */
	rewardPlayers()
	{
		if (player1 != null)
			player1.score += 500;
		if (player2 != null)
			player2.score += 500;
	}
	
	/**
	 * Multiply all registered enemies speed by 2
	 */
	muliplyEnemiesSpeed()
	{
		for (var key of this.registeredEnemies.keys())
			if (this.registeredEnemies.get(key))
				this.registeredEnemies.get(key).speed *= 2;
	}
	
	/* ----- Tasks ----- */
	/**
	 * Count how many enemies left on screen and throw a new wave if this number is 0
	 */
	checkEnemiesOnScreen()
	{
		var nb = 0;
		var regex = new RegExp(/enemy[0-9]+/);
		
		for (var key of game.scheduler.tasks.keys())
			if (regex.test(key))
				nb++;
		
		if (nb == 0 && ((player1 != null && !player1.isDead) || (player2 != null && !player2.isDead)))
			for (var key of game.registeredEnemies.keys())
			{
				game.registeredEnemies.delete(key);
				game.onUnregisterEnemy();
			}
	}
}