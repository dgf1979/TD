﻿module TDGame {
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
                            currentCampaign = json;
                            console.log("AJAX campaign ID: " + currentCampaign.Name);
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
                        url: "http://localhost:1337/tileset/" + currentCampaign.TilesetID,
                        dataType: "json",
                        async: false,
                        success: (json: GameObjectClasses.Tileset) => {
                            currentTileset = json;
                            console.log("Tileset: " + currentTileset.Name);
                        },
                        error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    });
            });

            this.load.crossOrigin = "anonymous";

            // load background, tileset, and CSV map
            this.load.image("background", currentTileset.BackgroundURL);
            this.load.image("tileIMG", currentTileset.WallURL);
            this.load.tilemap("tileDEF", currentCampaign.MapURL, null, Phaser.Tilemap.CSV);
            this.load.image("tileEntrance", currentTileset.EntranceURL);
            this.load.image("tileExit", currentTileset.ExitURL);

            // load tower assets
            var oTowers: GameObjectClasses.TowerAssets[] = currentTileset.Towers;
            for (var i = 0; i < oTowers.length; i++) {
                if (oTowers[i].BaseURL !== "") {
                    this.load.spritesheet(oTowers[i].Name + ".base", oTowers[i].BaseURL, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".base");
                } else {
                    this.load.spritesheet(oTowers[i].Name + ".base", "img/32x32.png", TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".base");
                }
                if (oTowers[i].RotatorURL !== "") {
                    this.load.spritesheet(oTowers[i].Name + ".rotator", oTowers[i].RotatorURL, TDGame.ui.tileSize.x, TDGame.ui.tileSize.y);
                    console.log("ASSET ADDED: " + oTowers[i].Name + ".rotator");
                }   
            } 

            // load creep assets
            var oCreeps: GameObjectClasses.CreepAssets[] = currentTileset.Creeps;
            for (var i2 = 0; i2 < oCreeps.length; i2++) {
                var walk = this.load.spritesheet(oCreeps[i2].Name + ".walk",
                    oCreeps[i2].WalkAnimationURL,
                    TDGame.ui.tileSize.x,
                    TDGame.ui.tileSize.y);
                if (oCreeps[i2].DieAnimationURL !== undefined) {
                    var die = this.load.spritesheet(oCreeps[i2].Name + ".die",
                        oCreeps[i2].DieAnimationURL,
                        TDGame.ui.tileSize.x,
                        TDGame.ui.tileSize.y);
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