module TDGame {
    export class LoadCampaignAssets extends Phaser.State {

        preloadBar: Phaser.Sprite; // progbar

        preload() {
            // progbar
            this.preloadBar = this.add.sprite(200, 250, 'progbar');
            this.load.setPreloadSprite(this.preloadBar);


            console.log('Value in LCA State: ' + TDGame.currentCampaign);

            // query asset server for the selected campaigns details
            var oCampaign: GameObjectClasses.Campaign;
            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/campaign/' + TDGame.currentCampaign,
                        dataType: 'json',
                        async: false,
                        success: (json: GameObjectClasses.Campaign) => {
                            oCampaign = json;
                            console.log('AJAX campaign ID: ' + oCampaign.ID);
                        }
                    })
            });

            // query asset server for the tileset used in this campaign
            var oTileset: GameObjectClasses.Tileset;
            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID,
                        dataType: 'json',
                        async: false,
                        success: (json: GameObjectClasses.Tileset) => {
                            oTileset = json;
                            console.log("Tileset: " + oTileset);
                        }
                    })
            });

            // query asset server for every creep
            // var oCreep: GameObjectClasses.CreepAssets; 
            var oCreeps: GameObjectClasses.CreepAssets[] = [];
            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID + '/creeps',
                        dataType: 'json',
                        async: false,
                        success: (json: GameObjectClasses.CreepAssets[]) => {
                            oCreeps = json;
                            // console.log("AJAX success returned: " + JSON.stringify(json));
                            // console.log("creep list length: " + oCreeps.length);
                            console.log("WalkAnimationURL prop: " + oCreeps[oCreeps.length].WalkAnimationURL);
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    })
            });

            // query asset server for every tower
            var oTowers: GameObjectClasses.TowerAssets[] = [];
            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID + '/towers',
                        dataType: 'json',
                        async: false,
                        success: (json: GameObjectClasses.TowerAssets[]) => {
                            oTowers = json;
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    })
            });


            // load test tower
            var base = this.load.spritesheet(oTowers[0].GameObjectID + ".base", oTowers[0].BaseURL, 64, 64);
            if (oTowers[0].RotatorURL !== undefined) {
                var rotator = this.load.spritesheet(oTowers[0].GameObjectID + ".rotator", oTowers[0].RotatorURL, 64, 64);
            }

            // load test creep
            var walk = this.load.spritesheet(oCreeps[0].GameObjectID + '.walk', oCreeps[0].WalkAnimationURL, 64, 64);
            if (oCreeps[0].DieAnimationURL !== undefined) {
                var die = this.load.spritesheet(oCreeps[0].GameObjectID + '.die', oCreeps[0].DieAnimationURL, 64, 64);
            }

            // load background, tileset, and CSV map
            this.load.image('background', oTileset.BackgroundURL);
            this.load.image('tileIMG', oTileset.WallURL);
            this.load.tilemap('tileDEF', oCampaign.MapURL, null, Phaser.Tilemap.CSV);

            // console.log("CSV: " + oCampaign.MapURL);

        }

        // phaser.create()
        create() {
            var tween: Phaser.Tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => this.game.state.start('Proto1', true, false));
        }

    }

} 