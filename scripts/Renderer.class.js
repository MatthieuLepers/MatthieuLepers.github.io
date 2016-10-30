class Renderer
{
	/**
	 * Create the sprite renderer
	 */
	constructor()
	{
		this._timer = null;
		this.sprites = new Map();
	}
	
	/**
	 * Stop rendering
	 */
	stop()
	{
		this.sprites.clear();
		window.cancelAnimationFrame(this._timer);
	}
	
	/**
	 * Add a sprite to the renderer
	 * @param sprite 	: [Sprite] The sprite
	 */
	addSprite(sprite)
	{
		this.sprites.set(sprite.id, sprite);
		//console.warn('The sprite with id: "' + sprite.id + '" has been added to the renderer !');
	}
	
	/**
	 * Delete a sprite from the renderer by his id
	 * @param id : [String] The id of the sprite to delete
	 */
	deleteSprite(id)
	{
		if (this.sprites.get(id) != null)
		{
			context.clearRect(this.sprites.get(id).position.x - 1, this.sprites.get(id).position.y - 1, this.sprites.get(id).width + 2, this.sprites.get(id).height + 2);
			this.sprites.delete(id);
			//console.warn('The sprite with id: "' + id + '" has been deleted from the renderer !');
		}
	}
	
	/**
	 * Delete the sprite witch match a specific pattern
	 * @param pattern : [RegExp] The RegExp object for testing map's keys
	 */
	deleteSpritePattern(pattern)
	{
		for (var key of this.sprites.keys())
			if (pattern.test(key))
				this.deleteSprite(key);
	}
	
	/**
	 * Replace a existing sprite and place a ew sprite at the same ID index
	 * @param sprite : [Sprite] The new sprite
	 */
	replaceSprite(sprite)
	{
		this.deleteSprite(sprite.id);
		this.addSprite(sprite);
	}
	
	/**
	 * Execute the render methode for each sprite in the renderer
	 */
	renderAll()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (var key of this.sprites.keys())
		{
			this.sprites.get(key).update();
			if (this.sprites.get(key) != null)
				this.sprites.get(key).render();
		}
	}
}