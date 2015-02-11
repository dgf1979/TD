class Tower extends Phaser.Group {
    private _name: string;
    private _range: Phaser.Circle;
    private _baseTextureKey: string;
    private _rotatorTextureKey: string;
    private _turret: Phaser.Sprite;
    private _base: Phaser.Sprite;
    private _hasTurret: boolean;
    private _creepList: Phaser.Group;
    private _targetCreep: Creep;
    private _laserLine: BitmapLine;
    private _damagePer: number;
    private _nextFire: number;
    private _fireRate: number;
    // private _turretTween: Phaser.Tween;

    constructor(ThisGame: Phaser.Game, TowerIndex: number, Location: Phaser.Point, CreepGroup: Phaser.Group) {
        var TowerJSONData: GameObjectClasses.TowerData = TDGame.currentCampaign.TowerStats[TowerIndex];
        var TowerJSONAssets: GameObjectClasses.TowerAssets = TDGame.currentTileset.Towers[TowerIndex];
        this._name = TowerJSONAssets.Name;
        this._targetCreep = null;
        this._creepList = CreepGroup;

        // get the tower data
        console.log("adding tower: " + this._name);
        super(ThisGame, null, this._name, true);

        this.position = Location;
        this.Range = TowerJSONData.Range;
        this.DamagePer = TowerJSONData.Damage;
        this._fireRate = 1000 / TowerJSONData.FireRate;

        // texture keys
        this._baseTextureKey = this._name + ".base";
        this._rotatorTextureKey = this._name + ".rotator";

        // base handling
        console.log("Looking for asset key: " + this._baseTextureKey);
        if (this.game.cache.checkImageKey(this._baseTextureKey)) {
            console.log("Adding tower base");
            this._base = this.game.add.sprite(this.position.x, this.position.y, this._baseTextureKey);
        }

        console.log("Looking for asset key: " + this._rotatorTextureKey);
        // turret handling
        this._hasTurret = this.game.cache.checkImageKey(this._rotatorTextureKey);
        if (this._hasTurret) {
            console.log("adding tower turret");
            this._turret = this.game.add.sprite(this.position.x + TDGame.ui.tileSize.x / 2,
                this.position.y + TDGame.ui.tileSize.x / 2,
                this._rotatorTextureKey);
            this._turret.anchor.setTo(0.5, 0.5);
            // this._turretTween = this.game.add.tween(this._turret);
        }

        // laser line
        this._laserLine = new BitmapLine(this.game);
        // fire rate setup
        this._nextFire = ThisGame.time.now;       
    }

    // range setter
    public set Range(Dist: number) {
        this._range = new Phaser.Circle(this.position.x + TDGame.ui.tileSize.x / 2,
            this.position.y + TDGame.ui.tileSize.x / 2,
            Dist * 2);
    }

    // damage setter
    public set DamagePer(Points: number) {
        this._damagePer = Points;
    }

    // phaser update loop
    update() {
        // console.log("Living Creeps: " + this._creepList.countLiving());
        // console.log("target: " + this._targetCreep);
        // aquire target
        this.aquireTarget();
        // follow target
        this.trackTarget();
        // shoot target
        this.shootTarget();
    }

    // set the nearest in-range creep as target
    private aquireTarget() {
        // remove out-of-range targets
        if (this._targetCreep !== null) {
            if (this._range.contains(this._targetCreep.x, this._targetCreep.y) && this._targetCreep.alive && this._targetCreep.health > 0) {
                return;
            } else {
                this._targetCreep = null;
            }
        } 

        var nearest: Creep;
        var lastDistance: number = this._range.diameter;
        this._creepList.forEachAlive((creep: Creep) => { // for each live creep on the board
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
        if (this._targetCreep !== null || typeof (this._targetCreep) === "undefined") {
            var from: Phaser.Point = new Phaser.Point(this.position.x + TDGame.ui.tileSize.x / 2,
                this.position.y + TDGame.ui.tileSize.y / 2);
            var to: Phaser.Point = new Phaser.Point(this._targetCreep.position.x, this._targetCreep.position.y);
            this._laserLine.Draw(from, to);
            this.damagePerMS(this._targetCreep);
        } else {
            this._laserLine.NoDraw();
        }
    }

    // laser-style damage
    private damagePerMS(Target: Creep) {
        if (this.game.time.now > this._nextFire) {
            Target.Damage(this._damagePer);
            console.log("Tower Damaging Target for " + this._damagePer + " points"); 
            this._nextFire += this._fireRate;
        }
    }
} 