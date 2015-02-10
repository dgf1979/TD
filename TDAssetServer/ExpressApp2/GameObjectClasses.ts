// a campaign, consisting of multiple waves
export class Campaign {
    ID: string;
    Name: string;
    Author: string;
    TilesetID: string;
    MapURL: string;
    Waves: Wave[];
}

// a wave, each consisting of a number of creeps of a specific type
export class Wave {
    SpawnDelay: number;
    CreepIndex: number;
    CreepCount: number;
    CreepSpeed: number;
}

// tileset classes

// a tileset, with URLs to each asset
export class Tileset {
    ID: string;
    Name: string;
    Author: string;
    WallURL: string;
    BackgroundURL: string;
    Creeps: Creep;
    Towers: Tower;
}

// asset URLs for a partucular type of creep
export class CreepAssets {
    WalkAnimationURL: string;
    DieAnimationURL: string;
}

// asset URLs for a partucular type of creep
export class TowerAssets {
    BaseURL: string;
    RotatorURL: string;
}

// asset-related creep info
export class Creep {
    name: string;
    assets: CreepAssets;
}

// asset-related tower info
export class Tower {
    name: string;
    assets: TowerAssets;
}




