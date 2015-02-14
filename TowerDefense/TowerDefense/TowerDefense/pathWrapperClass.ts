// wrap some EasyStar functionality into typescript for simpler (to me) usage
class PathHelper {
    // easystar
    private _easystar: EasyStar.js = new EasyStar.js();
    private _map: TDMap;
    private _path: Phaser.Point[] = [];
    private _debugStrings: Phaser.Text[] = [];

    // signals
    SignalNewPathOK: Phaser.Signal = new Phaser.Signal();
    SignalNewPathBlocked: Phaser.Signal = new Phaser.Signal();

    // default constructor
    constructor(Map: TDMap) {
        this._map = Map;
        this._debugStrings = [];
    }

    // return path as node array
    get TilePath(): Phaser.Point[]{
        if (this._path) {
            return this._path;
        }
    }

    // path translated to the centered pixel location of each tile
    GetPixelPathCentered(TileWidth: number, TileHeight: number): Phaser.Point[]{
        var Path: Phaser.Point[] = this.TilePath;
        var pixelPath: Phaser.Point[] = [];
        for (var i: number = 0; i < Path.length; i++) {
            var x = Path[i].x;
            var y = Path[i].y;
            var p = new Phaser.Point(TileWidth * x + TileWidth / 2, TileHeight * y + TileWidth / 2);
            pixelPath.push(p);
        }
        return pixelPath;
    }

    // draw path
    DebugPathDraw(PixelPath: Phaser.Point[], Game: Phaser.Game) {
        // debug helper - show each element of the map path
        for (var i = this._debugStrings.length - 1; i >= 0; i--) {
            this._debugStrings[i].destroy();
            this._debugStrings.pop();
        }
        for (var i = 0; i < PixelPath.length; i++) {
            var txt: Phaser.Text = Helper.CreateUpdateableDebugText("P" + i, Game, PixelPath[i].x, PixelPath[i].y);
            this._debugStrings.push(txt);
        }
    }

    // use EasyStar.js to generate a path
    AsyncCalculatePath(StartNode: Phaser.Point) {
        var grid = this._map.WalkableGrid;
        // easyStar
        this._easystar.setGrid(grid);
        this._easystar.setAcceptableTiles([0]);
        this._easystar.findPath(StartNode.x, StartNode.y, this._map.CreepExit.x, this._map.CreepExit.y,
            (path: any) => {
                if (path === null) {
                    console.log("path blocked");
                    this.SignalNewPathBlocked.dispatch();
                } else {
                    console.log("path resolved");
                    for (var i: number = 0; i < path.length; i++) {
                        var x: number = path[i].x;
                        var y: number = path[i].y;
                        this._path[i] = new Phaser.Point(x, y);
                    }
                    this.SignalNewPathOK.dispatch(); 
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

