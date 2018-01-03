const debuglog = require('util').debuglog('dev');

module.exports = {

    /**
     * log
     * @param message
     * @param data
     */
    log: function(message, data){
        debuglog(message, data);
    }

};