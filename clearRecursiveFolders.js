const fs = require('fs');
const Path = require('path');
const rimraf = require("rimraf");

const startFolder = 'C:\\OpenServer\\domains';
const removeFiles = {
    'node_modules': {count: 0},
    'vendor': {count: 0, if(curPath, files){
        return files.indexOf('composer.json') !== -1
        }},
    // '.idea': {count: 0},
    'package-lock.json': {count: 0},
    'composer.lock': {count: 0},
};

const ignoreFolders = [ // ignoreFolderName or /var/www/sites/ignoreFolderName
];

const recursive = function(path) {
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        for (let index = 0; index < files.length; index++) {
            let file = files[index];
            const curPath = Path.join(path, file);
            let removeFile = removeFiles[file];

            if(ignoreFolders.indexOf(curPath) !== -1 || ignoreFolders.indexOf(file) !== -1){
                continue;
            }

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                if(!removeFile){
                    recursive(curPath);
                }
            }

            if(removeFile){
                if(!removeFile.if || removeFile.if(curPath, files)){
                    rimraf.sync(curPath);
                }

                removeFiles[file].count++;
                console.log('Removed "'+file+'" count='+removeFiles[file].count)
            }
        }
    }
};

recursive(startFolder);
console.log('Final statistics');

for (const fileKey in removeFiles) {
    console.log(fileKey + ' = ' + removeFiles[fileKey].count);
}

