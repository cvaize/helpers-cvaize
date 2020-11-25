const fs = require('fs');
const Path = require('path');
const ImageMagick = require('imagemagick');

function pngToJpgWebp(filename){
    return new Promise(function (resolve) {
        ImageMagick.convert(
            [
                filename+'.png',
                '-background',
                'rgb(255,255,255)',
                '-flatten',
                filename+'.jpg'
            ],
            function (err, stdout) {
                resolve();
            }
        );
    });
}

function pngToWebp(filename){
    return new Promise(function (resolve) {
        ImageMagick.convert(
            [
                filename+'.png',
                '-quality',
                '100',
                '-define',
                'webp:lossless=false',
                filename+'.webp'
            ],
            function (err, stdout) {
                resolve();
            }
        );
    });
}

async function convertPngToJpgAndWebp(filename) {
    await pngToJpgWebp(filename);
    await pngToWebp(filename);
}

const recursive = async function(path) {
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        for (let index = 0; index < files.length; index++) {
            let file = files[index];
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                await recursive(curPath);
            } else {
                let filePaths = curPath.split('/');
                let fileFullName = filePaths.pop();
                let filePath = filePaths.join('/');
                let fileChunksName = fileFullName.split('.');
                let fileExtension = fileChunksName.pop();
                let fileName = fileChunksName.join('.');
                fileName = Path.join(filePath, fileName);
                if(fileExtension === 'png'){
                    console.log('file ', curPath);
                    await convertPngToJpgAndWebp(fileName);
                }
            }
        }
    }
};

recursive('C:\\OpenServer\\domains\\evrazen.ru\\public\\img\\catalog\\race\\motorcycle-pants');


