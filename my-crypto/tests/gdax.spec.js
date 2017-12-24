var expect = require('chai').expect;
var gdax = require('../lib/gdax');

describe('gdax', function(){

    it('should return btc ticker', async function(){
        var response = await gdax.getProductTicker();
        console.log('response:', response);
        expect(response).to.exist;
    });

    it('should return eth ticker', async function(){
        var response = await gdax.getProductTicker('eth');
        console.log('response:', response);
        expect(response).to.exist;
    });

    it('should return ltc ticker', async function(){
        var response = await gdax.getProductTicker('ltc');
        console.log('response:', response);
        expect(response).to.exist;
    });

    it('should return bch ticker', async function(){
        var response = await gdax.getProductTicker('bch');
        console.log('response:', response);
        expect(response).to.exist;
    });

});