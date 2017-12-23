#!/usr/bin/env /Users/chrichen/.nvm/versions/node/v8.8.0/bin/node

var _ = require('lodash');
var request = require('request-promise');
var icons = require('./my-crypto/icons');
var holdings = require('./my-crypto/holdings')
var totalValue = 0;
var valueWithCost = 0;
var totalCost = 0;
const font = 'Monaco';

async function myCrypto() {

    // get data from cmc
    var response = await request({
        method: 'GET',
        url: 'https://api.coinmarketcap.com/v1/ticker/?limit=50',
        json: true
    });

    var cmcData = {};
    _.each(response, function (data) {
        cmcData[data.id] = data;
    });

    // holdings
    _.each(holdings, function (data, index) {

        // get cmc data
        var cmcDatum = cmcData[data.name];

        // calculate value of holding
        var value = data.amount * cmcDatum.price_usd;

        // add to total value
        totalValue = totalValue + value;

        // add to value with cost if there is cost
        if (!_.isNil(data.cost)) {
            valueWithCost = valueWithCost + value;
        }

        totalCost = data.cost ? totalCost + data.cost : totalCost;

        // add prices to data
        data.price = cmcDatum.price_usd;
        data.symbol = cmcDatum.symbol;
        data.value = value;

        holdings[index] = data;

    });

    _.each(holdings, function (data, index) {
        data.percentage = data.value / totalValue * 100;
        holdings[index] = data;
    });

    console.log(`| image=${icons.btc}`);
    console.log('---');
    console.log(`${'sym'.padEnd(8)}\t${'price'.padEnd(8)}\t${'value'.padEnd(8)}\t${'cost'.padEnd(4)}\t% | color='#000' font=${font}`);
    console.log('---');
    _.each(holdings, function (data) {
        data.cost = data.cost || 0;
        console.log(`${data.symbol.padEnd(5)}\t$${_.round(data.price, 5).toString().padEnd(8)}\t$${_.round(data.value, 2).toString().padEnd(8)}\t$${_.round(data.cost, 2).toString().padEnd(4)}\t${_.round(data.percentage, 2)}% | color='#000' font=${font} image=${icons[_.toLower(data.symbol)]}`);
    });
    console.log('---');
    console.log(`total: $${_.round(totalValue, 2)}\t\t% profit/loss: ${_.round(valueWithCost/totalCost*100-100, 2)}% | color='#000' font=${font}`);
}

myCrypto();