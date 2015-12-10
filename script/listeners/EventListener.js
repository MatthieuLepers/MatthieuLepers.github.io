function EventListener(action, params)
{
	this.actionPerformed = action;
	this.actionParams = params;
}

EventListener.prototype.actionPerformed = function(source)
{
	console.log(this);
	this.actionPerformed.call(source, this.actionParams);
}

/* ----- Util ----- */
EventListener.prototype.equals = function(object)
{
	if (typeof object === 'eventlistener')
	{
		return this.actionPerformed == object.actionPerformed;
	}
	
	return false;
}