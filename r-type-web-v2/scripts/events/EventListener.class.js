class EventListener
{
	/**
	 * Create an event listener
	 * @param invokeFun : [Function] The function to invoke whe the event is triggered
	 * @param funArgs : [Array] The list of arguments for the invoked function
	 */
	constructor(invokeFun, funArgs)
	{
		this.invokeFun = invokeFun;
		this.funArgs = funArgs;
	}
	
	/* ----- Trigger ----- */
	/**
	 * Invoke the function with her args
	 * @param source : [Object] The ocject witch has triggered the event
	 */
	invoke(source)
	{
		this.invokeFun.call(source, this.funArgs);
	}
	
	/* ----- Comparaison ----- */
	/**
	 * Test if a ovject is equals to this event listener
	 * @param object : [Object] The object to test
	 * @return true if the both objects are equals, false else
	 */
	equals(object)
	{
		return (typeof object === 'eventlistener' && this.invokeFun == object.invokeFun && this.funArgs == object.funArgs);
	}
}