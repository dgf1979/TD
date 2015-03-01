class CreepFactory {

    private _game: Phaser.Game;
    private _map: TDMap;
    private _wave: GameObjectClasses.Wave;

    // public objects
    CreepGroup: Phaser.Group;

    // signals
    SignalCreepKilled: Phaser.Signal = new Phaser.Signal();

    constructor(Game: Phaser.Game, Map: TDMap) {
        this._game = Game;
        this._map = Map;

        this.CreepGroup = this._game.add.group();
        this.CreepGroup.name = "creeps";

        // subscribe to map update
        this._map.SignalMapChanged.add(() => { this.TriggerCreepPathUpdates(); });
    }

    public DeployCreeps(Wave: GameObjectClasses.Wave) {
        this._wave = Wave;
        this.createCreep(Wave);
        console.log("should see " + Wave.CreepCount + " creeps, spawned " + Wave.SpawnDelay + " seconds apart.");
        var createCreep = (Wave: GameObjectClasses.Wave) => { this.createCreep(Wave); };
        this._game.time.events.repeat(Phaser.Timer.SECOND * Wave.SpawnDelay, Wave.CreepCount - 1, createCreep, this);
    }

    private createCreep(Wave: GameObjectClasses.Wave) {
        var w = this._wave;
        console.log("creating new creep at: " + this._map.PathThrough[0]);
        var creep: Creep = new Creep(this._game, w.CreepIndex, this.PathNewCopy(), this._map);
        creep.SignalKilled.add((value: number) => {
            console.log("Kill trigger passed value to dispatch: " + value);
            this.SignalCreepKilled.dispatch(value);
        }, this);
        this.CreepGroup.add(creep);
    }

    // signal each living creep to update its path
    private TriggerCreepPathUpdates() {
        console.log("Factory triggering creep path updates...");
        this.CreepGroup.forEachAlive((c: Creep) => { c.UpdatePath(this._map); }, this);
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