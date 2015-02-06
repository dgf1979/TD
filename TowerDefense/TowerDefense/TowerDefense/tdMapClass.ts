class TDMap {

    private _game: Phaser.Game;
    private _tileMap: Phaser.Tilemap;
    private _creepSpawn: Phaser.Point;
    private _creepExit: Phaser.Point;
    private _walkableGrid: number[][];

    constructor(ThisGame: Phaser.Game, CreepSpawn: Phaser.Point, CreepExit: Phaser.Point) {
        this._game = ThisGame;

        // set up Phaser tilemap
        this._tileMap = this._game.add.tilemap("tileDEF", TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
        this._tileMap.addTilesetImage("tileIMG");
        this._tileMap.setCollisionBetween(0, 99);
        var layer = this._tileMap.createLayer(0);
        layer.resizeWorld;
        layer.debug = true;

        // set up pathing
        this._creepSpawn = CreepSpawn;
        this._creepExit = CreepExit;

        // get walkable 
        this.GetWalkable(layer);
    }

    get TileMap(): Phaser.Tilemap {
        return this._tileMap;
    }

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