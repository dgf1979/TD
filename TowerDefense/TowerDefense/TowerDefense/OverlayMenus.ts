module TDGame {

    export class OverlayMenus {

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
            this._screenOverlay = Game.add.image(0,0, screenOverlay.generateTexture(1, PIXI.scaleModes.DEFAULT, null));
            this._screenOverlay.visible = false; //invisible by default
        }

        ShowQuitMenu() {
            this._screenOverlay.visible = true;
            this._screenOverlay.inputEnabled = true;
            this._screenOverlay.events.onInputUp.addOnce(() => { this.HideQuitMenu() });
            this._screenOverlay.game.world.bringToTop(this._screenOverlay); // force top (last) in drawing order
        }

        HideQuitMenu() {
            this._screenOverlay.visible = false;
            this._screenOverlay.inputEnabled = false;
        }

    }
} 