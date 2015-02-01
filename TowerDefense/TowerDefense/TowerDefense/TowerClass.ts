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
    // private _turretTween: Phaser.Tween;

    constructor(ThisGame: Phaser.Game, TowerID: string, Location: Phaser.Point, CreepGroup: Phaser.Group) {
        this._id = TowerID;
        // texture keys
        this._baseTextureKey = this._id + ".base";
        this._rotatorTextureKey = this._id + ".rotator";
        this._creepList = CreepGroup;
        //load the sprite contructor
        super(ThisGame, Location.x * 64 + 32, Location.y * 64 + 32, this._baseTextureKey, 0);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
        this.Range = 128; // default range
        this._targetCreep = null;
        // optional turret handling
        this._hasTurret = this.game.cache.checkImageKey(this._rotatorTextureKey);
        if (this._hasTurret) {
            this._turret = this.game.add.sprite(this.position.x, this.position.y, this._rotatorTextureKey);
            this._turret.anchor.setTo(0.5, 0.5);
            // this._turretTween = this.game.add.tween(this._turret);
        }
        //laser line
        this._laserLine = new BitmapLine(this.game);        
    }

    // range setter
    public set Range(Dist: number) {
        this._range = new Phaser.Circle(this.position.x, this.position.y, Dist * 2);
    }

    // phaser update loop
    update() {
        // console.log("Living Creeps: " + this._creepList.countLiving());
        // console.log("target: " + this._targetCreep);
        // aquire target
        this.aquireTarget();
        // follow target
        this.trackTarget();
        //shoot target
        this.shootTarget();
    }

    // set the nearest in-range creep as target
    private aquireTarget() {
        //remove out-of-range targets
        if (this._targetCreep !== null) {
            if (this._range.contains(this._targetCreep.x, this._targetCreep.y) && this._targetCreep.alive) {
                return;
            } else {
                this._targetCreep = null;
            }
        } 

        var nearest: Phaser.Sprite;
        var lastDistance: number = this._range.diameter;
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
        if (lastDistance < this._range.radius) {
            console.log("targeting NEW creep: " + nearest.key);
            this._targetCreep = nearest;
        } else {
            this._targetCreep = null;
        }
    }

    // rotate turret to tract targeted creep
    private trackTarget() {
        if (this._hasTurret && this._targetCreep !== null) {
            // calculate angle in degrees between tower and targreted creep
            var lookAtAngle: number = Phaser.Math.angleBetweenPoints(this.position, this._targetCreep.position);
            this._turret.rotation = lookAtAngle;
        }
    }

    // shoot at target
    private shootTarget() {
        if (this._targetCreep !== null || typeof(this._targetCreep) === "undefined") {
            this._laserLine.Draw(this.position, this._targetCreep.position);
        } else {
            this._laserLine.NoDraw();
        }
    }
} 