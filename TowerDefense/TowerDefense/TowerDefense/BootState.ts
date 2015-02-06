module TDGame {
    // BOOT STATE
    export class BootState extends Phaser.State {

        preload() {
            console.log("Boot:preload()");
            this.load.image('progbar', 'img/loader.png');
        }

        create() {
            console.log("Boot:create()");
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                // todo
            }

            this.game.state.start('StartMenu', true, false);

            // Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        }
    }

    //PRELOAD STATE
    export class PreloadState extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            console.log("Preload:preload()");
            this.preloadBar = this.add.sprite(200, 250, 'progbar');
            this.load.setPreloadSprite(this.preloadBar);

            this.load.image('debugTile', 'img/32x32.png');

        }

        create() {
            console.log("Preload:create()");
            var tween: Phaser.Tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(() => this.game.state.start('Proto1', true, false));
            tween.onComplete.add(() => this.game.state.start('StartMenu', true, false));
        }

    }
} 