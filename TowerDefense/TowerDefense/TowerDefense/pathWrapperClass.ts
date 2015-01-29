// wrap some EasyStar functionality into typescript for simpler (to me) usage
class PathHelper {
    // easystar
    private _easystar: any = new EasyStar.js();
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

    // use EasyStar.js to generate a path
    AsyncCalculatePath(StartNode: Phaser.Point, TileSize: number, Scale: Helper.Scaler) {
        this._asyncComplete = false;
        var grid = this._map.WalkableGrid;
        // easyStar
        this._easystar.setGrid(grid);
        this._easystar.setAcceptableTiles([0]);
        this._easystar.findPath(StartNode.x, StartNode.y, this._map.CreepExit.x, this._map.CreepExit.y,
            path => {
            if (path == null) {
                // alert("Path not found.");
                this._pathFound = false;
                this._asyncComplete = true;
            } else {
                this._pathFound = true;
                this._asyncComplete = true;
                // alert("Path found: first point is " + path[0].x + "," + path[0].y);
                var newGrid = grid.slice();
                // var displayPathStr: string = "Path: ";
                for (var i: number = 0; i < path.length; i++) {
                    // displayPathStr = displayPathStr + 'X:' + path[i].x + ',Y:' + path[i].y + " -> ";
                    var x: number = path[i].x;
                    var y: number = path[i].y;
                    // fill the path list
                    this._path[i] = new Phaser.Point(x, y);
                    newGrid[y][x] = 8;  // path taken marked with an arbitrary '8'
                }
                // alert(this.PrintableArrayString(newGrid));
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

