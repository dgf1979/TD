class Creep extends Phaser.Sprite {
    private _id: string;
    private _payout: number;
    private _velocity: number;
    private _path: Phaser.Point[];
    private _walkTextureKey: string;
    private _dieTextureKey: string;

    constructor(ThisGame: Phaser.Game, CreepType: string, StartPath: Phaser.Point[]) {
        this._walkTextureKey = CreepType + ".walk";
        this._dieTextureKey = CreepType + ".die";

        super(ThisGame, 0, 0, this._walkTextureKey, 0);

        //this.scale = new Phaser.Point(2, 2);
        this.anchor.setTo(0.5, 0.5);

        this.health = 10;
        this._id = CreepType;
        this._payout = 10;
        this._velocity = 300;
        this._path = StartPath;
        this.animations.add('walk');
        this.animations.play('walk',4,true);

        this.game.add.existing(this);

        this.position = this._path[0];
        var lookat = this._path[1];
        this.rotation = Phaser.Point.angle(lookat, this.position);
    }

    // phaser update loop
    update() {
        this.FollowPath(); // movement
    }

    // movement
    private FollowPath() {
        var p: Phaser.Point = this._path[0];
        if (this.position.x === p.x && this.position.y === p.y) {
            if (this._path.length > 1) {
                var nextPos: Phaser.Point = this._path[1];
                var angle: number = Phaser.Point.angle(nextPos, this.position);
                this.rotation = angle;
                this.game.add.tween(this.position).to(nextPos, this._velocity, Phaser.Easing.Linear.None, true);
                this._path.shift();
            } else {
                this.Exit();
            }
        }
    }

    // exit map
    private Exit() {
        var fadeOut: Phaser.Tween = this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        fadeOut.onComplete.add(() => { this.kill; });
    }

    // die
    private Die() {
        // todo: add value to global payout

        this.animations.stop('walk');
        if (!this.game.cache.checkImageKey(this._dieTextureKey)) {
            this.Exit();
        } else {
            var test = this.loadTexture(this._dieTextureKey, 0, true);
            var die_anim = this.animations.add('die');
            die_anim.play(15, false);  // no loop, kill on complete
            this.Exit();
        }
    }
}