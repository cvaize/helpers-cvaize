const fs = require('fs');
const Path = require('path');
const rimraf = require("rimraf");

const removeFiles = [
    'node_modules',
    'vendor',
    '.idea',
    'package-lock.json',
    'composer.lock',
];

const countRemoveFiles = {};

for (let i = 0; i < removeFiles.length; i++) {
    countRemoveFiles[removeFiles[i]] = 0;
}

const recursive = function(path) {
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        for (let index = 0; index < files.length; index++) {
            let file = files[index];
            const curPath = Path.join(path, file);
            let removeIndex = removeFiles.indexOf(file);

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                console.log(curPath);
                if(removeIndex === -1){
                    recursive(curPath);
                }
            }

            if(removeIndex !== -1){
                rimraf.sync(curPath);

                countRemoveFiles[file]++;
                console.log('Removed "'+file+'" count='+countRemoveFiles[file])
            }
        }
    }
};

recursive('/var/www/sites');
console.log('Final statistics');

for (let i = 0; i < removeFiles.length; i++) {
    console.log(removeFiles[i] + ' = ' + countRemoveFiles[removeFiles[i]]);
}

