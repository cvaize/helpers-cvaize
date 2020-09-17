const fs = require('fs');
const Path = require('path');
const { slugify } = require('transliterations');

const recursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                recursive(curPath);
            } else {
                let filePaths = curPath.split('/');
                let fileFullName = filePaths.pop();
                let filePath = filePaths.join('/');
                let fileChunksName = fileFullName.split('.');
                let fileExtension = fileChunksName.pop();
                let fileName = fileChunksName.join('.');
                fileName = slugify(fileName)+'.'+fileExtension;
                console.log('file ', curPath, '=>', fileName);
                fileName = Path.join(filePath, fileName);
                fs.renameSync(curPath, fileName);
            }
        });
        let paths = path.split('/');
        let dirName = paths.pop();
        let dirPath = paths.join('/');
        dirName = slugify(dirName);
        console.log('dir  ', path, '=>', dirName);
        dirName = Path.join(dirPath, dirName);
        fs.renameSync(path, dirName);
    }
};

recursive('/home/cvaize/Загрузки/luversy');
