class Circle extends SpawnableEntity
{
	constructor()
	{
		super(
			new Sprite(
				'circle',
				'images/gui/none.png',
				1,
				1,
				new Point(canvas.width / 2, canvas.height / 2),
				0,
				[0],
				true
			),
			0,
			8000
		);
		this.rayon = 100; //pixels
		this.registeredEntities = new Map();
		this.createCircle();
	}
	
	createCircle()
	{
		var entity0 = new Sprite('entity0', 'images/spritesheets/enemies/circle_gunner.png', 32, 32, new Point((canvas.width / 2) + this.rayon, canvas.height / 2 + this.rayon), 0, [0], true, false, false, 0);
		var entity45 = new Sprite('entity45', 'images/spritesheets/enemies/circle_gunner.png', 32, 32, new Point((canvas.width / 2) + this.rayon * Math.cos(45), canvas.height / 2 + this.rayon * Math.sin(45)), 0, [0], true, false, false, 45);
		
		this.registeredEntities.set('entity0', entity0);
		this.registeredEntities.set('entity45', entity45);
	}
	
	modifyPosition()
	{
		this.sprite.position.x -= this.speed;
		for (var key of this.registeredEntities.keys())
		{
			var entity = this.registeredEntities.get(key);
			entity.angle += 1;
			entity.position.x = this.sprite.position.x + this.rayon * Math.cos(entity.angle);
			entity.position.y = this.sprite.position.y + this.rayon * Math.sin(entity.angle);
		}
	}
}