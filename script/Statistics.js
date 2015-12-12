function Statistics(game)
{
	this.game = game;
	//Ship shot
	this.shipShots = 0;
	this.shipShotHits = 0;
	this.shipShotFails = 0;
	this.chargedShots = 0;
	this.chargedShotHits = 0;
	this.chargedShotFails = 0;
	this.dnaShots = 0;
	this.dnaShotHits = 0;
	this.dnaShotFails = 0;
	
	//Rockets
	this.rocketLaunched = 0;
	this.rocketHits = 0;
	this.rocketFails = 0;
	
	//Module Stats
	this.moduleTier = 0;
	this.moduleAbsorbedShot = 0;
	this.moduleShots = 0;
	this.moduleShotHits = 0;
	this.moduleShotFails = 0;
	this.biModuleShots = 0;
	this.bitModuleShotHits = 0;
	this.bitModuleShotFails = 0;
	
	//Kills
	this.killedPataPata = 0;
	this.killedMid = 0;
	this.killedCancer = 0;
	this.killedPowArmor = 0;
	
	//Upgrades
	this.spawnedUpgrade = 0;
	this.pickedDnaUpgrade = 0;
	this.pickedLaserUpgrade = 0;
	this.pickedFireUpgrade = 0;
	this.pickedRocketsUpgrade = 0;
	this.pickedSpeedUpgrade = 0;
	this.pickedBitModuleUpgrade = 0;
	
	this.maximumScore;
	this.maximumShootedBullets = this.maximumScore / 20;
}

function createCell(title)
{
	var cell = document.createElement('div');
	var h3 = document.createElement('h3');
	
	cell.className = 'cell';
	h3.textContent = title;
	
	cell.appendChild(h3);
	
	return cell;
}

function createCellSection(labelValueArray)
{
	var dl = document.createElement('dl');
	
	for (var i = 0; i < labelValueArray.length / 2; i++)
	{
		var dd = document.createElement('dd');
		var dt = document.createElement('dt');
		
		dd.textContent = labelValueArray[i * 2];
		dt.textContent = labelValueArray[i * 2 + 1];
		
		dl.appendChild(dd);
		dl.appendChild(dt);
	}
	
	return dl;
}

function calculPercentage(hits, total)
{
	var a = (hits * 100) / total;
	return (!isNaN(a) ? (""+a).substr(0, 5) : '0.00');
}

Statistics.prototype.printStatistics = function()
{
	var getMaxScore = function(waves)
	{
		if (waves == 1)
		{
			return 935;
		}
		else
		{
			var w = (waves * 5 > 30 ? 30 : waves * 5);
			return ((w * 50) + (w * 100) - 35 + (w * 10) + (waves * 10)) + getMaxScore(waves - 1);
		}
	}
	
	this.maximumScore = getMaxScore(this.game.waveNumber);
	
	var section = document.createElement('section');
	var article = document.createElement('article');
	var h2 = document.createElement('h2');
	var button = document.createElement('button');
	section.id = 'stats';
	article.id = 'main';
	button.id = 'close';
	button.textContent = 'X';
	
	h2.textContent = 'Total score: ' + this.game.score + '/' + this.maximumScore + ' (' + (""+calculPercentage(this.maximumScore - this.game.score,this.maximumScore)).substr(0, 5) + '%)';
	article.appendChild(h2);
	
	//Create Global statistics
	var globalStats = createCell('Global statistics');
	globalStats.appendChild(createCellSection(new Array('Score:',this.game.score)));
	globalStats.appendChild(createCellSection(new Array('Maximum score:',this.maximumScore)));
	globalStats.appendChild(createCellSection(new Array('Wave:',this.game.waveNumber)));
	globalStats.appendChild(createCellSection(new Array('Global accuracy:',calculPercentage(this.shipShotHits + this.chargedShotHits + this.dnaShotHits + this.rocketHits + this.moduleShotHits,this.shipShots + this.chargedShots + this.dnaShots + this.rocketLaunched + this.moduleShots) + '%')));	
	article.appendChild(globalStats);
	
	//Create Kills statistics
	var killsStats = createCell('Kills statistics');
	killsStats.appendChild(createCellSection(new Array('PataPata:',this.killedPataPata)));
	killsStats.appendChild(createCellSection(new Array('Mid:',this.killedMid)));
	killsStats.appendChild(createCellSection(new Array('Cancer:',this.killedCancer)));
	killsStats.appendChild(createCellSection(new Array('PowArmor:',this.killedPowArmor)));
	article.appendChild(killsStats);
	
	//Create Ship statistics
	var shipStats = createCell('Ship statistics');
	shipStats.appendChild(createCellSection(
		new Array(
			'Bullets shoots:',this.shipShots,
			'Bullets hits:',this.shipShotHits,
			'Bullets fails:',this.shipShotFails,
			'Accuracy:',calculPercentage(this.shipShotHits,this.shipShots) + '%'
		)
	));
	shipStats.appendChild(createCellSection(
		new Array(
			'Charged Bullets shoots:',this.chargedShots,
			'Charged Bullets hits:',this.chargedShotHits,
			'Charged Bullets fails:',this.chargedShotFails,
			'Accuracy:',calculPercentage(this.chargedShotHits,this.chargedShots) + '%'
		)
	));
	shipStats.appendChild(createCellSection(
		new Array(
			'DNA Bullets shoots:',this.dnaShots,
			'DNA Bullets hits:',this.dnaShotHits,
			'DNA Bullets fails:',this.dnaShotFails,
			'Accuracy:',calculPercentage(this.dnaShotHits,this.dnaShots) + '%'
		)
	));
	shipStats.appendChild(createCellSection(
		new Array(
			'Rockets launched:',this.rocketLaunched,
			'Rockets hits:',this.rocketHits,
			'Rockets fails:',this.rocketFails,
			'Accuracy:',calculPercentage(this.rocketHits,this.rocketLaunched) + '%'
		)
	));
	article.appendChild(shipStats);
	
	//Create Module statistics
	var moduleStats = createCell('Module statistics');
	moduleStats.appendChild(createCellSection(new Array('Module tier:',this.moduleTier)));
	moduleStats.appendChild(createCellSection(new Array('Shots absorbed:',this.moduleAbsorbedShot)));
	moduleStats.appendChild(createCellSection(new Array('Bullets shooted:',this.moduleShots)));
	moduleStats.appendChild(createCellSection(new Array('Bullets hits:',this.moduleShotHits)));
	moduleStats.appendChild(createCellSection(new Array('Bullets hits:',this.moduleShotFails)));
	moduleStats.appendChild(createCellSection(new Array('Accuracy:',calculPercentage(this.moduleShotHits,this.moduleShots) + '%')));
	article.appendChild(moduleStats);
	
	//Create Upgrades statistics
	var upgradesStats = createCell('Upgrades statistics');
	upgradesStats.appendChild(createCellSection(new Array('Upgrade spawned:',this.spawnedUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Upgrade picked:',(this.pickedDnaUpgrade + this.pickedLaserUpgrade + this.pickedFireUpgrade + this.pickedRocketsUpgrade + this.pickedSpeedUpgrade + this.pickedBitModuleUpgrade))));
	upgradesStats.appendChild(createCellSection(new Array('Picked Dna upgrade:',this.pickedDnaUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Picked Laser upgrade:',this.pickedLaserUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Picked Fire upgrade:',this.pickedFireUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Picked Rockets upgrade:',this.pickedRocketsUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Picked Speed upgrade:',this.pickedSpeedUpgrade)));
	upgradesStats.appendChild(createCellSection(new Array('Picked Bit Module upgrade:',this.pickedBitModuleUpgrade)));
	article.appendChild(upgradesStats);
	
	section.appendChild(article);
	section.appendChild(button);
	
	var closeStats = function()
	{
		document.getElementById('close').removeEventListener('click', closeStats);
		var stats = document.getElementById('stats');
		stats.parentNode.removeChild(stats);
	}
	
	button.addEventListener('click', closeStats);
	document.getElementsByTagName('body')[0].appendChild(section);
}