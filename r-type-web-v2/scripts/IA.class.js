class IA
{
	constructor(player, neededTasks)
	{
		this.target = null;
		this.player = player;
		this.cooldown = false;
		this.isPlayer = true;
		
		for (var i = 0; i < neededTasks.length; i++)
			game.scheduler.addTask(neededTasks[i](this));
	}
	
	clearCooldown()
	{
		this.cooldown = false;
	}
	
	findTarget() {
		var selected = null;
		
		for (var trgt of game.registeredEnemies.keys())
		{
			var tgt = game.registeredEnemies.get(trgt);
			
			if (tgt != null && !tgt.isDead && tgt.sprite.position.x - this.player.sprite.position.x > 50)
				selected = tgt;
		}
		this.target = selected;
	}
	
	/* ----- Statics ----- */
	static DODGES(ia)
	{
		var dodges = function(ia)
		{
			var entity = ia.player;
			
			if (entity != null)
				for (var proj of game.registeredProjectiles.keys())
				{
					var pr = game.registeredProjectiles.get(proj);

					if (pr != null && pr.sprite.id.contains('enemy'))
					{
						//Is plamsa ball or redlaser
						if (pr.sprite.id.contains('plasma_ball') || pr.sprite.id.contains('midshot'))
						{
							var multi = (pr.sprite.id.contains('plasma_ball') ? pr.sign * pr.speed * Math.sin((Math.PI * pr.angle) / 180) : 1);
							
							var p = new Point(30, 30 * multi);
							var hitbox = new Hitbox({position: new Point(entity.sprite.position.x - p.x, entity.sprite.position.y - p.y), width: 2 * p.x + 10 + entity.sprite.width, height: 2 * p.y + entity.sprite.height});

							if (hitbox.isHovering(pr.getHitbox(), true) && entity.sprite.position.y)
							{
								//hitbox.debugDraw();
								
								var side = hitbox.hitPart;
								var movement = new Point(0, 0);
								
								if (side.contains('top'))
								{
									entity.isDangerous = true;
									movement = new Point(0, entity.speed);
								}
								else if (side.contains('bottom'))
								{
									entity.isDangerous = true;
									movement = new Point(0, -entity.speed);
								}
								else
									movement = new Point((Math.random() < 0.5 ? 1 : -1) * entity.speed, 0);
								
								if (entity.sprite.position.y >= 0.9 * canvas.height || entity.sprite.position.y <= 0.1 * canvas.height)
									movement = new Point(entity.speed, 0);

								game.scheduler.addTask(
									new Task(entity.sprite.id + '_ia_' + side, function(object) {
											if (object.entity != null)
											{
												object.entity.move(object.goal);
												window.setTimeout(function(side, entity) {
													entity.isDangerous = false;
													game.scheduler.removeTask(entity.sprite.id + '_ia_' + side);
												}, 50, side, entity);
											}
										}, {entity: entity, goal: movement}
									)
								);
							}
						}
					}
				}
		};
		
		return new Task(ia.player.sprite.id + '_ia_dodges', dodges, ia);
	}
	
	static FOCUS(ia)
	{
		var focus = function(ia)
		{
			var entity = ia.player;
			
			ia.isPlayer = false;
			
			if (entity != null)
				if (ia.target == null || (ia.target.isDead || ia.target.sprite.position.x - entity.sprite.position.x < 50))
					ia.findTarget();
				else
				{
					var distanceX = ia.target.sprite.position.x - entity.sprite.position.x;
					var distanceY = entity.sprite.position.y - ia.target.sprite.position.y;
					var movement = new Point(0, (distanceY < 0 ? 1 : -1) * entity.speed);
					
					if (distanceX > 50)
						game.scheduler.addTask(
							new Task('z' + entity.sprite.id + '_focus', function(object) {
									if (object.entity != null && !object.entity.isDangerous)
									{
										object.entity.move(object.goal);
										window.setTimeout(game.scheduler.removeTask('z' + object.entity.sprite.id + '_focus'), 50);
									}
								}, {entity: entity, goal: movement}
							)
						);
					else
						ia.findTarget();
				}
		}
		
		return new Task('z' + ia.player.sprite.id + '_ia_focus', focus, ia);
	}
	
	static SHOOT(ia)
	{
		var shoot = function(ia)
		{
			var entity = ia.player;
			for (var key of game.registeredEnemies.keys())
			{
				var enemy = game.registeredEnemies.get(key);
				if (enemy != null && /enemy[0-9]+/.test(enemy.sprite.id) && !ia.cooldown)
					if (enemy.sprite.position.y <= entity.sprite.position.y && enemy.sprite.position.y + enemy.sprite.height >= entity.sprite.position.y + entity.sprite.height)
					{
						if (!ia.isPlayer)
							if (enemy.sprite.image.src.contains('cheetah'))
							{
								var multiplier = (enemy.sprite.image.src.contains('cheetah') ? (1/3) : 1);
								
								entity.prepareCharge();
								ia.cooldown = true;
								
								window.setTimeout(function(ia) {
									ia.player.launchCharge();
									ia.clearCooldown();
								}, 600 * multiplier, ia);
							}
							else
							{
								if (enemy.sprite.image.src.contains('mid') && enemy.hasTag('shots'))
								{
									ia.findTarget();
									break;
								}
							
								entity.shoot();
								enemy.addTag('shots')
								ia.cooldown = true;
								window.setTimeout(function(ia) {ia.clearCooldown();}, 100, ia);
							}
						else
						{
							if (enemy.sprite.image.src.contains('mid') && enemy.hasTag('shots'))
							{
								ia.findTarget();
								break;
							}
							
							entity.shoot();
							enemy.addTag('shots')
							ia.cooldown = true;
							window.setTimeout(function(ia) {ia.clearCooldown();}, 100, ia);
						}
					}
				}
		}
		
		return new Task(ia.player.sprite.id + '_ia_shoot', shoot, ia);
	}
}