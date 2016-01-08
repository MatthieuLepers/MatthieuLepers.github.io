function HelpMenu()
{
	
}

HelpMenu.prototype.display = function()
{
	var body = document.querySelectorAll('body')[0];
	
	var helpmenu = document.createElement('div');
	helpmenu.id = 'helpMenu';
	
	var assistMode = function()
	{
		return (document.URL.contains('?assist=true') ? '&assist=true' : '');
	}
	
	helpmenu.innerHTML += '<h2>Controls</h2><dl><dd>Z</dd><dt>Up</dt> <dd>Q</dd><dt>Left</dt> <dd>S</dd><dt>Down</dt> <dd>D</dd><dt>Right</dt> <dd>L</dd><dt>Shoot</dt> <dd>M</dd><dt>Charge</dt> <dd>Ctrl</dd><dt>Throw module</dt> <dd>Echap</dd><dt>Pause</dt> <dd>F5</dd><dt>Retry</dt> <dd>↑ ↓</dd><dt>Change letter</dt> <dd>→</dd><dt>Change slot</dt></dl><h2 class="border">Mode</h2><span><a href="http://aireayquaza.github.io?assist=true" title="Computer detects ennemies and shoot them.">Assisted mode</a></span><h2 class="border">Skins</h2><div id="skins"><span class="skin"><a href="http://aireayquaza.github.io?skin=blue' + assistMode() + '"><img src="images/blue_idle.gif" alt="blue" /></a></span><span class="skin"><a href="http://aireayquaza.github.io?skin=darkblue' + assistMode() + '"><img src="images/darkblue_idle.gif" alt="darkblue" /></a></span><span class="skin"><a href="http://aireayquaza.github.io?skin=green' + assistMode() + '"><img src="images/green_idle.gif" alt="green" /></a></span><span class="skin"><a href="http://aireayquaza.github.io?skin=red' + assistMode() + '"><img src="images/red_idle.gif" alt="red" /></a></span><span class="skin"><a href="http://aireayquaza.github.io?skin=yellow' + assistMode() + '"><img src="images/yellow_idle.gif" alt="yellow" /></a></span><span class="skin"><a href="http://aireayquaza.github.io?skin=purple' + assistMode() + '"><img src="images/purple_idle.gif" alt="purple" /></a></span></div>';
	
	body.appendChild(helpmenu);
}