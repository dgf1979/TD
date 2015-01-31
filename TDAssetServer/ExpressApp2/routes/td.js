var nodefs = require("../NodeFS");
var goc = require("../GameObjectClasses");

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
    var ts = new goc.Tileset;
    ts.BackgroundURL = global.ASSETURL + "/TILESETS/" + id + "/background.png";
    ts.WallURL = global.ASSETURL + "/TILESETS/" + id + "/walls.png";
    res.json(ts);
}
exports.TileSetGetByID = TileSetGetByID;

// /tileset/:id/creeps GET[] (get)
function TileSetCreepsByID(req, res) {
    "use strict";
    var id = req.params.id;
    res.json(CreepAssetLoader(id));
}
exports.TileSetCreepsByID = TileSetCreepsByID;

// /tileset/:id/towers GET[] (get)
function TileSetTowersByID(req, res) {
    "use strict";
    var id = req.params.id;
    res.json(TowerAssetLoader(id));
}
exports.TileSetTowersByID = TileSetTowersByID;

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
function CreateDemoCampaign() {
    "use strict";
    var saveAs = global.ASSETPATH + "\\CAMPAIGNS\\C_00000\\campaign.json";

    var demoCampaign = new goc.Campaign();

    demoCampaign.ID = "C_00000";
    demoCampaign.MapURL = global.ASSETURL + "/CAMPAIGNS/" + demoCampaign.ID + "/map.csv";
    demoCampaign.TilesetID = "TS_00000";

    var wave1 = new goc.Wave;
    wave1.CreepCount = 1;
    wave1.CreepIndex = 0;
    wave1.CreepSpeed = 1000;
    wave1.SpawnDelay = 1;

    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);

    console.log("Demo campaign should now exist at:" + saveAs);
}
exports.CreateDemoCampaign = CreateDemoCampaign;

function CreepAssetLoader(TilesetID) {
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
            creep.GameObjectID = creepID;
            creep.WalkAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/walk_anim.png";

            var diePNG = searchPath + "\\" + creepID + "\\die_anim.png";
            if (nodefs.Exists(diePNG)) {
                creep.DieAnimationURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/CREEPS/" + creepID + "/die_anim.png";
            }
            creeps.push(creep);
        }
    }
    return creeps;
}

function TowerAssetLoader(TilesetID) {
    var towers = [];

    var searchPath = global.ASSETPATH + "\\TILESETS\\" + TilesetID + "\\TOWERS";
    var subfld = nodefs.SubDirsOf(searchPath);
    console.log("found " + subfld.length + " subfolders");
    for (var i = 0; i < subfld.length; i++) {
        // a valid base.png means a valid tower
        var towerID = subfld[i];
        var basePNG = searchPath + "\\" + towerID + "\\base.png";
        console.log("looking in: " + towerID);
        if (nodefs.Exists(basePNG)) {
            console.log("found: " + basePNG);
            var tower = new goc.TowerAssets;
            tower.GameObjectID = towerID;
            tower.BaseURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/TOWERS/" + towerID + "/base.png";

            var rotatorPNG = searchPath + "\\" + towerID + "\\rotator.png";
            if (nodefs.Exists(rotatorPNG)) {
                tower.RotatorURL = global.ASSETURL + "/TILESETS/" + TilesetID + "/TOWERS/" + towerID + "/rotator.png";
            }
            towers.push(tower);
        }
    }
    return towers;
}
//# sourceMappingURL=td.js.map
