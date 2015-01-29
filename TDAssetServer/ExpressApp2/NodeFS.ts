import fs = require('fs');
    
    // return subfolders of a given folder
    export function SubDirsOf(ThisDir: string): string[] {
        var rootdir = fs.readdirSync(ThisDir);
        var subfolders: string[] = [];
        rootdir.forEach(function (item: string) {
            var st: string = ThisDir + "\\" + item;
            if (fs.statSync(st).isDirectory() === true) { subfolders.push(item) }
        });
        return subfolders;
    }

    // return files of a given folder
    export function SubFilesOf(ThisDir: string): string[] {
        var rootdir = fs.readdirSync(ThisDir);
        var files: string[] = [];
        rootdir.forEach(function (item: string) {
            var st: string = ThisDir + "\\" + item;
            if (fs.statSync(st).isFile() === true) { files.push(item) }
        });
        return files;
    }

    // check if object exists
    export function Exists(FileOrFolderPath: string): boolean {
        return fs.existsSync(FileOrFolderPath);
    }

export function SaveObjectAsJSONFile(FilePathAndName: string, JSObject: Object) {
    fs.writeFileSync(FilePathAndName, JSON.stringify(JSObject));
}
