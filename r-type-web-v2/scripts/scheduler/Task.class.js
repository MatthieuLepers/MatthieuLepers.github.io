class Task
{
	/**
	 * Create a task for the scheduler
	 * @param id : [String] The task id
	 * @param invokeFun : [Function] The function witch is invoked when task is run
	 * @param funArg : [Generic] The argument for the invoked function
	 */
	constructor(id, invokeFun, funArg)
	{
		this.id = id;
		this.invokeFun = invokeFun;
		this.funArg = funArg;
	}
	
	/**
	 * Execute function one time
	 */
	doStep()
	{
		this.invokeFun(this.funArg);
	}
}