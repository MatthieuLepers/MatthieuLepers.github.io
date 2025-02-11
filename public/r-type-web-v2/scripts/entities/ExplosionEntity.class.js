class ExplosionEntity extends Entity
{
	/**
	 * Create an explosion in the canvas
	 * @param id : [String] The id of the entity
	 * @param image : [String] The image to display as a sprite
	 * @param width : [Int] The width of a frame
	 * @param height : [Int] The height of a frame
	 * @param position : [Point] The position of the explosion on the canvas
	 * @param frames : [Array] The list of frames to play
	 */
	constructor(id, image, width, height, position, frames)
	{
		super(
			new Sprite(
				id,
				image,
				width,
				height,
				position,
				6,
				frames,
				false,
				true
			),
			0,
			-1
		);
	}
	
	static noExplosion() { return null; };
	static littleExplosion() { return {image: 'images/spritesheets/particles/explosion.png', width: 32, height: 32, frames: [0, 1, 2, 3, 4, 5, 6]}; };
	static bigExplosion() { return {image: 'images/spritesheets/particles/explosion_big.png', width: 64, height: 64, frames: [0, 1, 2, 3, 4, 5]}; };
	static dnaBulletExplosion() { return {image: 'images/spritesheets/particles/explosion_dna_bullet.png', width: 16, height: 14, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8]}; };
	static fireballExplosion() { return {image: 'images/spritesheets/particles/explosion_fireball.png', width: 32, height: 32, frames: [0, 1, 2, 3, 4]}; };
	static rocketExplosion() { return {image: 'images/spritesheets/particles/explosion_rocket.png', width: 32, height: 32, frames: [0, 1, 2, 3, 4, 5, 6]}; };
}