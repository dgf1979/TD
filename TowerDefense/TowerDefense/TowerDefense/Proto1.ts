module TDGame {

    export class Proto1 extends Phaser.State {

        _campaign: GameObjectClasses.Campaign;
        background: Phaser.Sprite;
        tdmap: TDMap;
        pather: PathHelper;

        // init - get params passed to state
        init(Campaign: GameObjectClasses.Campaign) {
            this._campaign = Campaign;
        }

        // run-up
        create() {
            this.background = this.add.sprite(0, 0, "background");

            // set up the map
            var map = this.game.add.tilemap("tileDEF", TDGame.tileSize, TDGame.tileSize, 10, 10);
            map.addTilesetImage("tileIMG");
            map.setCollisionBetween(0, 99);
            var layer = map.createLayer(0);
            layer.resizeWorld();

            this.tdmap = new TDMap(this.game);

            // get all tiles in layer and build a dirty little walkable array
            var tiles: Phaser.Tile[] = layer.getTiles(0, 0, layer.width, layer.height, false, false);
            // use helper to init a 2D array
            var tmp: number[][] = Helper.Array2D(22, 22, 0);
            // flip any unwalkable tile to 1
            for (var i = 0; i < tiles.length; i++) {
                var tile: Phaser.Tile = tiles[i];
                // console.log(tile.x + "," + tile.y + "collides=" + tile.canCollide);
                if (tile.canCollide) {
                    tmp[tile.y][tile.x] = 1;
                }
            }

            // load up the map object
            this.tdmap.LoadWalkable(tmp);
            this.tdmap.SetCreepSpawnLocation(1, 8);
            this.tdmap.SetCreepExitLocation(14, 14);

            // use the path wrapper to run the A* pathfinding
            this.pather = new PathHelper(this.tdmap);
            this.pather.AsyncCalculatePath(this.tdmap.CreepSpawn, 32);

            // debug helper - show each element of the map path
            var path: Phaser.Point[] = this.pather.Path;
            var extendedPath: Phaser.Point[] = [];
            for (var i: number = 0; i < path.length; i++) {
                var tile: Phaser.Tile = map.getTile(path[i].x, path[i].y,0,true);
                if (tile != null) {
                    extendedPath[i] = new Phaser.Point
                        (tile.worldX + tile.centerX,
                        tile.worldY + tile.centerY);
                    Helper.WriteDebugText("P" + i, this.game, extendedPath[i].x, extendedPath[i].y);
                }
            }

            // loop waves
            var wave: GameObjectClasses.Wave = this._campaign.Waves[0];
            

            // make a creep group
            var creepGroup: Phaser.Group = this.game.add.group();
            creepGroup.name = "creeps";

            // creep factory
            var CF: CreepFactory = new CreepFactory(this.game, wave, creepGroup, extendedPath);
            CF.Start();
            // var creep0: Creep;
            // creep0 = new Creep(this.game, "CREEP000", extendedPath);
            // creepGroup.add(creep0);

            //drop a tower
            var tower0 = new Tower(this.game, "TOWER000", new Phaser.Point(3, 3), creepGroup);
            tower0.Range = 128;

            //drop a 2nd tower
            var tower1 = new Tower(this.game, "TOWER000", new Phaser.Point(6, 6), creepGroup);
            tower0.Range = 128;

        }

    }
} 