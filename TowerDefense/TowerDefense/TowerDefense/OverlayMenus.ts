module TDGame {

    export class OverlayMenus {
        // public menus
        PauseQuit: PauseMenu;

        constructor(Game: Phaser.Game) {
            this.PauseQuit = new PauseMenu(Game);
        }
    }

    // full screen semi-transparent overlay that prevents clicking-under by enabling input on the image
    export class FullScreenOverlay {
        private _screenOverlay: Phaser.Image;

        constructor(Game: Phaser.Game) {
            // config a full-screen graphics object to act as the overaly
            var screenOverlay = new Phaser.Graphics(Game, 0, 0);
            screenOverlay.beginFill(parseInt("007f7f", 16), 0.7);
            screenOverlay.drawRect(0, 0,
                TDGame.Globals.Settings.ScreenSize.x,
                TDGame.Globals.Settings.ScreenSize.y);
            screenOverlay.endFill();
            // add the overaly to the game as an image
            this._screenOverlay = Game.add.image(0, 0, screenOverlay.generateTexture(1, PIXI.scaleModes.DEFAULT, null));
            this._screenOverlay.visible = false; //invisible by default
        }

        Enable() {
            this._screenOverlay.visible = true;
            this._screenOverlay.inputEnabled = true;
            // this._screenOverlay.events.onInputUp.addOnce(() => { this.HideQuitMenu() });
            this._screenOverlay.game.world.bringToTop(this._screenOverlay); // force top (last) in drawing order
        }

        Disable() {
            this._screenOverlay.visible = false;
            this._screenOverlay.inputEnabled = false;
        }
    }

    export class TextMenu {

        private _game: Phaser.Game;
        private _menuItems: Phaser.Group;
        private _style: Object;
        private _itemSpacing: number;
        private _overTween: Phaser.Tween;

        //Signal
        SignalItemClicked: Phaser.Signal = new Phaser.Signal();

        constructor(Game: Phaser.Game) {
            this._game = Game;
            this._menuItems = new Phaser.Group(Game);
            this._style = { font: "48px Arial", fill: "white", align: "center" };
            this._itemSpacing = 64;
        }

        AddItem(MenuItemText: string) {
            var center = this._game.world.centerX;
            var top = this._menuItems.total * this._itemSpacing + Math.round(TDGame.Globals.Settings.ScreenSize.y / 4);

            var item: Phaser.Text = new Phaser.Text(this._game, center, top, MenuItemText, this._style);
            item.buttonMode = true;
            item.anchor.set(0.5, 0.5);
            item.inputEnabled = true;
            item.stroke = "#000000";
            item.strokeThickness = 4;
            // item.addColor("white", 1);
            item.events.onInputOver.add(function () { this.menuItemOnMouseOver(item); }, this);
            item.events.onInputOut.add(() => this.menuItemOnMouseOut(item), this);
            item.events.onInputDown.add(() => this.menuItemOnMouseClick(item), this);

            // this._overTween = this._game.add.tween(item).to({ scale: new Phaser.Point(1.25, 1.25) }, 1000, Phaser.Easing.Exponential.InOut, true, -1, 1000, true);
            // this._overTween.pause();

            this._game.add.existing(item);
            this._menuItems.add(item);
            this._menuItems.visible = false;
        }

        Show() {
            this._menuItems.visible = true;
            this._game.world.bringToTop(this._menuItems);
        }

        Hide() {
            this._menuItems.visible = false;
        }

        private menuItemOnMouseOver(menuItem: Phaser.Text) {
            menuItem.scale = new Phaser.Point(1.25, 1.25);
            // this._overTween.target = menuItem;
            // this._overTween.resume();
        }

        private menuItemOnMouseOut(menuItem: Phaser.Text) {
            // this._overTween.pause();
            menuItem.scale = new Phaser.Point(1.0, 1.0);
        }

        private menuItemOnMouseClick(menuItem: Phaser.Text) {
            this.SignalItemClicked.dispatch(menuItem.text);
        }


    }
    
    // Pause/Quit menu
    export class PauseMenu extends TextMenu {

        private _overlay: FullScreenOverlay;

        // Signals
        SignalResume: Phaser.Signal = new Phaser.Signal();
        SignalRestart: Phaser.Signal = new Phaser.Signal();
        SignalQuit: Phaser.Signal = new Phaser.Signal();

        constructor(Game: Phaser.Game) {
            super(Game);
            this._overlay = new FullScreenOverlay(Game);

            this.AddItem("RESUME");
            this.AddItem("RESTART");
            this.AddItem("QUIT");

            // subscribe to general click event on base class, fire more specific event for each.
            this.SignalItemClicked.add((buttonText: string) => {
                switch (buttonText) {
                    case "RESUME":
                        this.SignalResume.dispatch();
                        break;
                    case "RESTART":
                        this.SignalRestart.dispatch();
                        break;
                    case "QUIT":
                        this.SignalQuit.dispatch();
                        break;
                    default:
                        alert("no click handler for this menu item defined");
                }
            });
        }

        Show() {
            this._overlay.Enable();
            super.Show();
        }

        Hide() {
            super.Hide();
            this._overlay.Disable();
        }
    } 
} 