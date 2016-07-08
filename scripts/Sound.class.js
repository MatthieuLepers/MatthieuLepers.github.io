class Sound
{
	/**
	 * Create a playable sound
	 * @param soundFile : [String] The location of the sound in the disc
	 * @param autostart : [Boolean] Define if the sound must be started at creation
	 * @param loop : [Boolean] Define if the sound is played infinitely
	 */
	constructor(soundFile, autostart, loop)
	{
		this.soundFile = soundFile;
		this.autostart = autostart || false;
		this.audio = new Audio(this.soundFile);
		this.audio.loop = loop || false;
		this.audio.load();
		
		if (autostart && !game.params.get('noSounds'))
			this.play();
	}
	
	/* ----- Actions ----- */
	/**
	 * Play the sound ad remove it when it's finished
	 */
	play()
	{
		this.audio.play();
	}
	
	/**
	 * Pause the sound
	 */
	pause()
	{
		this.audio.pause();
	}
}