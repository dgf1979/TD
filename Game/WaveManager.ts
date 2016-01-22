class WaveManager {
    private _game: Phaser.Game;
    private _ui: TDGame.UI;
    private _waves: GameObjectClasses.Wave[];
    private _currentWave: number;
    private _waveDelay: number;
    private _countdownToNextWave: Phaser.Timer;

    // signals
    SignalDeployCreeps: Phaser.Signal = new Phaser.Signal();  

    constructor(Game: Phaser.Game, UI: TDGame.UI, WaveData: GameObjectClasses.Wave[], WaveDelay: number) {
        this._game = Game;
        this._ui = UI;
        this._waves = WaveData;
        this._waveDelay = WaveDelay;
    }

    Start() {
        console.log("Starting 1st wave")
        this._currentWave = 0;
        this.QueueNextWave();
    }

    // set a timer to release next creep wave
    QueueNextWave() {
        if (this._currentWave < this._waves.length) {
            var delay: number;
            if (this._currentWave === 0) {
                delay = 2; //default first wave to avoid waiting around
            } else {
                delay = this._waveDelay
            }
            console.log("Queuing next wave in " + delay);
            this._countdownToNextWave = this._game.time.create(true);
            this._countdownToNextWave.add(Phaser.Timer.SECOND * delay, this.SendNextWave, this);
            this._countdownToNextWave.start();
            this._ui.DisplayAreas.GameInfo.CurrentWave = (this._currentWave + 1) + " of " + (this._waves.length);
        }
    }

    // trigger next wave
    SendNextWave() {
        console.log("Signal next creep wave next wave..");
        this.SignalDeployCreeps.dispatch(this._waves[this._currentWave]);
        this._currentWave++;
        this.QueueNextWave();
    }

    Pause() {
        if (this._countdownToNextWave && !this._countdownToNextWave.paused) {
            this._countdownToNextWave.pause();
        }
    }

    Unpause() {
        if (this._countdownToNextWave && this._countdownToNextWave.paused) {
            this._countdownToNextWave.resume();
        }
    }

    Update() {
        if (this._countdownToNextWave) {  // display countdown to next wave
            var sec = Math.round(this._countdownToNextWave.duration / 1000);
            this._ui.DisplayAreas.GameInfo.WaveCountdown = sec;
        }
    }

} 