const path = require("path");
const { unzip, readDir, grayScale } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

function main() {
    unzip(zipFilePath, pathUnzipped)
        .then(() => readDir(pathUnzipped))
        .then((pngFiles) => {
            const promiseGrayScaleFiles = pngFiles.map((file) =>
                grayScale(file, pathProcessed)
            );
            return Promise.all(promiseGrayScaleFiles).then(() => {console.log('done')})
        })
        .catch((err) => {
            console.error("An error occurred:", err);
        });
}

main();
