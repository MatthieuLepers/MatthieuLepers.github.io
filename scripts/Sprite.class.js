class Sprite extends EventsEmitter
{
	/**
	 * Create an animated sprite
	 * @param id 			: [String] The id of the sprite
	 * @param image 		: [String] The location of the spritesheet
	 * @param width 		: [Int] The width of the spritesheet
	 * @param height 		: [Int] The height of the spritesheet
	 * @param ticksPerFrame : [Int] The number of updates before changing frame index
	 * @param frames		: [Array] The list of frames to play
	 * @param loop			: [Boolean] The sprite loop infinitely
	 * @param angle			: [Number] The default sprite angle
	 */
	constructor(id, image, width, height, position, ticksPerFrame, frames, loop, autoDelete, angle)
	{
		super();
		this.id = id;
		this.width = width;
		this.height = height;
		this.position = position || new Point(0, 0);
		this.ticksPerFrame = ticksPerFrame || 0;
		this.frames = frames || 1;
		this.loop = loop || false;
		this.autoDelete = autoDelete || false;
		this.image = new Image();
		this.image.src = image;
		this.angle = angle || 0;
		this.deltaPoint = new Point(0, 0);
		this.savedPos = new Point(0, 0);
		
		this._frameIndex = 0;
		this._tickCount = 0;
		
		// Add the sprite to the renderer when the spritesheet is loaded
		var sprite = this;
		this.image.addEventListener('load', function() {
			game.renderer.addSprite(sprite);
		});
		
		//Events
		this.addEventListener('onanimationfinished', function() {
			game.renderer.deleteSprite(this.id);
		});
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger a 'onanimationfinished' event
	 */
	onAnimationFinished()
	{
		this.emit('onanimationfinished', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Update the frame index
	 */
	update()
	{
		this._tickCount++;
		
		if (this._tickCount > this.ticksPerFrame)
		{
			this._tickCount = 0;
			
			if (this._frameIndex < this.frames.length - 1)
				this._frameIndex++;
			else if (this.loop)
				this._frameIndex = 0;
		}
		
		if (this._frameIndex >= this.frames.length - 1 && this.loop == false && this.autoDelete == true)
		{
			this.onAnimationFinished();
			this.done = true;
		}
	}
	
	/**
	 * Render the sprite in the canvas
	 */
	render()
	{
		if (this.angle != 0)
		{
			context.save();
			if (this.deltaPoint.x != 0 || this.deltaPoint.y != 0)
				context.translate(this.deltaPoint.x, this.deltaPoint.y);
			else
				context.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
			context.rotate(this.angle * Math.PI / 180);
		}
		context.drawImage(
			this.image,
			this.frames[this._frameIndex] * this.width,
			0,
			this.width,
			this.height,
			(this.angle != 0 ? -this.savedPos.x : this.position.x),
			(this.angle != 0 ? -this.savedPos.y : this.position.y),
			this.width,
			this.height
		);
		if (this.angle != 0)
			context.restore();
	}
}