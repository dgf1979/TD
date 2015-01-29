class Creep extends Phaser.Sprite {
    private _id: string;
    private _payout: number;
    private _velocity: number;
    private _path: Phaser.Point[];

    constructor(ThisGame: Phaser.Game, CreepType: string, StartPath: Phaser.Point[]) {
        super(ThisGame, 0, 0, CreepType, 0);

        this.scale = new Phaser.Point(2, 2);
        this.anchor.setTo(0.5, 0.5);

        this.health = 10;
        this._id = CreepType;
        this._payout = 10;
        this._velocity = 1000;
        this._path = StartPath;

        ThisGame.add.existing(this);

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
            }
        }
    }
}