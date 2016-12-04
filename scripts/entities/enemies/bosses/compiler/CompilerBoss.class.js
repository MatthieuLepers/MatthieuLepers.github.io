class CompilerBoss extends EventsEmitter
{
	constructor()
	{
		super();
		this.compiler1 = new CompilerTopPart();
		game.registeredEnemies.set(this.compiler1.sprite.id, this.compiler1);
		this.compiler2 = new CompilerBottomPart();
		game.registeredEnemies.set(this.compiler2.sprite.id, this.compiler2);
		this.compiler3 = new CompilerRightPart();
		game.registeredEnemies.set(this.compiler3.sprite.id, this.compiler3);
	}
}