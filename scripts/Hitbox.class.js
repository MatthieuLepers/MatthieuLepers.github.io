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
	isHovering(otherHitbox)
	{
		var a = this.cTopLeft;
		var b = this.cTopRight;
		var c = this.cBottomRight;
		var d = this.cBottomLeft;
		var e = otherHitbox.cTopLeft;
		var f = otherHitbox.cTopRight;
		var g = otherHitbox.cBottomRight;
		var h = otherHitbox.cBottomLeft;
		
		//Vars format : (This_Hitbox_Side) HittedBy (Enemy_Hitbox_Side)
		var bRightHittedByLeft = (e.y <= c.y && h.y >= b.y);
		var bLeftHittedByRight = (f.y <= d.y && g.y >= a.y);
		var bBottomHittedByTop = (f.x >= d.x && e.x <= c.x);
		var bTopHittedByBottom = (g.x >= a.x && h.x <= b.x);
		
		if (this.hitPart == null)
			if (bRightHittedByLeft)
				this.hitPart = 'right';
			else if (bLeftHittedByRight)
				this.hitPart = 'left';
			else if (bBottomHittedByTop)
				this.hitPart = 'bottom';
			else if (bTopHittedByBottom)
				this.hitPart = 'top';
		
		return (bRightHittedByLeft || bLeftHittedByRight) && (bBottomHittedByTop || bTopHittedByBottom);
	}
}