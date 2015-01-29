var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TDGame;
(function (TDGame) {
    //BOOT STATE
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            _super.apply(this, arguments);
        }
        BootState.prototype.preload = function () {
            console.log("Boot:preload()");
            this.load.image('progbar', 'img/loader.png');
        };

        BootState.prototype.create = function () {
            console.log("Boot:create()");
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                // todo
            }

            this.game.state.start('PreloadState', true, false);
            // Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        };
        return BootState;
    })(Phaser.State);
    TDGame.BootState = BootState;

    //PRELOAD STATE
    var PreloadState = (function (_super) {
        __extends(PreloadState, _super);
        function PreloadState() {
            _super.apply(this, arguments);
        }
        PreloadState.prototype.preload = function () {
            console.log("Preload:preload()");
            this.preloadBar = this.add.sprite(200, 250, 'progbar');
            this.load.setPreloadSprite(this.preloadBar);
            // this.load.image('creep0', 'img/tilemap0/creeps/creep0.png');
            // this.load.image('background', 'img/tilemap0/background0.png');
            // this.load.image('grid', 'img/tilemap0/grid0.png');
            // this.load.image('tileIMG', 'img/tilemap0/tileset0.png');
            // this.load.tilemap('tileDEF', 'img/tilemap0/tilemap0.csv', null, Phaser.Tilemap.CSV);
        };

        PreloadState.prototype.create = function () {
            var _this = this;
            console.log("Preload:create()");
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

            // tween.onComplete.add(() => this.game.state.start('Proto1', true, false));
            tween.onComplete.add(function () {
                return _this.game.state.start('StartMenu', true, false);
            });
        };
        return PreloadState;
    })(Phaser.State);
    TDGame.PreloadState = PreloadState;
})(TDGame || (TDGame = {}));
var TDGame;
(function (TDGame) {
    var CampaignList = (function (_super) {
        __extends(CampaignList, _super);
        function CampaignList() {
            _super.apply(this, arguments);
        }
        CampaignList.prototype.create = function () {
            var _this = this;
            var jsObj;

            $(document).ready(function () {
                $.ajax({
                    url: 'http://localhost:1337/campaign',
                    dataType: 'json',
                    async: false,
                    data: jsObj,
                    success: function (jsObj) {
                        console.log(jsObj);
                        _this.buildMenu(jsObj);
                    }
                });
            });
        };

        // shitty basic menu build
        CampaignList.prototype.buildMenu = function (CampaignNames) {
            // loop through string and display as menu items
            var style = { font: "24px Arial", fill: "Blue", align: "center" };

            //offsets to space out the menu items vertically
            var offsetY = 28;
            for (var i = 0; i < CampaignNames.length; i++) {
                var down = offsetY * i + 40;
                var item = this.game.add.text(this.game.world.centerX, down, CampaignNames[i], style);
                item.buttonMode = true;
                item.anchor.set(0.5, 0.5);
                item.addColor("green", 2);
                item.inputEnabled = true;

                // make new instances of all events (because JavaScript)
                var mouseover = this.menuItemOnMouseOver(item);
                var mouseout = this.menuItemOnMouseOut(item);
                var mouseclick = this.menuItemClicked(item);
                item.events.onInputOver.add(mouseover, this);
                item.events.onInputOut.add(mouseout, this);
                item.events.onInputDown.add(mouseclick, this);
            }
        };

        CampaignList.prototype.menuItemOnMouseOver = function (menuItem) {
            // have to return a new function, not just execute the function - because JavaScript.
            return function () {
                menuItem.scale = new Phaser.Point(1.5, 1.5);
            };
        };

        CampaignList.prototype.menuItemOnMouseOut = function (menuItem) {
            return function () {
                menuItem.scale = new Phaser.Point(1.0, 1.0);
            };
        };

        CampaignList.prototype.menuItemClicked = function (menuItem) {
            var _this = this;
            return function () {
                TDGame.currentCampaign = menuItem.text;
                _this.game.state.start('LoadCampaignAssets', true, false);
            };
        };
        return CampaignList;
    })(Phaser.State);
    TDGame.CampaignList = CampaignList;
})(TDGame || (TDGame = {}));
var Creep = (function (_super) {
    __extends(Creep, _super);
    function Creep(ThisGame, CreepType, StartPath) {
        _super.call(this, ThisGame, 0, 0, CreepType, 0);

        this.scale = new Phaser.Point(2, 2);
        this.anchor.setTo(0.5, 0.5);

        this.health = 10;
        this._id = CreepType;
        this._payout = 10;
        this._velocity = 1000;
        this._path = StartPath;

        ThisGame.add.existing(this);

        this.position = this._path[0];
        var lookat = this._path[1];
        this.rotation = Phaser.Point.angle(lookat, this.position);
    }
    // phaser update loop
    Creep.prototype.update = function () {
        this.FollowPath(); // movement
    };

    // movement
    Creep.prototype.FollowPath = function () {
        var p = this._path[0];
        if (this.position.x === p.x && this.position.y === p.y) {
            if (this._path.length > 1) {
                var nextPos = this._path[1];
                var angle = Phaser.Point.angle(nextPos, this.position);
                this.rotation = angle;
                this.game.add.tween(this.position).to(nextPos, this._velocity, Phaser.Easing.Linear.None, true);
                this._path.shift();
            }
        }
    };
    return Creep;
})(Phaser.Sprite);
var TDGame;
(function (TDGame) {
    TDGame.currentCampaign = '';

    var Game = (function (_super) {
        __extends(Game, _super);
        // global vars for passing between states
        function Game() {
            _super.call(this, 800, 640, Phaser.AUTO, 'game', null);
            this.state.add('BootState', TDGame.BootState, true);
            this.state.add('PreloadState', TDGame.PreloadState, false);
            this.state.add('StartMenu', TDGame.StartMenu, false);
            this.state.add('CampaignListState', TDGame.CampaignList, false);
            this.state.add('LoadCampaignAssets', TDGame.LoadCampaignAssets, false);
            this.state.add('Proto1', TDGame.Proto1, false);
        }
        return Game;
    })(Phaser.Game);
    TDGame.Game = Game;
})(TDGame || (TDGame = {}));
var Helper;
(function (Helper) {
    // init a 2D array of a given size with a given starting value
    function Array2D(X, Y, DefaultValue) {
        var a = new Array([]);
        for (var y = 0; y < Y; y++) {
            a.push([]);
            for (var x = 0; x < X; x++) {
                a[y].push(DefaultValue);
            }
        }
        return a;
    }
    Helper.Array2D = Array2D;

    // extremely basic vector2 implementation
    // effectively a struct (does TS have an emulation for structs? research later)
    // to contain a node, or a lazy Vector2
    var Vector2 = (function () {
        function Vector2(X, Y) {
            this._x = X;
            this._y = Y;
        }
        Object.defineProperty(Vector2.prototype, "X", {
            // accessors
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "Y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Vector2;
    })();
    Helper.Vector2 = Vector2;

    // debugging text writer
    function WriteDebugText(Text, CurrentGame, AtCanvasX, AtCanvasY) {
        var style = { fill: "blue" };
        var txt = CurrentGame.add.text(AtCanvasX, AtCanvasY, Text, style);
        txt.anchor.set(0.5, 0.5);
    }
    Helper.WriteDebugText = WriteDebugText;

    // scaling enum
    (function (Scaler) {
        Scaler[Scaler["x16"] = 4] = "x16";
        Scaler[Scaler["x32"] = 2] = "x32";
        Scaler[Scaler["x64"] = 1] = "x64";
    })(Helper.Scaler || (Helper.Scaler = {}));
    var Scaler = Helper.Scaler;
    ;
})(Helper || (Helper = {}));
var TDGame;
(function (TDGame) {
    var LoadCampaignAssets = (function (_super) {
        __extends(LoadCampaignAssets, _super);
        function LoadCampaignAssets() {
            _super.apply(this, arguments);
        }
        LoadCampaignAssets.prototype.preload = function () {
            console.log('Value in LCA State: ' + TDGame.currentCampaign);
        };

        LoadCampaignAssets.prototype.create = function () {
        };
        return LoadCampaignAssets;
    })(Phaser.State);
    TDGame.LoadCampaignAssets = LoadCampaignAssets;
})(TDGame || (TDGame = {}));
var TDGame;
(function (TDGame) {
    var StartMenu = (function (_super) {
        __extends(StartMenu, _super);
        function StartMenu() {
            _super.apply(this, arguments);
        }
        StartMenu.prototype.create = function () {
            var _this = this;
            var text = "Select Campaign";
            var style = { font: "24px Arial", fill: "Red", align: "center" };
            var item1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, text, style);
            item1.buttonMode = true;
            item1.anchor.set(0.5, 0.5);
            item1.addColor("white", 7);
            item1.inputEnabled = true;
            item1.events.onInputOver.add(function () {
                this.menuItemOnMouseOver(item1);
            }, this);
            item1.events.onInputOut.add(function () {
                return _this.menuItemOnMouseOut(item1);
            }, this);
            item1.events.onInputDown.add(this.menuItemOnMouseClick, this);
        };

        StartMenu.prototype.menuItemOnMouseOver = function (menuItem) {
            menuItem.scale = new Phaser.Point(1.25, 1.25);
        };

        StartMenu.prototype.menuItemOnMouseOut = function (menuItem) {
            menuItem.scale = new Phaser.Point(1.0, 1.0);
        };

        StartMenu.prototype.menuItemOnMouseClick = function () {
            this.game.state.start('CampaignListState', true, false);
        };
        return StartMenu;
    })(Phaser.State);
    TDGame.StartMenu = StartMenu;
})(TDGame || (TDGame = {}));
// wrap some EasyStar functionality into typescript for simpler (to me) usage
var PathHelper = (function () {
    // default constructor
    function PathHelper(Map) {
        // easystar
        this._easystar = new EasyStar.js();
        this._path = [];
        this._map = Map;
        this._asyncComplete = true;
        this._pathFound = false;
    }
    Object.defineProperty(PathHelper.prototype, "Path", {
        // return path as node array
        get: function () {
            if (this._pathFound && this._asyncComplete) {
                return this._path;
            } else {
                alert("Error: caller tried to access path without checking MapIsWalkable && ProcessingComplete");
            }
        },
        enumerable: true,
        configurable: true
    });

    // return if map is walkable
    PathHelper.prototype.MapIsWalkable = function () {
        return this._pathFound;
    };

    // return false if the async operation is not yet complete
    PathHelper.prototype.ProcessingComplete = function () {
        return this._asyncComplete;
    };

    // return the html debug string
    PathHelper.prototype.DebugPathString = function () {
        return this._htmlDebugGrid;
    };

    // use EasyStar.js to generate a path
    PathHelper.prototype.AsyncCalculatePath = function (StartNode, TileSize, Scale) {
        var _this = this;
        this._asyncComplete = false;
        var grid = this._map.WalkableGrid;

        // easyStar
        this._easystar.setGrid(grid);
        this._easystar.setAcceptableTiles([0]);
        this._easystar.findPath(StartNode.x, StartNode.y, this._map.CreepExit.x, this._map.CreepExit.y, function (path) {
            if (path == null) {
                // alert("Path not found.");
                _this._pathFound = false;
                _this._asyncComplete = true;
            } else {
                _this._pathFound = true;
                _this._asyncComplete = true;

                // alert("Path found: first point is " + path[0].x + "," + path[0].y);
                var newGrid = grid.slice();

                for (var i = 0; i < path.length; i++) {
                    // displayPathStr = displayPathStr + 'X:' + path[i].x + ',Y:' + path[i].y + " -> ";
                    var x = path[i].x;
                    var y = path[i].y;

                    // fill the path list
                    _this._path[i] = new Phaser.Point(x, y);
                    newGrid[y][x] = 8; // path taken marked with an arbitrary '8'
                }

                // alert(this.PrintableArrayString(newGrid));
                _this._htmlDebugGrid = _this.PrintableArrayString(newGrid);
            }
        });

        this._easystar.calculate();
    };

    // format a 2D array into a printable HTML formatted string for debugging
    PathHelper.prototype.PrintableArrayString = function (Array2D) {
        var x, y;
        var pstr = "";
        for (x = 0; x < Array2D.length; x++) {
            for (y = 0; y < Array2D[x].length; y++) {
                pstr = pstr + Array2D[x][y] + " ";
            }

            // pstr = pstr + "\r";
            pstr = pstr + "<br />\r";
        }

        return pstr;
    };
    return PathHelper;
})();
var TDGame;
(function (TDGame) {
    var Proto1 = (function (_super) {
        __extends(Proto1, _super);
        function Proto1() {
            _super.apply(this, arguments);
        }
        // run-up
        Proto1.prototype.create = function () {
            this.background = this.add.sprite(0, 0, "background");

            // var map: TDMap = new TDMap(this.game);
            // map scalefactor
            this.ScaleFactor = 2 /* x32 */;

            // set up the map
            console.log("about to try adding the tilemap..");
            var map = this.game.add.tilemap("tileDEF", 32, 32, 10, 10);
            map.addTilesetImage("tileIMG");
            map.setCollisionBetween(0, 99);
            var layer = map.createLayer(0);
            layer.scale = new Phaser.Point(this.ScaleFactor, this.ScaleFactor);
            layer.resizeWorld();
            console.log("made it!");

            //
            this.tdmap = new TDMap(this.game);

            // get all tiles in layer and build a dirty little walkable array
            var tiles = layer.getTiles(0, 0, layer.width, layer.height, false, false);

            // use helper to init a 2D array
            var tmp = Helper.Array2D(10, 12, 0);

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                console.log(tile.x + "," + tile.y + "collides=" + tile.canCollide);
                if (tile.canCollide) {
                    tmp[tile.y][tile.x] = 1;
                }
            }

            // load up the map object
            this.tdmap.LoadWalkable(tmp);
            this.tdmap.SetCreepSpawnLocation(1, 8);
            this.tdmap.SetCreepExitLocation(8, 1);

            // use the path wrapper to run the A* pathfinding algorythm
            this.pather = new PathHelper(this.tdmap);
            this.pather.AsyncCalculatePath(this.tdmap.CreepSpawn, 16, this.ScaleFactor);

            // debug helper - show each element of the map path
            var path = this.pather.Path;
            var extendedPath = [];
            for (var i = 0; i < path.length; i++) {
                var tile = map.getTile(path[i].x, path[i].y, 0, true);
                if (tile != null) {
                    extendedPath[i] = new Phaser.Point(tile.worldX * this.ScaleFactor + tile.centerX * this.ScaleFactor, tile.worldY * this.ScaleFactor + tile.centerY * this.ScaleFactor);
                    Helper.WriteDebugText("P" + i, this.game, extendedPath[i].x, extendedPath[i].y);
                }
            }

            // drop a creep
            var creep0;
            creep0 = new Creep(this.game, "creep0", extendedPath);
        };
        return Proto1;
    })(Phaser.State);
    TDGame.Proto1 = Proto1;
})(TDGame || (TDGame = {}));
var TDMap = (function () {
    function TDMap(PhaserGameObject) {
        this._game = PhaserGameObject;
    }
    TDMap.prototype.LoadWalkable = function (Grid) {
        this._walkableGrid = Grid;
    };

    TDMap.prototype.SetCreepSpawnLocation = function (X, Y) {
        this._creepSpawn = new Phaser.Point(X, Y);
    };

    TDMap.prototype.SetCreepExitLocation = function (X, Y) {
        this._creepExit = new Phaser.Point(X, Y);
    };

    Object.defineProperty(TDMap.prototype, "CreepSpawn", {
        get: function () {
            return this._creepSpawn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TDMap.prototype, "CreepExit", {
        get: function () {
            return this._creepExit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TDMap.prototype, "WalkableGrid", {
        get: function () {
            return this._walkableGrid;
        },
        enumerable: true,
        configurable: true
    });
    return TDMap;
})();
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(100, 100, Phaser.AUTO, 'test', { preload: this.preload, create: this.create });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('test', 'img/test.png');
    };

    SimpleGame.prototype.create = function () {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'test');
        logo.anchor.setTo(0.5, 0.5);
    };
    return SimpleGame;
})();

window.onload = function () {
    // var game = new SimpleGame();
};
//# sourceMappingURL=game.js.map
