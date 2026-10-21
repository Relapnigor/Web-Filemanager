// Application entry point. Route implementations live in static/server.
const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");
const handlebars = require("express-handlebars");
const { registerAuthRoutes } = require("./static/server/auth-routes");
const { registerFileRoutes } = require("./static/server/file-routes");
const { registerEditorRoutes } = require("./static/server/editor-routes");
const { state } = require("./static/server/state");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(nocache());

// Configure Handlebars helpers used by the file manager templates.
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", handlebars({
    defaultLayout: "main.hbs",
    extname: ".hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: {
        fext: function (fileType) {
            const extension = fileType.includes(".") ? fileType.split(".")[1] : "folder";
            let iconPath = `icons/filetype-${extension}.svg`;
            if (!fs.existsSync(path.join(__dirname, "static", iconPath))) {
                iconPath = "/icons/filetype-unknown.svg";
            }
            return iconPath;
        },
        p_name: function (name) {
            return path.join(state.folderPath || "", name);
        }
    }
}));
app.set("view engine", "hbs");

registerAuthRoutes(app, state);
registerFileRoutes(app, state);
registerEditorRoutes(app, state);

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});
