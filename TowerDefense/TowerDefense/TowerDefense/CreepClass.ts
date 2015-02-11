class Creep extends Phaser.Sprite {
    private _name: string;
    private _cost: number;
    private _payout: number;
    private _velocity: number;
    private _path: Phaser.Point[];
    private _walkTextureKey: string;
    private _dieTextureKey: string;
    private _movementTween: Phaser.Tween;
    private _healthBar: HPBar;

    constructor(ThisGame: Phaser.Game, CreepIndex: number, StartPath: Phaser.Point[]) {
        var CreepJSONData: GameObjectClasses.CreepData = TDGame.currentCampaign.CreepStats[CreepIndex];
        var CreepJSONAssets: GameObjectClasses.CreepAssets = TDGame.currentTileset.Creeps[CreepIndex];

        this._name = CreepJSONAssets.Name;
        this._walkTextureKey = this.Name + ".walk";
        this._dieTextureKey = this.Name + ".die";

        super(ThisGame, 0, 0, this._walkTextureKey, 0);

        this.health = CreepJSONData.HitPoints;
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
    }

    // name getter
    get Name() {
        return this._name;
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
        if (this.position.x === p.x && this.position.y === p.y) {
            if (this._path.length > 1) {
                var nextPos: Phaser.Point = this._path[1];
                var angle: number = Phaser.Point.angle(nextPos, this.position);
                this.rotation = angle;
                this._movementTween = this.game.add.tween(this.position).to(nextPos, this._velocity, Phaser.Easing.Linear.None, true);
                this._path.shift();
            } else {
                this.Exit();
            }
        }
    }

    // exit map
    private Exit() {
        if (this.health > 0) {
            console.log("creep escaped with " + this.health + " hp.");
        }
        var fadeOut: Phaser.Tween = this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        fadeOut.onComplete.add(() => {
            this.destroy();
        });
    }

    // overrride sprite.damage
    Damage(Points: number) {
        if (this.health > 0) {
            this.health -= Points; // call the built-in function
        } else {
            this.health = 0;
            if (this.alive) {
                this.Die();
            } 
        };
        console.log("Creep taking damage; " + this.health + " hp remaining.");
        
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
            this.Exit();
        }
    }
}