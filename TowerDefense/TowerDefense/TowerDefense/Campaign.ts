class Campaign {
    private _game: Phaser.Game;
    private _paused: boolean;
    private _started: boolean;
    private _campaignData: GameObjectClasses.Campaign;
    private _ui: TDGame.UI;

    Map: TDMap;
    WaveMgr: WaveManager;

    constructor(Game: Phaser.Game, UI: TDGame.UI) {
        this._game = Game;
        this._ui = UI;
        this._paused = false;
        this._started = false;
        this._campaignData = TDGame.Globals.CampaignJSON;

        // set up the map
        this.Map = new TDMap(this._game);

        // add wave manager
        this.WaveMgr = new WaveManager(Game, UI, this._campaignData.Waves, this._campaignData.WaveDelay);
    }

    // begin campaign
    Start() {
        console.log("Campaign Start");
        this._started = true;
        this.WaveMgr.Start();
    }

    // pause 
    Pause() {
        this._paused = !this._paused;
        if (this._paused) {
            console.log("Campaign Paused");
            this.WaveMgr.Pause();
        } else {
            console.log("Campaign UN-Paused");
            this.WaveMgr.Unpause();
        }
    }

    // call during game udpate for sub-componenets
    Update() {
        this._ui.Update(this.Map.TileMap);
        this.WaveMgr.Update();
    }

} 