module TDGame {

    // global vars for passing between states
    export var ui: UI.Positioning;
    export var currentCampaign: GameObjectClasses.Campaign;
    export var currentTileset: GameObjectClasses.Tileset;

    export class Game extends Phaser.Game {
        constructor() {
            TDGame.ui = new UI.Positioning;
            super(TDGame.ui.screenSize.x, TDGame.ui.screenSize.y, Phaser.AUTO, 'game', null);
            this.state.add('BootState', BootState, true);
            this.state.add('PreloadState', PreloadState, false);
            this.state.add('StartMenu', StartMenu, false);
            this.state.add('CampaignListState', CampaignList, false);
            this.state.add('LoadCampaignAssets', LoadCampaignAssets, false);
            this.state.add('Proto1', Proto1, false);
        }
    }
}

