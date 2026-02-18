//Globals
var canvas;
var context;
var player1, player2, compiler = null;
var skins = {blue: 0, darkblue: 15, green: 30, purple: 45, red: 60, yellow: 75};
//Controls
var timerUp		= {player1: null, player2: null};
var timerDown	= {player1: null, player2: null};
var timerLeft	= {player1: null, player2: null};
var timerRight	= {player1: null, player2: null};
var timerShoot	= {player1: null, player2: null};
var bUp			= {player1: false, player2: false};
var bDown		= {player1: false, player2: false};
var bRight		= {player1: false, player2: false};
var bLeft		= {player1: false, player2: false};
var bShoot		= {player1: false, player2: false};
var hasPress	= {player1: false, player2: false};
//Konami code
var konamiCodeExecuted = false;
var kkeys = [];
var valid = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

/* ----- Functions Addons ----- */
/**
 * For Chrome support
 */
String.prototype.contains = function(s)
{
	return this.indexOf(s) != -1;
}

/**
 * Remove the node if has a parent node
 */
Node.prototype.remove = function()
{
	if (this.parentNode != null)
		this.parentNode.removeChild(this);
	else
		console.warn('This node cannot be removed because he have no parent node');
}

/**
 * Get the object number of attributes
 */
Object.prototype.getOjectSize = function()
{
	var size = 0;
	
	for (var attribute in this)
		size++;
	
	return size;
}

/* ----- Konami Code ----- */
/**
 * Check if pressed keys are a valid konami code
 * @param kkeys : [Array] The array of each pressed keys
 * @param valid : [Array] The array of konami keys
 * @return [Boolean] True if pressed kays are konami code, false else
 */
function checkValidity(kkeys, valid)
{
	for (var i = 0; i < kkeys.length; i++)
		if (kkeys[i] != valid[i])
			return false;
	
	return true;
}

/**
 * Insert the pressed key into pressed keys array, can run konami code effect when all keys are pressed
 */
function insertKeyCode(e)
{
	kkeys[kkeys.length] = e.keyCode;
	
	if (valid.indexOf(e.keyCode) >= 0 && !checkValidity(kkeys, valid))
	{
		kkeys = [];
		kkeys[kkeys.length] = e.keyCode;
	}
	
	if (kkeys.length == 10)
	{
		if (checkValidity(kkeys, valid))
			runKonamiCode();
		
		kkeys = [];
	}
}

/**
 * Do an action when konami code is runned
 */
function runKonamiCode()
{
	if (!konamiCodeExecuted)
		game.onKonamiCode();
	konamiCodeExecuted = true;
}

/* ----- Getters ----- */
/**
 * Get the player IP
 */
function getIp()
{
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', 'https://api.ipify.org?format=json', true);
	
	xhr.onload = function()
	{
		document.querySelectorAll('body')[0].dataset.ip = JSON.parse(this.responseText).ip;
		Scoreboard.getBestScores();
	}
	
	xhr.send(null);
}

/* ----- Controls ----- */
/**
 * Move the player to the new direction
 * @param playerShip	: [PlayerShip] The player
 * @param newPosition	: [Point] The point where the player move
 * @param directionX	: [String] The direction of the movement in the X axis
 * @param directionY	: [String] The direction of the movement in the Y axis
 */
function movePlayerShip(playerShip, newPosition, directionX, directionY)
{
	playerShip.directionX = directionX;
	playerShip.directionY = directionY;
	playerShip.direction = directionX + ' ' + directionY;
	playerShip.move(newPosition);
}

/**
 * Move the player vertically
 * @param player 	: [PlayerShip] The player to move
 * @param goal 		: [Point] The point where the player move to
 * @param direction	: [String] The direction of the movement (up|down)
 * @param condition : [Boolean] The condition to check for the movement
 * @param timer		: [Interval] The window.setInterval for the movement
 */
function moveVertically(player, goal, direction, condition, timer)
{
	if (player != null && !condition[player.sprite.id] && !player.isDead)
	{
		condition[player.sprite.id] = true;
		if (!player.isDead)
		{
			if (player.directionY == 'up' && timerUp[player.sprite.id])
				game.renderer.replaceSprite(new Sprite(player.sprite.id, 'images/spritesheets/player/' + game.params.get('skin_' + player.sprite.id) + '.png', 32, 15, player.sprite.position, 6, [3, 2], false));
			else if (player.directionY == 'down' && timerDown[player.sprite.id])
				game.renderer.replaceSprite(new Sprite(player.sprite.id, 'images/spritesheets/player/' + game.params.get('skin_' + player.sprite.id) + '.png', 32, 15, player.sprite.position, 6, [1, 2], false));
		}
		timer[player.sprite.id] = window.setInterval(movePlayerShip, game.scheduler.speed, player, goal, direction, player.directionY);
	}
}

/**
 * Move the player horizotally
 * @param player 	: [PlayerShip] The player to move
 * @param goal 		: [Point] The point where the player move to
 * @param direction	: [String] The direction of the movement (up|down)
 * @param condition : [Boolean] The condition to check for the movement
 * @param timer		: [Interval] The window.setInterval for the movement
 */
function moveHorizontally(player, goal, direction, condition, timer)
{
	if (player != null && !condition[player.sprite.id] && !player.isDead)
	{
		condition[player.sprite.id] = true;
		game.renderer.replaceSprite(new Sprite(player.sprite.id, 'images/spritesheets/player/' + game.params.get('skin_' + player.sprite.id) + '.png', 32, 15, player.sprite.position, 6, (direction == 'up' ? [3, 4] : [1, 0]), false));
		timer[player.sprite.id] = window.setInterval(movePlayerShip, game.scheduler.speed, player, goal, player.directionX, direction);
	}
}

/**
 * Define the shoot control
 * @param player : [PlayerShip] The player
 */
function shoot(player)
{
	if (player != null && !bShoot[player.sprite.id] && !player.isDead)
	{
		bShoot[player.sprite.id] = true;
		player.shoot();
		timerShoot[player.sprite.id] = window.setInterval(function(player) {
			player.shoot();
		}, game.scheduler.speed * 10, player);
	}
}

/**
 * Define the charge shoot control
 * @param player : [PlayerShip] The player
 */
function chargeShoot(player)
{
	if (player != null && !hasPress[player.sprite.id] && !player.isDead)
	{
		hasPress[player.sprite.id] = true;
		player.prepareCharge();
	}
}

/**
 * Pause/Unpause the game
 */
function togglePause()
{
	if (game.scheduler.isPaused)
		game.scheduler.resume();
	else
		if (player1 != null && !player1.isCharging)
			if (player2 != null && !player2.isCharging)
				game.scheduler.pause();
			else
				game.scheduler.pause();
		else if (player2 != null && !player2.isCharging)
			game.scheduler.pause();
}

/**
 * Reset the timer for a movement
 * @param player 	: [PlayerShip] The player
 * @param condition : [Boolean] The condition to check for the movement
 * @param timer 	: [Interval] The window.setInterval for the movement
 */
function resetMovementTimer(player, condition, timer)
{
	if (player != null)
	{
		condition[player.sprite.id] = false;
		window.clearInterval(timer[player.sprite.id]);
		player.direction = '';
	}
}

/**
 * Reset the timer for the shoot control
 * @param player : [PlayerShip] The player
 */
function resetShoot(player)
{
	if (player !=  null)
	{
		bShoot[player.sprite.id] = false;
		window.clearInterval(timerShoot[player.sprite.id]);
	}
}

/**
 * Reset the timer for the charge shoot control
 * @param player : [PlayerShip] The player
 */
function resetChargeShoot(player)
{
	if (player != null)
	{
		hasPress[player.sprite.id] = false;
		player.launchCharge();
	}
}

/**
 * Reset player movement animation
 * @param player : [PlayerShip] The player
 */
function resetAnimation(player)
{
	if (player != null && !player.isDead)
	{
		if (player.directionY == 'up')
			game.renderer.replaceSprite(new Sprite(player.sprite.id, 'images/spritesheets/player/' + game.params.get('skin_' + player.sprite.id) + '.png', 32, 15, player.sprite.position, 6, [3, 2], false));
		else if (player.directionY == 'down')
			game.renderer.replaceSprite(new Sprite(player.sprite.id, 'images/spritesheets/player/' + game.params.get('skin_' + player.sprite.id) + '.png', 32, 15, player.sprite.position, 6, [1, 2], false));
	}
}

/**
 * Change the letter horizontally in the save score screen
 * @param direction : [String] (left|right)
 */
function changeLetterHorizontally(direction)
{
	if (document.getElementById('saveScreen') != null)
	{
		var spanNames = document.querySelectorAll('span.name');
		var selected = document.querySelectorAll('span.name.selected')[0];
		var newSelected;
		
		selected.className = 'name';
		if (direction == 'left')
			if (parseInt(selected.id) == 1)
			{
				newSelected = spanNames[spanNames.length - 1];
				newSelected.className = 'name selected';
			}
			else
			{
				newSelected = spanNames[parseInt(selected.id) - 2];
				newSelected.className = 'name selected';
			}
		else
		{
			newSelected = spanNames[parseInt(selected.id) % spanNames.length];
			newSelected.className = 'name selected';
		}
	}
}

/**
 * Change the letter vertically in the save score screen
 * @param direction : [String] (up|down)
 */
function changeLetterVertically(direction)
{
	if (document.getElementById('saveScreen') != null)
	{
		var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9', '0');
		var selected = document.querySelectorAll('span.name.selected')[0];
		
		var letter = (direction == 'up' ? 'A' : '0');
		var sign = (direction == 'up' ? 1 : (-1));
		
		if ((direction == 'up' ? (alpha.indexOf(selected.textContent) + 1) < alpha.length : (alpha.indexOf(selected.textContent) - 1) >= 0))
			letter = alpha[alpha.indexOf(selected.textContent) + (sign * 1) % alpha.length];
		selected.textContent = letter;
	}
}

/* ----- Key Events ----- */
/**
 * All keys events when keyDown
 * @param e : [KeyDownEvent] The keyDown event
 */
function keysDownEvent(e)
{
	switch (e.key)
	{
		/* ----- Player 1 ----- */
		case 'z':
			if (player1 != null) moveHorizontally(player1, new Point(0, -player1.speed), 'up', bUp, timerUp);
			break;
		case 'q':
			if (player1 != null) moveVertically(player1, new Point(-player1.speed, 0), 'left', bLeft, timerLeft);
			break;
		case 's':
			if (player1 != null) moveHorizontally(player1, new Point(0, player1.speed), 'down', bDown, timerDown);
			break;
		case 'd':
			if (player1 != null) moveVertically(player1, new Point(player1.speed, 0), 'right', bRight, timerRight);
			break;
		case 'l':
			if (player1 != null) shoot(player1);
			break;
		case 'm':
			if (player1 != null) chargeShoot(player1);
			break;
		case 'Control':
			if (player1 != null) player1.callOrRelease();
			break;
		/* ----- Player 2 ----- */
		case 'ArrowUp':
			if (player2 != null)
				moveHorizontally(player2, new Point(0, -player2.speed), 'up', bUp, timerUp);
			else
				changeLetterVertically('up');
			break;
		case 'ArrowLeft':
			if (player2 != null)
				moveVertically(player2, new Point(-player2.speed, 0), 'left', bLeft, timerLeft);
			else
				changeLetterHorizontally('left');
			break;
		case 'ArrowDown':
			if (player2 != null)
				moveHorizontally(player2, new Point(0, player2.speed), 'down', bDown, timerDown);
			else
				changeLetterVertically('down');
			break;
		case 'ArrowRight':
			if (player2 != null)
				moveVertically(player2, new Point(player2.speed, 0), 'right', bRight, timerRight);
			else
				changeLetterHorizontally('right');
			break;
		case '2':
			if (player2 != null) shoot(player2);
			break;
		case '3':
			if (player2 != null) chargeShoot(player2);
			break;
		case '0':
			if (player2 != null) player2.callOrRelease();
			break;
		/* ----- Global ----- */
		case 'Escape':
			togglePause();
			break;
		case 'F5':
			location.reload();
			break;
		case 'F6':
			game.restart();
			break;
	}
}

/**
 * All keys event when keyUp
 * @param e : [KeyUpEvent] The keyUp event
 */
function keysUpEvent(e)
{
	switch (e.key)
	{
		/* ----- Player 1 ----- */
		case 'z':
			resetMovementTimer(player1, bUp, timerUp);
			break;
		case 'q':
			resetMovementTimer(player1, bLeft, timerLeft);
			break;
		case 's':
			resetMovementTimer(player1, bDown, timerDown);
			break;
		case 'd':
			resetMovementTimer(player1, bRight, timerRight);
			break;
		case 'l':
			resetShoot(player1);
			break;
		case 'm':
			resetChargeShoot(player1);
			break;
		/* ----- Player 2 ----- */
		case 'ArrowUp':
			resetMovementTimer(player2, bUp, timerUp);
			break;
		case 'ArrowLeft':
			resetMovementTimer(player2, bLeft, timerLeft);
			break;
		case 'ArrowDown':
			resetMovementTimer(player2, bDown, timerDown);
			break;
		case 'ArrowRight':
			resetMovementTimer(player2, bRight, timerRight);
			break;
		case '2':
			resetShoot(player2);
			break;
		case '3':
			resetChargeShoot(player2);
			break;
	}
	resetAnimation(player1);
	resetAnimation(player2);
}

/**
 * Start the sprites renderer
 */
function gameLoop()
{
	game.renderer._timer = window.requestAnimationFrame(gameLoop);
	
	game.renderer.renderAll();
}

function getLatestCommit()
{
	var url = 'https://api.github.com/repos/AireAyquaza/aireayquaza.github.io/commits';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onload = function()
	{
		var object = JSON.parse(this.responseText);
		var lastCommit = {
			date: object[0].commit.committer.date,
			msg: object[0].commit.message,
			url: object[0].html_url
		};
		
		var sources = document.querySelectorAll('div#scoreboard span.sources');
		if (sources.length > 0)
		{
			var span = document.createElement('span');
			span.className = 'lastCommit';
			span.innerHTML = 'Last commit: <a href="' + lastCommit.url + '" class="lastCommitLink" target="_blank" title="' + lastCommit.msg + '">' + (lastCommit.msg.length > 27 ? lastCommit.msg.substr(0, 27) + '...' : lastCommit.msg) + '</a>';
			
			sources[0].appendChild(span);
		}
		
		console.log(lastCommit);
	}
	xhr.send(null);
}

/**
 * Initialize the game
 */
function init()
{
	canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 51;
	context = canvas.getContext('2d');
	
	getIp();
	
	game = new Game(10);
	
	window.addEventListener('keydown',	keysDownEvent);
	window.addEventListener('keyup',	keysUpEvent);
	window.addEventListener('keyup', 	insertKeyCode);
	window.addEventListener('contextmenu',	function(e) {e.preventDefault(); return false; });
	window.addEventListener('keypress',		function(e) {e.preventDefault(); return false; });
	
	//Start game
	game.start();
	getLatestCommit();
	
	var agent = navigator.userAgent.toLowerCase();
	
	if (agent.contains('android') || agent.contains('iphone') || agent.contains('tablet'))
		new TactilePad();
}

window.addEventListener('load', init);