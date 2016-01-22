class HPBar {
    _maxHealth: number;
    _lastHealth: number;
    _parent: Phaser.Sprite;
    _healthBar: Phaser.Graphics;
    _totalBarWidth: number;

    constructor(Parent: Phaser.Sprite) {
        // load privates
        this._parent = Parent;
        this._maxHealth = Parent.health;
        this._lastHealth = Parent.health;
        // build the bar
        this._healthBar = this._parent.game.add.graphics(0,0);
        // 80% of parent width
        this._totalBarWidth = 30;
    }

    // call from parent update
    Update() {
        var startingPoint: Phaser.Point = this._parent.position;
        if (this._lastHealth !== this._parent.health) {
            var factor: number = this._totalBarWidth / this._maxHealth;
            var barWidth = factor * this._parent.health;
            var color: number = Phaser.Color.getColor(255, 0, 0);
            //build a new health bar
            this._healthBar.clear();
            this._healthBar.beginFill(color);
            this._healthBar.lineStyle(2, color, 1);
            this._healthBar.moveTo(0, 0);
            this._healthBar.lineTo(barWidth, 0);
            this._healthBar.endFill();
            this._lastHealth = this._parent.health;
        } else {
            this._healthBar.position.x = this._parent.position.x - 15;
            this._healthBar.position.y = this._parent.position.y + 15;
        }
    }
}