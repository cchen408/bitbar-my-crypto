var _ = require('lodash');
var expect = require('chai').expect;
var cmc = require('../lib/cmc');

describe('getTicker', function(){

    it('should return 1 ticker', async function(){
        var response = await cmc.getTicker(1);
        expect(_.keys(response).length).to.equal(1);
    });

    it('should return 50 ticker', async function(){
        var response = await cmc.getTicker(50);
        expect(_.keys(response).length).to.equal(50);
    });

});

describe('getCoin', function(){

    it('should return btc ticker', async function(){
        var response = await cmc.getCoin('bitcoin');
        console.log('response:', response);
        expect(response.id).to.equal('bitcoin');
        expect(response.symbol).to.equal('BTC');
    });

    it('should return icx', async function(){
        var response = await cmc.getCoin('icon');
        expect(response.id).to.equal('icon');
        expect(response.symbol).to.equal('ICX');
    });

});