﻿import express = require("express");
import nodefs = require("../NodeFS");
import goc = require("../GameObjectClasses");
import sqldb = require("../Data");

// db test
export function DBTest(req: express.Request, res: express.Response) {
    "use strict";
    var db: sqldb.DataStorage = sqldb.DataStorage.Instance();
    db.InsertNewAuthor("testXXX", "testXXX@gmail.com");
    res.json("DBTest");
};

// asset path for verification
export function AssetPath(req: express.Request, res: express.Response) {
    "use strict";
    res.json(global.ASSETPATH + " (" + global.ASSETURL + ")");
};

// /tileset LIST (GET)
export function TileSetList(req: express.Request, res: express.Response) {
    "use strict";
    res.setHeader("Content-Type", "application/json");
    // res.json(SubDirsOf(global.ASSETPATH + "\\TILESETS"));
    res.json(NamesAndIDsOf(global.ASSETPATH + "\\TILESETS"));
};

// /tileset/:id GET (GET)
export function TileSetGetByID(req: express.Request, res: express.Response) {
    "use strict";
    var id: string = req.params.id;
    // var ts: goc.Tileset = new goc.Tileset;
    // res.json(ts);
    var tilesetJSON: string = global.ASSETPATH + "\\TILESETS\\" + id + "\\tileset.json";

    if (nodefs.Exists(tilesetJSON) !== true) {
        GenerateTilesetJSON(id);
    }

    res.json(nodefs.TextIntoJSON(tilesetJSON)); 
}

// /campaign LIST (GET)
export function CampaignList(req: express.Request, res: express.Response) {
    "use strict";
    res.json(nodefs.SubDirsOf(global.ASSETPATH + "\\CAMPAIGNS"));
};

// /campaign/:id GET (GET)
export function CampaignGetByID(req: express.Request, res: express.Response) {
    "use strict";
    var id: string = req.params.id;
    var campaignJSON: string = global.ASSETPATH + "\\CAMPAIGNS\\" + id + "\\campaign.json";
    res.json(nodefs.TextIntoJSON(campaignJSON));
}

// return names and ID"s of campaign or tileset folders
function NamesAndIDsOf(ThisDir: string): Object[]{
    "use strict";
    var rootdir = nodefs.SubDirsOf(ThisDir);
    var namesAndIDs: Object[] = [];
    for (var i = 0; i < rootdir.length; i++) {
        var o: INameAndID = { name: rootdir[i], id: rootdir[i] };
        namesAndIDs.push(o);
    }
    return namesAndIDs;
}

// interface for Name and ID of tile sets or campaigns
interface INameAndID {
    name: string;
    id: string;
}

// generate a demo campaign and save to folder
export function CreateDemoCampaign(req: express.Request, res: express.Response) {
    "use strict";
    var saveAs: string = global.ASSETPATH + "\\CAMPAIGNS\\C_00000\\campaign.json";
    var demoCampaign: goc.Campaign = new goc.Campaign();
    demoCampaign.ID = "C_00000";
    demoCampaign.MapURL = global.ASSETURL + "/CAMPAIGNS/" + demoCampaign.ID + "/map.csv";
    demoCampaign.TilesetID = "TS_00000";
    demoCampaign.CreepEntranceX = 2;
    demoCampaign.CreepEntranceY = 2;
    demoCampaign.CreepExitX = 20;
    demoCampaign.CreepExitY = 20;
    demoCampaign.WaveDelay = 12;
    demoCampaign.StartMoney = 26;
    demoCampaign.HP = 3;

    // build a demo wave
    var wave1: goc.Wave = new goc.Wave;
    wave1.CreepCount = 4;
    wave1.CreepIndex = 0;
    wave1.SpawnDelay = 2;

    // build a demo wave 2
    var wave2: goc.Wave = new goc.Wave;
    wave2.CreepCount = 2;
    wave2.CreepIndex = 1;
    wave2.SpawnDelay = 8;

    // push wave into campaign
    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);
    demoCampaign.Waves.push(wave2);

    // build a demo set of creep stats
    demoCampaign.CreepStats = [];

    var cs1: goc.CreepData = new goc.CreepData();
    cs1.AssetID = "CREEP000";
    cs1.Index = 0;
    cs1.HitPoints = 40;
    cs1.KillValue = 5;
    cs1.WalkSpeed = 16;
    // push into campaign
    demoCampaign.CreepStats.push(cs1);

    var cs2: goc.CreepData = new goc.CreepData();
    cs2.AssetID = "CREEP001";
    cs2.Index = 1;
    cs2.HitPoints = 20;
    cs2.KillValue = 10;
    cs2.WalkSpeed = 32;
    // push into campaign
    demoCampaign.CreepStats.push(cs2);

    // build a demo set of tower stats
    demoCampaign.TowerStats = [];
    for (var i2 = 0; i2 < 8; i2++) {
        var ts: goc.TowerData = new goc.TowerData();
        ts.AssetID = "TOWER00" + i2;
        ts.Index = i2;
        ts.Damage = 3;
        ts.FireRate = 1;
        ts.Range = 96;
        ts.Cost = 10;
        // push into campaign
        demoCampaign.TowerStats.push(ts);
    }

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);
    console.log("Demo campaign should now exist at:" + saveAs);

    res.end();
}

// generate a json object for tileset details
function GenerateTilesetJSON(TilesetID: string) {
    "use strict";
    var searchPath: string = global.ASSETPATH + "\\TILESETS\\" + TilesetID;
    var saveAs: string = searchPath + "\\tileset.json";
    // implement later
    // var misslePath: string = searchPath + "\\MISSLES"; 

    var TilesetToGen: goc.Tileset = new goc.Tileset();
    TilesetToGen.ID = TilesetID;
    TilesetToGen.Author = "JaneSmith";
    TilesetToGen.Name = "DemoDefault";

    TilesetToGen.BackgroundURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/background.png";
    TilesetToGen.WallURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/walls.png";
    TilesetToGen.EntranceURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/entrance.png";
    TilesetToGen.ExitURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/exit.png";

    TilesetToGen.Creeps = CreepAssetLoader(TilesetID);
    TilesetToGen.Towers = TowerAssetLoader(TilesetID);

    nodefs.SaveObjectAsJSONFile(saveAs, TilesetToGen);
    console.log("Demo campaign should now exist at:" + saveAs);

}

function CreepAssetLoader(TilesetID: string): goc.CreepAssets[]{
    "use strict";
    var creeps: goc.CreepAssets[] = [];

    var searchPath: string = global.ASSETPATH + "\\TILESETS\\" + TilesetID + "\\CREEPS";
    var subfld: string[] = nodefs.SubDirsOf(searchPath); // get each "creep" subfolder
    console.log("found " + subfld.length + " subfolders"); 
    for (var i = 0; i < subfld.length; i++) {
        // a valid walk_anim.png means a valid creep
        var creepID = subfld[i];
        var walkPNG: string = searchPath + "\\" + creepID + "\\walk_anim.png";
        console.log("looking in: " + creepID);
        if (nodefs.Exists(walkPNG)) {
            console.log("found: " + walkPNG);
            var creep: goc.CreepAssets = new goc.CreepAssets;
            creep.WalkAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/walk_anim.png";

            var diePNG: string = searchPath + "\\" + creepID + "\\die_anim.png";
            if (nodefs.Exists(diePNG)) {
                creep.DieAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/die_anim.png";
            }
            creep.Name = "PlaceholderCreepName" + i;
            creep.Index = i;
            creeps.push(creep);
        }
    }
    return creeps;
}

function TowerAssetLoader(TilesetID: string): goc.TowerAssets[]{
    "use strict";
    var towers: goc.TowerAssets[] = [];

    var searchPath: string = global.ASSETPATH + "\\TILESETS\\" + TilesetID + "\\TOWERS";
    var subfld: string[] = nodefs.SubDirsOf(searchPath); // get each "tower" subfolder
    console.log("found " + subfld.length + " subfolders");
    for (var i = 0; i < subfld.length; i++) {
        // a valid base.png OR rotator.png means a valid tower
        var towerID = subfld[i];
        var towerFound: boolean = false;
        var basePNG: string = searchPath + "\\" + towerID + "\\base.png";
        var rotatorPNG: string = searchPath + "\\" + towerID + "\\rotator.png";
        console.log("looking in: " + towerID);
        var tower: goc.TowerAssets = new goc.TowerAssets;

        if (nodefs.Exists(basePNG)) {
            tower.BaseURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/TOWERS/" + towerID + "/base.png";
            towerFound = true;
        }
        if (nodefs.Exists(rotatorPNG)) {
            tower.RotatorURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/TOWERS/" + towerID + "/rotator.png";
            towerFound = true;
        }

        if (towerFound) {
            tower.Name = "PlaceholderTowerName" + i;
            tower.Index = i;
            towers.push(tower);
        }
    }
    return towers;
}

/*
// /tileset/:id/creeps GET[] (get)
export function TileSetCreepsByID(req: express.Request, res: express.Response) {
    "use strict";
    var id: string = req.params.id;
    res.json(CreepAssetLoader(id));
}

// /tileset/:id/towers GET[] (get)
export function TileSetTowersByID(req: express.Request, res: express.Response) {
    "use strict";
    var id: string = req.params.id;
    res.json(TowerAssetLoader(id));
}
*/