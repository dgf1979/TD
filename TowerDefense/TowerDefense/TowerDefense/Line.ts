class BitmapLine {

    private _bmd: Phaser.BitmapData;
    private _sprite: Phaser.Sprite;
    private _color: string;
    private _width: number; 

    constructor(ThisGame: Phaser.Game) {
        this._bmd = ThisGame.add.bitmapData(640, 640);
        this._sprite = ThisGame.add.sprite(0, 0, this._bmd);
        this._color = 'green';
        this._width = 5;
    }

    public set Color(value: string) {
        this._color = value;
    }

    public set Width(value: number) {
        this._width = value;
    }

    Draw(From: Phaser.Point, To: Phaser.Point) {
        this._bmd.clear();
        this._bmd.ctx.beginPath();
        this._bmd.ctx.strokeStyle = this._color;
        this._bmd.ctx.fill();
        this._bmd.ctx.lineWidth = this._width;
        this._bmd.ctx.moveTo(From.x, From.y);
        this._bmd.ctx.lineTo(To.x, To.y);
        this._bmd.ctx.stroke();
        this._bmd.ctx.closePath();
        this._bmd.render();
    }

    NoDraw() {
        this._bmd.clear();
    }
} 