module GameObjectClasses {

    // a campaign, consisting of multiple waves
    export class Campaign {
        ID: string;
        TilesetID: string;
        MapURL: string;
        Waves: Wave[];
    }

    // a wave, each consisting of a number of creeps of a specific type
    export class Wave {
        SpawnDelay: number;
        CreepID: string;
        CreepCount: number;
        CreepSpeed: number;
    }

    // a tileset, with URLs to each asset
    export class Tileset {
        WallURL: string;
        BackgroundURL: string;
    }

    // asset URLs for a particular type of creep
    export class CreepAssets {
        GameObjectID: string;
        WalkAnimationURL: string;
        DieAnimationURL: string;
    }

    // asset URLs for a particular type of creep
    export class TowerAssets {
        GameObjectID: string;
        BaseURL: string;
        RotatorURL: string;
    }

}




