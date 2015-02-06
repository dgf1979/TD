// wrap some EasyStar functionality into typescript for simpler (to me) usage
class PathHelper {
    // easystar
    private _easystar: EasyStar.js = new EasyStar.js();
    private _pathFound: boolean;
    private _asyncComplete: boolean;
    private _map: TDMap;
    private _path: Phaser.Point[] = [];

    // debug help
    private _htmlDebugGrid: string;

    // default constructor
    constructor(Map: TDMap) {
        this._map = Map;
        this._asyncComplete = true;
        this._pathFound = false;
    }

    // return path as node array
    get Path(): Phaser.Point[]{
        if (this._pathFound && this._asyncComplete) {
            return this._path;
        } else {
            alert("Error: caller tried to access path without checking MapIsWalkable && ProcessingComplete");
        }
    }

    GetPixelPath(TileWidth: number, TileHeight: number): Phaser.Point[]{
        var Path: Phaser.Point[] = this.Path;
        var pixelPath: Phaser.Point[] = [];
        for (var i: number = 0; i < Path.length; i++) {
            var x = Path[i].x;
            var y = Path[i].y;
            var p = new Phaser.Point(TileWidth * x + TileWidth / 2, TileHeight * y + TileWidth / 2);
            pixelPath.push(p);
        }
        return pixelPath;
    }

    // return if map is walkable
    MapIsWalkable(): boolean {
        return this._pathFound;
    }

    // return false if the async operation is not yet complete
    ProcessingComplete(): boolean {
        return this._asyncComplete;
    }

    // return the html debug string
    DebugPathString(): string {
        return this._htmlDebugGrid;
    }

    // draw path
    DebugPathDraw(PixelPath: Phaser.Point[], Game: Phaser.Game) {
        // debug helper - show each element of the map path
        for (var i = 0; i < PixelPath.length; i++) {
            Helper.WriteDebugText("P" + i, Game, PixelPath[i].x, PixelPath[i].y);
        }
    }

    // use EasyStar.js to generate a path
    AsyncCalculatePath(StartNode: Phaser.Point, TileSize: number) {
        this._asyncComplete = false;
        var grid = this._map.WalkableGrid;
        // easyStar
        this._easystar.setGrid(grid);
        this._easystar.setAcceptableTiles([0]);
        this._easystar.findPath(StartNode.x, StartNode.y, this._map.CreepExit.x, this._map.CreepExit.y,
            (path: any) => {
            if (path == null) {
                // alert("Path not found.");
                this._pathFound = false;
                this._asyncComplete = true;
            } else {
                this._pathFound = true;
                this._asyncComplete = true;
                var newGrid = grid.slice();
                for (var i: number = 0; i < path.length; i++) {
                    var x: number = path[i].x;
                    var y: number = path[i].y;
                    this._path[i] = new Phaser.Point(x, y);
                    newGrid[y][x] = 8;  // path taken marked with an arbitrary '8'
                }
                this._htmlDebugGrid = this.PrintableArrayString(newGrid);
            }
        });

        this._easystar.calculate();
    }

    // format a 2D array into a printable HTML formatted string for debugging
    private PrintableArrayString(Array2D: number[][]): string {
        var x, y: number;
        var pstr: string = "";
        for (x = 0; x < Array2D.length; x++) {
            for (y = 0; y < Array2D[x].length; y++) {
                pstr = pstr + Array2D[x][y] + " ";
            }
            // pstr = pstr + "\r";
            pstr = pstr + "<br />\r";
        }

        return pstr;
    }


}

