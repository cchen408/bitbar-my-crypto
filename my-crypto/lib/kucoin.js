const Kucoin = require('kucoin-api')
let apiKeys = require('./api-keys.json').kucoin;
let kucoin = new Kucoin(apiKeys.key, apiKeys.secret);

module.exports = {

    /**
     * getTicker
     * @param pair
     * @returns {Promise.<void>}
     */
    getTicker: async function (pair) {
        try {
            return await kucoin.getTicker(pair);
        }
        catch (error) {
            console.error("error:", error);
            return null;
        }
    }


};