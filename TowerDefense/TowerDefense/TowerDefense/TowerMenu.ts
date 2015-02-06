class TowerMenu {

    private _game: Phaser.Game;
    private _towers: Phaser.Group[];

    constructor(ThisGame: Phaser.Game) {
        this._game = ThisGame;
        this._towers = [];
        this.load();
    }

    private load() {
        // load towers images into selection tiles
        for (var i = 0; i < 8; i++) {
            var towerID: string = "TOWER00" + i;
            var base = towerID + ".base";
            var rotator = towerID + ".rotator";
            var hasBase = this._game.cache.checkImageKey(base);
            var hasRotator = this._game.cache.checkImageKey(rotator);
            if (hasBase || hasRotator) {
                var newGroup: Phaser.Group = new Phaser.Group(this._game, null, towerID, true);
                newGroup.position = TDGame.ui.towerTilesUL[i];
                if (hasBase) {
                    var TMIbase = new Phaser.Sprite(this._game, 0, 0, base, 0);
                    newGroup.add(TMIbase);
                }
                if (hasRotator) {
                    var TMIrotator = new Phaser.Sprite(this._game, 0, 0, rotator, 0);
                    newGroup.add(TMIrotator);
                }
                newGroup.interactive = true;
                newGroup.buttonMode = true;
                newGroup.hitArea = new Phaser.Rectangle(0, 0, TDGame.ui.tileSize.x, TDGame.ui.tileSize.x);
                newGroup.mousedown = (e: PIXI.InteractionData) => { alert("click"); }
                this._towers.push(newGroup);
            }
        } 
    }

    menuItemOnMouseOver() {
        // console.log(this.tint);
        // this.tint = Phaser.Color.getColor(0, 150, 0);
    }

    menuItemOnMouseOut() {
        // this.tint = 16777215;
    }

    menuItemOnMouseClick() {
        alert("Click");
    }
}
