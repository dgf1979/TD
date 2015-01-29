// a campaign, consisting of multiple waves, which consist of set of creeps
var Campaign = (function () {
    function Campaign() {
    }
    return Campaign;
})();
exports.Campaign = Campaign;

var Wave = (function () {
    function Wave() {
        this.SpawnDelay = 1;
        this.CreepIndex = 0;
        this.CreepCount = 1;
        this.CreepSpeed = 1000;
    }
    return Wave;
})();
exports.Wave = Wave;

var Tileset = (function () {
    function Tileset() {
    }
    return Tileset;
})();
exports.Tileset = Tileset;

var CreepAssets = (function () {
    function CreepAssets() {
        this.GameObjectID = '';
        this.WalkAnimationURL = '';
        this.DieAnimationURL = '';
    }
    return CreepAssets;
})();
exports.CreepAssets = CreepAssets;
//# sourceMappingURL=GameObjectClasses.js.map
