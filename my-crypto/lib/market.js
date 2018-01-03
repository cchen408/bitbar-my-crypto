var _ = require('lodash');

var cmc = require('./cmc');
var gdax = require('./gdax');
var binance = require('./binance');
var util = require('./util');

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
        _.each(currencies, function (currency) {
            var promise = async function () {
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
        var self = this;

        var promises = [];
        _.each(currencies, function (currency) {

            var promise = async function(){

                var symbol = _.get(self, `data.${currency}.symbol`);
                // util.log(currency);
                // util.log(symbol);

                if(symbol){
                    var price = await binance.getPriceUsd(symbol);
                    util.log(`price for ${symbol}`, price);
                }


                if (price) {
                    util.log(`replace price of ${currency} with ${price}`)
                    _.set(self.data, `${currency}.price_usd`, _.round(price, 2));
                }
            };

            promises.push(promise());
        });

        await Promise.all(promises);


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