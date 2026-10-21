// File-manager routes: uploads, navigation, creation, metadata, downloads and deletion.
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const {
    relativeUploadPath,
    readUploads,
    uniqueFileName,
    buildPathData
} = require("./helpers");

function loggedIn(req) {
    return typeof req.cookies.login !== "undefined";
}

function registerFileRoutes(app, state) {
    app.post("/filemanager", function (req, res) {
        const currentPath = req.query.path || "";
        const form = formidable({
            uploadDir: state.uploadPath,
            keepExtensions: true,
            multiples: true
        });

        form.parse(req, function (error, fields, files) {
            if (error) {
                throw error;
            }
            const uploaded = files.fileupload;
            const items = Array.isArray(uploaded) ? uploaded : [uploaded];

            items.forEach((item) => {
                const temporaryName = path.basename(item.path);
                const destinationPath = path.join(state.uploadPath, currentPath, item.name);
                const fileName = uniqueFileName(destinationPath, item, currentPath, state.uploadPath);
                const destination = path.join(state.uploadPath, currentPath, fileName);

                fs.rename(path.join(state.uploadPath, temporaryName), destination, (renameError) => {
                    if (renameError) {
                        throw renameError;
                    }
                    fs.copyFile(destination, path.join(state.publicUploadPath, fileName), (copyError) => {
                        if (copyError) {
                            throw copyError;
                        }
                    });
                });
                state.nextFileId++;
            });
            res.redirect(`/filemanager?path=${currentPath}`);
        });
    });

    app.get("/filemanager", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }

        const createType = req.query.tc;
        let dialog = { diag: false };
        if (createType === "Nowy folder") {
            dialog = { diag: true, type: "folder" };
        } else if (createType === "Nowy plik tekstowy") {
            dialog = { diag: true, type: "plik" };
        } else if (createType === "Zmiana nazwy folderu") {
            dialog = { diag: true, type: "folder", rename: true };
        }

        state.folderPath = typeof req.query.path === "undefined"
            ? state.uploadPath
            : path.join(state.uploadPath, req.query.path);
        readUploads(state.folderPath, state);
        const relativePath = relativeUploadPath(state.folderPath);
        const context = {
            all_files: state.allFiles,
            show: { show: false },
            diag: dialog,
            c_path: relativePath,
            format_path: buildPathData(relativePath)
        };
        return res.render("filemanager.hbs", context);
    });

    app.get("/filemanager/folder/rename", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }

        const renamePath = path.join("upload", req.query.path);
        const originalPath = path.join(path.dirname(renamePath), req.query.name.replace(".", "_"));
        let newPath = originalPath;

        if (req.query.next === "ok") {
            let copyNumber = 1;
            while (fs.existsSync(newPath)) {
                newPath = copyNumber === 1
                    ? `${originalPath} - kopia`
                    : `${originalPath} - kopia (${copyNumber})`;
                copyNumber++;
            }
            return fs.rename(renamePath, newPath, (error) => {
                if (error) {
                    return console.log(error);
                }
                return res.redirect(`/filemanager?path=${newPath.replace("upload", "")}`);
            });
        }
        if (req.query.next === "cancel") {
            return res.redirect(`/filemanager?path=${renamePath}`);
        }
    });

    app.get("/filemanager/:type", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        const folderPath = req.query.path;
        if (req.query.next === "cancel") {
            return res.redirect(`/filemanager?path=${folderPath}`);
        }
        if (req.query.next !== "ok") {
            return undefined;
        }

        const type = req.params.type;
        const originalName = req.query.name;
        let fileName = originalName === "" ? "Bez nazwy" : originalName;
        const newPath = path.join(state.uploadPath, folderPath, fileName);
        let uniquePath = newPath;
        let copyNumber = 1;
        while (fs.existsSync(uniquePath)) {
            fileName = originalName + (copyNumber === 1 ? " - kopia" : ` - kopia (${copyNumber})`);
            uniquePath = path.join(state.uploadPath, folderPath, fileName);
            copyNumber++;
        }

        if (type === "plik") {
            const extension = path.extname(uniquePath).slice(1);
            const layoutPath = path.join(state.rootPath, "static", "f_layouts", `${extension}.${extension}`);
            const content = fs.existsSync(layoutPath)
                ? fs.readFileSync(layoutPath, "utf8")
                : `file generated at ${Date.now()}`;
            fs.writeFileSync(uniquePath, content);
        } else if (type === "folder") {
            fs.mkdirSync(uniquePath);
        }
        return res.redirect(`/filemanager?path=${folderPath}`);
    });

    app.get("/previewFile", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        return res.render("preview.hbs", { img: path.basename(req.query.name) });
    });

    app.get("/info", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        let info = state.lastFile;
        const match = state.allFiles.files.find((file) => file.id == req.query.id);
        if (match) {
            info = match;
            state.lastFile = match;
        }
        return res.render("info.hbs", info);
    });

    app.get("/download/:id", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        const file = state.allFiles.files.find((item) => item.id == req.params.id);
        const downloadPath = path.join(state.publicUploadPath, file.fn);
        return res.download(downloadPath, file.name);
    });

    app.get("/delete/:name", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        const [type, name] = req.params.name.split("_");
        const removePath = req.query.path;
        if (type === "d") {
            state.allFiles.folders = state.allFiles.folders.filter((folder) => folder.name !== name);
            fs.rmdir(path.join(state.rootPath, "upload", removePath), () => {});
        } else if (type === "f") {
            state.allFiles.files = state.allFiles.files.filter((file) => file.name !== name);
            fs.unlink(path.join(state.rootPath, "upload", removePath), () => {});
        }
        const parts = removePath.split("\\");
        const parent = parts.slice(0, -1).join("\\");
        return res.redirect(parent ? `/filemanager?path=${parent}` : "/filemanager");
    });

    app.get("/reset", function (req, res) {
        if (!loggedIn(req)) {
            return res.redirect("/login");
        }
        state.allFiles = { files: [] };
        return res.redirect("/");
    });
}

module.exports = { registerFileRoutes };
