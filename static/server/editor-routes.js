// Text and image editor routes.
const fs = require("fs");
const path = require("path");
const { copyWithCollision } = require("./helpers");

function loggedIn(req) {
    return typeof req.cookies.login !== "undefined";
}

function registerEditorRoutes(app, state) {
    app.post("/show", function (req, res) {
        if (typeof req.body.dataUrl !== "undefined") {
            const buffer = Buffer.from(req.body.dataUrl.split(",")[1], "base64");
            const fileName = path.basename(req.body.path);
            fs.writeFileSync(path.join(state.rootPath, "upload", req.body.path), buffer);
            fs.writeFileSync(path.join(state.publicUploadPath, fileName), buffer);
            if (req.body.new_name !== "") {
                const target = copyWithCollision(path.join(
                    state.rootPath,
                    "upload",
                    path.dirname(req.body.path),
                    req.body.new_name
                ));
                fs.renameSync(path.join(state.rootPath, "upload", req.body.path), target);
                fs.renameSync(
                    path.join(state.publicUploadPath, fileName),
                    path.join(state.publicUploadPath, path.basename(target))
                );
                return res.redirect(`/show?f_name=${path.join(path.dirname(req.body.path), req.body.new_name)}`);
            }
            return undefined;
        }

        if (typeof req.body.font !== "undefined") {
            const config = JSON.stringify(req.body);
            fs.writeFile(path.join(state.rootPath, "static", "settings", "settings.json"), config, (error) => {
                if (error) {
                    console.log(error);
                }
            });
            state.jsonConfig = req.body;
        }

        if (typeof req.body.new_name !== "undefined") {
            fs.writeFile(path.join(state.rootPath, "upload", req.body.file_name), req.body.file_content, (error) => {
                if (error) {
                    console.log(error);
                }
                if (req.body.new_name !== "") {
                    const original = path.join(state.rootPath, "upload", req.body.file_name);
                    const target = copyWithCollision(path.join(
                        state.rootPath,
                        "upload",
                        path.dirname(req.body.file_name),
                        req.body.new_name
                    ));
                    fs.rename(original, target, (renameError) => {
                        if (renameError) {
                            console.log(renameError);
                        }
                        res.redirect(`/show?f_name=${path.join(path.dirname(req.body.file_name), req.body.new_name)}`);
                    });
                }
            });
        }
    });

    app.get("/show", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        const fileName = req.query.f_name;
        const filePath = path.join(state.rootPath, "upload", fileName);
        const shortName = path.basename(fileName);
        const extension = path.extname(filePath).toLowerCase();

        if ([".png", ".jpg", ".jpeg"].includes(extension)) {
            return res.render("img_editor.hbs", {
                photo_path: shortName,
                show: { show: true, img: true },
                file_name: fileName,
                effects: [
                    { name: "grayscale", image_path: shortName },
                    { name: "invert", image_path: shortName },
                    { name: "sepia", image_path: shortName }
                ]
            });
        }

        return fs.readFile(filePath, "utf8", (error, data) => {
            if (error) {
                return console.error(error);
            }
            return res.render("editor.hbs", {
                photo_path: filePath,
                show: { show: true, img: false, txt: data },
                config: state.jsonConfig,
                file_name: fileName
            });
        });
    });
}

module.exports = { registerEditorRoutes };
