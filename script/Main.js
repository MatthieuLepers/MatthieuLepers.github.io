var game;
var ship;
var timerUp;
var timerDown;
var timerLeft;
var timerRight;
var timerShoot;
var bUp;
var bDown;
var bRight;
var bLeft;
var bShoot;
var hasPress = false;
var shipShoot = function(ship)
{
	ship.shoot();
}

String.prototype.contains = function(s)
{
	return this.indexOf(s) != -1;
}

function resetAnimation(e)
{
	if (!ship.isDead)
	{
		switch (ship.direction)
		{
			case 'up':
				ship.img = ship.game.textures.ship_up_to_idle.getPath();
				ship.printShip();
				break;
			case 'down':
				ship.img = ship.game.textures.ship_down_to_idle.getPath();
				ship.printShip();
				break;
		}
	}
}

function resetDirection(e)
{
	switch (e.keyCode)
	{
		case 81:
			bLeft = false;
			window.clearInterval(timerLeft);
			break;
		case 90:
			bUp = false;
			window.clearInterval(timerUp);
			break;
		case 68:
			bRight = false;
			window.clearInterval(timerRight);
			break;
		case 83:
			bDown = false;
			window.clearInterval(timerDown);
			break;
		case 77:
			hasPress = false;
			ship.launchCharge();
			break;
		case 76:
			bShoot = false;
			window.clearInterval(timerShoot);
			break;
	}
	resetAnimation();
}

/* ----- Movement ----- */
var moveTheShip = function(ship, x, y, direction)
{
	ship.direction = direction;
	ship.move(x, y);
}

function moveUp()
{
	if (!bUp)
	{
		bUp = true;
		if (!ship.isDead)
		{
			ship.img = ship.game.textures.ship_up.getPath();
			ship.printShip();
		}
		timerUp = window.setInterval(moveTheShip, 10, ship, 0, -ship.speed, 'up');
	}
}

function moveDown()
{
	if (!bDown)
	{
		bDown = true;
		if (!ship.isDead)
		{
			ship.img = ship.game.textures.ship_down.getPath();
			ship.printShip();
		}
		timerDown = window.setInterval(moveTheShip, 10, ship, 0, ship.speed, 'down');
	}
}

function moveLeft()
{
	if (!bLeft)
	{
		bLeft = true;
		timerLeft = window.setInterval(moveTheShip, 10, ship, -ship.speed, 0, 'left');
	}
}

function moveRight()
{
	if (!bRight)
	{
		bRight = true;
		timerRight = window.setInterval(moveTheShip, 10, ship, ship.speed, 0, 'right');
	}
}

var pauseGame = function()
{
	if (ship.game.pause)
	{
		ship.game.pause = false;
		ship.game.waveTimer = window.setInterval(ship.game.createEnnemy, 1000, ship.game);
		ship.game.gameSchedulerTimer = window.setInterval(ship.game.f, 10, ship.game.scheduler);
		if (ship.hasRockets)
			ship.rocketTimer = window.setInterval(ship.launchRocket, 2000, ship);
	}
	else
	{
		ship.game.pause = true;
		window.clearInterval(ship.game.waveTimer);
		window.clearInterval(ship.game.gameSchedulerTimer);
		if (ship.hasRockets)
			window.clearInterval(ship.rocketTimer);
	}
}

var changeSelectedSpanName = function()
{
	if (document.getElementById('saveScreen') != null)
	{
		var selectedOld = document.getElementsByClassName('selected')[0];
		selectedOld.className = 'name';
		var spanNames = document.querySelectorAll('span.name');
		var selectedNew = spanNames[parseInt(selectedOld.id) % spanNames.length];
		selectedNew.className = 'name selected';
	}
}

var changeLetterInSpanName = function(direction)
{
	if (document.getElementById('saveScreen') != null)
	{
		var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
		var selectedSpan = document.getElementsByClassName('selected')[0];
		if (direction == 'up')
		{
			var letter = 'A';
			
			if (alpha.indexOf(selectedSpan.textContent) + 1 < alpha.length)
			{
				letter = alpha[alpha.indexOf(selectedSpan.textContent) + 1 % alpha.length];
			}
			
			selectedSpan.textContent = letter;
		}
		else
		{
			var letter = 'Z';
			
			if (alpha.indexOf(selectedSpan.textContent) - 1 >= 0)
			{
				letter = alpha[alpha.indexOf(selectedSpan.textContent) - 1 % alpha.length];
			}
			
			selectedSpan.textContent = letter;
		}
	}
}

function moveShip(e)
{
	switch (e.keyCode)
	{
		case 81:
			moveLeft();
			break;
		case 90:
			moveUp();
			break;
		case 68:
			moveRight();
			break;
		case 83:
			moveDown();
			break;
		case 27:
			pauseGame();
			break;
		case 17:
			ship.throwModule();
			break;
		case 76:
			if (!bShoot)
			{
				bShoot = true;
				ship.shoot();
				timerShoot = window.setInterval(shipShoot, 100, ship);
			}
			break;
		case 77:
			if (!hasPress)
			{
				hasPress = true;
				ship.prepareCharge();
			}
			break;
		case 116:
			location.reload();
			break;
		case 38:
			changeLetterInSpanName('up');
			break;
		case 40:
			changeLetterInSpanName('down');
			break;
		case 39:
			changeSelectedSpanName();
			break;
	}
}

function shoot(e)
{
	e.preventDefault();
	switch (e.button)
	{
		case 0:
			if (!bShoot)
			{
				bShoot = true;
				ship.shoot();
				timerShoot = window.setInterval(shipShoot, 100, ship);
			}
			break;
		case 2:
			ship.prepareCharge();
			break;
	}
}

function launchCharge(e)
{
	e.preventDefault();
	if (e.button == 2)
		ship.launchCharge();
	else
	{
		bShoot = false;
		window.clearInterval(timerShoot);
	}
}

function parseParamsUrl(paramsUrl)
{
	var map = new Map();
	var params = paramsUrl.split('&');
	
	for (var i = 0; i < params.length; i++)
	{
		var tmp = params[i].split('=');
		map.set(tmp[0], tmp[1]);
	}
	
	return map;
}

function getBestScore()
{
	var p_ip = document.querySelectorAll('body')[0].dataset.ip;
	
	var xhr = new XMLHttpRequest();
	var param = new FormData();
	
	xhr.open("POST", "http://hackromproject.craym.eu/JSGame/ajax/bestScore.php", true);
	param.append('p_ip', p_ip);
	
	xhr.onload = function()
	{
		var hightScore = document.createElement('div');
		hightScore.innerHTML = this.responseText;
		hightScore.id = 'hightScore';
		
		document.getElementById('scoreboard').appendChild(hightScore);
	}
	
	xhr.send(param);
}

function getIp()
{
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', 'https://api.ipify.org?format=json', true);
	
	xhr.onload = function()
	{
		document.querySelectorAll('body')[0].dataset.ip = JSON.parse(this.responseText).ip;
		getBestScore();
	}
	
	xhr.send(null);
}

function setupEvent()
{
	game = new Game();
	ship = game.ship;
	bUp = false;
	bDown = false;
	bRight = false;
	bLeft = false;
	
	ship.printShip();
	
	window.addEventListener('keydown', moveShip);
	window.addEventListener('keyup', resetDirection);
	window.addEventListener('mousedown', shoot);
	window.addEventListener('mouseup', launchCharge);
	window.addEventListener('contextmenu', function(e) {e.preventDefault(); return false; });
	window.addEventListener('keypress', function(e) {e.preventDefault(); return false; });
	
	if (document.URL.contains('&assist=true') || document.URL.contains('?assist=true'))
	{
		new IA(ship);
	}
	
	getIp();
	
	var agent = navigator.userAgent.toLowerCase();
	
	if (agent.contains('android') || agent.contains('iphone') || agent.contains('tablet'))
		new TactilePad();
}

window.addEventListener('load', setupEvent);