const fs = require('fs');
const Path = require('path');

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
                if(fileExtension === 'php'){
                    let fileFullPath = Path.join(filePath, fileName+'.'+fileExtension);
                    console.log('file ', fileFullPath);
                    let content = fs.readFileSync(fileFullPath, 'utf-8');
                    let startIndex = content.indexOf('/**');
                    let endIndex = content.indexOf('class ');
                    if(startIndex !== -1 && endIndex !== -1 && startIndex < endIndex){
                        fs.writeFileSync(fileFullPath, content.slice(0, startIndex)+content.slice(endIndex))
                    }
                }
            }
        });
    }
};

recursive('/var/www/sites/monument-kz.com/app/Models');
