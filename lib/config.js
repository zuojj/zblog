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
        },

    const DEFAULT_CONFIG = {
        "compile": {
            "css": {
                "useHash": true,
                "useUglify": true
            },
            "js": {
                "useHash": true,
                "useUglify": true
            },
            "img": {
                "useHash": true
            }
        },
        "server": {
            "port": 8080,
            "hostname": "127.0.0.1",
            "browser": "chrome"
        },
        "site": {
            "name": "WEBX",
            "url": "http://xxx.com",
            "description": "WEBX_搜索搜索WEB研发部",
            "keywords": "WEBX, web, sogou搜索"
        },
        "navbar": [{
            "title": "Home",
            "url": "/"
        }, {
            "title": "Archives",
            "url": "/archives"
        }, {
            "title": "Categories",
            "url": "/categories"
        },{
            "title": "Tags",
            "url": "/tags"
        }, {
            "title": "About",
            "url": "/about"
        }]
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

