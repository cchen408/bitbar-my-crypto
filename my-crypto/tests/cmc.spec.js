var _ = require('lodash');
var expect = require('chai').expect;
var cmc = require('../lib/cmc');

describe('coin market cap', function(){

    it('should return 1 ticker', async function(){
        var response = await cmc.getTicker(1);
        expect(_.keys(response).length).to.equal(1);
    });

    it('should return 50 ticker', async function(){
        var response = await cmc.getTicker(50);
        expect(_.keys(response).length).to.equal(50);
    });

});