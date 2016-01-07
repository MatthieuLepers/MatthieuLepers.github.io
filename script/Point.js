function Point(xPos, yPos)
{
	this.xPos = xPos;
	this.yPos = yPos;
}

Point.prototype.getX = function()
{
	return this.xPos;
}

Point.prototype.getY = function()
{
	return this.yPos;
}

function Hitbox(origin, width, height)
{
	this.boxOrigin = origin;
	this.boxWidth = width;
	this.boxHeight = height;
	this.cTopLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY());
	this.cTopRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY());
	this.cBottomLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY() + this.boxHeight);
	this.cBottomRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY() + this.boxHeight);
}

/* ----- Booleans ----- */
Hitbox.prototype.isHovering = function(hitbox)
{
	var a = this.cTopLeft;
	var b = this.cTopRight;
	var c = this.cBottomRight;
	var d = this.cBottomLeft;
	var e = hitbox.cTopLeft;
	var f = hitbox.cTopRight;
	var g = hitbox.cBottomRight;
	var h = hitbox.cBottomLeft;
	
	//(Xa >= Xe et Xa <= Xf et Ya >= Ye && Ya <= Yh) ou (Xb >= Xe et Xb <= Xf et Yb >= Ye && Yb <= Yh) ou (Xc >= Xe et Xc <= Xf et Yc >= Ye && Yc <= Yh) ou (Xd >= Xe et Xd <= Xf et Yd >= Ye && Y <= Yh)
	var bA = (a.getX() >= e.getX() && a.getX() <= f.getX() && a.getY() >= e.getY() && a.getY() <= h.getY());
	var bB = (b.getX() >= e.getX() && b.getX() <= f.getX() && b.getY() >= e.getY() && b.getY() <= h.getY());
	var bC = (c.getX() >= e.getX() && c.getX() <= f.getX() && c.getY() >= e.getY() && c.getY() <= h.getY());
	var bD = (d.getX() >= e.getX() && d.getX() <= f.getX() && d.getY() >= e.getY() && d.getY() <= h.getY());
	
	if (bA || bB || bC || bD)
		return true;
	
	return false;
}