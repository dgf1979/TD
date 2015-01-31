var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TDGame;
(function (TDGame) {
    // BOOT STATE
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

            this.game.state.start('StartMenu', true, false);
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
        this._walkTextureKey = CreepType + ".walk";
        this._dieTextureKey = CreepType + ".die";

        _super.call(this, ThisGame, 0, 0, this._walkTextureKey, 0);

        // this.scale = new Phaser.Point(2, 2);
        this.anchor.setTo(0.5, 0.5);

        this.health = 10;
        this._id = CreepType;
        this._payout = 10;
        this._velocity = 300;
        this._path = StartPath;
        this.animations.add("walk");
        this.animations.play("walk", 4, true);

        this.game.add.existing(this);

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
            } else {
                this.Exit();
            }
        }
    };

    // exit map
    Creep.prototype.Exit = function () {
        var _this = this;
        var fadeOut = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        fadeOut.onComplete.add(function () {
            _this.kill();
            _this.destroy();
        });
    };

    // die
    Creep.prototype.Die = function () {
        // todo: add value to global payout
        this.animations.stop("walk");
        if (!this.game.cache.checkImageKey(this._dieTextureKey)) {
            this.Exit();
        } else {
            var die_anim = this.animations.add("die");
            die_anim.play(15, false); // no loop, kill on complete
            this.Exit();
        }
    };
    return Creep;
})(Phaser.Sprite);
var GameObjectClasses;
(function (GameObjectClasses) {
    // a campaign, consisting of multiple waves
    var Campaign = (function () {
        function Campaign() {
        }
        return Campaign;
    })();
    GameObjectClasses.Campaign = Campaign;

    // a wave, each consisting of a number of creeps ofa  specific type
    var Wave = (function () {
        function Wave() {
        }
        return Wave;
    })();
    GameObjectClasses.Wave = Wave;

    // a tileset, with URLs to each asset
    var Tileset = (function () {
        function Tileset() {
        }
        return Tileset;
    })();
    GameObjectClasses.Tileset = Tileset;

    // asset URLs for a partucular type of creep
    var CreepAssets = (function () {
        function CreepAssets() {
        }
        return CreepAssets;
    })();
    GameObjectClasses.CreepAssets = CreepAssets;

    // asset URLs for a partucular type of creep
    var TowerAssets = (function () {
        function TowerAssets() {
        }
        return TowerAssets;
    })();
    GameObjectClasses.TowerAssets = TowerAssets;
})(GameObjectClasses || (GameObjectClasses = {}));
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

    // debugging text writer
    function WriteDebugText(Text, CurrentGame, AtCanvasX, AtCanvasY) {
        var style = { fill: "blue" };
        var txt = CurrentGame.add.text(AtCanvasX, AtCanvasY, Text, style);
        txt.anchor.set(0.5, 0.5);
    }
    Helper.WriteDebugText = WriteDebugText;
})(Helper || (Helper = {}));
var TDGame;
(function (TDGame) {
    var LoadCampaignAssets = (function (_super) {
        __extends(LoadCampaignAssets, _super);
        function LoadCampaignAssets() {
            _super.apply(this, arguments);
        }
        LoadCampaignAssets.prototype.preload = function () {
            // progbar
            this.preloadBar = this.add.sprite(200, 250, 'progbar');
            this.load.setPreloadSprite(this.preloadBar);

            console.log('Value in LCA State: ' + TDGame.currentCampaign);

            // query asset server for the selected campaigns details
            var oCampaign;
            $(document).ready(function () {
                $.ajax({
                    url: 'http://localhost:1337/campaign/' + TDGame.currentCampaign,
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        oCampaign = json;
                        console.log('AJAX campaign ID: ' + oCampaign.ID);
                    }
                });
            });

            // query asset server for the tileset used in this campaign
            var oTileset;
            $(document).ready(function () {
                $.ajax({
                    url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID,
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        oTileset = json;
                        console.log("Tileset: " + oTileset);
                    }
                });
            });

            // query asset server for every creep
            // var oCreep: GameObjectClasses.CreepAssets;
            var oCreeps = [];
            $(document).ready(function () {
                $.ajax({
                    url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID + '/creeps',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        oCreeps = json;

                        // console.log("AJAX success returned: " + JSON.stringify(json));
                        // console.log("creep list length: " + oCreeps.length);
                        console.log("WalkAnimationURL prop: " + oCreeps[oCreeps.length].WalkAnimationURL);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                    }
                });
            });

            // query asset server for every tower
            var oTowers = [];
            $(document).ready(function () {
                $.ajax({
                    url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID + '/towers',
                    dataType: 'json',
                    async: false,
                    success: function (json) {
                        oTowers = json;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                    }
                });
            });

            // load test tower
            var base = this.load.spritesheet(oTowers[0].GameObjectID + ".base", oTowers[0].BaseURL, 64, 64);
            if (oTowers[0].RotatorURL !== undefined) {
                var rotator = this.load.spritesheet(oTowers[0].GameObjectID + ".rotator", oTowers[0].RotatorURL, 64, 64);
            }

            // load test creep
            var walk = this.load.spritesheet(oCreeps[0].GameObjectID + '.walk', oCreeps[0].WalkAnimationURL, 64, 64);
            if (oCreeps[0].DieAnimationURL !== undefined) {
                var die = this.load.spritesheet(oCreeps[0].GameObjectID + '.die', oCreeps[0].DieAnimationURL, 64, 64);
            }

            // load background, tileset, and CSV map
            this.load.image('background', oTileset.BackgroundURL);
            this.load.image('tileIMG', oTileset.WallURL);
            this.load.tilemap('tileDEF', oCampaign.MapURL, null, Phaser.Tilemap.CSV);
            // console.log("CSV: " + oCampaign.MapURL);
        };

        // phaser.create()
        LoadCampaignAssets.prototype.create = function () {
            var _this = this;
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                return _this.game.state.start('Proto1', true, false);
            });
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
    PathHelper.prototype.AsyncCalculatePath = function (StartNode, TileSize) {
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
            // set up the map
            console.log("about to try adding the tilemap..");
            var map = this.game.add.tilemap("tileDEF", 64, 64, 10, 10);
            map.addTilesetImage("tileIMG");
            map.setCollisionBetween(0, 99);
            var layer = map.createLayer(0);

            // layer.scale = new Phaser.Point(this.ScaleFactor, this.ScaleFactor);
            layer.resizeWorld();

            //console.log("made it!");
            //
            this.tdmap = new TDMap(this.game);

            // get all tiles in layer and build a dirty little walkable array
            var tiles = layer.getTiles(0, 0, layer.width, layer.height, false, false);

            // use helper to init a 2D array
            var tmp = Helper.Array2D(10, 12, 0);

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];

                // console.log(tile.x + "," + tile.y + "collides=" + tile.canCollide);
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
            this.pather.AsyncCalculatePath(this.tdmap.CreepSpawn, 32);

            // debug helper - show each element of the map path
            var path = this.pather.Path;
            var extendedPath = [];
            for (var i = 0; i < path.length; i++) {
                var tile = map.getTile(path[i].x, path[i].y, 0, true);
                if (tile != null) {
                    extendedPath[i] = new Phaser.Point(tile.worldX + tile.centerX, tile.worldY + tile.centerY);
                    Helper.WriteDebugText("P" + i, this.game, extendedPath[i].x, extendedPath[i].y);
                }
            }

            // make a creep group
            var creepGroup = this.game.add.group();

            creepGroup.name = "creeps";

            // drop a creep
            var creep0;
            creep0 = new Creep(this.game, "CREEP000", extendedPath);
            creepGroup.add(creep0);

            //drop a tower
            var tower0 = new Tower(this.game, "TOWER000", new Phaser.Point(3, 3), creepGroup);
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
var Tower = (function (_super) {
    __extends(Tower, _super);
    function Tower(ThisGame, TowerID, Location, CreepGroup) {
        this._id = TowerID;
        this._baseTextureKey = this._id + ".base";
        this._rotatorTextureKey = this._id + ".rotator";
        this._creepList = CreepGroup;
        _super.call(this, ThisGame, Location.x * 64 + 32, Location.y * 64 + 32, this._baseTextureKey, 0);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        this.Range = 128; // default range
        this._targetCreep = null;
        this._hasTurret = this.game.cache.checkImageKey(this._rotatorTextureKey);
    }
    Object.defineProperty(Tower.prototype, "Range", {
        set: function (Dist) {
            this._range = new Phaser.Circle(this.position.x, this.position.y, Dist * 2);
        },
        enumerable: true,
        configurable: true
    });

    // phaser update loop
    Tower.prototype.update = function () {
        // check if the tower has a target within range
        if (this._targetCreep !== null && this._range.contains(this._targetCreep.x, this._targetCreep.y)) {
            console.log("target creep is not null and is in range - clear to shoot");

            // shoooooot iiiiiit!!!  ..or, you kow, get the rotation and draw a line..
            if (this._hasTurret) {
                this.rotateTurretToTarget();
            }

            // pew pew pew!
            var line = new Phaser.Line(this.x, this.y, this._targetCreep.x, this._targetCreep.y);
            console.log(line.angle);
        } else {
            // console.log("No target creep, or creep is out of range.");
            this._targetCreep = null;
            if (this._creepList.countLiving() > 0) {
                this.targetNearestInRangeCreep();
            }
        }
    };

    // rotate turret to tract targeted creep
    Tower.prototype.rotateTurretToTarget = function () {
    };

    // set the nearest in-range creep as target
    Tower.prototype.targetNearestInRangeCreep = function () {
        var _this = this;
        var nearest;
        var lastDistance = this._range.diameter;

        // console.log("LIVE CREEPS IN GROUP: " + this._creepList.countLiving());
        this._creepList.forEachAlive(function (creep) {
            if (_this._range.contains(creep.position.x, creep.position.y)) {
                var distance = Phaser.Point.distance(creep.position, _this.position);
                if (distance < lastDistance) {
                    lastDistance = distance; // if the distance to this creep from tower is the lowest so far, save it for the next loop
                    nearest = creep;
                }
            }
        }, this);

        // now that the loop is complete, set the nearest creep as the tower target
        if (lastDistance < this._range.diameter) {
            console.log("targeting NEW creep: " + nearest.key);
            this._targetCreep = nearest;
        } else {
            console.log("No creeps in range");
        }
    };
    return Tower;
})(Phaser.Sprite);
//# sourceMappingURL=game.js.map
