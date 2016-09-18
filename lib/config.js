/**
 * 
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-08 11:27:52
 * @version $Id$
 */

const PATH = require('path');
const fset = require('fs-extra');
const util = require('./util');

module.exports = function() {
    var path = PATH.resolve(process.env.PWD, 'config.json'),
        config = {};

    config = util.readJSON(path);

    // port
    config.port = config.port || 3000;
    config.links = config.links || [];

    return config;
};

