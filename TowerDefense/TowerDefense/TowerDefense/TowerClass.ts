class Tower extends Phaser.Sprite {
    private _id: string;
    private _range: Phaser.Circle;
    private _baseTextureKey: string;
    private _rotatorTextureKey: string;
    private _turret: Phaser.Sprite;
    private _hasTurret: boolean;
    private _creepList: Phaser.Group;
    private _targetCreep: Phaser.Sprite;
    private _laserLine: BitmapLine;

    constructor(ThisGame: Phaser.Game, TowerID: string, Location: Phaser.Point, CreepGroup: Phaser.Group) {
        this._id = TowerID;
        this._baseTextureKey = this._id + ".base";
        this._rotatorTextureKey = this._id + ".rotator";
        this._creepList = CreepGroup;
        super(ThisGame, Location.x * 64 + 32, Location.y * 64 + 32, this._baseTextureKey, 0);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        this.Range = 128; // default range
        this._targetCreep = null;
        this._hasTurret = this.game.cache.checkImageKey(this._rotatorTextureKey);

        if (this._hasTurret) {
            this._turret = this.game.add.sprite(this.position.x, this.position.y, this._rotatorTextureKey);
            this._turret.anchor.setTo(0.5, 0.5);
        }

        //laser line
        this._laserLine = new BitmapLine(this.game);        
    }

    public set Range(Dist: number) {
        this._range = new Phaser.Circle(this.position.x, this.position.y, Dist * 2);
    }

    // phaser update loop
    update() {
        // check if the tower has a target within range
        if (this._targetCreep !== null && this._range.contains(this._targetCreep.x, this._targetCreep.y)) {
            console.log("target creep is not null and is in range - clear to shoot");
            // shoooooot iiiiiit!!!  ..or, you kow, get the rotation and draw a line..
            if (this._hasTurret) { this.rotateTurretToTarget(); }
            // pew pew pew!

            // var line: Phaser.Line = new Phaser.Line(this.x, this.y, this._targetCreep.x, this._targetCreep.y);
            // console.log(line.angle);
            this._laserLine.Draw(this.position, this._targetCreep.position);

        } else { // search for the next target
            // console.log("No target creep, or creep is out of range.");
            this._laserLine.NoDraw();
            this._targetCreep = null;
            if (this._creepList.countLiving() > 0) {
                this.targetNearestInRangeCreep();
            }
        }
    }

    // rotate turret to tract targeted creep
    private rotateTurretToTarget() {
        this._turret.rotation = Phaser.Point.angle(this._targetCreep.position, this.position);
    }

    // set the nearest in-range creep as target
    private targetNearestInRangeCreep() {
        var nearest: Phaser.Sprite;
        var lastDistance: number = this._range.diameter;

        // console.log("LIVE CREEPS IN GROUP: " + this._creepList.countLiving()); 
        this._creepList.forEachAlive((creep: Phaser.Sprite) => { // for each live creep on the board
            if (this._range.contains(creep.position.x, creep.position.y)) { // if the creep is in range
                var distance = Phaser.Point.distance(creep.position, this.position); // get distance from creep to tower
                if (distance < lastDistance) {
                    lastDistance = distance; // if the distance to this creep from tower is the lowest so far, save it for the next loop
                    nearest = creep;
                } 
            }
        }, this);

        // now that the loop is complete, set the nearest creep as the tower target
        if (lastDistance < this._range.diameter) {
            console.log("targeting NEW creep: " + nearest.key);
            this._targetCreep = nearest;
        } else {
            console.log("No creeps in range");
        }
    }
} 