class TowerFactory {
    private _creeps: Phaser.Group;
    private _game: Phaser.Game;

    constructor(ThisGame: Phaser.Game, TargetCreeps: Phaser.Group) {
        this._game = ThisGame;
        this._creeps = TargetCreeps;
    }

    PlaceTower(TowerName: String, Location: Phaser.Point) {
        var tower: Tower = new Tower(this._game, TowerName, Location, this._creeps);
        // alert(tower.key);
    }
} 