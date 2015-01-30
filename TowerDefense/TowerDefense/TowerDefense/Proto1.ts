module TDGame {

    export class Proto1 extends Phaser.State {

        background: Phaser.Sprite;
        tdmap: TDMap;
        pather: PathHelper;

        // run-up
        create() {
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
            var tiles: Phaser.Tile[] = layer.getTiles(0, 0, layer.width, layer.height, false, false);
            // use helper to init a 2D array
            var tmp: number[][] = Helper.Array2D(10, 12, 0);
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
            this.tdmap.SetCreepExitLocation(8, 1);

            // use the path wrapper to run the A* pathfinding algorythm
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

            // drop a creep
            var creep0: Creep;
            creep0 = new Creep(this.game, "CREEP000", extendedPath);

        }
    }

} 