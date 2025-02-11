class Achievements
{
	/**
	 * Create the list of achievements for a player 
	 */
	constructor()
	{
		this.doubleKill		= {has: false, name: 'Double kill'		, description: 'Kill 2 enemies with the same charged shot.'};//Done
		this.tripleKill		= {has: false, name: 'Triple kill'		, description: 'Kill 3 enemies with the same charged shot.'};//Done
		this.quadraKill		= {has: false, name: 'Quadra-kill'		, description: 'Kill 4 enemies with the same charged shot.'};//Done
		this.pentaKill		= {has: false, name: 'Penta-kill'		, description: 'Kill 5 enemies with the same charged shot.'};//Done
		this.monsterKill	= {has: false, name: 'Monster kill'		, description: 'Kill more than 5 enemies with the same charged shot.'};//Done
		this.overPower		= {has: false, name: 'Overpowered'		, description: 'Get the tier 3 module, the 2 bits modules, the rockets and 4 speeds upgrades.'};
		this.indestructible = {has: false, name: 'Indestructible'	, description: 'Survive a piercing projectile.'};//Done
		this.survivor		= {has: false, name: 'Survivor'			, description: 'Survive 15 waves without die.'};
	}
	
	/* ----- Getters ----- */
	/**
	 * Get the unlocked achievements
	 * @return The unlocked achievements
	 */
	getUnlockedAchievementsAsMap()
	{
		var obj = new Object();
		
		for (var achievement in this)
			if (this[achievement].has)
				obj[this[achievement].name] = this[achievement].description;
		
		return obj;
	}
	
	/* ----- Actions ----- */
	/**
	 * Unlock an achivement
	 * @param achievement : [String] The name of the achievement
	 */
	unlock(achievement)
	{
		if (!this[achievement]['has'])
		{
			this[achievement]['has'] = true;
			this.displayAchievement(this[achievement]['name']);
		}
	}
	
	/**
	 * Display an unlocked achivement
	 * @param name : [String] The achievement display name
	 */
	displayAchievement(name)
	{
		var achievementDiv = document.createElement('div');
		achievementDiv.id = 'achievement';
		achievementDiv.innerHTML = '<img src="images/gui/icons/module_t2.gif" alt="module" /><span>Achievement unlock<span>' + name + '</span></span>';
		
		document.getElementById('achievements').appendChild(achievementDiv);
		
		window.setTimeout(function() {var e = document.getElementById('achievement'); e.parentNode.removeChild(e);}, 3000);
	}
}