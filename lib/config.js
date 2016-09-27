/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-08 11:27:52
 * @version $Id$
 * @description 默认配置待处理
 */

const PATH = require('path');
const util = require('./util');

module.exports = function() {
    let path = PATH.resolve(process.env.PWD, 'config.json'),
        _map = function(arr, obj) {
            arr.map((item, index) => {
                obj[item] = obj[item] || {};
            });
        };

    config = util.readJSON(path) || {};

    _map(['compile', 'server'], config);
    _map(['css', 'js', 'img'], config.compile);

    let server = config.server;

    server.root = util.www;
    server.port = server.port || 8080;
    server.hostname = server.hostname || '127.0.0.1';
    server.protocol = server.protocol || 'http';
    server.browser = server.browser || 'chrome';

    config.links = config.links || [];

    return config;
};

