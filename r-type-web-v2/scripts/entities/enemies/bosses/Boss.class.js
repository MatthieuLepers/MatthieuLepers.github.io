class Boss extends EventsEmitter
{
	constructor(id, speed)
	{
		super();
		this.id = id;
		this.speed = speed;
		
		this.launch();
		
		if (game.params.has('ambient') && game.params.get('ambient') != '')
		{
			if (game.ambient != null)
				game.ambient.audio.pause();
			game.ambient = null;
			game.ambient = new Sound('sounds/R-Type I/sound_boss_entering.ogg', true, false, 1);
			window.setTimeout(function() {
				game.ambient = new Sound('sounds/R-Type I/sound_boss_loop.ogg', true, true, 1);
			}, 5116);
		}
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger an 'onlaunched' event
	 */
	onLaunched()
	{
		this.emit('onlaunched', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Launch the entity
	 */
	launch()
	{
		this.onLaunched();
		game.scheduler.addTask(new Task('entering_' + this.id, this.enteringAnim, this));
	}
	
	/* ----- Animations ----- */
	/**
	 * Make the entity entering the canvas
	 * @param entity : [Boss] The boss to animate
	 */
	//Need to be implemented
	enteringAnim(entity) {}
	
	/**
	 * Make the entity playing idle animation
	 * @param entity : [Boss] The boss to animate
	 */
	//Need to be implemented
	idleAnim(entity) {}
}