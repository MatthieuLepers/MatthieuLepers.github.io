function Hitbox(boxOrigin, boxWidth, boxHeight, theObject)
{
	this.listeners = new Array();
	this.theObject = theObject;
	this.boxOrigin = boxOrigin;
	this.boxWidth = boxWidth;
	this.boxHeight = boxHeight;
	this.cTopLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY());
	this.cTopRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY());
	this.cBottomLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY() + this.boxHeight);
	this.cBottomRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY() + this.boxHeight);
}

/* ----- Getters ----- */
Hitbox.prototype.getListeners = function()
{
	return this.listeners;
}

Hitbox.prototype.getOrigin = function()
{
	return this.boxOrigin;
}

Hitbox.prototype.getWidth = function()
{
	return this.boxWidth;
}

Hitbox.prototype.getHeight = function()
{
	return this.boxHeight;
}

/* ----- Setters ----- */
Hitbox.prototype.setWidth = function(width)
{
	this.boxWidth = width;
	this.cTopLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY());
	this.cTopRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY());
	this.cBottomLeft = new Point(this.boxOrigin.getX(), this.boxOrigin.getY() + this.boxHeight);
	this.cBottomRight = new Point(this.boxOrigin.getX() + this.boxWidth, this.boxOrigin.getY() + this.boxHeight);
}

Hitbox.prototype.setHeight = function(height)
{
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

/* ----- Events ----- */
Hitbox.prototype.addEventListener = function(eventName, action)
{
	this.listeners.push(new Array(eventName, new EventListener(action)));
}

Hitbox.prototype.removeEventListener = function(eventName, action)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		if (this.listeners[i][0] == eventName && this.listeners[i][1].equals(new EventListener(action)))
		{
			this.listeners[i] = null;
		}
	}
}

Hitbox.prototype.fire = function(event)
{
	event.dispatchEvent();
}

Hitbox.prototype.onHover = function()
{
	this.fire(new Event('onhover', this));
}