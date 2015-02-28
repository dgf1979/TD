class WaveManager {
    private _game: Phaser.Game;
    private _waves: GameObjectClasses.Wave[];
    private _currentWave: number;

    constructor(Game: Phaser.Game, WaveData: GameObjectClasses.Wave[]) {
        this._game = Game;
        this._waves = WaveData;

    }

    Start() {
        this._currentWave = 0;
    }

    Pause() {

    }

    Update() {

    }

} 