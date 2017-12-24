var _ = require('lodash');

var cmc = require('./cmc');
var gdax = require('./gdax');
var binance = require('./binance');

var icon = {
    "id": "icon",
    "name": "Icon",
    "symbol": "ICX",
};

module.exports = {

    data: {
        icon
    },

    /**
     * get data from everywhere
     * @returns {Promise.<void>}
     */
    getAllData: async function () {
        await this.getCmcData();
        await this.getGdaxData();
        await this.getBinanceData();
    },

    /**
     * get data from coinmarketcap
     */
    getCmcData: async function () {
        var self = this;
        var cmcData = await cmc.getTicker(50);
        this.data.cmc = cmcData;

        // sort data into object
        _.each(cmcData, function (cmcDatum) {
            self.data[cmcDatum.id] = cmcDatum;
        });
    },

    /**
     * get data from binance
     */
    getBinanceData: async function () {

        // get ICX price
        this.data['icon'].price_usd = await binance.getPriceUsd('icx');

    },

    /**
     * get data from gdax
     */
    getGdaxData: async function () {
        var map = {
            bitcoin: 'btc',
            ethereum: 'eth',
            litecoin: 'ltc',
            'bitcoin-cash': 'bch'
        };

        var promises = [];
        var self = this;
        _.forIn(map, function (symbol, name) {
            var promise = async function () {
                var price = await gdax.getPrice(symbol);
                _.set(self.data, `gdax.${symbol}.price`, price);
                // console.log(`symbol: ${symbol} price: ${price}`);

                _.set(self.data, `${name}.price_usd`, price);
            }
            promises.push(promise());
        });
        await Promise.all(promises);
    }

};