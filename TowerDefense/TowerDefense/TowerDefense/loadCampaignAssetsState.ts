module TDGame {
    "use strict";
    export class LoadCampaignAssets extends Phaser.State {

        preloadBar: Phaser.Sprite; // progbar
        _campaignID: string;

        init(ID: string) {
            console.log("Selected Campaign State: " + ID);
            this._campaignID = ID;
        }

        preload() {
            // progbar
            this.preloadBar = this.add.sprite(200, 250, "progbar");
            this.load.setPreloadSprite(this.preloadBar);

            // query asset server for the selected campaigns details
            $(document).ready(() => {
                $.ajax(
                    {
                        url: "http://localhost:1337/campaign/" + this._campaignID,
                        dataType: "json",
                        async: false,
                        success: (json: GameObjectClasses.Campaign) => {
                            Globals.CampaignJSON = json;
                            console.log("AJAX campaign ID: " + Globals.CampaignJSON.Name);
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    });
            });

            // query asset server for the tileset used in this campaign
            $(document).ready(() => {
                $.ajax(
                    {
                        url: "http://localhost:1337/tileset/" + Globals.CampaignJSON.TilesetID,
                        dataType: "json",
                        async: false,
                        success: (json: GameObjectClasses.Tileset) => {
                            Globals.TilesetJSON = json;
                            console.log("Tileset: " + Globals.TilesetJSON.Name);
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    });
            });

            this.load.crossOrigin = "anonymous";

            // load background, tileset, and CSV map
            this.load.image("background", Globals.TilesetJSON.BackgroundURL);
            this.load.image("tileIMG", Globals.TilesetJSON.WallURL);
            this.load.tilemap("tileDEF", Globals.CampaignJSON.MapURL, null, Phaser.Tilemap.CSV);
            this.load.image("tileEntrance", Globals.TilesetJSON.EntranceURL);
            this.load.image("tileExit", Globals.TilesetJSON.ExitURL);

            // load tower assets
            var oTowers: GameObjectClasses.TowerAssets[] = Globals.TilesetJSON.Towers;
            for (var i = 0; i < oTowers.length; i++) {
                if (oTowers[i].BaseURL !== "") {
                    this.load.spritesheet(oTowers[i].Name + ".base", oTowers[i].BaseURL, 32, 32);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".base");
                } else {
                    this.load.spritesheet(oTowers[i].Name + ".base", "img/32x32.png", 32, 32);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".base");
                }
                if (oTowers[i].RotatorURL !== "") {
                    this.load.spritesheet(oTowers[i].Name + ".rotator", oTowers[i].RotatorURL, 32, 32);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".rotator");
                }   
            } 

            // load creep assets
            var oCreeps: GameObjectClasses.CreepAssets[] = Globals.TilesetJSON.Creeps;
            for (var i2 = 0; i2 < oCreeps.length; i2++) {
                this.load.spritesheet(oCreeps[i2].Name + ".walk",
                    oCreeps[i2].WalkAnimationURL,
                    32,
                    32);
                if (oCreeps[i2].DieAnimationURL !== undefined) {
                    var die = this.load.spritesheet(oCreeps[i2].Name + ".die",
                        oCreeps[i2].DieAnimationURL,
                        32,
                        32);
                }
            }



        }

        // phaser.create()
        create() {
            var tween: Phaser.Tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => this.game.state.start("Proto1", true, false));
        }

    }

} 