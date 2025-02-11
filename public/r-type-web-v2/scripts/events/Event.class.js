class Event
{
	/**
	 * Create an event
	 * @param eventName : [String] The name of this event
	 * @param source : [Object] The object wich has triggered this event
	 */
	constructor(eventName, source)
	{
		this.eventName = eventName;
		this.source = source;
	}
	
	/* ----- Trigger Listeners ----- */
	/**
	 * Trigger all listener in the source object where the name is this event name
	 */
	dispatchEvent()
	{
		for (var key of this.source.listeners.keys())
		{
			if (this.source.listeners.get(key) && key == this.eventName)
				this.source.listeners.get(key).invoke(this.source);
		}
	}
}