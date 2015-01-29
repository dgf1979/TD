var nodefs = require('../NodeFS');
var goc = require('../GameObjectClasses');

// asset path for verification
function AssetPath(req, res) {
    res.json(global.ASSETPATH + " (" + global.ASSETURL + ")");
}
exports.AssetPath = AssetPath;
;

// /tileset LIST (GET)
function TileSetList(req, res) {
    res.setHeader('Content-Type', 'application/json');

    //res.json(SubDirsOf(global.ASSETPATH + "\\TILESETS"));
    res.json(NamesAndIDsOf(global.ASSETPATH + "\\TILESETS"));
}
exports.TileSetList = TileSetList;
;

// /tileset/:id GET (GET)
function TileSetGetByID(req, res) {
    var id = req.params.id;
    var tilesetURL = global.ASSETURL + "/TILESETS/" + id;
    res.send(tilesetURL);
}
exports.TileSetGetByID = TileSetGetByID;

// /campaign LIST (GET)
function CampaignList(req, res) {
    res.json(nodefs.SubDirsOf('D:\\HTML5\\TDAssetServer\\ExpressApp2\\ASSETS\\CAMPAIGNS'));
}
exports.CampaignList = CampaignList;
;

// return names and ID's of campaign or tileset folders
function NamesAndIDsOf(ThisDir) {
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
    var saveAs = "D:\\HTML5\\TDAssetServer\\ExpressApp2\\ASSETS\\CAMPAIGNS\\C_00000\\campaign.json";

    var demoCampaign = new goc.Campaign();
    console.log("did we get this far?");
    demoCampaign.ID = 'C_00000';
    demoCampaign.MapURL = 'http://localhost/CAMPAIGNS/' + demoCampaign.ID + '/map.csv';
    demoCampaign.TilesetID = 'TS_00000';

    var wave1 = new goc.Wave;
    wave1.CreepCount = 1;
    wave1.CreepIndex = 0;
    wave1.CreepSpeed = 1000;
    wave1.SpawnDelay = 1;

    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);
}
exports.CreateDemoCampaign = CreateDemoCampaign;

var TilesetBuilder = (function () {
    // build an object to represent the tileset that can be used to convey the asset URL's
    function TilesetBuilder(ID, TileSetURL, BaseAssetFilePath) {
        this._ID = ID;
        this._baseFilePath = BaseAssetFilePath;
        this._baseURL = TileSetURL;
        this._creepAssets = [];
    }
    TilesetBuilder.prototype.Generate = function () {
        // set background asset object properties
        this._backgroundURL = this._baseURL + '/' + this._ID + '/background.png';

        // set wall asset object properties
        this._wallURL = this._baseURL + '/' + this._ID + '/walls.png';

        // set creep asset object properties
        this.CreepAssetLoader();

        var ts;
        ts.BackgroundURL = this._backgroundURL;
        ts.Creeps = this._creepAssets;
        ts.WallURL = this._wallURL;

        return ts;
    };

    TilesetBuilder.prototype.CreepAssetLoader = function () {
        var searchPath = this._baseFilePath + '\\CREEPS';
        var subfld = nodefs.SubDirsOf(searchPath);
        for (var i = 0; i < subfld.length; i++) {
            // a valid walk_anim.png means a valid creep
            var creepID = subfld[i];
            var walkPNG = searchPath + '\\' + creepID + '\\walk_anim.png';
            if (nodefs.Exists(walkPNG)) {
                var creep;
                creep.GameObjectID = creepID;
                creep.WalkAnimationURL = this._baseURL = '/' + creepID + '/walk_anim.png';

                var diePNG = searchPath + '\\' + creepID + '\\die_anim.png';
                if (nodefs.Exists(diePNG)) {
                    creep.DieAnimationURL = this._baseURL = '/' + creepID + '/die_anim.png';
                }

                this._creepAssets.push(creep);
            }
        }
    };
    return TilesetBuilder;
})();
//# sourceMappingURL=td.js.map
