function Game()
{
	this.textures = new DefaultTextures();
	this.listeners = new Array();
	this.registeredEnnemies = new Map();
	this.isLost = false;
	this.scheduler = new Scheduler();
	this.ship = new Ship(this);
	this.score = 100;
	this.pause = false;
	
	this.hasSpawn = false;
	this.maxEnnemyPerWave = 5;
	this.displayedEnnemies = 0;
	this.shootingProba = 99.85;
	this.waveNumber = 1;
	this.waveTimer;
	this.gameSchedulerTimer;
	
	this.stopCancerSpawn = false;
	this.spawnedCancer = 0;
	
	this.printScore();
	
	this.f = function(s)
	{
		s.doStep();
	}
	
	var pScore = function(g)
	{
		g.printScore();
	}
	
	var newWave = function(g)
	{
		if (!g.ship.isDead && !g.pause)
		{
			if (g.maxEnnemyPerWave < 30)
			{
				g.maxEnnemyPerWave += 5;
			}
			if (g.shootingProba < 99.50)
			{
				g.shootingProba -= 0.01;
			}
			g.waveNumber++;
			g.addPoints(g.maxEnnemyPerWave * 10 + g.waveNumber * 10);
			g.waveTimer = window.setInterval(g.createEnnemy, 1000, g);
			g.printScore();
		}
	}
	
	var task = function(g)
	{
		var ennemies = document.querySelectorAll('img.ennemy');
		if (ennemies.length == 0)
		{
			for (var key of g.registeredEnnemies.keys())
			{
				g.registeredEnnemies.delete(key);
				g.onUnregisterEnnemy();
			}
		}
	}
	
	var gameOver = function(g)
	{
		if (!g.isLost)
		{
			var displayStats = function()
			{
				g.stats.printStatistics();
			}
			
			var div = document.createElement('div');
			div.id = 'gameOver';
			div.innerHTML = '<h2>GAME OVER</h2><span>You survived ' + (g.waveNumber - 1) + ' wave' + ((g.waveNumber - 1) > 1 ? 's' : '') + '</span><span>Your score: ' + g.score + '</span><button id="retry" autofocus="autofocus">Retry (Enter)</button><button id="openStats">Show statistics</button>';
			document.getElementsByTagName('body')[0].appendChild(div);
			document.getElementById('openStats').addEventListener('click', displayStats);
			document.getElementById('retry').addEventListener('click', function() { location.reload(); });
			window.addEventListener('keyup', function(e) { if (e.keyCode == 13) location.reload(); });
			new SaveScoreScreen(g);
		}
	}
	
	this.createEnnemy = function(g)
	{
		if (g.displayedEnnemies == g.maxEnnemyPerWave)
		{
			g.displayedEnnemies = 0;
			g.hasSpawn = false;
			window.clearInterval(g.waveTimer);
		}
		else
		{
			g.displayedEnnemies++;
			g.spawnPataPataEnnemy();
			g.spawnMidEnnemy();
			if ((g.waveNumber - 1) % 5 == 0 && (g.waveNumber - 1) > 0 && !g.hasSpawn)
			{
				g.spawnPOWArmor(g.getRandomUpdate());
				g.hasSpawn = true;
			}
			if ((g.waveNumber - 1) >= 20 && !g.stopCancerSpawn)
			{
				g.spawnedCancer++;
				g.spawnCancerEnnemy();
				if (g.spawnedCancer == g.maxEnnemyPerWave - 15)
				{
					g.stopCancerSpawn = true;
					g.spawnedCancer = 0;
				}
			}
		}
	}
	
	this.scheduler.addTask('checkEnnemies', task, this);
	this.stats = new Statistics(this);
	
	this.waveTimer = window.setInterval(this.createEnnemy, 1000, this);
	this.gameSchedulerTimer = window.setInterval(this.f, 10, this.scheduler);
	this.addEventListener('onscorechange', pScore, this);
	this.addEventListener('onunregisterennemy', newWave, this);
	this.addEventListener('ongamelost', gameOver, this);
}

/* ----- Getters ----- */
Game.prototype.getRandomUpdate = function()
{
	var random = parseInt(Math.random() * 6);
	var returned = '';
	
	switch (random)
	{
		case 0:
			returned = 'dna';
			break;
		case 1:
			returned = 'laser';
			break;
		case 2:
			returned = 'fire';
			break;
		case 3:
			if (this.ship.speed < 4)
				returned = 'speed';
			else
				returned = this.getRandomUpdate();
			break;
		case 4:
			if (!this.ship.hasRockets)
				returned = 'rockets';
			else
				returned = this.getRandomUpdate();
			break;
		case 5:
			if (this.ship.bitModules.size < 2)
				returned = 'bitmodule';
			else
				returned = this.getRandomUpdate();
			break;
	}
	
	return returned;
}

/* ----- Setters ----- */
Game.prototype.setLost = function()
{
	this.onLost();
	this.isLost = true;
}

Game.prototype.addPoints = function(points)
{
	this.score += points;
	this.onScoreChange();
}

Game.prototype.removePoints = function(points)
{
	this.score -= points;
	this.onScoreChange();
}

/* ----- Events ----- */
Game.prototype.addEventListener = function(eventName, action, params)
{
	this.listeners.push(new Array(eventName, new EventListener(action, params)));
}

Game.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Game.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Game.prototype.onLost = function()
{
	this.fire(new Event('ongamelost', this));
}

Game.prototype.onScoreChange = function()
{
	this.fire(new Event('onscorechange', this));
}

Game.prototype.onUnregisterEnnemy = function()
{
	if (this.registeredEnnemies.size == 0)
	{
		this.fire(new Event('onunregisterennemy', this));
	}
}

/* ----- Actions ----- */
Game.prototype.spawnPataPataEnnemy = function()
{
	var ennemy = new PataPataEnnemy(this, 'ennemy' + this.registeredEnnemies.size);
	this.registeredEnnemies.set(ennemy.id, ennemy);
}

Game.prototype.spawnMidEnnemy = function()
{
	var ennemy = new MidEnnemy(this, 'mid' + this.registeredEnnemies.size);
	this.registeredEnnemies.set(ennemy.id, ennemy);
}

Game.prototype.spawnCancerEnnemy = function()
{
	var ennemy = new CancerEnnemy(this, 'cancer' + this.registeredEnnemies.size);
	this.registeredEnnemies.set(ennemy.id, ennemy);
}

Game.prototype.spawnPOWArmor = function(upgradeType)
{
	var ennemy = new POWArmorEnnemy(this, 'POWArmor' + this.registeredEnnemies.size, upgradeType);
	this.registeredEnnemies.set(ennemy.id, ennemy);
}

Game.prototype.spawnModule = function()
{
	var module = new Module(this.ship);
	this.registeredEnnemies.set(module.id, module);
	this.ship.module = module;
}

/* ----- Printers ----- */
Game.prototype.printScore = function()
{
	var scoreboard = document.querySelectorAll('div[id="scoreboard"]');
	if (scoreboard.length == 0)
	{
		var scoreboard = document.createElement('div');
		scoreboard.id = 'scoreboard';
		scoreboard.innerHTML = '<span class="score">Score: ' + this.score + '<span>Current wave: ' + (this.waveNumber - 1) + '</span></span><span class="label">BEAM- </span><span id="powerBar" class="power"><span style="width: 0px;"></span></span>';
		
		var help = document.createElement('div');
		help.id = 'help';
		help.title = 'Help';
		
		scoreboard.appendChild(help);
		
		var display = function()
		{
			var helpmenu = new HelpMenu();
			
			var menu = document.querySelectorAll('div[id="helpMenu"]');
			
			if (menu.length == 0)
				helpmenu.display();
			else
				menu[0].parentNode.removeChild(menu[0]);
		}
		
		help.addEventListener('click', display);
		
		document.getElementsByTagName('body')[0].appendChild(scoreboard);
	}
	else
	{
		var score = document.querySelectorAll('div[id="scoreboard"] span.score');
		if (score.length == 1)
		{
			score[0].innerHTML = 'Score: ' + this.score + '<span>Current wave: ' + (this.waveNumber - 1) + '</span>';
		}
	}
}