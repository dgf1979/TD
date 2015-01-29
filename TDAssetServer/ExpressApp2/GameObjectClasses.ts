

// a campaign, consisting of multiple waves, which consist of set of creeps 
export class Campaign {
    ID: string;
    TilesetID: string;
    MapURL: string;
    Waves: Wave[];
}

export class Wave {
    SpawnDelay: number = 1;
    CreepIndex: number = 0;
    CreepCount: number = 1;
    CreepSpeed: number = 1000;
}

export class Tileset {
    WallURL: string;
    BackgroundURL: string;
    Creeps: CreepAssets[];
}

export class CreepAssets {
    GameObjectID: string = '';
    WalkAnimationURL: string = '';
    DieAnimationURL: string = '';
}





