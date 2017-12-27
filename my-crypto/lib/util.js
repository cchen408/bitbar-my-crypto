const debuglog = require('util').debuglog('dev');

module.exports = {
    log: function(message){
        debuglog(message);
    }
};