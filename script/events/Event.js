function Event(eventName, object)
{
	this.source = object;
	this.name = eventName;
}

Event.prototype.dispatchEvent = function()
{
	for (var i = 0; i < this.source.listeners.length; i++)
	{
		if (this.source.listeners[i] != null && this.source.listeners[i][0] == this.name)
		{
			this.source.listeners[i][1].actionPerformed(this.source);
		}
	}
}