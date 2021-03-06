﻿class TowerFactory {
    private _creeps: Phaser.Group;
    private _game: Phaser.Game;
    private _inQueueIndex: number;
    private _inQueueLocation: Phaser.Point;
    private _map: TDMap;
    private _towerGroup: Phaser.Group;

    //Signals
    SignalTowerDropped: Phaser.Signal = new Phaser.Signal();

    constructor(ThisGame: Phaser.Game, TargetCreeps: Phaser.Group, Map: TDMap) {
        this._game = ThisGame;
        this._towerGroup = new Phaser.Group(ThisGame);
        this._creeps = TargetCreeps;
        this._map = Map;
        var make = () => { this.PlaceQueuedTower(); };
        Map.SignalMapChanged.add(make);
        // var clear = () => { this.ClearTowerPlacement(); };
        // Map.SignalMapChangeFailed.add(clear);
    }

    PlaceTower(TowerIndex: number, Location: Phaser.Point) {
        if (TowerIndex >= 0 && TowerIndex < 8) {
            this._inQueueLocation = Location;
            this._inQueueIndex = TowerIndex;
            this._map.TryAddBlockingAtTilePosition(Helper.PixelToTile(Location));
        }
    }

    private ClearTowerPlacement() {
        this._inQueueIndex = null;
        this._inQueueLocation = null;
    }

    PauseAllTowers() {
        this._towerGroup.forEach((t: Tower) => { t.Pause(); }, this);
    }

    UnpauseAllTowers() {
        this._towerGroup.forEach((t: Tower) => { t.Unpause(); }, this);
    }

    private PlaceQueuedTower() {
        var t: Tower = new Tower(this._game, this._inQueueIndex, this._inQueueLocation, this._creeps);
        this.SignalTowerDropped.dispatch(Location);
        this._towerGroup.add(t);
        this._inQueueIndex = null;
        this._inQueueLocation = null;
    }
} 