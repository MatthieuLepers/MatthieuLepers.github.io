class Hitbox
{
	/**
	 * Create a collision box
	 * @param sprite : [Sprite] The sprite
	 */
	constructor(sprite)
	{
		this.origin = sprite.position;
		this.width = sprite.width;
		this.height = sprite.height;
		
		//Calculate the 4 box corners positions
		this.cTopLeft = this.origin;
		this.cTopRight = new Point(this.origin.x + this.width, this.origin.y);
		this.cBottomLeft = new Point(this.origin.x, this.origin.y + this.height);
		this.cBottomRight = new Point(this.origin.x + this.width, this.origin.y + this.height);
		
		this.hitPart = null;
	}
	
	/* ----- Booleans ----- */
	/**
	 * Test if the collision box is hovering an other collision box
	 * @param otherHitbox : [Hitbox] The other collision box
	 * @return true if this is hovering the other box, false else
	 */
	isHovering(otherHitbox, checkSquareHitbox)
	{
		var check = checkSquareHitbox || false;
		
		var a = this.cTopLeft;
		var b = this.cTopRight;
		var c = this.cBottomRight;
		var d = this.cBottomLeft;
		var e = otherHitbox.cTopLeft;
		var f = otherHitbox.cTopRight;
		var g = otherHitbox.cBottomRight;
		var h = otherHitbox.cBottomLeft;
		
		//Vars format : (This_Hitbox_Side) HittedBy (Enemy_Hitbox_Side)
		var bRightHittedByLeft = (h.y >= b.y && e.y <= c.y);
		var bLeftHittedByRight = (g.y >= a.y && f.y <= d.y);
		var bBottomHittedByTop = (f.x >= d.x && e.x <= c.x);
		var bTopHittedByBottom = (g.x >= a.x && h.x <= b.x);
		
		if (check && this.hitPart == null)
		{
			var ab = new Point(a.x + this.width / 2, a.y);
			var ad = new Point(a.x, this.height / 2);
			
			var hitboxTopLeft = new Hitbox({position: a, width: this.width / 2, height: this.height / 2});
			var hitboxTopRight = new Hitbox({position: ab, width: this.width / 2, height: this.height / 2});
			var hitboxBottomLeft = new Hitbox({position: ad, width: this.width / 2, height: this.height / 2});
			
			if (hitboxTopLeft.isHovering(otherHitbox))
				this.hitPart = 'top left';
			else if (hitboxTopRight.isHovering(otherHitbox))
				this.hitPart = 'top right';
			else if (hitboxBottomLeft.isHovering(otherHitbox))
				this.hitPart = 'bottom left';
			else
				this.hitPart = 'bottom right';
		}
		
		return (bRightHittedByLeft || bLeftHittedByRight) && (bBottomHittedByTop || bTopHittedByBottom);
	}
	
	/* ----- Debug ----- */
	/**
	 * /!\ THIS IS A DEBUG METHOD, USE IT OLY FOR DEBUGING HITBOXES /!\
	 * Stop the game and draw to the canvas the hitbox of the hitten player
	 */
	debugDraw()
	{
		game.renderer.stop();
		game.scheduler.pause();
		
		var a = this.cTopLeft;
		var b = this.cTopRight;
		var c = this.cBottomRight;
		var d = this.cBottomLeft;
		
		var ab = new Point((a.x + b.x) / 2, a.y);
		var ad = new Point(a.x, (a.y + d.y) / 2);
		var bc = new Point(b.x, (b.y + c.y) / 2);
		var dc = new Point((d.x + c.x) / 2, d.y);
		
		context.beginPath();
		context.strokeStyle = 'black';
		context.rect(a.x, a.y, this.width, this.height);
		context.stroke();
		
		context.fillStyle = 'magenta';
		context.fillRect(a.x + this.width / 2, a.y + this.height / 2, this.width / 2, this.height / 2);
		context.fillStyle = 'blue';
		context.fillRect(a.x, a.y, this.width / 2, this.height / 2);
		context.fillStyle = 'red';
		context.fillRect(a.x + this.width / 2, a.y, this.width / 2, this.height / 2);
		context.fillStyle = 'green';
		context.fillRect(a.x, a.y + this.height / 2, this.width / 2, this.height / 2);
	}
}
