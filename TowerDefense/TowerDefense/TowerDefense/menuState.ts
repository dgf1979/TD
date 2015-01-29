module TDGame {
    export class StartMenu extends Phaser.State {

        create() {
            var text: string = "Select Campaign";
            var style: Object = { font: "24px Arial", fill: "Red", align: "center" };
            var item1: Phaser.Text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, text, style);
            item1.buttonMode = true;
            item1.anchor.set(0.5, 0.5);
            item1.addColor("white", 7);
            item1.inputEnabled = true;
            item1.events.onInputOver.add(function () { this.menuItemOnMouseOver(item1); }, this);
            item1.events.onInputOut.add(() => this.menuItemOnMouseOut(item1), this);
            item1.events.onInputDown.add(this.menuItemOnMouseClick, this);
        }

        menuItemOnMouseOver(menuItem: Phaser.Text) {
            menuItem.scale = new Phaser.Point(1.25, 1.25);
        }

        menuItemOnMouseOut(menuItem: Phaser.Text) {
            menuItem.scale = new Phaser.Point(1.0, 1.0);
        }

        menuItemOnMouseClick() {
            this.game.state.start('CampaignListState', true, false);
        }
    }
}