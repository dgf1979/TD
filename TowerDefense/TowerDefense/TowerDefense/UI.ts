module UI {
    "use strict";
    export class Positioning {
        tileSize: Phaser.Point = new Phaser.Point(32, 32);
        screenSize: Phaser.Point = new Phaser.Point(1024, 768);
        playAreaUL: Phaser.Point = new Phaser.Point(32, 32);
        playAreaTiles: Phaser.Point = new Phaser.Point(22, 22);
        iconAreaUL: Phaser.Point = new Phaser.Point(768, 32);

        towerTilesUL: Phaser.Point[] = [
            new Phaser.Point(784, 48), 
            new Phaser.Point(832, 48),
            new Phaser.Point(880, 48),
            new Phaser.Point(928, 48),
            new Phaser.Point(784, 96),
            new Phaser.Point(832, 96),
            new Phaser.Point(880, 96),
            new Phaser.Point(928, 96)
        ];

        displayArea1UL: Phaser.Point = new Phaser.Point(784, 160);
        displayArea1BR: Phaser.Point = new Phaser.Point(959, 319);

        displayArea2UL: Phaser.Point = new Phaser.Point(784, 336);
        displayArea2BR: Phaser.Point = new Phaser.Point(959, 495);
    }

    export class MouseHandler {

        private _game: Phaser.Game;
        private _playarea: Phaser.Rectangle;

        private _cursor: Phaser.Graphics;

        constructor(ThisGame: Phaser.Game, UIPosition: UI.Positioning) {
            this._game = ThisGame;
            this._playarea = new Phaser.Rectangle(UIPosition.playAreaUL.x,
                UIPosition.playAreaUL.y,
                UIPosition.tileSize.x * UIPosition.playAreaTiles.x,
                UIPosition.tileSize.y * UIPosition.playAreaTiles.y);

            this._cursor = ThisGame.add.graphics(0, 0);
            this._cursor.visible = false;
            this._cursor.lineStyle(2, Phaser.Color.getColor(255,0,0), 0.8);
            this._cursor.beginFill(Phaser.Color.getColor(255, 0, 0), 0.5);
            this._cursor.drawRect(0, 0, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
            this._cursor.endFill();
        }

        update(PlayArea: Phaser.Tilemap) {
            var mouse: Phaser.Pointer = this._game.input.mousePointer;

            if (this._playarea.contains(mouse.position.x, mouse.position.y)) {
                var currentTile: Phaser.Tile = PlayArea.getTileWorldXY(mouse.position.x, mouse.position.y, null, null, 1);
                if (currentTile !== null) {
                    this._cursor.position = new Phaser.Point(currentTile.worldX, currentTile.worldY);
                    this._cursor.visible = true;
                } else {
                    this._cursor.visible = false;
                }
            }
        }
    }
} 