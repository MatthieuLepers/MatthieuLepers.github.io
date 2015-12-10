function Scheduler()
{
	this.task = new Map();
}

Scheduler.prototype.addTask = function(taskId, task, taskParams)
{
	this.task.set(taskId, new Array(task, taskParams));
}

Scheduler.prototype.doStep = function()
{
	for (var key of this.task.keys())
	{
		var f = this.task.get(key)[0];
		var params = this.task.get(key)[1];
		
		f(params);
	}
}

Scheduler.prototype.removeTask = function(id)
{
	this.task.delete(id);
}