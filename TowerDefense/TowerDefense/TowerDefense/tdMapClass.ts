class TDMap {

    private _game: Phaser.Game;
    private _tileMap: Phaser.Tilemap;
    private _pather: PathHelper;
    private _creepSpawn: Phaser.Point;
    private _creepExit: Phaser.Point;
    private _undo: Phaser.Point;
    private _pathThroughMap: Phaser.Point[];
    private _walkableGrid: number[][];

    // signals

    SignalMapChanged: Phaser.Signal = new Phaser.Signal();

    // constructor
    constructor(ThisGame: Phaser.Game, CreepSpawn: Phaser.Point, CreepExit: Phaser.Point) {
        this._game = ThisGame;

        // set up Phaser tilemap
        this._tileMap = this._game.add.tilemap("tileDEF", TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
        this._tileMap.addTilesetImage("tileIMG");
        this._tileMap.setCollisionBetween(0, 99);
        var layer = this._tileMap.createLayer(0);
        layer.resizeWorld();
        // layer.debug = true;

        // set up pathing
        this._creepSpawn = CreepSpawn;
        this._creepExit = CreepExit;

        // get walkable 
        this.GetWalkable(layer);

        // config pathing
        this._pather = new PathHelper(this);

        // subscribe to pather events
        var mapUpdated = () => {
            this.MapUpdated();
        };
        this._pather.SignalNewPathOK.add(mapUpdated, this);
        this._pather.SignalNewPathBlocked.add(() => { this.MapUpdateFailed(); });

        // set initial path
        this._pather.AsyncCalculatePath(this.CreepSpawn);
    }

    // called when the map is updated and valid (e.g. a valid path remains) 
    private MapUpdated() {
        this._pathThroughMap = this._pather.GetPixelPathCentered(TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
        this._pather.DebugPathDraw(this._pathThroughMap, this._game);
        this.SignalMapChanged.dispatch();
        this._undo = null;
    }

    // call when the map update fails
    private MapUpdateFailed() {
        if (this._undo) {
            this._walkableGrid[this._undo.y][this._undo.x];
            this._undo = null;
        }
    }

    // tilemap getter
    get TileMap(): Phaser.Tilemap {
        return this._tileMap;
    }

    // path getter
    get PathThrough(): Phaser.Point[] {
        return this._pathThroughMap;
    }

    // queue path change
    TryAddBlockingAtTilePosition(TilePosition: Phaser.Point) {
        this._undo = TilePosition;
        this._walkableGrid[TilePosition.y][TilePosition.x] = 1;
        this._pather.AsyncCalculatePath(this._creepSpawn);
    }

    // 
    private GetWalkable(Layer: Phaser.TilemapLayer) {
        // get all tiles in layer and build a dirty little walkable array
        var tiles: Phaser.Tile[] = Layer.getTiles(0, 0, Layer.width, Layer.height, false, false);
        // use helper to init a 2D array
        var tmp: number[][] = Helper.Array2D(24, 24, 0);
        // flip any unwalkable tile to 1
        for (var i = 0; i < tiles.length; i++) {
            var tile: Phaser.Tile = tiles[i];
            if (tile.canCollide) {
                tmp[tile.y][tile.x] = 1;
            }
        }
        // load up the map object
        this._walkableGrid = tmp;
    }

    get CreepSpawn(): Phaser.Point { return this._creepSpawn; }
    get CreepExit(): Phaser.Point { return this._creepExit; }
    get WalkableGrid(): number[][] { return this._walkableGrid; }
} 