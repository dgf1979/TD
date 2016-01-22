class Global {
    CampaignJSON: GameObjectClasses.Campaign;
    TilesetJSON: GameObjectClasses.Tileset;
    // UI: TDGame.UI;
    Settings: settings = new settings();
}

// settings singleton
class settings {
    private static _instance: settings = null;

    // settings
    private _playAreaUL: Phaser.Point = new Phaser.Point(32, 32);
    private _playAreaTiles: Phaser.Point = new Phaser.Point(22, 20);
    private _tileSize: Phaser.Point = new Phaser.Point(32, 32);
    private _screenSize: Phaser.Point = new Phaser.Point(1024, 768);

    constructor() {
        // prevent normal contructor access of singlton
        if (settings._instance) {
            throw new Error("Error: Call 'settings' singleton as settings.instance");
        }
        settings._instance = this;
    }
    // singleton instance
    public static instance(): settings {
        if (settings._instance === null) {
            settings._instance = new settings();
        }
        return settings._instance;
    }

    // setting accessors

    // screen size
    get ScreenSize(): Phaser.Point {
        return this._screenSize;
    }

    // tile size
    get TileSize(): Phaser.Point {
        return this._tileSize;
    }

    // tiles in the play area
    get PlayAreaTiles(): Phaser.Point {
        return this._playAreaTiles;
    }

    // upper left corner of play area
    get PlayAreaUL(): Phaser.Point {
        return this._playAreaUL;
    }
}