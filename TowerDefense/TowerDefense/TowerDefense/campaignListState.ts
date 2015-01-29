module TDGame {
    export class CampaignList extends Phaser.State {

        create() {

            var jsObj: string[];

            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/campaign',
                        dataType: 'json',
                        async: false,
                        data: jsObj,
                        success: (jsObj) => {
                            console.log(jsObj);
                            this.buildMenu(jsObj);
                        }
                    })
            });
        }

        // shitty basic menu build
        buildMenu(CampaignNames: string[]) {
            // loop through string and display as menu items
            var style: Object = { font: "24px Arial", fill: "Blue", align: "center" };
            //offsets to space out the menu items vertically
            var offsetY: number = 28;
            for (var i = 0; i < CampaignNames.length; i++) {
                var down: number = offsetY * i + 40;
                var item: Phaser.Text = this.game.add.text(this.game.world.centerX, down, CampaignNames[i], style);
                item.buttonMode = true;
                item.anchor.set(0.5, 0.5);
                item.addColor("green", 2);
                item.inputEnabled = true;
                // make new instances of all events (because JavaScript)
                var mouseover = this.menuItemOnMouseOver(item);
                var mouseout = this.menuItemOnMouseOut(item);
                var mouseclick = this.menuItemClicked(item)
                item.events.onInputOver.add(mouseover, this);
                item.events.onInputOut.add(mouseout, this);
                item.events.onInputDown.add(mouseclick, this);
            } 
            
        }

        menuItemOnMouseOver(menuItem: Phaser.Text) {
            // have to return a new function, not just execute the function - because JavaScript.
            return () => { menuItem.scale = new Phaser.Point(1.5, 1.5); }
        }

        menuItemOnMouseOut(menuItem: Phaser.Text) {
            return () => { menuItem.scale = new Phaser.Point(1.0, 1.0); }
        }

        menuItemClicked(menuItem: Phaser.Text) {
            return () => {
                TDGame.currentCampaign = menuItem.text;
                this.game.state.start('LoadCampaignAssets', true, false);
            }
        }
    }
} 