module TDGame {
    "use strict";
    export class Proto1 extends Phaser.State {

        private _campaign: Campaign;
        private _creepFactory: CreepFactory;

        // run-up
        create() {
            // set up UI
            TDGame.Globals.UI = new TDGame.UI(this.game);
            TDGame.Globals.UI.DisplayAreas.GameInfo.Money = 29; // demo money setup

            // load campaign
            this._campaign = new Campaign(this.game);

            // loop waves
            var wave: GameObjectClasses.Wave = TDGame.Globals.CampaignJSON.Waves[0];

            // make a creep group
            var creepGroup: Phaser.Group = this.game.add.group();
            creepGroup.name = "creeps";

            // creep factory
            this._creepFactory = new CreepFactory(this.game, wave, creepGroup, this._campaign.Map);

            // subscribe to creep factory's bubble-through of creep death signal
            this._creepFactory.SignalCreepKilled.add((value: number) => {
                TDGame.Globals.UI.DisplayAreas.GameInfo.Money = (value + TDGame.Globals.UI.DisplayAreas.GameInfo.Money);
            });


            // tower factory
            var TF: TowerFactory = new TowerFactory(this.game, creepGroup, this._campaign.Map);

            // subscript to tower-dropped on tower factory
            var towerDropped = () => {
                var towerCost = TDGame.Globals.CampaignJSON.TowerStats[TDGame.Globals.UI.TowerMenu.SelectedTowerIndex].Cost;
                TDGame.Globals.UI.DisplayAreas.GameInfo.Money = (TDGame.Globals.UI.DisplayAreas.GameInfo.Money - towerCost); // subtract money
                TDGame.Globals.UI.TowerMenu.ClearSelectedTower();
                TDGame.Globals.UI.Input.ClearSpriteCursor();
            }
            TF.SignalTowerDropped.add(towerDropped);

            // subscribing to grid-click event on mouse.
            var dropTower = (X: number, Y: number, tileX: number, tileY: number) =>
            {
                console.log("ClickSignalXY: " + X + "," + Y + "; (TileXY: " + tileX + "," + tileY + ")");               
                TF.PlaceTower(TDGame.Globals.UI.TowerMenu.SelectedTowerIndex, new Phaser.Point(X, Y));                
            };
            TDGame.Globals.UI.Input.SignalGridClicked.add(dropTower);

            TDGame.Globals.UI.Buttons.StartButton.onInputUp.addOnce(() => this.start());
        }

        // begin the game
        start() {
            this._creepFactory.Start();
        }

        // pause the game
        pause() {
            // this._campaign.Pause();
        }

        // game over - won
        gameWon() {

        }

        // game over - lost
        gameLost() {

        }

        update() {
            this._campaign.Update();
            TDGame.Globals.UI.Update(this._campaign.Map.TileMap);
        }

    }
} 