class Scheduler
{
	/**
	 * Create a scheduler
	 * @param speed : [Int] The delay between 2 steps
	 */
	constructor(speed)
	{
		this._timer = null;
		this.speed = speed;
		this._frame = 0;
		this.tasks = new Map();
		this.isPaused = false;
		this.fps = 0;
	}
	
	/* ----- Actions ----- */
	/**
	 * Add a task to the scheduler
	 * @param task : [Task] The task to add
	 */
	addTask(task)
	{
		this.tasks.set(task.id, task);
	}
	
	/**
	 * Remove a task from the scheduler
	 * @param taskId : [String] The id of the task
	 */
	removeTask(taskId)
	{
		this.tasks.delete(taskId);
	}
	
	/**
	 * Execute all tasks one time
	 */
	doStep()
	{
		this.fps++;
		this._frame++;
		if (!this.isPaused)
			for (var key of this.tasks.keys())
				this.tasks.get(key).doStep();
	}
	
	/**
	 * Start scheduling
	 */
	start()
	{
		this._timer = window.setInterval(function(scheduler) {scheduler.doStep();}, this.speed, this);
	}
	
	/**
	 * Stop the scheduler
	 */
	stop()
	{
		window.clearInterval(this._timer);
		this._timer = null;
		this.tasks.clear();
		this.isPaused = false;
		this._frame = 0;
		this.fps = 0;
	}
	
	/**
	 * Pause scheduling
	 */
	pause()
	{
		this.isPaused = true;
	}
	
	/**
	 * Resume scheduling
	 */
	resume()
	{
		this.isPaused = false;
	}
	
	/**
	 * Restart the scheduler
	 * @param speed : [Int][Optional] The new scheduler speed
	 */
	restart(speed)
	{
		window.clearInterval(this._timer);
		var newSpeed = speed || 10;
		this.speed = speed;
		this.start();
	}
	
	/**
	 * Reset the fps counter
	 */
	resetFpsCounter()
	{
		this.fps = 0;
	}
}