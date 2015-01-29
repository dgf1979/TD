module Helper {
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

    // extremely basic vector2 implementation
    // effectively a struct (does TS have an emulation for structs? research later)
    // to contain a node, or a lazy Vector2
    export class Vector2 {
        private _x: number;
        private _y: number;

        constructor(X: number, Y: number) {
            this._x = X;
            this._y = Y;
        }
        // accessors
        get X(): number { return this._x; }
        get Y(): number { return this._y; }
    }

    // debugging text writer
    export function WriteDebugText(Text: string, CurrentGame: Phaser.Game, AtCanvasX: number, AtCanvasY: number) {
        var style: PIXI.TextStyle = { fill: "blue" };
        var txt = CurrentGame.add.text(AtCanvasX, AtCanvasY, Text, style);
        txt.anchor.set(0.5, 0.5);
    }

    // scaling enum
    export enum Scaler {
        x16 = 4,
        x32 = 2,
        x64 = 1
    };
} 