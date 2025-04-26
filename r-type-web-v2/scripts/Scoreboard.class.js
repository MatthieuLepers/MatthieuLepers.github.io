class Scoreboard
{
	/**
	 * Create the scoreboard
	 */
	constructor()
	{
		window.setInterval(this.drawFps, 1000);
	}
	
	/* ----- Process ----- */
	/**
	 * Get the number of images to print with the amount of tries left
	 * @param player : [PlayerShip] The player
	 * @return [String] The html code with the img
	 */
	makeTriesImg(player)
	{
		if (player)
		{
			var img = '';
			
			for (var i = 0; i < player.triesLeft - 1; i++)
				img += '<img src="images/gui/try.png" alt="try" />';
			
			return '<span class="tries ' + player.sprite.id + '">' + img + '</span>';
		}
		return '';
	}
	
	/* ----- Printers ----- */
	/**
	 * Draw the Fps number in the screen
	 */
	drawFps()
	{
		var maxFps = 10 * game.scheduler.speed;
		var percent75Fps = (75 / 100) * maxFps;
		var percent50Fps = (50 / 100) * maxFps;
		var fps = game.scheduler.fps;
		
		if (game.params.get('drawFps'))
		{
			var fpsHTML = document.getElementById('fpsDrawer');
			var color = 'green';
			if (fps < percent75Fps && fps >= percent50Fps)
				color = 'orange';
			else if (fps < percent50Fps)
				color = 'red';
			
			if (fpsHTML == null)
			{
				var fpsHTML = document.createElement('label');
				fpsHTML.id = 'fpsDrawer';
				fpsHTML.textContent = fps;
				fpsHTML.className = color;
				
				document.getElementById('background').appendChild(fpsHTML);
			}
			else
			{
				fpsHTML.textContent = fps;
				fpsHTML.className = color;
			}
		}
		
		game.scheduler.resetFpsCounter();
	}
	
	/**
	 * Print the scoreboard
	 */
	print()
	{
		var scoreboardHTML = document.getElementById('scoreboard');
		
		if (!scoreboardHTML)
		{	
			var scoreboard = document.createElement('div');
			var scoreP2 = '';
			var beamBarP2 = '';
			var triesP2 = '';
			
			if (player2 != null)
			{
				scoreP2 = '<span class="scoreP2">Score: ' + player2.score + '</span>';
				beamBarP2 = '<span class="label p2">BEAM-</span><span id="powerBarplayer2" class="power p2"><span style="width: 0px;"></span></span>';
				triesP2 = this.makeTriesImg(player2);
			}
			
			scoreboard.id = 'scoreboard';
			scoreboard.innerHTML = '<span class="scoreP1">' +
			'	Score: ' + player1.score +
			'	<span>' + 
			'		Current wave: ' + game.wave +
			'	</span>' +
			'</span>' +
			scoreP2 +
			'<span class="label p1">' +
			'	BEAM-' +
			'</span>' +
			'<span id="powerBarplayer1" class="power p1">' +
			'	<span style="width: 0px;"></span>' +
			'</span>' +
			beamBarP2 + 
			this.makeTriesImg(player1) +
			triesP2 + '<span class="sources">' +
			'	<a href="https://github.com/AireAyquaza/AireAyquaza.github.io" class="sources">Github source code</a>' +
			'</span>';
		
			var help = document.createElement('div');
			help.id = 'help';
			help.title = 'Help';
			
			scoreboard.appendChild(help);
			help.addEventListener('click', function()
			{
				if (game.scheduler.isPaused)
					game.scheduler.resume();
				else
					game.scheduler.pause();
				game.scoreboard.printHelpMenu();
			});
			
			document.getElementById('background').appendChild(scoreboard);
		}
		else
		{
			var scoreP1 = document.querySelectorAll('div[id="scoreboard"] span.scoreP1');
			var scoreP2 = document.querySelectorAll('div[id="scoreboard"] span.scoreP2');
			var triesP1 = document.querySelectorAll('span.tries.player1');
			var triesP2 = document.querySelectorAll('span.tries.player2');
			
			if (scoreP1 && player1 != null)
				scoreP1[0].innerHTML = 'Score: ' + player1.score + '<span>Current wave: ' + game.wave + '</span>';
			if (scoreP2 && player2 != null)
				scoreP2[0].innerHTML = 'Score: ' + player2.score;
			
			if (triesP1 && player1 != null)			
			{
				triesP1[0].innerHTML = this.makeTriesImg(player1).replace(/<span class="tries player(1|2)">(.+)<\/span>/, '$2');
			}
			
			if (triesP2 && player2 != null)			
			{
				triesP2[0].innerHTML = this.makeTriesImg(player2).replace(/<span class="tries player(1|2)">(.+)<\/span>/, '$2');
			}
		}
	}
	
	/**
	 * Print hte help menu
	 */
	printHelpMenu()
	{
		var menu = document.getElementById('helpMenu');
		
		if (!menu)
		{
			var assistMode = (document.URL.contains('?assist=true') ? '&assist=true' : '');
			var helpmenu = document.createElement('div');
			helpmenu.id = 'helpMenu';
			
			helpmenu.innerHTML += '<div id="tab_control_labels">' +
			'	<label class="tab" data-id="player1_tab">Player 1</label>' +
			'	<label class="tab" data-id="player2_tab">Player 2</label>' +
			'</div>' +
			'<div id="tab_control">' +
			'	<div id="player1_tab">' +
			'		<h2 id="ctrl">' +
			'			Controls' +
			'		</h2>' +
			'		<dl>' +
			'			<dd>Z</dd>		<dt>Up</dt>' +
			'			<dd>Q</dd>		<dt>Left</dt>' +
			'			<dd>S</dd>		<dt>Down</dt>' +
			'			<dd>D</dd>		<dt>Right</dt>' +
			'			<dd>L</dd>		<dt>Shoot</dt>' +
			'			<dd>M</dd>		<dt>Charge</dt>' +
			'			<dd>Ctrl</dd>	<dt>Throw module</dt>' +
			'			<dd>Echap</dd>	<dt>Pause</dt>' +
			'			<dd>F5</dd>		<dt>Reload</dt>' +
			'			<dd>F6</dd>		<dt>Retry</dt>' +
			'			<dd>↑ ↓</dd>	<dt>Change letter</dt>' +
			'			<dd>→</dd>		<dt>Change slot</dt>' +
			'		</dl>' +
			'		<h2 class="border">' +
			'			Skins' +
			'		</h2>' +
			'		<div id="skins">' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=blue' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/blue_idle.gif" alt="blue" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=darkblue' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/darkblue_idle.gif" alt="darkblue" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=green' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/green_idle.gif" alt="green" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=red' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/red_idle.gif" alt="red" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=yellow' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/yellow_idle.gif" alt="yellow" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player1=purple' + game.encodeUriParams(false, 'skin_player1') + '">' +
			'					<img src="images/gui/player/purple_idle.gif" alt="purple" />' +
			'				</a>' +
			'			</span>' +
			'		</div>' +
			'	</div>' +
			'	<div id="player2_tab" class="hide">' +
			'		<h2 id="ctrl">' +
			'			Controls' +
			'		</h2>' +
			'		<dl>' +
			'			<dd>↑</dd>		<dt>Up</dt>' +
			'			<dd>←</dd>		<dt>Left</dt>' +
			'			<dd>↓</dd>		<dt>Down</dt>' +
			'			<dd>→</dd>		<dt>Right</dt>' +
			'			<dd>NUMPAD2</dd><dt>Shoot</dt>' +
			'			<dd>NUMPAD3</dd><dt>Charge</dt>' +
			'			<dd>NUMPAD0</dd><dt>Throw module</dt>' +
			'		</dl>' +
			'		<h2 class="border">' +
			'			Skins' +
			'		</h2>' +
			'		<div id="skins">' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=blue' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/blue_idle.gif" alt="blue" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=darkblue' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/darkblue_idle.gif" alt="darkblue" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=green' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/green_idle.gif" alt="green" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=red' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/red_idle.gif" alt="red" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=yellow' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/yellow_idle.gif" alt="yellow" />' +
			'				</a>' +
			'			</span>' +
			'			<span class="skin">' +
			'				<a href="index.html?skin_player2=purple' + game.encodeUriParams(false, 'skin_player2') + '">' +
			'					<img src="images/gui/player/purple_idle.gif" alt="purple" />' +
			'				</a>' +
			'			</span>' +
			'		</div>' +
			'	</div>' +
			'</div>' +
			'<h2 class="border">' +
			'	Mode' +
			'</h2>' +
			'<span>' +
			'	<a href="index.html' + game.encodeUriParams(true, '') + '" title="Play the game normaly">' +
			'		Normal mode' +
			'	</a>' +
			'</span>' +
			'<span>' +
			'	<a href="index.html?assist=true' + game.encodeUriParams(false, 'assist') + '" title="Computer detects ennemies and shoot them.">' +
			'		Assisted mode' +
			'	</a>' +
			'</span>' +
			'<span>' +
			'	<a href="index.html' + game.encodeUriParams(true, 'players') + '" title="Play solo.">' +
			'		1 Players' +
			'	</a>' +
			'</span>' +
			'<span>' +
			'	<a href="index.html?players=2' + game.encodeUriParams(false, 'players') + '" title="Play with a friend.">' +
			'		2 Players' +
			'	</a>' +
			'</span>' +
			'<h2 class="border">' +
			'	Other' +
			'</h2>' +
			'<span>' +
			'	<a href="index.html?noSounds=true' + game.encodeUriParams(false, 'noSounds') + '" title="Play without sounds.">' +
			'		No Sounds' +
			'	</a>' +
			'</span>' +
			'<span>' +
			'	<a href="index.html?noBackground=true' + game.encodeUriParams(false, 'noBackground') + '" title="Play without the stared background.">' +
			'		No Background' +
			'	</a>' +
			'</span>';
			
			document.getElementById('background').appendChild(helpmenu);
			
			var tabLabels = document.getElementsByClassName('tab');
			for (var i = 0; i < tabLabels.length; i++)
			{
				tabLabels[i].addEventListener('click', function() {
					document.getElementById('player1_tab').className = 'hide';
					document.getElementById('player2_tab').className = 'hide';
					document.getElementById(this.dataset.id).removeAttribute('class');
				});
			}
		}
		else
			menu.parentNode.removeChild(menu);
	}
	
	/**
	 * Print game over window
	 */
	gameOver()
	{
		var p1 = document.querySelectorAll('span.scoreP1');
		var p2 = document.querySelectorAll('span.scoreP2');
		
		var scores = '';
		
		if (p1.length > 0)
			scores += 'P1 score: ' + p1[0].textContent.replace(/Score: ([0-9]+)(.+)?/, '$1');
		
		if (p2.length > 0)
			scores += '<br />P2 score: ' + p2[0].textContent.replace(/Score: ([0-9]+)(.+)?/, '$1');
		
		var div = document.createElement('div');
		div.id = 'gameOver';
		div.innerHTML = '<h2>' +
		'	GAME OVER' +
		'</h2>' +
		'<span>' +
		'	You survived ' + (game.wave) + ' wave' + ((game.wave - 1) > 1 ? 's' : '') +
		'</span>' +
		'<span>' +
			scores +
		'</span>' +
		'<button id="retry" autofocus="autofocus">Retry (Enter)</button>' +
		'<button id="openStats">Show statistics</button>' +
		'<div id="saveScreen">' +
		'	<h2> SAVE SCORE AS</h2>' +
		'	<div id="selectName">' +
		'		<div id="playersNames">' +
		'			<span id="1" class="name selected">' + (game.params.has('ia') && game.params.get('ia') == 'player1' ? 'A' : 'P') + '</span>' +
		'			<span id="2" class="name">' + (game.params.has('ia') && game.params.get('ia') == 'player1' ? 'I' : 'L') + '</span>' +
		'			<span id="3" class="name">1</span>' +
		(game.params.has('players') && game.params.get('players') == 2 ? '<span class="format">&</span><span id="4" class="name">' + (game.params.has('ia') && game.params.get('ia') == 'player2' ? 'A' : 'P') + '</span><span id="5" class="name">' + (game.params.has('ia') && game.params.get('ia') == 'player2' ? 'I' : 'L') + '</span><span id="6" class="name">2</span>' : '') +
		'		</div>' +
		'		<div id="savescores">' +
		'			<button id="save">Save my score</button>' +
		'		</div>' +
		'	</div>' +
		'</div>';
		document.getElementById('background').appendChild(div);
		
		document.getElementById('save').addEventListener('click', Scoreboard.save);
		document.getElementById('retry').addEventListener('click', 		function() {game.restart();});
		document.getElementById('openStats').addEventListener('click', 	function() {game.statistics.print();});
		window.addEventListener('keyup', function(e) {
			if (e.keyCode == 13)
				location.reload();
		});
	}
	
	/**
	 * Save players scores into a database
	 */
	static save()
	{
		var spanNames = document.getElementsByClassName('name');
		var p_ip = document.querySelectorAll('body')[0].dataset.ip;
		var p_p1Name = spanNames[0].textContent + spanNames[1].textContent + spanNames[2].textContent;
		var p_p2Name = (game.params.has('players') && game.params.get('players') == 2 ? spanNames[3].textContent + spanNames[4].textContent + spanNames[5].textContent : null);
		var stats = game.statistics.getJSON();
		
		var xhr = new XMLHttpRequest();
		var params = new FormData();
		
		xhr.open('POST', 'https://hackromproject.craym.eu/JSGames/R-Type%20Web/ajax/save.php', true);
		params.append('p_ip', p_ip);
		params.append('p_p1Name', p_p1Name);
		if (game.params.has('players') && game.params.get('players') == 2)
			params.append('p_p2Name', p_p2Name);
		params.append('stats', stats);
		
		xhr.onload = function()
		{
			var success = this.responseText;
			document.getElementById('save').innerHTML = 'Save my score ' + success;
		};
		
		xhr.send(params);
	}
	
	/**
	 * Get the best scores for 1P et 2P
	 */
	static getBestScores()
	{
		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', 'https://hackromproject.craym.eu/JSGames/R-Type%20Web/ajax/getBestScores.php', true)
		
		xhr.onload = function()
		{
			var object = JSON.parse(this.responseText);
			var divBestScore = document.createElement('div');
			var span1P = '<span class="best1P">No score</span>';
			var span2P = '<span class="best2P">No score</span>';
			
			if (object['p1']['name'] != '')
				span1P = '<span class="best1P"><a href="http://hackromproject.craym.eu/JSGames/R-Type%20Web/stats.php?id=' + object['p1']['id'] + '&mode=1P">' + object['p1']['name'] + '</a> - ' + object['p1']['score'] + ' point' + (object['p1']['score'] > 1 ? 's' : '') + '</span>';
			if (object['p2']['name_1p'] != '' && object['p2']['name_2p'] != '')
				span2P = '<span class="best2P"><a href="http://hackromproject.craym.eu/JSGames/R-Type%20Web/stats.php?id=' + object['p2']['id'] + '&mode=2P">' + object['p2']['name_1p'] + ' & ' + object['p2']['name_2p'] + '</a> - ' + (parseInt(object['p2']['score_1p']) + parseInt(object['p2']['score_2p'])) + ' point' + ((parseInt(object['p2']['score_1p']) + parseInt(object['p2']['score_2p'])) > 1 ? 's' : '') + '</span>';
			
			divBestScore.id = 'bestScores';
			divBestScore.innerHTML = span1P + span2P;
			
			document.getElementById('scoreboard').appendChild(divBestScore);
		};
		
		xhr.send(null);
	}
}
