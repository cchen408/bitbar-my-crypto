var request = require('request-promise');
var _ = require('lodash');

module.exports = {

    /**
     * get all
     * @param limit
     * @returns {Promise.<*>}
     */
    getTicker: async function(limit){
        limit = limit || 50;
        return await request({
            method: 'GET',
            url: `https://api.coinmarketcap.com/v1/ticker/?limit=${limit}`,
            json: true
        });
    },

    /**
     * getById
     * @param id
     * @returns {Promise.<*>}
     */
    getCoin: async function(id){
        var response = await request({
            method: 'GET',
            url: `https://api.coinmarketcap.com/v1/ticker/${id}`,
            json: true
        });
        return _.head(response);
    },

};