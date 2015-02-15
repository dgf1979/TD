import express = require("express");
import routes = require("./routes/td");
import http = require("http");
import path = require("path");

var app = express();

// cors middlewear
app.use(function (req: express.Request, res: express.Response, next: any) {
    if (global.ASSETURL === undefined) {
        global.ASSETURL = req.protocol + "://" + req.get("host");
        console.log("added ASSETURL: " + global.ASSETURL);
    }
    next();
});

// allow requests from other domains
var allowCrossDomain = function (req: express.Request, res: express.Response, next: any) {
    res.header("Access-Control-Allow-Origin", "*");  // * for any source
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow all common verbs
    // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // intercept OPTIONS method
    if ("OPTIONS" === req.method) {
        res.send(200);
    } else {
        next();
    }
};

// all environments
app.set("port", process.env.PORT || 1337);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);




// set the assets folder location up
global.ASSETPATH = __dirname + "\\ASSETS";
// make asset folders accessible
app.use("/TILESETS", express.static(global.ASSETPATH + "\\TILESETS"));
app.use("/CAMPAIGNS", express.static(global.ASSETPATH + "\\CAMPAIGNS"));

import stylus = require("stylus"); 
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" === app.get("env")) {
    app.use(express.errorHandler());
}

// route map
app.get("/assetpath", routes.AssetPath);
app.get("/demo", routes.CreateDemoCampaign); 
app.get("/", routes.AssetPath);
app.get("/dbtest", routes.DBTest);
// tileset routes
app.get("/tileset", routes.TileSetList);
app.get("/tileset/:id", routes.TileSetGetByID);
// campaign routes
app.get("/campaign", routes.CampaignList);
app.get("/campaign/:id", routes.CampaignGetByID);


http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
