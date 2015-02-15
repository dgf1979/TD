﻿var fs = require("fs");

// return subfolders of a given folder
function SubDirsOf(ThisDir) {
    "use strict";
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
    "use strict";
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
    "use strict";
    return fs.existsSync(FileOrFolderPath);
}
exports.Exists = Exists;

// read JSON file
function TextIntoJSON(FilePath) {
    "use strict";
    var obj = JSON.parse(fs.readFileSync(FilePath, "utf8"));
    return obj;
}
exports.TextIntoJSON = TextIntoJSON;

// read file into string
function ReadTextFile(FilePath) {
    "use strict";
    var str = fs.readFileSync(FilePath).toString();
    return str;
}
exports.ReadTextFile = ReadTextFile;

function SaveObjectAsJSONFile(FilePathAndName, JSObject) {
    "use strict";
    fs.writeFileSync(FilePathAndName, JSON.stringify(JSObject));
}
exports.SaveObjectAsJSONFile = SaveObjectAsJSONFile;
//# sourceMappingURL=NodeFS.js.map
