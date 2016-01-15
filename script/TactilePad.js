function TactilePad()
{
	this.displayPad();
}

TactilePad.prototype.displayPad = function()
{
	var buttonUp = document.createElement('span');
	buttonUp.className = 'pad';
	buttonUp.id = 'padUp';
	buttonUp.addEventListener('touchstart', moveUp);
	buttonUp.addEventListener('touchend', function()
										{
											bUp = false;
											window.clearInterval(timerUp);
											ship.img = ship.game.textures.ship_up_to_idle.getPath();
											ship.printShip();
										}
							);
	
	var buttonLeft = document.createElement('span');
	buttonLeft.className = 'pad';
	buttonLeft.id = 'padLeft';
	buttonLeft.addEventListener('touchstart', moveLeft);
	buttonLeft.addEventListener('touchend', function() {bLeft = false; window.clearInterval(timerLeft);});
	
	var buttonDown = document.createElement('span');
	buttonDown.className = 'pad';
	buttonDown.id = 'padDown';
	buttonDown.addEventListener('touchstart', moveDown);
	buttonDown.addEventListener('touchend', function()
											{
												bDown = false;
												window.clearInterval(timerDown);
												ship.img = ship.game.textures.ship_down_to_idle.getPath();
												ship.printShip();
											}
								);
	
	var buttonRight = document.createElement('span');
	buttonRight.className = 'pad';
	buttonRight.id = 'padRight';
	buttonRight.addEventListener('touchstart', moveRight);
	buttonRight.addEventListener('touchend', function() {bRight = false; window.clearInterval(timerRight);});
	
	var shootButton = document.createElement('span');
	shootButton.className = 'pad';
	shootButton.id = 'shoot';
	shootButton.addEventListener('touchstart', function() {if (!bShoot) {bShoot = true; ship.shoot(); timerShoot = window.setInterval(shipShoot, 100, ship);}});
	shootButton.addEventListener('touchend', function() {bShoot = false; window.clearInterval(timerShoot);});
	
	var chargeButton = document.createElement('span');
	chargeButton.className = 'pad';
	chargeButton.id = 'charge';
	chargeButton.addEventListener('touchstart', function() {ship.prepareCharge();});
	chargeButton.addEventListener('touchend', function() {ship.launchCharge();});
	
	var throwButton = document.createElement('span');
	throwButton.className = 'pad';
	throwButton.id = 'throw';
	throwButton.addEventListener('click', function() {ship.throwModule();});
	
	var pauseButton = document.createElement('span');
	pauseButton.className = 'pad';
	pauseButton.id = 'pause';
	pauseButton.addEventListener('click', function() {pauseGame();});
	
	document.getElementsByTagName('body')[0].appendChild(shootButton);
	document.getElementsByTagName('body')[0].appendChild(chargeButton);
	document.getElementsByTagName('body')[0].appendChild(throwButton);
	document.getElementsByTagName('body')[0].appendChild(pauseButton);
	document.getElementsByTagName('body')[0].appendChild(buttonUp);
	document.getElementsByTagName('body')[0].appendChild(buttonLeft);
	document.getElementsByTagName('body')[0].appendChild(buttonDown);
	document.getElementsByTagName('body')[0].appendChild(buttonRight);
}