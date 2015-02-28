class Campaign {
    private _game: Phaser.Game;
    private _paused: boolean;
    private _started: boolean;
    private _campaignData: GameObjectClasses.Campaign;

    Map: TDMap;

    constructor(Game: Phaser.Game) {
        this._game = Game;
        this._paused = false;
        this._started = false;
        this._campaignData = TDGame.Globals.CampaignJSON;

        // set up the map
        this.Map = new TDMap(this._game);

    }

    // begin campaign
    Start() {
        console.log("Campaign Start");
        this._started = true;
    }

    // pause 
    Pause() {
        console.log("Campaign Pause");
        this._paused = true;
    }

    // call during game udpate for sub-componenets
    Update() {

    }

} 