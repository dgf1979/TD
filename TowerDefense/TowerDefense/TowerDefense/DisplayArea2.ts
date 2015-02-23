﻿class DisplayArea2 {

    private _game: Phaser.Game;
    private _area: Phaser.Rectangle;
    private _textGroup: Phaser.Group;
    private _marginL: number;
    private _marginR: number;

    private _txtMoney: Phaser.Text;

    // constructor
    constructor(ThisGame: Phaser.Game, UpperLeft: Phaser.Point, LowerRight: Phaser.Point) {
        this._game = ThisGame;
        this._area = new Phaser.Rectangle(UpperLeft.x, UpperLeft.y, LowerRight.x - UpperLeft.x, LowerRight.y - UpperLeft.y);
        this._textGroup = new Phaser.Group(ThisGame);
        this._textGroup.position = UpperLeft;
        this._marginL = 4;
        this._marginR = 4;

        this.setup();  // finish the rest in another function
    }

    private Text(Text: string): Phaser.Text {
        var txt: Phaser.Text = this._game.add.text(0, 0, Text, null);
        // font default
        txt.font = "Lucida Console";
        txt.fontSize = 14;
        txt.fontWeight = "bold";
        // stroke default
        txt.stroke = "#000000";
        txt.strokeThickness = 2;
        txt.fill = "#66ffff";
        // position and alignment default (LEFT)
        txt.position.x = this._marginL;
        txt.align = "left";
        this._textGroup.add(txt);
        return txt;
    }

    private RightAlignedText(Text: string): Phaser.Text {
        var txt: Phaser.Text = this.Text(Text);
        txt.align = "right";
        txt.anchor.set(1, 0);
        txt.position.x = this._area.width - this._marginR;
        txt.fill = "#ffff66";

        return txt;
    }

    // setup the locations and initial text
    private setup() {
        var lblMoney: Phaser.Text = this.Text("MONIES:");
        lblMoney.position.y = 10;

        this._txtMoney = this.RightAlignedText("");
        this._txtMoney.position.y = 10;
    }

    HideAll() {
        this._textGroup.visible = false;
    }

    SetAll(TowerIndex: number) {
        var TowerJSONData: GameObjectClasses.TowerData = TDGame.currentCampaign.TowerStats[TowerIndex];
        var TowerJSONAssets: GameObjectClasses.TowerAssets = TDGame.currentTileset.Towers[TowerIndex];
    }

    set Money(Amount: number) {
        if (Amount < 0) {
            Amount = 0;
        }
        this._txtMoney.text = Amount.toString();
    }

    get Money(): number {
        return parseInt(this._txtMoney.text, 10);
    }

}  