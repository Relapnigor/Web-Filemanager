// Filesystem and view-data helpers shared by file-related routes.
const fs = require("fs");
const path = require("path");

function relativeUploadPath(fullPath) {
    const parts = fullPath.split("\\");
    let started = false;
    let result = "";

    for (const part of parts) {
        if (started) {
            result = path.join(result, part);
        }
        if (part === "upload") {
            started = true;
        }
    }
    return result;
}

function readUploads(readPath, state) {
    state.allFiles = { files: [], folders: [] };
    state.directoryNames = [];
    state.fileNames = [];

    fs.readdir(readPath, (error, files) => {
        if (error) {
            throw error;
        }

        files.forEach((file) => {
            const filePath = path.join(readPath, file);
            const startPath = relativeUploadPath(filePath);

            fs.lstat(filePath, (statError, stats) => {
                if (statError) {
                    throw statError;
                }

                const item = { name: file, path: startPath };
                if (stats.isDirectory()) {
                    if (!state.directoryNames.includes(item.name)) {
                        state.allFiles.folders.push(item);
                        state.directoryNames.push(item.name);
                    }
                } else if (!state.fileNames.includes(item.name)) {
                    state.allFiles.files.push(item);
                    state.fileNames.push(item.name);
                }
            });
        });
    });
}

function uniqueFileName(filePath, fileInfo, currentPath, uploadPath) {
    let fileName = fileInfo.name;
    const nameParts = fileName.split(".");
    const originalName = nameParts[0];
    const extension = nameParts[1];

    if (fs.existsSync(filePath)) {
        let copyNumber = 1;
        while (fs.existsSync(filePath)) {
            fileName = copyNumber === 1
                ? `${originalName} - kopia.${extension}`
                : `${originalName} - kopia (${copyNumber}).${extension}`;
            filePath = path.join(uploadPath, currentPath, fileName);
            copyNumber++;
        }
    }
    return fileName;
}

function buildPathData(relativePath) {
    const paths = [];
    if (relativePath !== "") {
        let sendPath = "";
        relativePath.split("\\").forEach((part) => {
            sendPath += `${part}\\`;
            paths.push({ name: part, send: sendPath });
        });
    }
    return { paths };
}

function copyWithCollision(originalPath) {
    const extension = path.extname(originalPath);
    const basePath = originalPath.slice(0, originalPath.length - extension.length);
    let candidate = originalPath;
    let copyNumber = 1;

    while (fs.existsSync(candidate)) {
        candidate = copyNumber === 1
            ? `${basePath} - kopia${extension}`
            : `${basePath} - kopia (${copyNumber})${extension}`;
        copyNumber++;
    }
    return candidate;
}

module.exports = {
    relativeUploadPath,
    readUploads,
    uniqueFileName,
    buildPathData,
    copyWithCollision
};
