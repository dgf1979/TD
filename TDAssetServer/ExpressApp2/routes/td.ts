import express = require('express');
import nodefs = require('../NodeFS');
import goc = require('../GameObjectClasses');

// asset path for verification
export function AssetPath(req: express.Request, res: express.Response) {
    res.json(global.ASSETPATH + " (" + global.ASSETURL + ")");
};

// /tileset LIST (GET)
export function TileSetList(req: express.Request, res: express.Response) {
    res.setHeader('Content-Type', 'application/json');
    //res.json(SubDirsOf(global.ASSETPATH + "\\TILESETS"));
    res.json(NamesAndIDsOf(global.ASSETPATH + "\\TILESETS"));
};

// /tileset/:id GET (GET)
export function TileSetGetByID(req: express.Request, res: express.Response) {
    var id: string = req.params.id;
    var tilesetURL: string = global.ASSETURL + "/TILESETS/" + id;
    res.send(tilesetURL); 
}

// /campaign LIST (GET)
export function CampaignList(req: express.Request, res: express.Response) {
    res.json(nodefs.SubDirsOf('D:\\HTML5\\TDAssetServer\\ExpressApp2\\ASSETS\\CAMPAIGNS'));
};

// return names and ID's of campaign or tileset folders
function NamesAndIDsOf(ThisDir: string): Object[] {
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
    var saveAs: string = "D:\\HTML5\\TDAssetServer\\ExpressApp2\\ASSETS\\CAMPAIGNS\\C_00000\\campaign.json";

    var demoCampaign: goc.Campaign = new goc.Campaign();
    console.log("did we get this far?");
    demoCampaign.ID = 'C_00000';
    demoCampaign.MapURL = 'http://localhost/CAMPAIGNS/' + demoCampaign.ID + '/map.csv';
    demoCampaign.TilesetID = 'TS_00000';

    var wave1: goc.Wave = new goc.Wave;
    wave1.CreepCount = 1;
    wave1.CreepIndex = 0;
    wave1.CreepSpeed = 1000;
    wave1.SpawnDelay = 1;

    demoCampaign.Waves = [];
    demoCampaign.Waves.push(wave1);

    nodefs.SaveObjectAsJSONFile(saveAs, demoCampaign);
}

class TilesetBuilder {

    private _baseURL: string;
    private _baseFilePath: string;
    private _wallURL;
    private _backgroundURL;
    private _creepAssets: goc.CreepAssets[];
    private _ID: string;

    // build an object to represent the tileset that can be used to convey the asset URL's
    constructor(ID: string, TileSetURL: string, BaseAssetFilePath) {
        this._ID = ID;
        this._baseFilePath = BaseAssetFilePath;
        this._baseURL = TileSetURL;
        this._creepAssets = [];
    }

    Generate(): goc.Tileset {
        // set background asset object properties
        this._backgroundURL = this._baseURL + '/' + this._ID + '/background.png'

        // set wall asset object properties
        this._wallURL = this._baseURL + '/' + this._ID + '/walls.png'

        // set creep asset object properties
        this.CreepAssetLoader();

        var ts: goc.Tileset;
        ts.BackgroundURL = this._backgroundURL;
        ts.Creeps = this._creepAssets;
        ts.WallURL = this._wallURL;

        return ts;
    }

    private CreepAssetLoader() {
        var searchPath: string = this._baseFilePath + '\\CREEPS';
        var subfld: string[] = nodefs.SubDirsOf(searchPath); // get each 'creep' subfolder 
        for (var i = 0; i < subfld.length; i++) {
            // a valid walk_anim.png means a valid creep
            var creepID = subfld[i];
            var walkPNG: string = searchPath + '\\' + creepID + '\\walk_anim.png';
            if (nodefs.Exists(walkPNG)) {
                var creep: goc.CreepAssets;
                creep.GameObjectID = creepID;
                creep.WalkAnimationURL = this._baseURL = '/' + creepID + '/walk_anim.png';

                var diePNG: string = searchPath + '\\' + creepID + '\\die_anim.png';
                if (nodefs.Exists(diePNG)) {
                    creep.DieAnimationURL = this._baseURL = '/' + creepID + '/die_anim.png';
                }

                this._creepAssets.push(creep);
            }
        }

    }

}

