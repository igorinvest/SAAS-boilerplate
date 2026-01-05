const fs = require('fs');
const path = require('path');

const filePaths = [];

const loadStaticFolder = async function(folderPath) {
    const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(folderPath, file.name);
        if (file.isDirectory()) {
            await loadStaticFolder(fullPath);
        } else {
            filePaths.push(fullPath);
        }
    }
}

module.exports.loadStaticFolder = loadStaticFolder;
module.exports.staticFiles = filePaths;