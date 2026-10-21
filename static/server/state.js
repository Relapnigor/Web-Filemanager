// Shared in-memory state used by the route modules.
const path = require("path");

const rootPath = path.join(__dirname, "..", "..");

const state = {
    rootPath,
    uploadPath: path.join(rootPath, "upload"),
    publicUploadPath: path.join(rootPath, "static", "upload"),
    allFiles: { files: [], folders: [] },
    directoryNames: [],
    fileNames: [],
    nextFileId: 1,
    logins: [],
    users: [],
    lastFile: undefined,
    folderPath: "",
    jsonConfig: require(path.join(rootPath, "static", "settings", "settings.json"))
};

module.exports = { state };
