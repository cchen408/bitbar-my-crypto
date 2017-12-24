var _ = require('lodash');
const binance = require('node-binance-api');
const apiKeys = require('./api-keys').binance;
var gdax = require('./gdax');

binance.options({
    'APIKEY': apiKeys.key,
    'APISECRET': apiKeys.secret
});

module.exports = {

    // all binance prices
    allPrices: {},

    /**
     * promisify binance's prices function
     * @returns {Promise}
     */
    prices: async function () {
        return new Promise(function (resolve, reject) {
            binance.prices(function (ticker) {
                resolve(ticker);
            });
        });
    },

    /**
     * get price
     * @returns {Promise.<void>}
     */
    getPriceUsd: async function (currency) {
        let inBtc = `${_.toUpper(currency)}BTC`;
        let inEth = `${_.toUpper(currency)}Eth`;

        // get price of eth and btc from gdax
        let ethPrice= await gdax.getPrice('eth');
        let btcPrice = await gdax.getPrice('btc');

        // get prices from binance
        let prices = await this.prices();
        let currencyEthPrice = prices[inEth] || 0;
        let currencyBtcPrice = prices[inBtc] || 0;

        let price1 = currencyEthPrice * ethPrice;
        let price2 = currencyBtcPrice * btcPrice;
        //
        // console.log('price from selling it to ethereum:', price1);
        // console.log('price from selling it to btc:', price2);

        let bestPrice = Math.max(price1, price2);
        // console.log('best price:', bestPrice);
        return bestPrice;
    }


};