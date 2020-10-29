const fs = require('fs');
const Path = require('path');
const makeDir = require('make-dir');
const rimraf = require("rimraf");
const compressImages = require("compress-images");

const rootPath = '/var/www/sites/api.cromi.ru/';

const inputPath = "original-storage-images/app/uploads/public/";
const outputPath = "storage/app/uploads/public/";

const INPUT = rootPath+inputPath;
const OUTPUT = rootPath+outputPath;

const extensions = 'jpg,JPG,jpeg,JPEG,png,gif';

!fs.existsSync(INPUT) && fs.mkdirSync(INPUT);
!fs.existsSync(OUTPUT) && fs.mkdirSync(OUTPUT);

let totalImages = 0;
let currentImages = 0;

const recursiveCopyFiles = async function(path) {
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        for (let index = 0; index < files.length; index++) {
            let file = files[index];
            const curPath = Path.join(path, file);

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                await recursiveCopyFiles(curPath);
            }else{
                let extension = file.split('.')
                extension = extension[extension.length - 1];
                if(extensions.indexOf(extension) !== -1){
                    totalImages++
                    let relativePath = curPath.split(outputPath)
                    relativePath = relativePath[relativePath.length - 1]
                    if (!fs.existsSync(INPUT+relativePath)) {
                        console.log('Copy file to original-storage-images '+relativePath)
                        makeDir.sync(INPUT+relativePath.split(file)[0])
                        fs.copyFileSync(curPath, INPUT+relativePath)
                    }
                }
            }
        }
    }
};

const recursiveSyncCompress = async function(path) {
    if (fs.existsSync(path)) {
        let files = fs.readdirSync(path);
        for (let index = 0; index < files.length; index++) {
            let file = files[index];
            const curPath = Path.join(path, file);

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                await recursiveSyncCompress(curPath);
            }else{
                let extension = file.split('.')
                extension = extension[extension.length - 1];
                if(extensions.indexOf(extension) !== -1){

                    let relativePath = curPath.split(inputPath)
                    relativePath = relativePath[relativePath.length - 1]

                    await new Promise(function (resolve){
                        rimraf.sync(OUTPUT+relativePath);
                        let output = (OUTPUT+relativePath).split(file)[0];
                        compressImages(curPath, output, {
                                compress_force: true,
                                statistic: true,
                                autoupdate: true
                            }, false,
                            {jpg: {engine: "mozjpeg", command: ["-quality", "80"]}},
                            {png: {engine: "pngquant", command: ["--quality=60-80", "-o"]}},
                            {svg: {engine: "svgo", command: "--multipass"}},
                            {gif: {engine: "gifsicle", command: ["--colors", "64", "--use-col=web"]}},
                            function (error, completed, statistic) {
                                currentImages++;
                                console.log("-------------");
                                console.log(error);
                                console.log(completed);
                                console.log(statistic);
                                console.log("-------------");
                                console.log(currentImages+'/'+totalImages)
                                if(error){
                                    fs.copyFileSync(curPath, OUTPUT+relativePath)
                                }
                                resolve();
                            }
                        );
                    })

                }
            }
        }
    }
};

recursiveCopyFiles(OUTPUT).then(function (){
    recursiveSyncCompress(INPUT);
    // Ниже асинхронная реализация, которая при большом количестве файлов отправит вашу машину в полет, как ракету =)
    // compressImages(`${INPUT}**/*.{${extensions}}`, OUTPUT, {
    //         compress_force: true,
    //         statistic: true,
    //         autoupdate: true
    //     }, false,
    //     {jpg: {engine: "mozjpeg", command: ["-quality", "80"]}},
    //     {png: {engine: "pngquant", command: ["--quality=60-80", "-o"]}},
    //     {svg: {engine: "svgo", command: "--multipass"}},
    //     {gif: {engine: "gifsicle", command: ["--colors", "64", "--use-col=web"]}},
    //     function (error, completed, statistic) {
    //         console.log("-------------");
    //         console.log(error);
    //         console.log(completed);
    //         console.log(statistic);
    //         console.log("-------------");
    //     }
    // );
});

