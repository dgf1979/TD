﻿class Creep extends Phaser.Sprite {
    private _name: string;
    // private _cost: number;
    // private _payout: number;
    private _velocity: number;
    private _path: Phaser.Point[];
    private _walkTextureKey: string;
    private _dieTextureKey: string;
    private _movementTween: Phaser.Tween;
    private _healthBar: HPBar;
    private _pather: PathHelper;
    private _pathReset: boolean;
    private _killValue: number;

    // signals
    SignalKilled: Phaser.Signal = new Phaser.Signal();
    SignalEscaped: Phaser.Signal = new Phaser.Signal();

    constructor(ThisGame: Phaser.Game, CreepIndex: number, StartPath: Phaser.Point[], Map: TDMap) {
        super(ThisGame, 0, 0, null, 0);

        var CreepJSONData: GameObjectClasses.CreepData = TDGame.Globals.CampaignJSON.CreepStats[CreepIndex];
        var CreepJSONAssets: GameObjectClasses.CreepAssets = TDGame.Globals.TilesetJSON.Creeps[CreepIndex];

        this._pather = new PathHelper(Map);
        this._pathReset = false;

        this._name = CreepJSONAssets.Name;
        this._walkTextureKey = this.Name + ".walk";
        this._dieTextureKey = this.Name + ".die";

        this.loadTexture(this._walkTextureKey, 0, false);

        this.health = CreepJSONData.HitPoints;
        this._killValue = CreepJSONData.KillValue;
        this._velocity = CreepJSONData.WalkSpeed;
        this.anchor.setTo(0.5, 0.5);
        this._path = StartPath; // duplication handled by factory
        this.animations.add("walk");
        this.animations.play("walk", 4, true);
        this.game.add.existing(this);
        this.position = this._path[0];
        var lookat = this._path[1];
        this.rotation = Phaser.Point.angle(lookat, this.position);
        // health bar setup
        this._healthBar = new HPBar(this);
        // alert("creep starting with " + this.health + " hp");

        // subscribe to path updates
        this._pather.SignalNewPathOK.add(() => { this.SetNewPath(); }); 
    }

    // update with new path
    private SetNewPath() {
        // this._movementTween.stop();
        this._path = this._pather.GetPixelPathCentered(TDGame.Globals.Settings.TileSize.x, TDGame.Globals.Settings.TileSize.y);
        console.log("Creep on new path.");
        this._pathReset = true;
        // this._movementTween.start();
    }

    // trigger new path gen (e.g. on map update)
    UpdatePath(CurrentMap: TDMap) {
        console.log("Creep received instruction to update path..");
        this._pather.AsyncCalculatePath(Helper.PixelToTile(this.position));
    }

    // name getter
    get Name() {
        return this._name;
    }

    Pause() {
        if (this._movementTween) {
            console.log("Creep PAUSED");
            this._movementTween.pause();
        }
    }

    Unpause() {
        if (this._movementTween) {
            console.log("Creep RESUMED FROM PAUSE");
            this._movementTween.resume();
        }
    }

    // phaser update loop
    update() {
        if (this.alive) {
            this.FollowPath(); // movement
            this._healthBar.Update();
        }
    }

    // movement
    private FollowPath() {
        var p: Phaser.Point = this._path[0];
        if ((this.position.x === p.x && this.position.y === p.y) || this._pathReset) {
            if (this._path.length > 1) {
                var nextPos: Phaser.Point = this._path[1];
                var angle: number = Phaser.Point.angle(nextPos, this.position);
                var dist: number = Phaser.Point.distance(this.position, nextPos);
                var duration: number = (1000 * dist) / this._velocity;
                this.rotation = angle;
                this._movementTween = this.game.add.tween(this.position).to(nextPos, duration, Phaser.Easing.Linear.None, true);
                this._path.shift();
            } else {
                this.Exit();
            }
            this._pathReset = false;
        }
    }

    // exit map
    private Exit() {
        if (this.health > 0) {
            console.log("creep escaped with " + this.health + " hp.");
            this.SignalEscaped.dispatch();
            this.health = 0;
        }
        var fadeOut: Phaser.Tween = this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        fadeOut.onComplete.add(() => {
            this.destroy();
        });
    }

    // overrride sprite.damage
    Damage(Points: number) {
        if (this.health > 0) {
            this.health -= Points; // call the built-in health var
            console.log("Creep taking damage; " + this.health + " hp remaining.");
        }
        // kill if at or below 0
        if (this.health <= 0) {
            this.health = 0;
            if (this.alive) {
                console.log("Creep Kill Value:" + this._killValue);
                this.SignalKilled.dispatch(this._killValue);
                this.Die();
            }
        }
    }

    // die
    private Die() {
        // todo: add value to global payout
        this._movementTween.stop();
        // console.log("current anim: " + this.animations.currentAnim.name);
        this.animations.stop("walk", true);
        if (!this.game.cache.checkImageKey(this._dieTextureKey)) {
            this.Exit();
        } else {
            this.loadTexture(this._dieTextureKey,0,true);
            var die_anim = this.animations.add("die");
            die_anim.play(4, false, false);  // no loop
            die_anim.onComplete.add(() => {
                this.Exit();
            });
        }
    }
}