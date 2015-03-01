module TDGame {
    "use strict";

    // collector for UI elements
    export class UI {
        Buttons: uiButtons;
        DisplayAreas: uiDisplayAreas;
        TowerMenu: TowerMenu;
        Input: Input.MouseHandler;
        
        constructor(Game: Phaser.Game) {
            // add the background
            Game.add.sprite(0, 0, "background");
            // set public UI
            this.DisplayAreas = new uiDisplayAreas(Game);
            this.TowerMenu = new TowerMenu(Game);
            this.Buttons = new uiButtons(Game);
            // handle the mouse
            this.Input = new Input.MouseHandler(Game,
                Globals.Settings.PlayAreaUL,
                Globals.Settings.PlayAreaTiles,
                Globals.Settings.TileSize);

            // event subscriptions
            this.TowerMenu.SignalItemSelected.add((TowerIndex: number) => this.reactToMenuItemSelected(TowerIndex));
        }

        Update(TileMap: Phaser.Tilemap) {
            this.Input.Update(TileMap);
        }

        // tower menu item selected
        reactToMenuItemSelected(TowerIndex: number) {
            var towerCost = TDGame.Globals.CampaignJSON.TowerStats[TowerIndex].Cost;
            this.DisplayAreas.TowerInfo.SetAll(TowerIndex);
            if (towerCost <= this.DisplayAreas.GameInfo.Money) {
                this.Input.SetSpriteCursor(this.TowerMenu.SelectedSpriteGroup);
                this.Input.SetRangeFinder(TDGame.Globals.CampaignJSON.TowerStats[TowerIndex].Range);
            } else {
                console.log("Not enough money!");
                console.log("Tower Cost: " + towerCost);
                console.log("Money Avail: " + this.DisplayAreas.GameInfo.Money);
                this.TowerMenu.ClearSelectedTower();
            }
        }

    }

    // buttons
    export class uiButtons {
        private _game: Phaser.Game;
        StartButton: Phaser.Button;
        PauseButton: Phaser.Button;
        ResumeButton: Phaser.Button;
        // signals

        // constructor
        constructor(Game: Phaser.Game) {
            this._game = Game;

            // add start button
            this.StartButton = MakeButton(Game, "Start", new Phaser.Point(32, 688));

            // add pause button
            this.PauseButton = MakeButton(Game, "Pause", new Phaser.Point(128, 688));

            // add resume button
            this.ResumeButton = MakeButton(Game, "Resume", this.PauseButton.position);
            this.ResumeButton.visible = false;
        }

        // start button state control
        StartButtonState(Enable: boolean) {
            if (Enable) {
                this.StartButton.tint = parseInt("ffffff", 16);
                this.StartButton.inputEnabled = true;
            } else {
                this.StartButton.tint = parseInt("404040", 16);
                this.StartButton.inputEnabled = false;
            }
        }

        // pause button state control
        PauseButtonToggle(SetToResume: boolean) {
            if (SetToResume) {
                this.PauseButton.visible = false;
                this.PauseButton.inputEnabled = false;
                this.ResumeButton.visible = true;
                this.ResumeButton.inputEnabled = true;
            } else {
                this.ResumeButton.visible = false;
                this.ResumeButton.inputEnabled = false;
                this.PauseButton.visible = true;
                this.PauseButton.inputEnabled = true;
            }
        }
    }

    // info display areas
    export class uiDisplayAreas {
        TowerInfo: DisplayArea;
        GameInfo: DisplayArea2;

        constructor(Game: Phaser.Game) {
            var displayArea1UL: Phaser.Point = new Phaser.Point(784, 160);
            var displayArea1BR: Phaser.Point = new Phaser.Point(959, 319);
            this.TowerInfo = new DisplayArea(Game, displayArea1UL, displayArea1BR);

            var displayArea2UL: Phaser.Point = new Phaser.Point(784, 336);
            var displayArea2BR: Phaser.Point = new Phaser.Point(959, 495); 
            this.GameInfo = new DisplayArea2(Game, displayArea2UL, displayArea2BR);
        }
    }

    // generate buttons dynamically using generated bitmaps
    function MakeButton(Game: Phaser.Game, ButtonText: string, Position: Phaser.Point): Phaser.Button {
        var style: {};
        var txt: Phaser.Text = new Phaser.Text(Game, 0, 0, ButtonText, style);
        txt.font = "Lucida Console";
        txt.fontSize = 18;
        txt.fontWeight = "bold";
        txt.stroke = "#000000";
        txt.strokeThickness = 3;
        txt.fill = "#ffffff";
        txt.align = "left";
        txt.anchor.set(0.5, 0.5);
        // generate button width from text width plus some margin buffer
        var buttonWidth = txt.width + 8;
        var buttonHeight = txt.height;
        console.log("button HxW: " + buttonHeight + "x" + buttonWidth);
        // create some bitmap data to serve as background
        var bmd: Phaser.BitmapData = new Phaser.BitmapData(Game, "btn_" + ButtonText, buttonWidth, buttonHeight);
        bmd.ctx.fillStyle = "#404040";
        bmd.ctx.beginPath();
        bmd.ctx.fillRect(0, 0, buttonWidth, buttonHeight);
        bmd.ctx.closePath();
        var grd = bmd.ctx.createLinearGradient(0, 0, buttonWidth, buttonHeight);
        grd.addColorStop(0, "black");
        grd.addColorStop(1, "#808080");
        bmd.ctx.fillStyle = grd;
        bmd.ctx.beginPath();
        bmd.ctx.fillRect(2, 2, buttonWidth - 4, buttonHeight - 4);
        bmd.ctx.closePath();
        // add text
        txt.position = new Phaser.Point(buttonWidth / 2, buttonHeight / 2 + 3); // seems arbitrary, unsure why adjusments are needed.
        bmd.draw(txt);
        console.log("bitmap key name: " + bmd.key);
        // create the button and return it
        var button: Phaser.Button = Game.add.button(Position.x, Position.y);
        button.setTexture(bmd.texture);  // add button texture
        return button;
    } 
} 