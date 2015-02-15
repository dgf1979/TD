var nodefs = require("../NodeFS");
var goc = require("../GameObjectClasses");
var sqldb = require("../Data");

// db test
function DBTest(req, res) {
    "use strict";
    var db = sqldb.DataStorage.Instance();
    db.InsertNewAuthor("test", "test@gmail.com");
    res.json("DBTest");
}
exports.DBTest = DBTest;
;

// asset path for verification
function AssetPath(req, res) {
    "use strict";
    res.json(global.ASSETPATH + " (" + global.ASSETURL + ")");
}
exports.AssetPath = AssetPath;
;

// /tileset LIST (GET)
function TileSetList(req, res) {
    "use strict";
    res.setHeader("Content-Type", "application/json");

    // res.json(SubDirsOf(global.ASSETPATH + "\\TILESETS"));
    res.json(NamesAndIDsOf(global.ASSETPATH + "\\TILESETS"));
}
exports.TileSetList = TileSetList;
;

// /tileset/:id GET (GET)
function TileSetGetByID(req, res) {
    "use strict";
    var id = req.params.id;

    // var ts: goc.Tileset = new goc.Tileset;
    // res.json(ts);
    var tilesetJSON = global.ASSETPATH + "\\TILESETS\\" + id + "\\tileset.json";

    if (nodefs.Exists(tilesetJSON) !== true) {
        GenerateTilesetJSON(id);
    }

    res.json(nodefs.TextIntoJSON(tilesetJSON));
}
exports.TileSetGetByID = TileSetGetByID;

// /campaign LIST (GET)
function CampaignList(req, res) {
    "use strict";
    res.json(nodefs.SubDirsOf(global.ASSETPATH + "\\CAMPAIGNS"));
}
exports.CampaignList = CampaignList;
;

// /campaign/:id GET (GET)
function CampaignGetByID(req, res) {
    "use strict";
    var id = req.params.id;
    var campaignJSON = global.ASSETPATH + "\\CAMPAIGNS\\" + id + "\\campaign.json";
    res.json(nodefs.TextIntoJSON(campaignJSON));
}
exports.CampaignGetByID = CampaignGetByID;

// return names and ID"s of campaign or tileset folders
function NamesAndIDsOf(ThisDir) {
    "use strict";
    var rootdir = nodefs.SubDirsOf(ThisDir);
    var namesAndIDs = [];
    for (var i = 0; i < rootdir.length; i++) {
        var o = { name: rootdir[i], id: rootdir[i] };
        namesAndIDs.push(o);
    }
    return namesAndIDs;
}


// generate a demo campaign and save to folder
function CreateDemoCampaign(req, res) {
    "use strict";
    var saveAs = global.ASSETPATH + "\\CAMPAIGNS\\C_00000\\campaign.json";
    var demoCampaign = new goc.Campaign();
    demoCampaign.ID = "C_00000";
    demoCampaign.MapURL = global.ASSETURL + "/CAMPAIGNS/" + demoCampaign.ID + "/map.csv";
    demoCampaign.TilesetID = "TS_00000";

    // build a demo wave
    var wave1 = new goc.Wave;
    wave1.CreepCount = 3;
    wave1.CreepIndex = 0;
    wave1.CreepSpeed = 1000;
    wave1.SpawnDelay = 6;

    // push wave into campaign
    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);

    // build a demo set of creep stats
    demoCampaign.CreepStats = [];
    for (var i = 0; i < 8; i++) {
        var cs = new goc.CreepData();
        cs.AssetID = "CREEP00" + i;
        cs.Index = i;
        cs.HitPoints = 40;
        cs.WalkSpeed = 2000;

        // push into campaign
        demoCampaign.CreepStats.push(cs);
    }

    // build a demo set of tower stats
    demoCampaign.TowerStats = [];
    for (var i2 = 0; i2 < 8; i2++) {
        var ts = new goc.TowerData();
        ts.AssetID = "TOWER00" + i2;
        ts.Index = i2;
        ts.Damage = 3;
        ts.FireRate = 1;
        ts.Range = 96;

        // push into campaign
        demoCampaign.TowerStats.push(ts);
    }

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);
    console.log("Demo campaign should now exist at:" + saveAs);

    res.end();
}
exports.CreateDemoCampaign = CreateDemoCampaign;

// generate a json object for tileset details
function GenerateTilesetJSON(TilesetID) {
    "use strict";
    var searchPath = global.ASSETPATH + "\\TILESETS\\" + TilesetID;
    var saveAs = searchPath + "\\tileset.json";

    // implement later
    // var misslePath: string = searchPath + "\\MISSLES";
    var TilesetToGen = new goc.Tileset();
    TilesetToGen.ID = TilesetID;
    TilesetToGen.Author = "JaneSmith";
    TilesetToGen.Name = "DemoDefault";

    TilesetToGen.BackgroundURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/background.png";
    TilesetToGen.WallURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/walls.png";

    TilesetToGen.Creeps = CreepAssetLoader(TilesetID);
    TilesetToGen.Towers = TowerAssetLoader(TilesetID);

    nodefs.SaveObjectAsJSONFile(saveAs, TilesetToGen);
    console.log("Demo campaign should now exist at:" + saveAs);
}

function CreepAssetLoader(TilesetID) {
    "use strict";
    var creeps = [];

    var searchPath = global.ASSETPATH + "\\TILESETS\\" + TilesetID + "\\CREEPS";
    var subfld = nodefs.SubDirsOf(searchPath);
    console.log("found " + subfld.length + " subfolders");
    for (var i = 0; i < subfld.length; i++) {
        // a valid walk_anim.png means a valid creep
        var creepID = subfld[i];
        var walkPNG = searchPath + "\\" + creepID + "\\walk_anim.png";
        console.log("looking in: " + creepID);
        if (nodefs.Exists(walkPNG)) {
            console.log("found: " + walkPNG);
            var creep = new goc.CreepAssets;
            creep.WalkAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/walk_anim.png";

            var diePNG = searchPath + "\\" + creepID + "\\die_anim.png";
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

function TowerAssetLoader(TilesetID) {
    "use strict";
    var towers = [];

    var searchPath = global.ASSETPATH + "\\TILESETS\\" + TilesetID + "\\TOWERS";
    var subfld = nodefs.SubDirsOf(searchPath);
    console.log("found " + subfld.length + " subfolders");
    for (var i = 0; i < subfld.length; i++) {
        // a valid base.png OR rotator.png means a valid tower
        var towerID = subfld[i];
        var towerFound = false;
        var basePNG = searchPath + "\\" + towerID + "\\base.png";
        var rotatorPNG = searchPath + "\\" + towerID + "\\rotator.png";
        console.log("looking in: " + towerID);
        var tower = new goc.TowerAssets;

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
//# sourceMappingURL=td.js.map
