class MultipleWidthSprite extends Sprite
{
	/**
	 * Create an animated sprite
	 * @param id 			: [String] The id of the sprite
	 * @param image 		: [String] The location of the spritesheet
	 * @param widthArray 	: [Array] The Array witch contains the width of all frames
	 * @param height 		: [Int] The height of the spritesheet
	 * @param ticksPerFrame : [Int] The number of updates before changing frame index
	 * @param frames		: [Array] The list of frames to play
	 * @param loop			: [Boolean] The sprite loop infinitely
	 */
	constructor(id, image, widthArray, height, position, ticksPerFrame, frames, loop, autoDelete, preserveWidth)
	{
		super(id, image, 0, height, position, ticksPerFrame, frames, loop, autoDelete);
		this.widthArray = widthArray;
		this.preserveWidth = preserveWidth || false;
		if (!this.preserveWidth)
			this.positionInSheet = [0].concat(this.widthArray.slice(0, this.widthArray.length - 1));
		else
			this.positionInSheet = new Array(this.widthArray.length).fill(0);
	}
	
	/* ----- Events ----- */
	/**
	 * Trigger a 'ondone' event
	 */
	onDone()
	{
		this.emit('ondone', this);
	}
	
	/* ----- Actions ----- */
	/**
	 * Update the frame index
	 */
	//@Override
	update()
	{
		super.update();
		if (this._frameIndex >= this.frames.length - 1 && this.loop == false)
		{
			this.onDone();
			this.done = true;
		}
	}
	
	/**
	 * Render the sprite in the canvas
	 */
	//@Override
	render()
	{
		if (this.angle != 0)
		{
			context.save();
			context.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
			context.rotate(this.angle * Math.PI / 180);
		}
		context.drawImage(
			this.image,
			this.calculateXPos(this._frameIndex),
			0,
			this.widthArray[this._frameIndex],
			this.height,
			(this.angle != 0 ? 0 : this.calculatePositionX()),
			(this.angle != 0 ? 0 : this.position.y),
			this.widthArray[this._frameIndex],
			this.height
		);
		if (this.angle != 0)
			context.restore();
	}
	
	/**
	 * Calculate the X pos of the current sprite to display in the sprite sheet
	 * @param frameIndex : [Int] The current frame
	 */
	calculateXPos(frameIndex)
	{
		var rexs = 0;
		for (var i = 0; i <= frameIndex; i++)
			rexs += this.positionInSheet[i];
		
		return rexs;
	}
	
	/**
	 * Calculate x pos for the DNA beam
	 */
	calculatePositionX()
	{
		if (this.image.src.contains('back'))
			return this.position.x - this.widthArray[this._frameIndex] + Math.max.apply(null, this.widthArray);
		else
			return this.position.x;
	}
}