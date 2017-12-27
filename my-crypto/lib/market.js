var _ = require('lodash');

var cmc = require('./cmc');
var gdax = require('./gdax');
var binance = require('./binance');

module.exports = {

    data: {},

    /**
     * get data from everywhere
     * @param currencies
     * @returns {Promise.<void>}
     */
    getAllData: async function (currencies) {
        await this.getCmcData(currencies);
        await this.getGdaxData(currencies);
        await this.getBinanceData(currencies);
    },

    /**
     * get data from coinmarketcap
     * @param currencies
     */
    getCmcData: async function (currencies) {
        var self = this;

        var promises = [];
        _.each(currencies, function(currency){
            var promise = async function(){
                var data = await cmc.getCoin(currency);
                self.data[data.id] = data;
            }
            promises.push(promise());
        })
        await Promise.all(promises);
    },

    /**
     * get data from binance
     */
    getBinanceData: async function (currencies) {
        // get ICX price
        if(_.includes(currencies, 'icon')){
            var iconPrice = await binance.getPriceUsd('icx');
            _.set(this.data, `icon.price_usd`, iconPrice);
        }
    },

    /**
     * get data from gdax
     */
    getGdaxData: async function () {
        var self = this;
        var map = {
            bitcoin: 'btc',
            ethereum: 'eth',
            litecoin: 'ltc',
            'bitcoin-cash': 'bch'
        };

        var promises = [];
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