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

    let server = config.server = config.server || {};

    server.root = util.www;
    server.port = server.port || 8080;
    server.hostname = server.hostname || '127.0.0.1';
    server.protocol = server.protocol || 'http';
    server.browser = server.browser || 'chrome';

    config.links = config.links || [];

    return config;
};

