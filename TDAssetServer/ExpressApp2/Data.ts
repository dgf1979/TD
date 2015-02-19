import nodefs = require("./NodeFS");
import sqlite3 = require("sqlite3");

// singleton database handler
export class DataStorage {

    // singleton stuff
    private static _instance: DataStorage = null;
    
    private _sqlFldr: string = __dirname + "\\SQL";
    private _db: sqlite3.Database;

    // do not call directly - use the instance
    constructor() {
        if (DataStorage._instance) {
            throw new Error("Error: Instantiation of DataStorage must be done through Instance() method");
        }
        this._db = new sqlite3.Database(this._sqlFldr + "\\towerdefense.db");
        console.log("running constructor logic");
        this.Setup();
        DataStorage._instance = this;
    }

    // singlton instance
    public static Instance(): DataStorage {
        console.log("creating instance of DataStorage");
        if (DataStorage._instance === null) {
            console.log("*NEW* instance of DataStorage");
            DataStorage._instance = new DataStorage();
        } else {
            console.log("returning extant copy of DataStorage");
        }
        return DataStorage._instance;
    }

    // make sure tables exist
    private Setup() {
        var createTables: string[] = [];
        var s: string = nodefs.ReadTextFile(this._sqlFldr + "\\td_Create_tables.sql");
        createTables = s.split("\n");
        this._db.serialize(() => {
            for (var i = 0; i < createTables.length; i++) {
                var line: string = createTables[i];
                if (line.substring(0, 6).toUpperCase() === "CREATE") {
                    this._db.run(line);
                }
            }
        });
    }

    // insert author, return rowID
    InsertNewAuthor(Username: string, Email: string) {
        var sql1: string = "INSERT INTO Authors VALUES (?,?,?)";
        this._db.serialize(() => {
            var stmt: sqlite3.Statement = this._db.prepare(sql1);
            stmt.run(null, Username, Email);
            stmt.finalize();
            this._db.get("SELECT last_insert_rowid() as id", function (err, row) {
                console.log("ROWID: " + row["id"]);
            });
        });
    }

    
}



