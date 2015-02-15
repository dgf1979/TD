import fs = require("fs");
    
// return subfolders of a given folder
export function SubDirsOf(ThisDir: string): string[]{
    "use strict";
    var rootdir = fs.readdirSync(ThisDir);
    var subfolders: string[] = [];
    rootdir.forEach(function (item: string) {
        var st: string = ThisDir + "\\" + item;
        if (fs.statSync(st).isDirectory() === true) { subfolders.push(item); }
    });
    return subfolders;
}

// return files of a given folder
export function SubFilesOf(ThisDir: string): string[]{
    "use strict";
    var rootdir = fs.readdirSync(ThisDir);
    var files: string[] = [];
    rootdir.forEach(function (item: string) {
        var st: string = ThisDir + "\\" + item;
        if (fs.statSync(st).isFile() === true) { files.push(item); }
    });
    return files;
}

// check if object exists
export function Exists(FileOrFolderPath: string): boolean {
    "use strict";
    return fs.existsSync(FileOrFolderPath);
}

// read JSON file
export function TextIntoJSON(FilePath: string): Object {
    "use strict";
    var obj: Object = JSON.parse(fs.readFileSync(FilePath, "utf8"));
    return obj; 
}

// read file into string
export function ReadTextFile(FilePath: string): string {
    "use strict";
    var str: string = fs.readFileSync(FilePath).toString();
    return str;
}

export function SaveObjectAsJSONFile(FilePathAndName: string, JSObject: Object) {
    "use strict";
    fs.writeFileSync(FilePathAndName, JSON.stringify(JSObject));
}
