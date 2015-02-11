module UI {
    "use strict";
    export class Positioning {
        tileSize: Phaser.Point = new Phaser.Point(32, 32);
        screenSize: Phaser.Point = new Phaser.Point(1024, 768);
        playAreaUL: Phaser.Point = new Phaser.Point(32, 32);
        playAreaTiles: Phaser.Point = new Phaser.Point(22, 20);
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

    // pointer control and cursor handling
    export class MouseHandler {
        // signals
        ClickSignal: Phaser.Signal = new Phaser.Signal();
        // vars
        private _game: Phaser.Game;
        private _playarea: Phaser.Rectangle;
        private _debugText: Phaser.Text;
        private _isBlocked: boolean;
        private _cursorSpriteGroup: Phaser.Group;
        private _cursor: Phaser.Graphics;

        constructor(ThisGame: Phaser.Game, UIPosition: UI.Positioning) {
            this._game = ThisGame;
            this._playarea = new Phaser.Rectangle(UIPosition.playAreaUL.x,
                UIPosition.playAreaUL.y,
                UIPosition.tileSize.x * UIPosition.playAreaTiles.x,
                UIPosition.tileSize.y * UIPosition.playAreaTiles.y);

            this._cursor = ThisGame.add.graphics(0, 0);
            this._cursor.visible = false;
            this._cursor.lineStyle(2,0xffffff, 0.50);
            this._cursor.beginFill(0xffffff, 0.25);
            this._cursor.drawRect(0, 0, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
            this._cursor.endFill();

            this._debugText = Helper.CreateUpdateableDebugText("",
                this._game, TDGame.ui.screenSize.x - 128,
                TDGame.ui.screenSize.y - 64);

            var clicked = this.gridClicked();
            this._game.input.onDown.add(clicked);
        }

        private gridClicked() {
            return () => {
                var xpos: number = this._game.input.activePointer.position.x;
                var ypos: number = this._game.input.activePointer.position.y;
                if (this._playarea.contains(xpos, ypos)) {
                    var x, y: number;
                    x = Phaser.Math.snapToFloor(xpos, TDGame.ui.tileSize.x);
                    y = Phaser.Math.snapToFloor(ypos, TDGame.ui.tileSize.y);
                    // only register click if the tile isn't blocked
                    if (!this._isBlocked) {
                        this.ClickSignal.dispatch(x, y);
                    }
                }
            }
        }

        // set a sprite group as a cursor
        SetSpriteCursor(SpriteGroup: Phaser.Group) {
            var internal: Phaser.Group;
            internal = SpriteGroup;
            this._cursorSpriteGroup = internal;
            console.log("sprite cursor set to: " + internal.name + " at " + internal.position); 
        }

        // clear a sprite group as a cursor
        ClearSpriteCursor() {
            if (this._cursorSpriteGroup) {
                this._cursorSpriteGroup.position.set(0, 0);
                this._cursorSpriteGroup.visible = false;
                this._cursorSpriteGroup = null;
            }
        }

        update(PlayArea: Phaser.Tilemap) {
            var mouse: Phaser.Pointer = this._game.input.mousePointer;
            if (this._playarea.contains(mouse.position.x, mouse.position.y)) {
                this._debugText.text = "Tracking Mouse at: " + mouse.position.x + "," + mouse.position.y;
                var currentTile: Phaser.Tile = PlayArea.getTileWorldXY(mouse.position.x, mouse.position.y);
                if (currentTile !== null) {
                    var currentXY: Phaser.Point = new Phaser.Point(currentTile.worldX, currentTile.worldY);
                    this._cursor.position = currentXY;
                    this._cursor.tint = 0xff0000;
                    if (this._cursorSpriteGroup) {
                        this._cursorSpriteGroup.visible = false;
                    }
                    this._isBlocked = true;
                } else {
                    var x, y: number;
                    x = Phaser.Math.snapToFloor(mouse.position.x, TDGame.ui.tileSize.x);
                    y = Phaser.Math.snapToFloor(mouse.position.y, TDGame.ui.tileSize.y);
                    var currentXY: Phaser.Point = new Phaser.Point(x, y);
                    this._cursor.position = currentXY;
                    this._cursor.tint = 0x00ff00;
                    if (this._cursorSpriteGroup) {
                        this._cursorSpriteGroup.position = currentXY;    
                        this._cursorSpriteGroup.visible = true;
                        console.log("SpriteCursor at: " + this._cursorSpriteGroup.position);
                    }
                    this._isBlocked = false;
                }   
                this._cursor.visible = true;
            } else {
                this._cursor.visible = false;
                if(this._cursorSpriteGroup) { this._cursorSpriteGroup.visible = false; }
                this._debugText.text = "";
            }

        }
    }
} 