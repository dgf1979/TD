class TowerMenu {

    private _game: Phaser.Game;
    private _towers: Phaser.Group[]; // array of sprite groups
    private _selected: Phaser.Group;

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
                var newGroup: Phaser.Group = new Phaser.Group(this._game, "TowerGroup" + i, towerID, true);
                newGroup.position = TDGame.ui.towerTilesUL[i];
                if (hasBase) {
                    var TMIbase = new Phaser.Sprite(this._game, 0, 0, base, 0);
                    newGroup.add(TMIbase);
                }
                if (hasRotator) {
                    var TMIrotator = new Phaser.Sprite(this._game, 0, 0, rotator, 0);
                    newGroup.add(TMIrotator);
                }
                //add click handling to topmost sprite
                var topmostSprite: Phaser.Sprite = newGroup.getTop();
                topmostSprite.inputEnabled = true;
                var mouseover = this.menuItemOnMouseOver(newGroup);
                var mouseout = this.menuItemOnMouseOut(newGroup);
                var mouseclick = this.menuItemOnMouseClick(newGroup);
                topmostSprite.events.onInputDown.add(mouseclick);
                topmostSprite.events.onInputOver.add(mouseover);
                topmostSprite.events.onInputOut.add(mouseout);
                console.log("topmost sprite: " + topmostSprite.key);
                this._towers.push(newGroup);
            }
        } 
    }

    menuItemOnMouseOver(Group: Phaser.Group) {
        return () => {
            Group.forEach((s: Phaser.Sprite) => {
                s.tint = Phaser.Color.getColor(0, 150, 0);
            }, this);
        }
        // console.log(this.tint);
        // ThisSprite.tint = Phaser.Color.getColor(0, 150, 0);
    }

    menuItemOnMouseOut(Group: Phaser.Group) {
        return () => {
            Group.forEach((s: Phaser.Sprite) => {
                s.tint = 16777215;
            }, this);
        }
        // ThisSprite.tint = 16777215;
    }

    menuItemOnMouseClick(Group: Phaser.Group) {
        return () => {
            this._selected = Group;
            console.log("Selected: " + Group.name);
        }
    }
}
