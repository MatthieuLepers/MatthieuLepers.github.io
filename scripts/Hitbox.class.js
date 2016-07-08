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
		
		var bA = (a.x >= e.x && a.x <= f.x && a.y >= e.y && a.y <= h.y);
		var bB = (b.x >= e.x && b.x <= f.x && b.y >= e.y && b.y <= h.y);
		var bC = (c.x >= e.x && c.x <= f.x && c.y >= e.y && c.y <= h.y);
		var bD = (d.x >= e.x && d.x <= f.x && d.y >= e.y && d.y <= h.y);
		
		return (bA || bB || bC || bD);
	}
}