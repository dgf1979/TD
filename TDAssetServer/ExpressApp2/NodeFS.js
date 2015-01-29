var fs = require('fs');

// return subfolders of a given folder
function SubDirsOf(ThisDir) {
    var rootdir = fs.readdirSync(ThisDir);
    var subfolders = [];
    rootdir.forEach(function (item) {
        var st = ThisDir + "\\" + item;
        if (fs.statSync(st).isDirectory() === true) {
            subfolders.push(item);
        }
    });
    return subfolders;
}
exports.SubDirsOf = SubDirsOf;

// return files of a given folder
function SubFilesOf(ThisDir) {
    var rootdir = fs.readdirSync(ThisDir);
    var files = [];
    rootdir.forEach(function (item) {
        var st = ThisDir + "\\" + item;
        if (fs.statSync(st).isFile() === true) {
            files.push(item);
        }
    });
    return files;
}
exports.SubFilesOf = SubFilesOf;

// check if object exists
function Exists(FileOrFolderPath) {
    return fs.existsSync(FileOrFolderPath);
}
exports.Exists = Exists;

function SaveObjectAsJSONFile(FilePathAndName, JSObject) {
    fs.writeFileSync(FilePathAndName, JSON.stringify(JSObject));
}
exports.SaveObjectAsJSONFile = SaveObjectAsJSONFile;
//# sourceMappingURL=NodeFS.js.map
