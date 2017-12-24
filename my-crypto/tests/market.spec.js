var _ = require('lodash');
var expect = require('chai').expect;
var market = require('../lib/market');

describe('getGdaxData', function () {

    it('should update with gdax prices', async function () {
        await market.getGdaxData();
        expect(market.data.bitcoin.price_usd).to.exist;
        expect(market.data.ethereum.price_usd).to.exist;
        expect(market.data.litecoin.price_usd).to.exist;
        expect(market.data['bitcoin-cash'].price_usd).to.exist;
    });

});

describe('getBinanceData', function () {

    it('update icx with price', async function () {
        await market.getBinanceData();
        expect(market.data.icon.price_usd).to.exist;
    });

});

describe('getAllData', function () {

    it('should update with gdax prices', async function () {
        await market.getAllData();

        console.log('market.data:', market.data);
        expect(market.data.bitcoin.price_usd).to.equal(market.data.gdax.btc.price);
        expect(market.data.ethereum.price_usd).to.equal(market.data.gdax.eth.price);
        expect(market.data.litecoin.price_usd).to.equal(market.data.gdax.ltc.price);
        expect(market.data['bitcoin-cash'].price_usd).to.equal(market.data.gdax.bch.price);
    });

});