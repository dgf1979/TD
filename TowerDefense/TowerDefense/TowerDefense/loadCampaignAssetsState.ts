module TDGame {
    export class LoadCampaignAssets extends Phaser.State {

        preloadBar: Phaser.Sprite; // progbar
        _campaign: GameObjectClasses.Campaign;

        preload() {
            // progbar
            this.preloadBar = this.add.sprite(200, 250, 'progbar');
            this.load.setPreloadSprite(this.preloadBar);
            
            // console.log('Value in LCA State: ' + TDGame.currentCampaign);

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
                            this._campaign = oCampaign;
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
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
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    })
            });

            // query asset server for every creep
            var oCreeps: GameObjectClasses.CreepAssets[] = [];
            $(document).ready(() => {
                $.ajax(
                    {
                        url: 'http://localhost:1337/tileset/' + oCampaign.TilesetID + '/creeps',
                        dataType: 'json',
                        async: false,
                        success: (json: GameObjectClasses.CreepAssets[]) => {
                            oCreeps = json;
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

            // load towers
            for (var i = 0; i < oTowers.length; i++) {
                var base = this.load.image(oTowers[i].GameObjectID + ".base", oTowers[i].BaseURL, true);
                if (oTowers[0].RotatorURL !== undefined) {
                    var rotator = this.load.spritesheet(oTowers[i].GameObjectID + ".rotator", oTowers[i].RotatorURL, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                }
            } 

            // load creeps
            for (var i = 0; i < oCreeps.length; i++) {
                var walk = this.load.spritesheet(oCreeps[i].GameObjectID + '.walk', oCreeps[i].WalkAnimationURL, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                if (oCreeps[i].DieAnimationURL !== undefined) {
                    var die = this.load.spritesheet(oCreeps[i].GameObjectID + '.die', oCreeps[i].DieAnimationURL, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                }
            }


            // load background, tileset, and CSV map
            this.load.image('background', oTileset.BackgroundURL);
            this.load.image('tileIMG', oTileset.WallURL);
            this.load.tilemap('tileDEF', oCampaign.MapURL, null, Phaser.Tilemap.CSV);

        }

        // phaser.create()
        create() {
            var tween: Phaser.Tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => this.game.state.start('Proto1', true, false, this._campaign));
        }

    }

} 