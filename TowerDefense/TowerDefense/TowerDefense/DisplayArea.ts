class DisplayArea {

    private _game: Phaser.Game;
    private _area: Phaser.Rectangle;
    private _textGroup: Phaser.Group;
    private _marginL: number;
    private _marginR: number;

    private _txtRange: Phaser.Text;
    private _txtDamage: Phaser.Text;
    private _txtRate: Phaser.Text;
    private _txtName: Phaser.Text;

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
        var lblTurretRange: Phaser.Text = this.Text("RANGE:");
        lblTurretRange.position.y = 40;

        var lblTurretSpeed: Phaser.Text = this.Text("FIRE RATE:");
        lblTurretSpeed.position.y = 60;

        var lblTurretDamage: Phaser.Text = this.Text("DAMAGE");
        lblTurretDamage.position.y = 80;

        this._txtName = this.Text("Undefined");
        this._txtName.align = "center";
        this._txtName.anchor.set(0.5, 0);
        this._txtName.fill = "#ff66ff";
        this._txtName.fontSize = 20;
        this._txtName.position = new Phaser.Point(this._area.halfWidth, 10);

        this._txtRange = this.RightAlignedText("999");
        this._txtRange.position.y = 40;

        this._txtRate = this.RightAlignedText("999");
        this._txtRate.position.y = 60;

        this._txtDamage = this.RightAlignedText("999");
        this._txtDamage.position.y = 80;

    }

    HideAll() {
        this._textGroup.visible = false;
    }

    SetAll(TowerIndex: number) {
        var TowerJSONData: GameObjectClasses.TowerData = TDGame.currentCampaign.TowerStats[TowerIndex];
        var TowerJSONAssets: GameObjectClasses.TowerAssets = TDGame.currentTileset.Towers[TowerIndex];
        this.Name = TowerJSONAssets.Name;
        this.Range = TowerJSONData.Range;
        this.Rate = TowerJSONData.FireRate;
        this.Damage = TowerJSONData.Damage;
    }

    set Range(Range: number) {
        this._txtRange.text = Range.toString();
    }

    set Rate(Rate: number) {
        this._txtRate.text = Rate.toString();
    }

    set Damage(Damage: number) {
        this._txtDamage.text = Damage.toString();
    }

    set Name(TowerType: string) {
        this._txtName.text = TowerType;
    }
     
} 