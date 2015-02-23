module TDGame {
    "use strict";
    export class Proto1 extends Phaser.State {

        _background: Phaser.Sprite;
        _tdmap: TDMap;
        _mouseHandler: UI.MouseHandler;

        // run-up
        create() {
            this._background = this.add.sprite(0, 0, "background");

            // set up the map
            this._tdmap = new TDMap(this.game);

            // handle the mouse
            this._mouseHandler = new UI.MouseHandler(this.game, TDGame.ui);

            // loop waves
            var wave: GameObjectClasses.Wave = currentCampaign.Waves[0];

            // make a creep group
            var creepGroup: Phaser.Group = this.game.add.group();
            creepGroup.name = "creeps";

            // creep factory
            var CF: CreepFactory = new CreepFactory(this.game, wave, creepGroup, this._tdmap);
            CF.Start();

            // subscribe to creep factory's bubble-through of creep death signal
            CF.SignalCreepKilled.add((value: number) => { statsInfoDisplayArea.Money = (value + statsInfoDisplayArea.Money); });

            // set up info display area
            var towerInfoDisplayArea = new DisplayArea(this.game, TDGame.ui.displayArea1UL, TDGame.ui.displayArea1BR);
            var statsInfoDisplayArea = new DisplayArea2(this.game, TDGame.ui.displayArea2UL, TDGame.ui.displayArea2BR);
            statsInfoDisplayArea.Money = 29; // demo starting money

            // create menu from avail. towers
            var towerMenu: TowerMenu = new TowerMenu(this.game);

            // subscribe to onselected of tower menu
            var updateTowerDisplay = (TowerIndex: number) => {
                var towerCost = TDGame.currentCampaign.TowerStats[TowerIndex].Cost;
                if (towerCost <= statsInfoDisplayArea.Money) {
                    towerInfoDisplayArea.SetAll(TowerIndex);
                    this._mouseHandler.SetSpriteCursor(towerMenu.SelectedSpriteGroup);
                    this._mouseHandler.SetRangeFinder(TDGame.currentCampaign.TowerStats[TowerIndex].Range);
                } else {
                    console.log("Not enough money!");
                    console.log("Tower Cost: " + towerCost);
                    console.log("Money Avail: " + statsInfoDisplayArea.Money);
                    towerMenu.ClearSelectedTower();
                }
            };
            towerMenu.ItemSelectedSignal.add(updateTowerDisplay);

            // tower factory
            var TF: TowerFactory = new TowerFactory(this.game, creepGroup, this._tdmap);

            // subscript to tower-dropped on tower factory
            var towerDropped = () => {
                var towerCost = TDGame.currentCampaign.TowerStats[towerMenu.SelectedTowerIndex].Cost;
                statsInfoDisplayArea.Money = (statsInfoDisplayArea.Money - towerCost); //subtract money
                towerMenu.ClearSelectedTower();
                this._mouseHandler.ClearSpriteCursor();
            }
            TF.SignalTowerDropped.add(towerDropped);

            // subscribing to grid-click event on mouse.
            var dropTower = (X: number, Y: number, tileX: number, tileY: number) =>
            {
                console.log("ClickSignalXY: " + X + "," + Y + "; (TileXY: " + tileX + "," + tileY + ")");               
                TF.PlaceTower(towerMenu.SelectedTowerIndex, new Phaser.Point(X, Y));                
            };
            this._mouseHandler.ClickSignal.add(dropTower);          

        }

        update() {
            this._mouseHandler.update(this._tdmap.TileMap);
        }

    }
} 