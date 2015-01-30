import express = require("express");
import nodefs = require("../NodeFS");
import goc = require("../GameObjectClasses");

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
    var ts: goc.Tileset = new goc.Tileset;
    ts.BackgroundURL = global.ASSETURL + "/TILESETS/" + id + "/background.png";
    ts.WallURL = global.ASSETURL + "/TILESETS/" + id + "/walls.png";
    res.json(ts); 
}

// /tileset/:id/creeps GET[] (get)
export function TileSetCreepsByID(req: express.Request, res: express.Response) {
    "use strict";
    var id: string = req.params.id;
    res.json(CreepAssetLoader(id));
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
export function CreateDemoCampaign() {
    "use strict";
    var saveAs: string = global.ASSETPATH + "\\CAMPAIGNS\\C_00000\\campaign.json";

    var demoCampaign: goc.Campaign = new goc.Campaign();

    demoCampaign.ID = "C_00000";
    demoCampaign.MapURL = global.ASSETURL + "/CAMPAIGNS/" + demoCampaign.ID + "/map.csv";
    demoCampaign.TilesetID = "TS_00000";

    var wave1: goc.Wave = new goc.Wave;
    wave1.CreepCount = 1;
    wave1.CreepIndex = 0;
    wave1.CreepSpeed = 1000;
    wave1.SpawnDelay = 1;

    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);

    console.log("Demo campaign should now exist at:" + saveAs);
}



function CreepAssetLoader(TilesetID: string): goc.CreepAssets[]{
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
            creep.GameObjectID = creepID;
            creep.WalkAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/walk_anim.png";

            var diePNG: string = searchPath + "\\" + creepID + "\\die_anim.png";
            if (nodefs.Exists(diePNG)) {
                creep.DieAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/die_anim.png";
            }
            creeps.push(creep);
        }
    }
    return creeps;
}

