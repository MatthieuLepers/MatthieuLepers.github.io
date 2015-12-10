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