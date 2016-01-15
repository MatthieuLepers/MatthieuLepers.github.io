function TactilePad()
{
	this.displayPad();
}

TactilePad.prototype.displayPad = function()
{
	var buttonUp = document.createElement('span');
	buttonUp.className = 'pad';
	buttonUp.id = 'padUp';
	buttonUp.addEventListener('mouseenter', moveUp);
	buttonUp.addEventListener('mouseleave', function()
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
	buttonLeft.addEventListener('mouseenter', moveLeft);
	buttonLeft.addEventListener('mouseleave', function() {bLeft = false; window.clearInterval(timerLeft);});
	
	var buttonDown = document.createElement('span');
	buttonDown.className = 'pad';
	buttonDown.id = 'padDown';
	buttonDown.addEventListener('mouseenter', moveDown);
	buttonDown.addEventListener('mouseleave', function()
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
	buttonRight.addEventListener('mouseenter', moveRight);
	buttonRight.addEventListener('mouseleave', function() {bRight = false; window.clearInterval(timerRight);});
	
	var shootButton = document.createElement('span');
	shootButton.className = 'pad';
	shootButton.id = 'shoot';
	shootButton.addEventListener('mouseenter', function() {if (!bShoot) {bShoot = true; ship.shoot(); timerShoot = window.setInterval(shipShoot, 100, ship);}});
	shootButton.addEventListener('mouseleave', function() {bShoot = false; window.clearInterval(timerShoot);});
	
	var chargeButton = document.createElement('span');
	chargeButton.className = 'pad';
	chargeButton.id = 'charge';
	chargeButton.addEventListener('mouseenter', function() {ship.prepareCharge();});
	chargeButton.addEventListener('mouseleave', function() {ship.launchCharge();});
	
	var throwButton = document.createElement('span');
	throwButton.className = 'pad';
	throwButton.id = 'throw';
	throwButton.addEventListener('mouseenter', function() {ship.throwModule();});
	
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