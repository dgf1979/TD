class TowerFactory {
    private _creeps: Phaser.Group;
    private _game: Phaser.Game;

    constructor(ThisGame: Phaser.Game, TargetCreeps: Phaser.Group) {
        this._game = ThisGame;
        this._creeps = TargetCreeps;
    }

    PlaceTower(TowerIndex: number, Location: Phaser.Point) {
        if (TowerIndex >= 0 && TowerIndex < 8) {
            new Tower(this._game, TowerIndex, Location, this._creeps);
        }
    }
} 