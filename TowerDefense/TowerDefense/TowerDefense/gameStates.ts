module TDGame {
    "use strict";

    // global vars for passing between states
    export var Globals: Global;

    export class Game extends Phaser.Game {
        constructor() {
            TDGame.Globals = new Global();
            super(1024, 768, Phaser.AUTO, "game", null);
            this.state.add("BootState", BootState, true);
            this.state.add("PreloadState", PreloadState, false);
            this.state.add("StartMenu", StartMenu, false);
            this.state.add("CampaignListState", CampaignList, false);
            this.state.add("LoadCampaignAssets", LoadCampaignAssets, false);
            this.state.add("Proto1", Proto1, false);
        }
    }
}

