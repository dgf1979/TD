module Input {

    // pointer control and cursor handling
    export class MouseHandler {
        // signals
        SignalGridClicked: Phaser.Signal = new Phaser.Signal();
        // vars
        private _game: Phaser.Game;
        private _playarea: Phaser.Rectangle;
        private _debugText: Phaser.Text;
        private _isBlocked: boolean;
        private _cursorSpriteGroup: Phaser.Group;
        private _cursor: Phaser.Graphics;
        private _cursorRangeFinder: Phaser.Graphics;

        constructor(ThisGame: Phaser.Game, PlayAreaUL, PlayAreaTiles, TileSize) {
            this._game = ThisGame;
            this._playarea = new Phaser.Rectangle(PlayAreaUL.x,
                PlayAreaUL.y,
                TileSize.x * PlayAreaTiles.x,
                TileSize.y * PlayAreaTiles.y);
            // cursor
            this._cursor = ThisGame.add.graphics(0, 0);
            this._cursor.visible = false;
            this._cursor.lineStyle(2, 0xffffff, 0.50);
            this._cursor.beginFill(0xffffff, 0.25);
            this._cursor.drawRect(0, 0, TileSize.x, TileSize.y);
            this._cursor.endFill();

            // rangefinder (circle)
            this._cursorRangeFinder = this._game.add.graphics(0, 0);
            this._cursorRangeFinder.lineStyle(2, 0xff0000, 0.2);
            this._cursorRangeFinder.visible = false;

            this._debugText = Helper.CreateUpdateableDebugText("",
                this._game, 900,
                700);

            var clicked = this.gridClicked();
            this._game.input.onDown.add(clicked);
        }

        private gridClicked() {
            return () => {
                var xpos: number = this._game.input.activePointer.position.x;
                var ypos: number = this._game.input.activePointer.position.y;
                if (this._playarea.contains(xpos, ypos)) {
                    var x, y: number;
                    x = Phaser.Math.snapToFloor(xpos, TDGame.Globals.Settings.TileSize.x);
                    y = Phaser.Math.snapToFloor(ypos, TDGame.Globals.Settings.TileSize.y);
                    // only register click if the tile isn't blocked
                    if (!this._isBlocked) {
                        var tileX, tileY: number;
                        tileX = x / TDGame.Globals.Settings.TileSize.x;
                        tileY = y / TDGame.Globals.Settings.TileSize.y;
                        this.SignalGridClicked.dispatch(x, y, tileX, tileY);
                    }
                }
            }
        }

        // set a sprite group as a cursor
        SetSpriteCursor(SpriteGroup: Phaser.Group) {
            var internal: Phaser.Group;
            internal = SpriteGroup;
            this._cursorSpriteGroup = internal;
            // console.log("sprite cursor set to: " + internal.name + " at " + internal.position); 
        }

        // clear a sprite group as a cursor
        ClearSpriteCursor() {
            if (this._cursorSpriteGroup) {
                this._cursorSpriteGroup.position.set(0, 0);
                this._cursorSpriteGroup.visible = false;
                this._cursorSpriteGroup = null;
            }
        }

        // set rangefinder
        SetRangeFinder(Range: number) {
            this._cursorRangeFinder.drawCircle(TDGame.Globals.Settings.TileSize.x / 2, TDGame.Globals.Settings.TileSize.y / 2, Range * 2);
            this._cursorRangeFinder.visible = true;
        }

        Update(PlayArea: Phaser.Tilemap) {
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
                    x = Phaser.Math.snapToFloor(mouse.position.x, TDGame.Globals.Settings.TileSize.x);
                    y = Phaser.Math.snapToFloor(mouse.position.y, TDGame.Globals.Settings.TileSize.y);
                    var currentXY: Phaser.Point = new Phaser.Point(x, y);
                    this._cursor.position = currentXY;
                    this._cursor.tint = 0x00ff00;
                    if (this._cursorSpriteGroup) {
                        this._cursorSpriteGroup.position = currentXY;
                        this._cursorSpriteGroup.visible = true;
                        // console.log("SpriteCursor at: " + this._cursorSpriteGroup.position);
                        this._cursorRangeFinder.position = currentXY;
                    }
                    this._isBlocked = false;
                }
                this._cursor.visible = true;
            } else {
                this._cursor.visible = false;
                if (this._cursorSpriteGroup) { this._cursorSpriteGroup.visible = false; }
                this._debugText.text = "";
            }
            if (this._cursorSpriteGroup) {
                this._cursorRangeFinder.visible = this._cursorSpriteGroup.visible;
            } else {
                this._cursorRangeFinder.visible = false;
            }
        }
    } 
}
