var _ = require('lodash');
var expect = require('chai').expect;
var binance = require('../lib/binance');

describe('binance', function () {

    it('should return binance prices', async function () {
        try {
            var response = await binance.prices();
            console.log('response:', response);
        }
        catch (error) {
            console.error("error:", error);
            throw error;
        }
        expect(response).to.exist;
    });

    it('should return price of icon', async function () {
        var response = await binance.getPriceUsd('icx');
        expect(response).to.exist;
    });

    it('should organize prices', async function () {
        await binance.getPrices();
        expect(binance.sorted).to.exist;
    });

});