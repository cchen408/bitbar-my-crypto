var _ = require('lodash');
var expect = require('chai').expect;
var kucoin = require('../lib/kucoin');

describe('kucoin', function () {

    it('should return kcs-eth ticker', async function () {
        var response = await kucoin.getTicker({
            pair: 'KCS-ETH'
        });
        console.log(response);
        expect(response).to.exist;
    });

    it('should return null', async function () {
        var response = await kucoin.getTicker({
            pair: 'BLAH'
        });
        expect(response).to.be.null;
    });

});