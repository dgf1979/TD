class TDMap {

    private _game: Phaser.Game;

    private _creepSpawn: Phaser.Point;
    private _creepExit: Phaser.Point;
    private _walkableGrid: number[][];

    constructor(PhaserGameObject: Phaser.Game) {
        this._game = PhaserGameObject;
    }

    LoadWalkable(Grid: number[][]) {
        this._walkableGrid = Grid;
    }

    SetCreepSpawnLocation(X: number, Y: number) {
        this._creepSpawn = new Phaser.Point(X, Y);
    }

    SetCreepExitLocation(X: number, Y: number) {
        this._creepExit = new Phaser.Point(X, Y);
    }

    get CreepSpawn(): Phaser.Point { return this._creepSpawn; }
    get CreepExit(): Phaser.Point { return this._creepExit; }
    get WalkableGrid(): number[][] { return this._walkableGrid; }
} 