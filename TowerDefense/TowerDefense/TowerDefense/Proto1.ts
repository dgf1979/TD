module TDGame {
    "use strict";
    export class Proto1 extends Phaser.State {

        _background: Phaser.Sprite;
        _tdmap: TDMap;
        _pather: PathHelper;
        _mouseHandler: UI.MouseHandler;

        // run-up
        create() {
            this._background = this.add.sprite(0, 0, "background");

            // set up the map
            this._tdmap = new TDMap(this.game, new Phaser.Point(1, 1), new Phaser.Point(20, 20));


            // use the path wrapper to run the A* pathfinding
            this._pather = new PathHelper(this._tdmap);
            this._pather.AsyncCalculatePath(this._tdmap.CreepSpawn, TDGame.ui.tileSize.x);
            var path: Phaser.Point[];
            if (this._pather.ProcessingComplete) {
                if (this._pather.MapIsWalkable) {
                    path = this._pather.GetPixelPath(TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                    // console.log(this._pather.DebugPathString());
                    // console.log(path);
                    // this._pather.DebugPathDraw(path, this.game);
                } else {
                    alert("No path found!");
                }
            } else {
                alert("Path processiong not complete");
            }

            // handle the mouse
            this._mouseHandler = new UI.MouseHandler(this.game, TDGame.ui);

            // loop waves
            var wave: GameObjectClasses.Wave = currentCampaign.Waves[0];

            // make a creep group
            var creepGroup: Phaser.Group = this.game.add.group();
            creepGroup.name = "creeps";

            // creep factory
            var CF: CreepFactory = new CreepFactory(this.game, wave, creepGroup, path);
            CF.Start();

            // set up info display area
            var towerInfoDisplayArea = new DisplayArea(this.game, TDGame.ui.displayArea1UL, TDGame.ui.displayArea1BR);

            // create menu from avail. towers
            var towerMenu: TowerMenu = new TowerMenu(this.game);

            // subscribe to onselected of tower menu
            var updateTowerDisplay = (TowerIndex: number) => {
                this._mouseHandler.SetSpriteCursor(towerMenu.SelectedSpriteGroup);
                towerInfoDisplayArea.SetAll(TowerIndex);
            };
            towerMenu.ItemSelectedSignal.add(updateTowerDisplay);

            // tower factory
            var TF: TowerFactory = new TowerFactory(this.game, creepGroup);

            // subscribing to grid-click event on mouse.
            var dropTower = (X: number, Y: number) =>
            {
                console.log("ClickSignalXY: " + X + "," + Y);
                TF.PlaceTower(towerMenu.SelectedTowerIndex, new Phaser.Point(X, Y));
                towerMenu.ClearSelectedTower();
                this._mouseHandler.ClearSpriteCursor();
            };
            this._mouseHandler.ClickSignal.add(dropTower);

        }

        update() {
            this._mouseHandler.update(this._tdmap.TileMap);
        }

    }
} 