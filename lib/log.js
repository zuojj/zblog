/**
 * 
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-08 16:52:51
 * @version $Id$
 */

const colors = require('colors');


function Log(type, msg) {
    if(!(this instanceof Log)) {
        return new Log(type, msg);
    }

    'function' === typeof this[type] && this[type](msg);
}

Log.prototype.debug = function(msg) {
    process.stdout.write('\n ' + '[DEBUG]'.grey + ' ' + msg + '\n');
}

Log.prototype.warning = function(msg) {
    process.stdout.write('\n ' + '[WARNING]'.yellow + ' ' + msg + '\n');
}

Log.prototype.info = function(msg) {
    process.stdout.write('\n ' + '[INFO]'.cyan + ' ' + msg + '\n');
}

Log.prototype.error = function(err) {
    if (!(err instanceof Error)) {
        err = new Error(err.message || '');
    }

    if (exports.throw) {
        throw err;
    } else {
        process.stdout.write('\n ' + '[ERROR]'.cyan + ' ' + err.message + '\n');
        process.exit(1);
    }
};


module.exports = Log;