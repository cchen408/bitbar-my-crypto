const Gdax = require('gdax');

// map to gdax product id
const idMap = {
    btc: 'BTC-USD',
    eth: 'ETH-USD',
    ltc: 'LTC-USD',
    bch: 'BCH-USD'
};

module.exports = {

    btcClient: null,
    ethClient: null,
    ltcClient: null,
    bchClient: null,

    /**
     * getPublicClient
     * @param currency
     */
    getPublicClient: function (currency) {
        var productId = idMap[currency];
        if (!productId) {
            // console.warn('no currency given default to btc');
        }


        if (!this[`${currency}Client`]) {
            this[`${currency}Client`] = new Gdax.PublicClient(productId);
        }

        return this[`${currency}Client`];
    },

    /**
     * getProductTicker - promisify gdax's getProductTicker
     * @param currency
     * @returns {Promise}
     */
    getProductTicker: function (currency) {
        var publicClient = this.getPublicClient(currency);
        return new Promise(function (resolve, reject) {
            publicClient.getProductTicker(function (error, response, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    },

    /**
     * getPrice
     * @param currency
     */
    getPrice: async function(currency){
        var data = await this.getProductTicker(currency);
        return data.price;
    }


};