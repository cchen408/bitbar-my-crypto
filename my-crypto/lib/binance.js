var _ = require('lodash');
const binance = require('node-binance-api');
const apiKeys = require('./api-keys').binance;
var gdax = require('./gdax');
var util = require('./util');

binance.options({
    'APIKEY': apiKeys.key,
    'APISECRET': apiKeys.secret
});

module.exports = {

    // all binance prices
    allPrices: null,
    sorted: null,

    /**
     * promisify binance's prices function
     * @returns {Promise}
     */
    prices: async function () {
        // util.log(`get all binance prices`);
        return new Promise(function (resolve, reject) {
            binance.prices(function (ticker) {
                // util.log(`response binance ticker`, ticker);
                resolve(ticker);
            });
        });
    },

    /**
     * getPrices
     * @returns {Promise.<void>}
     */
    getPrices: async function () {

        var basePairs = [
            'btc',
            'eth',
            'bnb',
            'usdt'
        ];

        var all = {
            eth: {},
            btc: {},
            bnb: {},
            usdt: {},
        };


        if (!this.allPrices) {
            var prices = await this.prices();
        }


        // list through prices and
        _.forIn(prices, function (price, pair) {
            pair = _.toLower(pair);
            // util.log(`pair: ${pair} price: ${price}`);
            _.each(basePairs, function (basePair) {
                var index = pair.indexOf(basePair);
                if (index != -1) {
                    var symbol = pair.substring(0, index);
                    // util.log(symbol);
                    _.set(all, `${basePair}.${symbol}`, price);
                }
            });

        });

        this.sorted = all;

    },

    /**
     * get price
     * @param symbol
     * @returns {Promise.<void>}
     */
    getPriceUsd: async function (symbol) {

        if (!this.sorted) {
            await this.getPrices();
        }

        symbol = _.toLower(symbol);
        util.log(`get price for ${symbol}`);

        var ethPrices = this.sorted.eth;
        // var btcPrices = this.sorted.btc;

        // get price of eth and btc from gdax
        let ethUsd = await gdax.getPrice('eth');
        // let btcUsd = await gdax.getPrice('btc');

        let ethPrice = ethPrices[symbol];
        // let btcPrice = btcPrices[symbol];


        if (!ethPrice) {
            return null;
        }

        let price1 = ethPrice * ethUsd;
        // let price2 = btcPrice * btcUsd;

        // util.log('price from selling it to ethereum:', price1);
        // util.log('price from selling it to btc:', price2);

        // let bestPrice = Math.max(price1, price2);
        // util.log('best price:', price1);
        return price1;
    }


};