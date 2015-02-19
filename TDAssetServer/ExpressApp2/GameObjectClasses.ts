// campaign classes //

// a campaign, consisting of multiple waves
export class Campaign {
    ID: string;
    Name: string;
    Author: string;
    TilesetID: string;
    MapURL: string;
    StartMoney: number;
    Waves: Wave[];
    CreepStats: CreepData[];
    TowerStats: TowerData[];
    CreepEntranceX: number;
    CreepEntranceY: number;
    CreepExitX: number;
    CreepExitY: number;
}

// a wave, each consisting of a number of creeps of a specific type
export class Wave {
    SpawnDelay: number;
    CreepIndex: number;
    CreepCount: number;
    CreepSpeed: number;
}

// campaign variables for creeps
export class CreepData {
    Index: number;
    AssetID: string;
    HitPoints: number;
    WalkSpeed: number;
    KillValue: number;
}

// campaign variables for towers
export class TowerData {
    Index: number;
    AssetID: string;
    FireRate: number;
    Damage: number;
    Range: number;
    Cost: number;
}


// tileset classes //

// a tileset, with URLs to each asset
export class Tileset {
    ID: string;
    Name: string;
    Author: string;
    WallURL: string;
    BackgroundURL: string;
    EntranceURL: string;
    ExitURL: string;
    Creeps: CreepAssets[];
    Towers: TowerAssets[];
}

// asset URLs for a partucular type of creep
export class CreepAssets {
    Index: number;
    Name: string;
    WalkAnimationURL: string;
    DieAnimationURL: string;
}

// asset URLs for a particular type of tower
export class TowerAssets {
    Index: number;
    Name: string;
    BaseURL: string;
    RotatorURL: string;
}





