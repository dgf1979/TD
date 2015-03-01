module TDGame {
    "use strict";
    export class Proto1 extends Phaser.State {

        private _campaign: Campaign;
        private _creepFactory: CreepFactory;

        // run-up
        create() {
            // set up UI
            var UI = new TDGame.UI(this.game);
            UI.DisplayAreas.GameInfo.Money = 29; // demo money setup

            // load campaign
            this._campaign = new Campaign(this.game, UI);

            // creep factory
            this._creepFactory = new CreepFactory(this.game, this._campaign.Map);

            // subscribe to wave's signal to deploy creeps
            var deployCreeps = (Wave: GameObjectClasses.Wave) => {
                this._creepFactory.DeployCreeps(Wave);
            }
            this._campaign.WaveMgr.SignalDeployCreeps.add(deployCreeps);

            // subscribe to creep factory's bubble-through of creep death signal
            this._creepFactory.SignalCreepKilled.add((value: number) => {
               UI.DisplayAreas.GameInfo.Money = (value + UI.DisplayAreas.GameInfo.Money);
            });

            // tower factory
            var TF: TowerFactory = new TowerFactory(this.game, this._creepFactory.CreepGroup, this._campaign.Map);

            // subscripe to tower-dropped on tower factory
            var towerDropped = () => {
                var towerCost = TDGame.Globals.CampaignJSON.TowerStats[UI.TowerMenu.SelectedTowerIndex].Cost;
                UI.DisplayAreas.GameInfo.Money = (UI.DisplayAreas.GameInfo.Money - towerCost); // subtract money
                UI.TowerMenu.ClearSelectedTower();
                UI.Input.ClearSpriteCursor();
            };
            TF.SignalTowerDropped.add(towerDropped);

            // subscribing to grid-click event on mouse.
            var dropTower = (X: number, Y: number, tileX: number, tileY: number) =>
            {
                console.log("ClickSignalXY: " + X + "," + Y + "; (TileXY: " + tileX + "," + tileY + ")");               
                TF.PlaceTower(UI.TowerMenu.SelectedTowerIndex, new Phaser.Point(X, Y));                
            };
            UI.Input.SignalGridClicked.add(dropTower);

            UI.Buttons.StartButton.onInputUp.addOnce(() => this.start());

            UI.Buttons.PauseButton.onInputUp.add(() => this.pause());
        }

        // begin the game
        start() {
            this._campaign.Start();
        }

        // pause the game
        pause() {
            this._campaign.Pause();
        }

        // game over - won
        gameWon() {

        }

        // game over - lost
        gameLost() {

        }

        update() {
            this._campaign.Update();
        }

    }
} 