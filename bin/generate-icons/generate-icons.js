const _ = require('lodash');
const fs = require('fs');
const request = require('request-promise');
const base64 = require('node-base64-image');
const rimraf = require('rimraf');
const gm = require('gm').subClass({imageMagick: true});
const dir = './tmp';
const dir2 = './icons';

var icons = require('./icons.json');

generateIcons();

async function generateIcons() {

    // get data from cmc
    var cmcData = await request({
        method: 'GET',
        url: 'https://api.coinmarketcap.com/v1/ticker/?limit=150',
        json: true
    });

    // create directories if they do not exist already
    createDirectories([dir, dir2]);

    // loop through each symbol
    var promises = [];
    _.each(cmcData, async function (data) {
        var promise = async function(){
                var symbol = _.toLower(data.symbol);
            try {
                await downloadImage(symbol);
            }
            catch (error) {
                console.log(`error downloading symbol: ${symbol}`)
            }
            try {
                await resizeImage(symbol);
            }
            catch (error) {
                console.log(`error resizing symbol: ${symbol}`)
            }

            try {
                await base64image(symbol);
            }
            catch (error) {
                console.log(`error base64 symbol: ${symbol}`)
            }
        }
        promises.push(promise());
    });
    await Promise.all(promises);

    // create a json file with all the icons base64
    writeIconsFile();

    // remove the temp directory
    cleanUp();

}

/**
 * downloadImage
 * @param symbol
 * @returns {Promise}
 */
function downloadImage(symbol) {
    // console.log(`download ${symbol} image`);
    return new Promise(async function (resolve, reject) {
        var symbolUrl = `https://github.com/cjdowner/cryptocurrency-icons/blob/master/32/color/${symbol}.png?raw=true'`;
        request(symbolUrl)
            .pipe(fs.createWriteStream(`${dir}/${symbol}.png`))
            .on('error', function (error) {
                reject(error);
            })
            .on('close', function () {
                resolve(true);
            })
        // console.log(`download ${symbol} image complete`)
    });
}

/**
 * resizeImage
 * @param symbol
 * @returns {Promise.<void>}
 */
async function resizeImage(symbol) {
    // console.log(`resize ${symbol} image`);
    return new Promise(function (resolve, reject) {
        gm(`${dir}/${symbol}.png`)
            .resize(16, 16)
            .write(`${dir2}/${symbol}.png`, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                // console.log(`resize ${symbol} image complete`);
                resolve(true);
            });
    });
}

/**
 * base64 image
 * @param symbol
 * @returns {*}
 */
function base64image(symbol) {
    // console.log(`base64 symbol: ${symbol}`);
    return new Promise(function(resolve, reject){
        base64.encode(`${dir2}/${symbol}.png`, {
            string: true,
            local: true
        }, function (error, response) {
            if (error) {
                console.error('error:', error);
                resolve(error);
            }
            // console.log(`base64 symbol: ${symbol} response: ${response}`);
            icons[symbol] = response;
            resolve(response);
        })
    });

}

/**
 * createDirectories
 * @param directories
 */
function createDirectories(directories) {
    _.each(directories, function (dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
}

/**
 * writeIconsFile
 */
function writeIconsFile(){
    fs.writeFile('./icons.json', JSON.stringify(icons), 'utf8', function(err){
        if(err){
            console.error(err);
            throw err;
        }
        console.log('icon file saved');
    });
}

/**
 * cleanUp
 */
function cleanUp(){
    rimraf(`./${dir}/`, {}, function(err){
        if(err){
            throw err;
        }
        console.log('removed');
    })
}