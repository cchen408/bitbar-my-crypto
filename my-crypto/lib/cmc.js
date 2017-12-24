var request = require('request-promise');

module.exports = {

    getTicker: async function(limit){
        limit = limit || 50;
        return await request({
            method: 'GET',
            url: `https://api.coinmarketcap.com/v1/ticker/?limit=${limit}`,
            json: true
        });
    }

};