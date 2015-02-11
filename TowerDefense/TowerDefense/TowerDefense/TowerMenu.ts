class TowerMenu {
    // signals
    ItemSelectedSignal: Phaser.Signal = new Phaser.Signal();

    // vars
    private _game: Phaser.Game;
    private _towers: Phaser.Group[]; // array of sprite groups
    private _cursorCopies: Phaser.Group[];
    private _selected: number;
    
    // constructor
    constructor(ThisGame: Phaser.Game) {
        this._game = ThisGame;
        this._towers = [];
        this._cursorCopies = [];
        this.load();
    }

    private load() {
        // load towers images into selection tiles
        var TowerJSONAssets: GameObjectClasses.TowerAssets[] = TDGame.currentTileset.Towers;

        for (var i = 0; i < TowerJSONAssets.length; i++) {
            var TowerJSONData: GameObjectClasses.TowerData = TDGame.currentCampaign.TowerStats[i];
            var name: string = TowerJSONAssets[i].Name;
            var base = name + ".base";
            var rotator = name + ".rotator";
            var hasBase = this._game.cache.checkImageKey(base);
            var hasRotator = this._game.cache.checkImageKey(rotator);
            if (hasBase || hasRotator) {
                var newGroup: Phaser.Group = new Phaser.Group(this._game, null, name, true);
                var newCursorGroup: Phaser.Group = new Phaser.Group(this._game, null, name, true);
                newCursorGroup.visible = false;
                newGroup.position = TDGame.ui.towerTilesUL[i];
                if (hasBase) {
                    // menu copy
                    var TMIbase = new Phaser.Sprite(this._game, 0, 0, base, 0);
                    newGroup.add(TMIbase);
                    // cursor copy
                    var TMIbaseCursorCopy = new Phaser.Sprite(this._game, 0, 0, base, 0);
                    newCursorGroup.add(TMIbaseCursorCopy);
                }
                if (hasRotator) {
                    // menu copy
                    var TMIrotator = new Phaser.Sprite(this._game, 0, 0, rotator, 0);
                    newGroup.add(TMIrotator);
                    // cursor copy
                    var TMIrotatorCursorCopy = new Phaser.Sprite(this._game, 0, 0, rotator, 0);
                    newCursorGroup.add(TMIrotatorCursorCopy);
                }
                // add click handling to topmost sprite
                var topmostSprite: Phaser.Sprite = newGroup.getTop();
                topmostSprite.inputEnabled = true;
                var mouseover = this.menuItemOnMouseOver(newGroup);
                var mouseout = this.menuItemOnMouseOut(newGroup);
                var mouseclick = this.menuItemOnMouseClick(TowerJSONData.Index);
                topmostSprite.events.onInputDown.add(mouseclick);
                topmostSprite.events.onInputOver.add(mouseover);
                topmostSprite.events.onInputOut.add(mouseout);
                // console.log("topmost sprite: " + topmostSprite.key);
                this._towers.push(newGroup);  // menu group
                this._cursorCopies.push(newCursorGroup); // cursor copies
            }
        } 
    }

    // get ID of selected tower
    get SelectedTowerIndex(): number {
        return this._selected;
    }

    ClearSelectedTower() {
        this._selected = -1;
    }

    // return the sprite group for the currently selected index
    get SelectedSpriteGroup(): Phaser.Group {
        if (this._cursorCopies[this._selected]) {
            return this._cursorCopies[this._selected];
        } else {
            console.log("couldn't find selected tower menuitem sprite group at index: " + this._selected);
            return new Phaser.Group(this._game);
        }
    }

    private menuItemOnMouseOver(Group: Phaser.Group) {
        return () => {
            Group.forEach((s: Phaser.Sprite) => {
                s.tint = Phaser.Color.getColor(102, 255, 255);
            }, this);
        };
        // console.log(this.tint);
        // thisSprite.tint = Phaser.Color.getColor(0, 150, 0);
    }

    private menuItemOnMouseOut(Group: Phaser.Group) {
        return () => {
            Group.forEach((s: Phaser.Sprite) => {
                s.tint = 16777215;
            }, this);
        };
        // ThisSprite.tint = 16777215;
    }

    private menuItemOnMouseClick(TowerIndex: number) {
        return () => {
            this._selected = TowerIndex;
            console.log("Selected Tower Index: " + TowerIndex);
            this.ItemSelectedSignal.dispatch(this._selected);
        };
    }
}
