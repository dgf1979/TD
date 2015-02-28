class WaveManager {
    private _game: Phaser.Game;
    private _ui: TDGame.UI;
    private _waves: GameObjectClasses.Wave[];
    private _currentWave: number;
    private _countdownToNextWave: Phaser.TimerEvent;

    constructor(Game: Phaser.Game, UI: TDGame.UI, WaveData: GameObjectClasses.Wave[]) {
        this._game = Game;
        this._ui = UI;
        this._waves = WaveData;
    }

    Start() {
        this._currentWave = 0;
        this.QueueNextWave();
    }

    // set a timer to release next creep wave
    QueueNextWave() {
        if (this._currentWave < this._waves.length) {
            var t: number = this._waves[this._currentWave].SpawnDelay;
            this._countdownToNextWave = this._game.time.events.add(Phaser.Timer.SECOND * t, this.SendNextWave, this);
            this._ui.DisplayAreas.GameInfo.CurrentWave = (this._currentWave + 1) + " of " + (this._waves.length);
        } else {
            // todo: trigger all waves complete
        }
    }

    // trigger next wave
    SendNextWave() {
        this._currentWave++;
        this.QueueNextWave();
    }

    Pause() {

    }

    Update() {
        if (this._countdownToNextWave) {  // display countdown to next wave
            var sec = Math.round(this._countdownToNextWave.timer.duration / 1000);
            this._ui.DisplayAreas.GameInfo.WaveCountdown = sec;
        }
    }

} 