class EventsEmitter
{
	/**
	 * Create an entity with listenable event
	 */
	constructor()
	{
		this.listeners = new Map();
	}
	
	/**
	 * Add a listener for a specific event with a specific function
	 * @param eventName : [String] The name of the event you would listen
	 * @param invokeFun : [Function] The fuction to invoke when the event is triggered
	 */
	addEventListener(eventName, invokeFun)
	{
		this.listeners.set(eventName, new EventListener(invokeFun));
	}
	
	/**
	 * Remove a listener for a specific event with a specific function
	 * @param eventName : [String] The name of the event you would listen
	 */
	removeEventListener(eventName)
	{
		this.listeners.delete(eventName);
	}
	
	/**
	 * Trigger an event and alert all listeners who are listening for this event
	 * @param eventName : [String] The name of the event to trigger
	 * @param context 	: [Object] The context of the event
	 */
	emit(eventName, context)
	{
		var event = new Event(eventName, context);
		event.dispatchEvent();
	}
}