class CreepFactory {

    _wave: GameObjectClasses.Wave;
    _creepGroup: Phaser.Group;
    _game: Phaser.Game;
    _map: TDMap;

    constructor(ThisGame: Phaser.Game, Wave: GameObjectClasses.Wave, CreepGroup: Phaser.Group, Map: TDMap) {
        this._game = ThisGame;
        this._wave = Wave;
        this._creepGroup = CreepGroup;
        this._map = Map;

        //subscribe to map update
        this._map.SignalMapChanged.add(() => { this.TriggerCreepPathUpdates(); });
    }

    public Start() {
        this.createCreep();
        this._game.time.events.repeat(Phaser.Timer.SECOND * this._wave.SpawnDelay, this._wave.CreepCount - 1, this.createCreep, this);
    }

    private createCreep() {
        console.log("creating new creep at: " + this._map.PathThrough[0]);
        var creep: Creep = new Creep(this._game, this._wave.CreepIndex, this.PathNewCopy(), this._map);
        this._creepGroup.add(creep);
    }

    // signal each living creep to update its path
    private TriggerCreepPathUpdates() {
        console.log("Factory triggering creep path updates...");
        this._creepGroup.forEachAlive((c: Creep) => { c.UpdatePath(this._map); }, this);
    }

    // clone path array - because JavaScript.
    private PathNewCopy(): Phaser.Point[]{
        var startingPath = this._map.PathThrough;
        var newPath: Phaser.Point[] = [];
        for (var i = 0; i < startingPath.length; i++) {
            newPath.push(new Phaser.Point(startingPath[i].x, startingPath[i].y));
        }
        return newPath;
    }
} 