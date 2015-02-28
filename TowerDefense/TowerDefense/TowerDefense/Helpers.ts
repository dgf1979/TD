module Helper {
    "use strict";
    // init a 2D array of a given size with a given starting value
    export function Array2D(X: number, Y: number, DefaultValue: number): number[][] {
        var a: number[][] = new Array([]);
        for (var y = 0; y < Y; y++) {
            a.push([]);
            for (var x = 0; x < X; x++) {
                a[y].push(DefaultValue);
            }
        }
        return a;
    }

    // debugging text writer
    export function WriteDebugText(Text: string, CurrentGame: Phaser.Game, AtCanvasX: number, AtCanvasY: number) {
        var style: PIXI.TextStyle = { fill: "blue", font: "bold 12px Arial" };
        var txt = CurrentGame.add.text(AtCanvasX, AtCanvasY, Text, style);
        txt.anchor.set(0.5, 0.5);
    }

    export function CreateUpdateableDebugText(Text: string, CurrentGame: Phaser.Game, AtCanvasX: number, AtCanvasY: number): Phaser.Text {
        var style: PIXI.TextStyle = { fill: "blue", font: "bold 12px Arial" };
        var txt = CurrentGame.add.text(AtCanvasX, AtCanvasY, Text, style);
        txt.anchor.set(0.5, 0.5);
        return txt;
    }

    // convert pixel location to tile location
    export function PixelToTile(PixelPostion: Phaser.Point): Phaser.Point {
        var x, y: number;
        x = Phaser.Math.snapToFloor(PixelPostion.x, TDGame.Globals.Settings.TileSize.x) / TDGame.Globals.Settings.TileSize.x;
        y = Phaser.Math.snapToFloor(PixelPostion.y, TDGame.Globals.Settings.TileSize.y) / TDGame.Globals.Settings.TileSize.y;
        return new Phaser.Point(x, y);
    }

    // conver tile to pixel (upper left corner)
    export function TileToPixelUpperLeft(TilePosition: Phaser.Point): Phaser.Point {
        return new Phaser.Point(TilePosition.x * TDGame.Globals.Settings.TileSize.x, TilePosition.y * TDGame.Globals.Settings.TileSize.y);
    }

    // convert the center of a tile ot pixel
    export function TileCenterToPixel(TilePosition: Phaser.Point): Phaser.Point {
        return new Phaser.Point(TilePosition.x * TDGame.Globals.Settings.TileSize.x + TDGame.Globals.Settings.TileSize.x /2,
            TilePosition.y * TDGame.Globals.Settings.TileSize.y + TDGame.Globals.Settings.TileSize.y / 2);
    }
}
