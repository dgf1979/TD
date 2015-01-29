module TDGame {

    export var currentCampaign: string = '';

    export class Game extends Phaser.Game {

        // global vars for passing between states
        

        constructor() {
            super(800, 640, Phaser.AUTO, 'game', null);
            this.state.add('BootState', BootState, true);
            this.state.add('PreloadState', PreloadState, false);
            this.state.add('StartMenu', StartMenu, false);
            this.state.add('CampaignListState', CampaignList, false);
            this.state.add('LoadCampaignAssets', LoadCampaignAssets, false);
            this.state.add('Proto1', Proto1, false);
        }
    }
}

