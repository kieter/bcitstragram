/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
    fs = require("fs").promises,
    PNG = require("pngjs").PNG,
    path = require("path"),
    pipeline = require('stream').pipeline,
    { createReadStream, createWriteStream } = require("fs");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
    return new Promise((resolve, reject) => {
        createReadStream(pathIn)
            .pipe(unzipper.Extract({ path: pathOut }))
            .promise()
            .then(() => {
                console.log('unzipped');
                resolve('unzipped');
            })
            .catch((err) => {
                console.log('error', err);
                reject(err);
            });
    });
};


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @return {promise}
 * @param dir
 */
const readDir = (dir) => {
    return fs.readdir(dir).then((files) => {
        const pngFiles = files.filter((file) => path.extname(file) === ".png");
        return pngFiles.map((file) => path.join(dir, file));
    });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @return {promise}
 * @param pathIn
 * @param pathOut
 */
const grayScale = (pathIn, pathOut) => {
    const inPNGReadableStream = createReadStream(pathIn);
    const pixelTransformStream = new PNG({ filterType: 4 }).on("parsed", grayscaleHandler);
    const outFilePath = path.join(pathOut, path.basename(pathIn, ".png") + ".png");
    const outWriteStream = createWriteStream(outFilePath);
    pipeline(
        inPNGReadableStream,
        pixelTransformStream,
        outWriteStream,
        (err) => {
            console.log("error", err)
        }
    )
};

const grayscaleHandler = function () {
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {

            const idx = (this.width * y + x) << 2;
            const r = this.data[idx];
            const g = this.data[idx + 1];
            const b = this.data[idx + 2];
            const gray = ((r + g + b) / 3);
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
        }
    }
    this.pack();
}

module.exports = {
    unzip,
    readDir,
    grayScale,
};
