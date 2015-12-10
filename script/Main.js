var game;
var ship;
var timerUp;
var timerDown;
var timerLeft;
var timerRight;
var bUp;
var bDown;
var bRight;
var bLeft;

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
		case 37:
			bLeft = false;
			window.clearInterval(timerLeft);
			break;
		case 38:
			bUp = false;
			window.clearInterval(timerUp);
			break;
		case 39:
			bRight = false;
			window.clearInterval(timerRight);
			break;
		case 40:
			bDown = false;
			window.clearInterval(timerDown);
			break;
	}
	resetAnimation();
}

function moveShip(e)
{
	var moveTheShip = function(ship, x, y, direction)
	{
		ship.direction = direction;
		ship.move(x, y);
	}
	
	switch (e.keyCode)
	{
		case 37:
			if (!bLeft)
			{
				bLeft = true;
				timerLeft = window.setInterval(moveTheShip, 10, ship, -ship.speed, 0, 'left');
			}
			break;
		case 38:
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
			break;
		case 39:
			if (!bRight)
			{
				bRight = true;
				timerRight = window.setInterval(moveTheShip, 10, ship, ship.speed, 0, 'right');
			}
			break;
		case 40:
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
			break;
		case 27:
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
			break;
		case 17:
			ship.throwModule();
			break;
	}
}

function shoot(e)
{
	e.preventDefault();
	switch (e.button)
	{
		case 0:
			ship.shoot();
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
}

window.addEventListener('load', setupEvent);