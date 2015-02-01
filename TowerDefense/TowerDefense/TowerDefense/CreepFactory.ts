class CreepFactory {

    _wave: GameObjectClasses.Wave;
    _creepGroup: Phaser.Group;
    _game: Phaser.Game;
    _startingPath: Phaser.Point[];

    constructor(ThisGame: Phaser.Game, Wave: GameObjectClasses.Wave, CreepGroup: Phaser.Group, StartPath: Phaser.Point[]) {
        this._game = ThisGame;
        this._wave = Wave;
        this._creepGroup = CreepGroup;
        this._startingPath = StartPath;
    }

    public Start() {
        this.createCreep();
        this._game.time.events.repeat(Phaser.Timer.SECOND * this._wave.SpawnDelay, this._wave.CreepCount - 1, this.createCreep, this);
    }

    private createCreep() {
        console.log("creating new creep at: " + this._startingPath[0]);
        var creep: Creep = new Creep(this._game, this._wave.CreepID, this.PathNewCopy());
        this._creepGroup.add(creep);
    }

    // clone path array - because JavaScript.
    private PathNewCopy(): Phaser.Point[] {
        var newPath: Phaser.Point[] = [];
        for (var i = 0; i < this._startingPath.length; i++) {
            newPath.push(new Phaser.Point(this._startingPath[i].x, this._startingPath[i].y));
        }
        return newPath;
    }
} 