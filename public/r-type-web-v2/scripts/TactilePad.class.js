class TactilePad
{
	constructor()
	{
		this.displayPad();
	}
	
	displayPad()
	{
		/* Button Shoot */
		var buttonShoot = document.createElement('span');
		buttonShoot.className = 'pad';
		buttonShoot.id = 'padShoot';
		buttonShoot.addEventListener('mouseover', function() {
			if (player1 != null) shoot(player1);
		});
		buttonShoot.addEventListener('mouseout', function() {resetShoot(player1);});
		buttonShoot.addEventListener('touchend', function() {resetShoot(player1);});
		document.body.appendChild(buttonShoot);
		
		/* Button Charge */
		var buttonCharge = document.createElement('span');
		buttonCharge.className = 'pad';
		buttonCharge.id = 'padCharge';
		buttonCharge.addEventListener('mouseover', function() {
			if (player1 != null) chargeShoot(player1);
		});
		buttonCharge.addEventListener('mouseout', function() {resetChargeShoot(player1);});
		buttonCharge.addEventListener('touchend', function() {resetChargeShoot(player1);});
		document.body.appendChild(buttonCharge);
		
		/* Button Call/Release */
		var buttonCallRelease = document.createElement('span');
		buttonCallRelease.className = 'pad';
		buttonCallRelease.id = 'padCallRelease';
		buttonCallRelease.addEventListener('click', function() {
			if (player1 != null) player1.callOrRelease();
		});
		document.body.appendChild(buttonCallRelease);
		
		/* Button Pause */
		var buttonPause = document.createElement('span');
		buttonPause.className = 'pad';
		buttonPause.id = 'padPause';
		buttonPause.addEventListener('click', function() {togglePause();});
		document.body.appendChild(buttonPause);
		
		/* Button Up */
		var buttonUp = document.createElement('span');
		buttonUp.className = 'pad';
		buttonUp.id = 'padUp';
		buttonUp.addEventListener('mouseover', function() {
			if (player1 != null) moveHorizontally(player1, new Point(0, -player1.speed), 'up', bUp, timerUp);
		});
		buttonUp.addEventListener('mouseout', function() {resetMovementTimer(player1, bUp, timerUp);});
		buttonUp.addEventListener('touchend', function() {resetMovementTimer(player1, bUp, timerUp);});
		document.body.appendChild(buttonUp);
		
		/* Button Left */
		var buttonLeft = document.createElement('span');
		buttonLeft.className = 'pad';
		buttonLeft.id = 'padLeft';
		buttonLeft.addEventListener('mouseover', function() {
			if (player1 != null) moveVertically(player1, new Point(-player1.speed, 0), 'left', bLeft, timerLeft);
		});
		buttonLeft.addEventListener('mouseout', function() {resetMovementTimer(player1, bLeft, timerLeft);});
		buttonLeft.addEventListener('touchend', function() {resetMovementTimer(player1, bLeft, timerLeft);});
		document.body.appendChild(buttonLeft);
		
		/* Button Down */
		var buttonDown = document.createElement('span');
		buttonDown.className = 'pad';
		buttonDown.id = 'padDown';
		buttonDown.addEventListener('mouseover', function() {
			if (player1 != null) moveHorizontally(player1, new Point(0, player1.speed), 'down', bDown, timerDown);
		});
		buttonDown.addEventListener('mouseout', function() {resetMovementTimer(player1, bDown, timerDown);});
		buttonDown.addEventListener('touchend', function() {resetMovementTimer(player1, bDown, timerDown);});
		document.body.appendChild(buttonDown);
		
		/* Button Right */
		var buttonRight = document.createElement('span');
		buttonRight.className = 'pad';
		buttonRight.id = 'padRight';
		buttonRight.addEventListener('mouseover', function() {
			if (player1 != null) moveVertically(player1, new Point(player1.speed, 0), 'right', bRight, timerRight);
		});
		buttonRight.addEventListener('mouseout', function() {resetMovementTimer(player1, bRight, timerRight);});
		buttonRight.addEventListener('touchend', function() {resetMovementTimer(player1, bRight, timerRight);});
		document.body.appendChild(buttonRight);
	}
}