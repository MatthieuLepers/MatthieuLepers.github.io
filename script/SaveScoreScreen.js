function SaveScoreScreen(game)
{
	this.game = game;
	this.printScreen();
}

SaveScoreScreen.prototype.printScreen = function()
{
	var mainDiv = document.createElement('div');
	var nameDiv = document.createElement('div');
	var saveButton = document.createElement('button');
	
	mainDiv.id = 'saveScreen';
	saveButton.id = 'savescore';
	mainDiv.innerHTML = '<h2>SAVE SCORE AS</h2>';
	saveButton.textContent = 'Save my score';
	
	var spanName1 = document.createElement('span');
	spanName1.textContent = 'A';
	spanName1.id = '1';
	spanName1.className = 'name selected';
	var spanName2 = document.createElement('span');
	spanName2.textContent = 'A';
	spanName2.id = '2';
	spanName2.className = 'name';
	var spanName3 = document.createElement('span');
	spanName3.textContent = 'A';
	spanName3.id = '3';
	spanName3.className = 'name';
	
	nameDiv.appendChild(spanName1);
	nameDiv.appendChild(spanName2);
	nameDiv.appendChild(spanName3);
	mainDiv.appendChild(nameDiv);
	mainDiv.appendChild(saveButton);
	
	document.getElementById('gameOver').appendChild(mainDiv);
	
	var g = this;
	
	var save2 = function()
	{
		g.save(g.game);
	}
	
	saveButton.addEventListener('click', save2);
}

SaveScoreScreen.prototype.save = function(game)
{
	var spanNames = document.getElementsByClassName('name');
	var p_ip = myip;
	var p_name = spanNames[0].textContent + spanNames[1].textContent + spanNames[2].textContent;
	var stats = game.stats.getJSON();
	
	var xhr = new XMLHttpRequest();
	var param = new FormData();
	
	xhr.open("POST", "http://hackromproject.craym.eu/JSGame/ajax/saveStats.php", true);
	param.append('p_ip', p_ip);
	param.append('p_name', p_name);
	param.append('stats', stats);
	
	xhr.onload = function()
	{
		var done = this.responseText;
		document.getElementById('savescore').innerHTML = 'Save my score ' + done;
	}
	
	xhr.send(param);
}